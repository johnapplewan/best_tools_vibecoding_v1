// Check-up de ton App : express (pré-diagnostic IA, réservé aux membres, 1 par membre)
// et demandes de rappel pour le Check-up complet (contact par un lien du profil, jamais par numéro).
import { json, readJson, HttpError } from "../lib/http.js";
import { ensureSchema } from "../lib/schema.js";
import { requireUser, isAdmin } from "../lib/session.js";
import { cleanText, cleanMultiline, cleanHttps } from "../lib/validate.js";
import { analyzeExpress } from "../checkup/analyze.js";
import { notifyAdmin, getSetting, setSetting, telegram } from "../lib/notify.js";
import { randomHex } from "../lib/http.js";

const MAX_ATTEMPTS = 3;
export const GOALS = {
  launch: "Préparer un lancement public",
  funding: "Levée de fonds ou investisseurs",
  bank: "Business plan ou dossier bancaire",
  insurance: "Préparer un dossier d'assurance cyber",
  gdpr: "Pré-diagnostic RGPD",
  sale: "Vente ou rachat du projet",
  incubator: "Incubateur, BPI ou subvention",
  b2b: "Questionnaire sécurité d'un client B2B",
  partner: "Recherche d'un associé ou d'un CTO",
  opensource: "Passage en open source",
  other: "Autre",
};
const DAYS = ["lun", "mar", "mer", "jeu", "ven", "sam"];
const SLOTS = { morning: "9 h – 12 h", lunch: "12 h – 14 h", afternoon: "14 h – 18 h", evening: "18 h – 21 h" };
const CONTACTS = ["telegram", "signal", "whatsapp"];
const parse = (s, f = null) => {
  try { return JSON.parse(s); } catch { return f; }
};
const bad = (field, reason) => new HttpError(400, "invalid", { field, reason });

function expressOut(r) {
  return { id: r.id, status: r.status, input: parse(r.input, {}), result: r.status === "done" ? parse(r.result, null)?.card || null : null, error: r.status === "error" ? "L'analyse a échoué, elle sera relancée automatiquement." : null, created_at: r.created_at };
}

// État du membre : son check-up express et sa demande de rappel.
export async function mine(request, env) {
  const user = await requireUser(request, env);
  const { results } = await env.DB.prepare("SELECT * FROM checkups WHERE user_id = ?1 ORDER BY created_at DESC").bind(user.id).all();
  const express = results.filter((r) => r.kind === "express");
  const callback = results.find((r) => r.kind === "callback" && ["new", "contacted"].includes(r.status));
  const contacts = parse(user.contacts, {});
  return json({
    express: express.map(expressOut),
    canExpress: isAdmin(user, env) || express.length === 0,
    callback: callback ? { id: callback.id, status: callback.status, input: parse(callback.input, {}), created_at: callback.created_at } : null,
    contactOptions: CONTACTS.filter((n) => contacts[n]),
    goals: GOALS, days: DAYS, slots: SLOTS,
  });
}

export async function submitExpress(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const url = cleanHttps(body.url, "url");
  if (!url) throw bad("url", "Le lien de votre app ou de votre dépôt public est obligatoire");
  const description = cleanMultiline(body.description, "description", 800);
  if (description.length < 30) throw bad("description", "Décrivez votre app en quelques phrases (30 caractères minimum)");
  if (!isAdmin(user, env)) {
    const done = await env.DB.prepare("SELECT 1 FROM checkups WHERE user_id = ?1 AND kind = 'express'").bind(user.id).first();
    if (done) throw new HttpError(403, "forbidden", { reason: "Vous avez déjà utilisé votre Check-up express" });
  }
  const now = Date.now();
  const row = await env.DB.prepare("INSERT INTO checkups (user_id, kind, input, created_at, updated_at) VALUES (?1, 'express', ?2, ?3, ?3) RETURNING id")
    .bind(user.id, JSON.stringify({ url, description }), now).first();
  return json({ ok: true, id: row.id });
}

