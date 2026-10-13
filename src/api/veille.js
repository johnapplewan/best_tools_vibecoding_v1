// Veille : réception des éléments (raccourci iOS / admin), traitement en file d'attente,
// validation par l'admin et publication dans l'onglet Actualités.
import { json, readJson, HttpError, randomHex, sha256 } from "../lib/http.js";
import { ensureSchema } from "../lib/schema.js";
import { requireUser, isAdmin } from "../lib/session.js";
import { analyze, fitScore } from "../veille/analyze.js";

const MAX_ATTEMPTS = 3;
const parse = (s, fallback = null) => {
  try { return JSON.parse(s); } catch { return fallback; }
};

async function requireAdmin(request, env) {
  const me = await requireUser(request, env);
  if (!isAdmin(me, env)) throw new HttpError(403, "forbidden");
  return me;
}

// Le raccourci iOS s'authentifie avec un jeton personnel (Authorization: Bearer …),
// le site avec la session de l'admin.
async function adminFromTokenOrSession(request, env) {
  const auth = request.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(vt_[a-f0-9]{48})$/);
  if (m) {
    const row = await env.DB.prepare(
      "SELECT t.token_hash, u.* FROM api_tokens t JOIN users u ON u.id = t.user_id WHERE t.token_hash = ?1"
    ).bind(await sha256(m[1])).first();
    if (!row || !isAdmin(row, env)) throw new HttpError(401, "bad_token");
    await env.DB.prepare("UPDATE api_tokens SET last_used_at = ?1 WHERE token_hash = ?2").bind(Date.now(), row.token_hash).run();
    return row;
  }
  return requireAdmin(request, env);
}

// ───────── Réception ─────────
export async function submit(request, env) {
  await ensureSchema(env.DB);
  await adminFromTokenOrSession(request, env);
  const type = request.headers.get("content-type") || "";
  let input;
  if (type.includes("application/json")) input = (await readJson(request, 8 * 1024)).text;
  else input = (await request.text()).slice(0, 8 * 1024);
  input = String(input ?? "").replace(/\s+/g, " ").trim();
  if (!input) throw new HttpError(400, "invalid", { field: "text", reason: "Rien à analyser" });
  if (input.length > 2000) throw new HttpError(400, "invalid", { field: "text", reason: "2000 caractères maximum" });
  const now = Date.now();
  const source = request.headers.get("authorization") ? "ios" : "admin";
  const row = await env.DB.prepare(
    "INSERT INTO veille_items (input, source, created_at, updated_at) VALUES (?1, ?2, ?3, ?3) RETURNING id"
  ).bind(input, source, now).first();
  return json({ ok: true, id: row.id, message: "✅ Reçu, analyse en cours" });
}

// ───────── Traitement ─────────
export async function processItem(env, id) {
  const claimed = await env.DB.prepare(
    `UPDATE veille_items SET status = 'running', attempts = attempts + 1, updated_at = ?2
     WHERE id = ?1 AND status IN ('pending', 'error') AND attempts < ?3 RETURNING *`
  ).bind(id, Date.now(), MAX_ATTEMPTS).first();
  if (!claimed) return null;
  try {
    const result = await analyze(claimed.input, env);
    await env.DB.prepare(
      `UPDATE veille_items SET status = 'done', error = NULL, result = ?2, verdict = ?3, tool_name = ?4, updated_at = ?5 WHERE id = ?1`
    ).bind(id, JSON.stringify(result), result.card.status === "ok" ? result.card.verdict : null, result.card.tool?.name || null, Date.now()).run();
  } catch (e) {
    console.error("veille", id, e);
    await env.DB.prepare("UPDATE veille_items SET status = 'error', error = ?2, updated_at = ?3 WHERE id = ?1")
      .bind(id, errorText(e), Date.now()).run();
  }
  return id;
}

// Tâche planifiée : relance les analyses bloquées, puis traite quelques éléments en attente.
export async function scheduled(env) {
  if (!env.DB) return;
  await ensureSchema(env.DB);
  await env.DB.prepare("UPDATE veille_items SET status = 'pending' WHERE status = 'running' AND updated_at < ?1")
    .bind(Date.now() - 20 * 60e3).run();
  const { results } = await env.DB.prepare(
    `SELECT id FROM veille_items WHERE (status = 'pending') OR (status = 'error' AND attempts < ?1 AND updated_at < ?2)
     ORDER BY created_at LIMIT 3`
  ).bind(MAX_ATTEMPTS, Date.now() - 10 * 60e3).all();
  for (const r of results) await processItem(env, r.id);
}

// ───────── Admin ─────────
function itemOut(row, full = false) {
  const result = parse(row.result, null);
  return {
    id: row.id, input: row.input, source: row.source, status: row.status, attempts: row.attempts, error: row.error,
    verdict: row.verdict, tool_name: row.tool_name, published: !!row.published, published_at: row.published_at,
    created_at: row.created_at, updated_at: row.updated_at,
    ...(full ? { card: result?.card || null, github: result?.github || null, dossier: result?.dossier || null, model: result?.model || null } : {}),
  };
}

