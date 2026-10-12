// Sessions : un jeton aléatoire dans un cookie HttpOnly, seule son empreinte est stockée en base.
import { parseCookies, cookie, randomHex, sha256, HttpError } from "./http.js";
import { ensureSchema } from "./schema.js";

export const SESSION_COOKIE = "vt_session";
const SESSION_DAYS = 30;

export async function createSession(request, env, userId) {
  const token = randomHex(32);
  const expires = Date.now() + SESSION_DAYS * 86400e3;
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?1, ?2, ?3)")
    .bind(await sha256(token), userId, expires)
    .run();
  // Ménage des sessions expirées.
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?1").bind(Date.now()).run();
  return cookie(request, SESSION_COOKIE, token, SESSION_DAYS * 86400);
}

export async function destroySession(request, env) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?1").bind(await sha256(token)).run();
  return cookie(request, SESSION_COOKIE, "", 0);
}

export async function currentUser(request, env) {
  if (!env.DB) return null;
  await ensureSchema(env.DB);
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return env.DB.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?1 AND s.expires_at > ?2`
  )
    .bind(await sha256(token), Date.now())
    .first();
}

export async function requireUser(request, env, { onboarded = true } = {}) {
  const user = await currentUser(request, env);
  if (!user) throw new HttpError(401, "not_logged_in");
  if (onboarded && (!user.pseudo || !user.terms_accepted_at)) throw new HttpError(403, "onboarding_required");
  return user;
}

export function isAdmin(user, env) {
  if (!user) return false;
  const admins = String(env.ADMIN_GITHUB_LOGINS || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  return admins.includes(String(user.github_login).toLowerCase());
}