export async function requestCallback(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const contacts = parse(user.contacts, {});
  const network = CONTACTS.includes(body.network) && contacts[body.network] ? body.network : null;
  if (!network) throw bad("network", "Ajoutez d'abord un lien Telegram, Signal ou WhatsApp (lien QR) sur votre profil, puis choisissez-le ici");
  const days = (Array.isArray(body.days) ? body.days : []).filter((d) => DAYS.includes(d));
  const slots = (Array.isArray(body.slots) ? body.slots : []).filter((s) => SLOTS[s]);
  if (!days.length || !slots.length) throw bad("days", "Choisissez au moins un jour et une tranche horaire");
  const goal = GOALS[body.goal] ? body.goal : "other";
  const project = cleanText(body.project, "project", 120);
  if (!project) throw bad("project", "Donnez le nom ou le lien de votre projet");
  const note = cleanMultiline(body.note, "note", 600);
  const open = await env.DB.prepare("SELECT 1 FROM checkups WHERE user_id = ?1 AND kind = 'callback' AND status IN ('new', 'contacted')").bind(user.id).first();
  if (open) throw new HttpError(409, "invalid", { reason: "Vous avez déjà une demande de rappel en cours" });
  const now = Date.now();
  await env.DB.prepare("INSERT INTO checkups (user_id, kind, input, status, created_at, updated_at) VALUES (?1, 'callback', ?2, 'new', ?3, ?3)")
    .bind(user.id, JSON.stringify({ network, days, slots, goal, project, note }), now).run();
  // Prévenir l'admin dans ses notifications du site.
  const ids = String(env.ADMIN_GITHUB_IDS || "").split(",").map((s) => s.trim()).filter((s) => /^\d+$/.test(s));
  if (ids.length) {
    const { results } = await env.DB.prepare(`SELECT id FROM users WHERE github_id IN (${ids.join(",")})`).all();
    for (const a of results) {
      await env.DB.prepare("INSERT INTO notifications (user_id, text, link, created_at) VALUES (?1, ?2, '/admin#checkups', ?3)")
        .bind(a.id, `Demande de rappel Check-up complet de ${user.pseudo} (${user.code}) : ${GOALS[goal]}.`, now).run();
    }
  }
  // Notification instantanée sur le téléphone de l'admin (bot Telegram), si elle est configurée.
  const contactUrl = contacts[network];
  await notifyAdmin(env,
    `📞 Nouvelle demande de rappel — Check-up complet\n\n` +
    `Membre : ${user.pseudo} (${user.code})\nObjectif : ${GOALS[goal]}\nProjet : ${project}\n` +
    (note ? `Besoin : ${note}\n` : "") +
    `Disponibilités : ${days.join(", ")} · ${slots.map((x) => SLOTS[x]).join(", ")}\nContact : ${network}`,
    [{ text: `Contacter sur ${network}`, url: contactUrl }, { text: "Ouvrir /admin", url: `${new URL(request.url).origin}/admin#checkups` }]);
  return json({ ok: true });
}

export async function cancelCallback(request, env) {
  const user = await requireUser(request, env);
  await env.DB.prepare("UPDATE checkups SET status = 'cancelled', updated_at = ?2 WHERE user_id = ?1 AND kind = 'callback' AND status IN ('new', 'contacted')")
    .bind(user.id, Date.now()).run();
  return json({ ok: true });
}

// ───────── Traitement de la file express ─────────
export async function processExpress(env, id) {
  const row = await env.DB.prepare(
    `UPDATE checkups SET status = 'running', attempts = attempts + 1, updated_at = ?2
     WHERE id = ?1 AND kind = 'express' AND status IN ('pending', 'error') AND attempts < ?3 RETURNING *`
  ).bind(id, Date.now(), MAX_ATTEMPTS).first();
  if (!row) return;
  try {
    const result = await analyzeExpress(parse(row.input, {}), env);
    await env.DB.prepare("UPDATE checkups SET status = 'done', result = ?2, error = NULL, updated_at = ?3 WHERE id = ?1").bind(id, JSON.stringify(result), Date.now()).run();
  } catch (e) {
    console.error("checkup", id, e);
    const msg = e?.error?.error?.message ? `${e.status} : ${e.error.error.message}` : String(e?.message || e);
    await env.DB.prepare("UPDATE checkups SET status = 'error', error = ?2, updated_at = ?3 WHERE id = ?1").bind(id, msg.slice(0, 500), Date.now()).run();
  }
}

export async function scheduled(env) {
  if (!env.DB) return;
  await ensureSchema(env.DB);
  await env.DB.prepare("UPDATE checkups SET status = 'pending' WHERE kind = 'express' AND status = 'running' AND updated_at < ?1").bind(Date.now() - 20 * 60e3).run();
  const { results } = await env.DB.prepare(
    `SELECT id FROM checkups WHERE kind = 'express' AND (status = 'pending' OR (status = 'error' AND attempts < ?1 AND updated_at < ?2))
     ORDER BY created_at LIMIT 2`
  ).bind(MAX_ATTEMPTS, Date.now() - 10 * 60e3).all();
  for (const r of results) await processExpress(env, r.id);
}

