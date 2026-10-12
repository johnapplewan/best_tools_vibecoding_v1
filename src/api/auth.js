// Connexion avec GitHub (OAuth). On ne demande AUCUNE permission (pas d'email, pas de dépôts) :
// GitHub nous donne seulement l'identifiant, le nom d'utilisateur et l'avatar publics.
// Le jeton GitHub est jeté (et révoqué) aussitôt après : la plateforme ne le conserve pas.
import { cookie, parseCookies, randomHex, HttpError } from "../lib/http.js";
import { ensureSchema } from "../lib/schema.js";
import { createSession, destroySession } from "../lib/session.js";

const STATE_COOKIE = "vt_oauth_state";
const CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // base32 de Crockford (sans I, L, O, U)

function newMemberCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "VD-" + [...bytes].map((b) => CODE_ALPHABET[b % 32]).join("");
}

function safeNext(value) {
  return typeof value === "string" && /^\/[A-Za-z0-9/_\-.?=&#]*$/.test(value) && !value.startsWith("//") ? value : "/moi";
}

function redirect(location, cookies = []) {
  const headers = new Headers({ location, "cache-control": "no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(null, { status: 302, headers });
}

export async function login(request, env) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response("Connexion GitHub pas encore configurée (secrets GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET manquants).", { status: 503 });
  }
  const url = new URL(request.url);
  const state = randomHex(16);
  const next = safeNext(url.searchParams.get("next"));
  const gh = new URL("https://github.com/login/oauth/authorize");
  gh.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  gh.searchParams.set("redirect_uri", `${url.origin}/auth/callback`);
  gh.searchParams.set("state", state);
  gh.searchParams.set("scope", ""); // aucune permission : profil public uniquement
  gh.searchParams.set("allow_signup", "true");
  return redirect(gh.toString(), [cookie(request, STATE_COOKIE, `${state}|${next}`, 600)]);
}

export async function callback(request, env, ctx) {
  const url = new URL(request.url);
  const [expected, next] = (parseCookies(request)[STATE_COOKIE] || "").split("|");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!expected || !state || state !== expected || !code) throw new HttpError(400, "bad_oauth_state");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/auth/callback`,
    }),
  });
  const tokenData = await tokenRes.json().catch(() => ({}));
  if (!tokenData.access_token) throw new HttpError(502, "github_token_failed");

  const userRes = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${tokenData.access_token}`, accept: "application/vnd.github+json", "user-agent": "vibe-tools" },
  });
  const gh = await userRes.json().catch(() => ({}));

  // On révoque immédiatement le jeton GitHub : il ne nous sert plus à rien.
  const basic = btoa(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`);
  const revoke = fetch(`https://api.github.com/applications/${env.GITHUB_CLIENT_ID}/token`, {
    method: "DELETE",
    headers: { authorization: `Basic ${basic}`, accept: "application/vnd.github+json", "user-agent": "vibe-tools", "content-type": "application/json" },
    body: JSON.stringify({ access_token: tokenData.access_token }),
  }).catch(() => {});
  ctx?.waitUntil?.(revoke);

  if (!Number.isInteger(gh.id) || !gh.login) throw new HttpError(502, "github_user_failed");
  const userId = await upsertGithubUser(env, { id: gh.id, login: gh.login, avatar: gh.avatar_url || null });
  const session = await createSession(request, env, userId);
  return redirect(safeNext(next), [session, cookie(request, STATE_COOKIE, "", 0)]);
}

export async function upsertGithubUser(env, { id, login, avatar }) {
  await ensureSchema(env.DB);
  const now = Date.now();
  const existing = await env.DB.prepare("SELECT id FROM users WHERE github_id = ?1").bind(id).first();
  if (existing) {
    await env.DB.prepare("UPDATE users SET github_login = ?1, github_avatar = ?2 WHERE id = ?3").bind(login, avatar, existing.id).run();
    return existing.id;
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const row = await env.DB.prepare(
        `INSERT INTO users (code, github_id, github_login, github_avatar, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?5) RETURNING id`
      )
        .bind(newMemberCode(), id, login, avatar, now)
        .first();
      return row.id;
    } catch (e) {
      if (!String(e?.message || e).includes("UNIQUE")) throw e;
      const again = await env.DB.prepare("SELECT id FROM users WHERE github_id = ?1").bind(id).first();
      if (again) return again.id;
    }
  }
  throw new HttpError(500, "member_code_failed");
}

export async function logout(request, env) {
  const cleared = await destroySession(request, env);
  return redirect("/outils", [cleared]);
}

// Connexion factice pour tester en local uniquement (jamais active en production).
export async function devLogin(request, env) {
  const url = new URL(request.url);
  if (env.DEV_LOGIN !== "1" || !["localhost", "127.0.0.1"].includes(url.hostname)) {
    return new Response("Not Found", { status: 404 });
  }
  const n = Number(url.searchParams.get("n") || 1);
  const login = url.searchParams.get("login") || `dev-user-${n}`;
  const userId = await upsertGithubUser(env, { id: 900000 + n, login, avatar: null });
  const session = await createSession(request, env, userId);
  return redirect(safeNext(url.searchParams.get("next")), [session]);
}