export async function adminList(request, env) {
  await requireAdmin(request, env);
  const { results } = await env.DB.prepare("SELECT * FROM veille_items ORDER BY created_at DESC LIMIT 200").all();
  return json({ items: results.map((r) => itemOut(r, true)) });
}

export async function adminRun(request, env, id) {
  await requireAdmin(request, env);
  await env.DB.prepare("UPDATE veille_items SET status = 'pending', attempts = 0 WHERE id = ?1 AND status IN ('error', 'pending')").bind(Number(id)).run();
  await processItem(env, Number(id));
  const row = await env.DB.prepare("SELECT * FROM veille_items WHERE id = ?1").bind(Number(id)).first();
  if (!row) throw new HttpError(404, "not_found");
  return json({ item: itemOut(row, true) });
}

export async function adminUpdate(request, env, id) {
  await requireAdmin(request, env);
  const body = await readJson(request, 64 * 1024);
  const row = await env.DB.prepare("SELECT * FROM veille_items WHERE id = ?1").bind(Number(id)).first();
  if (!row) throw new HttpError(404, "not_found");
  if (body.delete === true) {
    await env.DB.prepare("DELETE FROM veille_items WHERE id = ?1").bind(row.id).run();
    return json({ ok: true, deleted: true });
  }
  const result = parse(row.result, null);
  // Corrections manuelles de l'admin (titre, texte, verdict) avant publication.
  if (result && body.news && typeof body.news === "object") {
    result.card.news.title = String(body.news.title ?? result.card.news.title).slice(0, 120);
    result.card.news.body = String(body.news.body ?? result.card.news.body).slice(0, 1500);
  }
  let verdict = row.verdict;
  if (["green", "orange", "red"].includes(body.verdict) && result) {
    verdict = body.verdict;
    result.card.verdict = verdict;
    fitScore(result.card); // la note reste dans la plage de la nouvelle couleur
  }
  let published = row.published;
  let publishedAt = row.published_at;
  if (typeof body.published === "boolean") {
    if (body.published && !(row.status === "done" && ["green", "orange", "red"].includes(verdict))) {
      throw new HttpError(400, "invalid", { reason: "Seules les analyses terminées peuvent être publiées" });
    }
    published = body.published ? 1 : 0;
    publishedAt = body.published ? publishedAt || Date.now() : null;
  }
  await env.DB.prepare("UPDATE veille_items SET result = ?2, verdict = ?3, published = ?4, published_at = ?5, updated_at = ?6 WHERE id = ?1")
    .bind(row.id, result ? JSON.stringify(result) : row.result, verdict, published, publishedAt, Date.now()).run();
  const updated = await env.DB.prepare("SELECT * FROM veille_items WHERE id = ?1").bind(row.id).first();
  return json({ item: itemOut(updated, true) });
}

// Jeton personnel pour le raccourci iOS : affiché UNE seule fois, seule l'empreinte est gardée.
export async function adminTokens(request, env) {
  const me = await requireAdmin(request, env);
  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM api_tokens WHERE user_id = ?1").bind(me.id).run();
    return json({ ok: true });
  }
  if (request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT label, created_at, last_used_at FROM api_tokens WHERE user_id = ?1 ORDER BY created_at DESC").bind(me.id).all();
    return json({ tokens: results });
  }
  const token = `vt_${randomHex(24)}`;
  await env.DB.prepare("INSERT INTO api_tokens (token_hash, user_id, label, created_at) VALUES (?1, ?2, ?3, ?4)")
    .bind(await sha256(token), me.id, "Raccourci iOS", Date.now()).run();
  return json({ token });
}

// ───────── Public : Actualités ─────────
export async function news(request, env) {
  await ensureSchema(env.DB);
  const { results } = await env.DB.prepare(
    "SELECT * FROM veille_items WHERE published = 1 AND status = 'done' ORDER BY published_at DESC LIMIT 60"
  ).all();
  const items = results.map((r) => {
    const { card, github } = parse(r.result, {}) || {};
    if (!card) return null;
    return {
      id: r.id,
      verdict: r.verdict,
      published_at: r.published_at,
      title: card.news.title,
      body: card.news.body,
      tool: { name: card.tool.name, category: card.tool.category, url: card.tool.official_url, pricing: card.tool.pricing, pricing_note: card.tool.pricing_note },
      summary: card.summary,
      uses: r.verdict === "green" ? card.uses : [],
      checks: card.security.checks,
      reasons: card.verdict_reasons,
      score: typeof card.score === "number" ? card.score : null,
      highlights: card.highlights || [],
      risks: card.risks || [],
      uncertainties: card.uncertainties || [],
      improvements: card.improvements || [],
      github: github ? { repo: github.repo, stars: github.stars, license: github.license } : null,
      sources: card.sources.slice(0, 5),
    };
  }).filter(Boolean);
  return json({ items }, 200, { "cache-control": "public, max-age=120" });
}


// Message d'erreur lisible : pour une erreur de l'API Claude, le code HTTP et l'explication.
function errorText(e) {
  const apiMessage = e?.error?.error?.message;
  return (apiMessage ? `${e.status} : ${apiMessage}` : String(e?.message || e)).slice(0, 500);
}