// ───────── Admin ─────────
async function requireAdmin(request, env) {
  const me = await requireUser(request, env);
  if (!isAdmin(me, env)) throw new HttpError(403, "forbidden");
  return me;
}

export async function adminList(request, env) {
  await requireAdmin(request, env);
  const { results } = await env.DB.prepare(
    `SELECT c.*, u.pseudo, u.code, u.contacts FROM checkups c JOIN users u ON u.id = c.user_id ORDER BY c.created_at DESC LIMIT 200`
  ).all();
  return json({
    goals: GOALS, slots: SLOTS,
    items: results.map((r) => {
      const input = parse(r.input, {});
      return {
        id: r.id, kind: r.kind, status: r.status, attempts: r.attempts, error: r.error, created_at: r.created_at,
        member: { pseudo: r.pseudo, code: r.code },
        input,
        // Lien de contact choisi par le membre (visible par l'admin uniquement, uniquement pour un rappel).
        contact: r.kind === "callback" ? parse(r.contacts, {})[input.network] || null : null,
        result: r.kind === "express" && r.status === "done" ? parse(r.result, null)?.card || null : null,
      };
    }),
  });
}

export async function adminUpdate(request, env, id) {
  await requireAdmin(request, env);
  const body = await readJson(request);
  const row = await env.DB.prepare("SELECT * FROM checkups WHERE id = ?1").bind(Number(id)).first();
  if (!row) throw new HttpError(404, "not_found");
  if (body.run === true && row.kind === "express") {
    await env.DB.prepare("UPDATE checkups SET status = 'pending', attempts = 0 WHERE id = ?1").bind(row.id).run();
    await processExpress(env, row.id);
    return json({ ok: true });
  }
  if (row.kind === "callback" && ["new", "contacted", "done", "cancelled"].includes(body.status)) {
    await env.DB.prepare("UPDATE checkups SET status = ?2, updated_at = ?3 WHERE id = ?1").bind(row.id, body.status, Date.now()).run();
    return json({ ok: true });
  }
  throw bad("status", "Action inconnue");
}

// ───────── Intégrations de l'admin : bot Telegram et abonnement d'agenda ─────────
export async function adminIntegrations(request, env) {
  await requireAdmin(request, env);
  const origin = new URL(request.url).origin;
  if (request.method === "POST") {
    const body = await readJson(request);
    if (body.action === "telegram_code") {
      if (!env.TELEGRAM_BOT_TOKEN) throw bad("telegram", "Ajoutez d'abord le secret TELEGRAM_BOT_TOKEN dans Cloudflare");
      await setSetting(env, "telegram_link_code", randomHex(6));
    } else if (body.action === "telegram_verify") {
      const code = await getSetting(env, "telegram_link_code");
      if (!code) throw bad("telegram", "Générez d'abord un code de liaison");
      const updates = await telegram(env, "getUpdates", { limit: 50, allowed_updates: ["message"] });
      const msg = updates.map((u) => u.message).filter(Boolean).reverse()
        .find((m) => m.chat?.type === "private" && String(m.text || "").trim() === `/start ${code}`);
      if (!msg) throw bad("telegram", "Message introuvable : ouvrez le lien Telegram, appuyez sur « Démarrer », puis réessayez");
      await setSetting(env, "telegram_chat_id", String(msg.chat.id));
      await setSetting(env, "telegram_link_code", null);
      await notifyAdmin(env, "✅ Vibe Tools est relié : vous recevrez ici les demandes de rappel du Check-up.");
    } else if (body.action === "telegram_test") {
      const ok = await notifyAdmin(env, "🔔 Test : les notifications Vibe Tools fonctionnent.");
      if (!ok) throw bad("telegram", "Envoi impossible : vérifiez le bot et la liaison");
    } else if (body.action === "telegram_off") {
      await setSetting(env, "telegram_chat_id", null);
    } else if (body.action === "calendar_new") {
      await setSetting(env, "calendar_token", randomHex(24)); // l'ancien lien cesse de fonctionner
    } else if (body.action === "calendar_off") {
      await setSetting(env, "calendar_token", null);
    } else throw bad("action", "Action inconnue");
  }
  let bot = null;
  if (env.TELEGRAM_BOT_TOKEN) {
    try { bot = (await telegram(env, "getMe")).username; } catch { bot = null; }
  }
  const code = await getSetting(env, "telegram_link_code");
  const cal = await getSetting(env, "calendar_token");
  return json({
    telegram: { tokenSet: !!env.TELEGRAM_BOT_TOKEN, bot, connected: !!(await getSetting(env, "telegram_chat_id")), linkUrl: bot && code ? `https://t.me/${bot}?start=${code}` : null },
    calendar: { url: cal ? `${origin}/cal/${cal}.ics` : null },
  });
}

