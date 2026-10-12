// Limites de fréquence (anti-robots, anti-spam), stockées dans D1.
// Une ligne par clé (ex. « contact:ip:<empreinte> ») avec un compteur par fenêtre de temps.
import { HttpError, sha256 } from "./http.js";

let ready = false;
async function ensureTable(db) {
  if (ready) return;
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL)"
  ).run();
  ready = true;
}

// Empreinte de l'IP (jamais stockée en clair), salée avec RATING_SALT.
export async function ipKey(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
  return (await sha256(`${ip}|${env.RATING_SALT || "vibe-tools"}`)).slice(0, 32);
}

// Compte un passage ; lève une erreur 429 au-delà de `limit` passages par fenêtre de `windowSec` secondes.
export async function hit(env, key, limit, windowSec) {
  if (!env.DB) return;
  await ensureTable(env.DB);
  const now = Date.now();
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN window_start <= ?3 THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start <= ?3 THEN ?2 ELSE window_start END
     RETURNING count, window_start`
  )
    .bind(key, now, now - windowSec * 1000)
    .first();
  // Ménage occasionnel des compteurs périmés.
  if (Math.random() < 0.01) await env.DB.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(now - 2 * 86400e3).run();
  if (row.count > limit) {
    const retry = Math.max(1, Math.ceil((row.window_start + windowSec * 1000 - now) / 1000));
    throw new HttpError(429, "rate_limited", { reason: "Trop de requêtes. Réessayez un peu plus tard.", retryAfter: retry });
  }
}
