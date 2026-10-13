// Check-up de ton App : express (pré-diagnostic IA, réservé aux membres, 1 par membre)
// et demandes de rappel pour le Check-up complet (contact par un lien du profil, jamais par numéro).
import { json, readJson, HttpError } from "../lib/http.js";
import { ensureSchema } from "../lib/schema.js";
import { requireUser, isAdmin } from "../lib/session.js";
import { cleanText, cleanMultiline, cleanHttps } from "../lib/validate.js";
import { analyzeExpress } from "../checkup/analyze.js";

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