// Flux d'agenda privé (abonnement iCalendar) : une adresse secrète, sans connexion.
// Chaque demande de rappel ouverte apparaît sur le premier créneau proposé par le membre.
const DAY_INDEX = { lun: 1, mar: 2, mer: 3, jeu: 4, ven: 5, sam: 6 };
const SLOT_START = { morning: [9, 0], lunch: [12, 0], afternoon: [14, 0], evening: [18, 0] };
const icsEscape = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const pad = (n) => String(n).padStart(2, "0");
// Heure locale « flottante » (sans fuseau) : l'agenda l'affiche à l'heure de l'appareil (France).
function floating(d, h, m) { return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(h)}${pad(m)}00`; }
function firstSlot(createdAt, days, slots) {
  const [h, m] = SLOT_START[slots.map((x) => x).sort((a, b) => SLOT_START[a][0] - SLOT_START[b][0])[0]] || [9, 0];
  const wanted = new Set(days.map((d) => DAY_INDEX[d]));
  const d = new Date(createdAt + 2 * 3600e3); // heure de Paris approximative pour choisir le jour
  for (let i = 0; i < 14; i++) {
    const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + i));
    const isToday = i === 0;
    if (wanted.has(day.getUTCDay()) && !(isToday && d.getUTCHours() >= h)) return { day, h, m };
  }
  return { day: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)), h, m };
}

export async function calendarFeed(request, env, token) {
  await ensureSchema(env.DB);
  const expected = await getSetting(env, "calendar_token");
  if (!expected || token !== expected) return new Response("Not Found", { status: 404 });
  const origin = new URL(request.url).origin;
  const { results } = await env.DB.prepare(
    `SELECT c.*, u.pseudo, u.code, u.contacts FROM checkups c JOIN users u ON u.id = c.user_id
     WHERE c.kind = 'callback' AND c.status IN ('new', 'contacted') ORDER BY c.created_at DESC LIMIT 200`
  ).all();
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Vibe Tools//Check-up//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:Vibe Tools · Rappels Check-up", "X-PUBLISHED-TTL:PT15M", "REFRESH-INTERVAL;VALUE=DURATION:PT15M"];
  for (const r of results) {
    const input = parse(r.input, {});
    const { day, h, m } = firstSlot(r.created_at, input.days || [], input.slots || []);
    const contact = parse(r.contacts, {})[input.network] || "";
    const desc = [`Objectif : ${GOALS[input.goal] || ""}`, `Projet : ${input.project || ""}`, input.note ? `Besoin : ${input.note}` : "",
      `Disponibilités : ${(input.days || []).join(", ")} · ${(input.slots || []).map((x) => SLOTS[x]).join(", ")}`,
      `Contact (${input.network}) : ${contact}`, `Statut : ${r.status === "contacted" ? "contacté" : "nouvelle demande"}`, `${origin}/admin#checkups`].filter(Boolean).join("\n");
    lines.push("BEGIN:VEVENT", `UID:checkup-${r.id}@vibetools`, `DTSTAMP:${stamp}`,
      `DTSTART:${floating(day, h, m)}`, `DURATION:PT30M`,
      `SUMMARY:${icsEscape(`📞 Rappel Check-up : ${r.pseudo} (${r.code})`)}`,
      `DESCRIPTION:${icsEscape(desc)}`, ...(/^https:\/\//.test(contact) ? [`URL:${contact}`] : []),
      "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:-PT10M", `DESCRIPTION:${icsEscape(`Rappel Check-up : ${r.pseudo}`)}`, "END:VALARM",
      "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  // Pliage des lignes à 75 octets environ (norme iCalendar).
  const folded = lines.map((l) => l.length > 74 ? l.match(/.{1,74}/gu).join("\r\n ") : l).join("\r\n");
  return new Response(folded + "\r\n", {
    headers: { "content-type": "text/calendar; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}
