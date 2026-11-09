// Formulaire de contact (/contact).
// Chaque message est enregistré sous la clé « contacts/AAAA-MM-JJ/identifiant/sujet » : dans D1 (table contact_messages)
// et, si le bucket R2 est relié au Worker (binding CONTACTS), aussi comme un fichier JSON à ce chemin.
// L'admin est prévenu par Telegram (si relié depuis /admin) et par email via Resend (si les secrets sont configurés).
// Aucune alerte ratée ne fait échouer l'envoi : le message est déjà enregistré.
import { json, readJson, HttpError, randomHex } from "../lib/http.js";
import { ensureSchema } from "../lib/schema.js";
import { requireUser, isAdmin } from "../lib/session.js";
import { notifyAdmin } from "../lib/notify.js";

const MAX = { email: 254, subject: 120, message: 5000 };
const MIN_MESSAGE = 10;
const EMAIL_RE = /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[a-z]{2,}$/i;

// Retire les caractères de contrôle (on garde les retours à la ligne dans le message).
const clean = (value, multiline = false) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, multiline ? "" : " ")
    .trim();

// « Bug sur la page Outils ! » → « bug-sur-la-page-outils »
export function slug(text) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "sans-sujet";
}

export function validate(body) {
  const email = clean(body.email).toLowerCase();
  const subject = clean(body.subject).replace(/\s+/g, " ");
  const message = clean(body.message, true);
  const fields = {};
  if (!email) fields.email = "email_required";
  else if (email.length > MAX.email || !EMAIL_RE.test(email)) fields.email = "email_invalid";
  if (!subject) fields.subject = "subject_required";
  else if (subject.length > MAX.subject) fields.subject = "subject_too_long";
  if (!message) fields.message = "message_required";
  else if (message.length < MIN_MESSAGE) fields.message = "message_too_short";
  else if (message.length > MAX.message) fields.message = "message_too_long";
  return { email, subject, message, fields };
}

async function sendEmail(env, msg) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: msg.email,
      subject: `[Vibe Tools] ${msg.subject}`,
      text: `Nouveau message reçu par le formulaire de contact.\n\nDe : ${msg.email}\nSujet : ${msg.subject}\nRéférence : ${msg.path}\n\n${msg.message}\n\n— Répondre à cet email écrit directement à l'expéditeur.`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status} : ${(await res.text()).slice(0, 200)}`);
  return true;
}

async function alert(env, origin, msg) {
  const done = [];
  if (await notifyAdmin(env, `📬 Nouveau message de contact\nSujet : ${msg.subject}\nRéférence : ${msg.id}\nÀ lire dans l'administration (le contenu n'est pas envoyé sur Telegram).`,
    [{ text: "Lire le message", url: `${origin}/admin#contacts` }])) done.push("telegram");
  try { if (await sendEmail(env, msg)) done.push("email"); } catch (e) { console.error("contact email", e); }
  await env.DB.prepare("UPDATE contact_messages SET alerts = ?1 WHERE id = ?2").bind(done.join(","), msg.id).run();
}

export async function submit(request, env, ctx) {
  const body = await readJson(request, 24 * 1024);
  // Champ piège invisible : seuls les robots le remplissent. On répond comme si tout allait bien.
  if (clean(body.website)) return json({ ok: true, ref: null });
  const { email, subject, message, fields } = validate(body);
  if (Object.keys(fields).length) throw new HttpError(400, "invalid_fields", { fields });

  await ensureSchema(env.DB);
  const now = Date.now();
  const id = randomHex(6);
  const path = `contacts/${new Date(now).toISOString().slice(0, 10)}/${id}/${slug(subject)}`;
  const msg = { id, path, email, subject, message, created_at: now };
  await env.DB.prepare(
    "INSERT INTO contact_messages (id, path, email, subject, message, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
  ).bind(id, path, email, subject, message, now).run();
  if (env.CONTACTS) {
    try {
      await env.CONTACTS.put(path, JSON.stringify({ ...msg, created_at: new Date(now).toISOString() }, null, 2), {
        httpMetadata: { contentType: "application/json; charset=utf-8" },
      });
    } catch (e) { console.error("contact R2", e); }
  }
  const task = alert(env, new URL(request.url).origin, msg).catch((e) => console.error("contact alert", e));
  if (ctx?.waitUntil) ctx.waitUntil(task); else await task;
  return json({ ok: true, ref: id });
}

async function requireAdmin(request, env) {
  const me = await requireUser(request, env);
  if (!isAdmin(me, env)) throw new HttpError(403, "forbidden");
}

export async function adminList(request, env) {
  await requireAdmin(request, env);
  await ensureSchema(env.DB);
  const { results } = await env.DB.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200").all();
  return json({ items: results, email: Boolean(env.RESEND_API_KEY && env.CONTACT_TO && env.CONTACT_FROM), r2: Boolean(env.CONTACTS) });
}

export async function adminUpdate(request, env, id) {
  await requireAdmin(request, env);
  const { status } = await readJson(request);
  if (!["new", "read", "done"].includes(status)) throw new HttpError(400, "bad_status");
  await env.DB.prepare("UPDATE contact_messages SET status = ?1 WHERE id = ?2").bind(status, id).run();
  return json({ ok: true });
}

// Suppression définitive (droit à l'effacement, ou message traité).
export async function adminDelete(request, env, id) {
  await requireAdmin(request, env);
  const row = await env.DB.prepare("SELECT path FROM contact_messages WHERE id = ?1").bind(id).first();
  if (!row) throw new HttpError(404, "not_found");
  await env.DB.prepare("DELETE FROM contact_messages WHERE id = ?1").bind(id).run();
  if (env.CONTACTS) await env.CONTACTS.delete(row.path).catch((e) => console.error("contact R2 delete", e));
  return json({ ok: true });
}
