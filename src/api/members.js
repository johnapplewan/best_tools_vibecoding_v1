// Profil du membre connecté, showroom public, recommandations, signalements et modération.
import { json, readJson, HttpError } from "../lib/http.js";
import { hit } from "../lib/ratelimit.js";
import { ensureSchema } from "../lib/schema.js";
import { currentUser, requireUser, isAdmin, destroySession } from "../lib/session.js";
import {
  TERMS_VERSION, SPECIALTIES, CONTACT_NETWORKS, cleanPseudo, cleanText, cleanSpecialties, cleanContacts, cleanProjects, projectThumbnail,
} from "../lib/validate.js";

const parse = (s, fallback) => {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
};

function publicAvatar(u) {
  return u.avatar_mode === "github" && u.github_avatar ? u.github_avatar : null;
}

function projectOut(p) {
  return {
    title: p.title, pitch: p.pitch, github_url: p.github_url, demo_url: p.demo_url,
    tools: parse(p.tools, []), thumbnail: projectThumbnail(p.github_url), position: p.position,
  };
}

async function projectsOf(env, userId) {
  const { results } = await env.DB.prepare("SELECT * FROM projects WHERE user_id = ?1 ORDER BY position").bind(userId).all();
  return results.map(projectOut);
}

// Données publiques d'un membre : pseudo, identifiant, jamais de donnée personnelle.
function memberOut(u, projects, extra = {}) {
  const contacts = parse(u.contacts, {});
  return {
    code: u.code,
    pseudo: u.pseudo,
    avatar: publicAvatar(u),
    bio: u.bio,
    specialties: parse(u.specialties, []),
    available: !!u.available,
    networks: CONTACT_NETWORKS.filter((n) => contacts[n]),
    projects,
    ...extra,
  };
}

// ───────── Mon compte ─────────

export async function getMe(request, env) {
  const user = await currentUser(request, env);
  if (!user) return json({ user: null, options: { specialties: SPECIALTIES, networks: CONTACT_NETWORKS, termsVersion: TERMS_VERSION } });
  return json({
    user: {
      code: user.code,
      pseudo: user.pseudo,
      needsOnboarding: !user.pseudo || !user.terms_accepted_at || user.terms_version !== TERMS_VERSION,
      avatarMode: user.avatar_mode,
      githubAvatar: user.github_avatar, // visible par le membre lui-même uniquement
      bio: user.bio,
      specialties: parse(user.specialties, []),
      available: !!user.available,
      contacts: parse(user.contacts, {}),
      projects: await projectsOf(env, user.id),
      hidden: !!user.hidden,
      isAdmin: isAdmin(user, env),
    },
    options: { specialties: SPECIALTIES, networks: CONTACT_NETWORKS, termsVersion: TERMS_VERSION },
  });
}

export async function onboarding(request, env) {
  const user = await requireUser(request, env, { onboarded: false });
  const body = await readJson(request);
  if (body.acceptTerms !== true) throw new HttpError(400, "invalid", { field: "acceptTerms", reason: "Vous devez accepter la charte et les conditions d'utilisation" });
  if (body.adult !== true) throw new HttpError(400, "invalid", { field: "adult", reason: "La plateforme est réservée aux personnes majeures" });
  const pseudo = cleanPseudo(body.pseudo);
  await savePseudo(env, user.id, pseudo, ", terms_version = ?3, terms_accepted_at = ?4", [TERMS_VERSION, Date.now()]);
  return json({ ok: true });
}

async function savePseudo(env, userId, pseudo, extraSql = "", extraBinds = []) {
  try {
    await env.DB.prepare(`UPDATE users SET pseudo = ?1, updated_at = ?2${extraSql} WHERE id = ?${extraBinds.length + 3}`)
      .bind(pseudo, Date.now(), ...extraBinds, userId)
      .run();
  } catch (e) {
    if (String(e?.message || e).includes("UNIQUE")) throw new HttpError(409, "invalid", { field: "pseudo", reason: "Ce pseudo est déjà pris" });
    throw e;
  }
}

export async function updateProfile(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const pseudo = cleanPseudo(body.pseudo);
  const bio = cleanText(body.bio, "bio", 280);
  const specialties = cleanSpecialties(body.specialties);
  const contacts = cleanContacts(body.contacts);
  const avatarMode = body.avatarMode === "github" ? "github" : "generated";
  if (pseudo !== user.pseudo) await savePseudo(env, user.id, pseudo);
  await env.DB.prepare(
    `UPDATE users SET bio = ?1, specialties = ?2, contacts = ?3, available = ?4, avatar_mode = ?5, updated_at = ?6 WHERE id = ?7`
  )
    .bind(bio, JSON.stringify(specialties), JSON.stringify(contacts), body.available ? 1 : 0, avatarMode, Date.now(), user.id)
    .run();
  return json({ ok: true, contacts });
}

export async function updateProjects(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request, 64 * 1024);
  const projects = cleanProjects(body.projects);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM projects WHERE user_id = ?1").bind(user.id),
    ...projects.map((p) =>
      env.DB.prepare(
        `INSERT INTO projects (user_id, position, title, pitch, github_url, demo_url, tools, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
      ).bind(user.id, p.position, p.title, p.pitch, p.github_url, p.demo_url, JSON.stringify(p.tools), now)
    ),
  ]);
  return json({ ok: true, projects: await projectsOf(env, user.id) });
}

export async function deleteMe(request, env) {
  const user = await requireUser(request, env, { onboarded: false });
  await env.DB.batch([
    env.DB.prepare("DELETE FROM projects WHERE user_id = ?1").bind(user.id),
    env.DB.prepare("DELETE FROM recommendations WHERE from_user = ?1 OR to_user = ?1").bind(user.id),
    env.DB.prepare("DELETE FROM reports WHERE reporter = ?1 OR target = ?1").bind(user.id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?1").bind(user.id),
    env.DB.prepare("DELETE FROM users WHERE id = ?1").bind(user.id),
  ]);
  const cleared = await destroySession(request, env);
  return json({ ok: true }, 200, { "set-cookie": cleared });
}

// ───────── Showroom public ─────────

const VISIBLE = "u.pseudo IS NOT NULL AND u.terms_accepted_at IS NOT NULL AND u.hidden = 0";

export async function listShowroom(request, env) {
  await ensureSchema(env.DB);
  const me = await currentUser(request, env);
  const [{ results: users }, { results: projects }, { results: recos }] = await Promise.all([
    env.DB.prepare(`SELECT u.* FROM users u WHERE ${VISIBLE} ORDER BY u.updated_at DESC LIMIT 500`).all(),
    env.DB.prepare(`SELECT p.* FROM projects p JOIN users u ON u.id = p.user_id WHERE ${VISIBLE} ORDER BY p.position`).all(),
    env.DB.prepare("SELECT to_user, COUNT(*) AS n FROM recommendations GROUP BY to_user").all(),
  ]);
  const mine = me
    ? new Set((await env.DB.prepare("SELECT to_user FROM recommendations WHERE from_user = ?1").bind(me.id).all()).results.map((r) => r.to_user))
    : new Set();
  const byUser = new Map();
  for (const p of projects) {
    if (!byUser.has(p.user_id)) byUser.set(p.user_id, []);
    byUser.get(p.user_id).push(projectOut(p));
  }
  const counts = new Map(recos.map((r) => [r.to_user, r.n]));
  const members = users.map((u) =>
    memberOut(u, byUser.get(u.id) || [], { recommendations: counts.get(u.id) || 0, recommendedByMe: mine.has(u.id), isMe: me?.id === u.id })
  );
  return json({ members, options: { specialties: SPECIALTIES } });
}

async function findVisible(env, code) {
  if (!/^VD-[0-9A-Z]{5}$/.test(code || "")) return null;
  return env.DB.prepare(`SELECT u.* FROM users u WHERE u.code = ?1 AND ${VISIBLE}`).bind(code).first();
}

export async function getMember(request, env, code) {
  await ensureSchema(env.DB);
  const u = await findVisible(env, code);
  if (!u) throw new HttpError(404, "not_found");
  const me = await currentUser(request, env);
  const { results } = await env.DB.prepare(
    `SELECT r.message, r.created_at, f.pseudo, f.code FROM recommendations r JOIN users f ON f.id = r.from_user
     WHERE r.to_user = ?1 AND f.hidden = 0 AND f.pseudo IS NOT NULL ORDER BY r.created_at DESC LIMIT 100`
  )
    .bind(u.id)
    .all();
  const recommendedByMe = me ? !!(await env.DB.prepare("SELECT 1 FROM recommendations WHERE from_user = ?1 AND to_user = ?2").bind(me.id, u.id).first()) : false;
  return json({
    member: memberOut(u, await projectsOf(env, u.id), {
      recommendations: results.length,
      recommendedBy: results.map((r) => ({ pseudo: r.pseudo, code: r.code, message: r.message, at: r.created_at })),
      recommendedByMe,
      isMe: me?.id === u.id,
    }),
  });
}

// Redirection vers un lien de contact. Réservée aux membres connectés (anti-aspiration par des robots),
// avec un quota quotidien. Le lien n'apparaît jamais dans les pages, il n'est donné qu'au clic.
export async function contactRedirect(request, env, code, network) {
  await ensureSchema(env.DB);
  const me = await currentUser(request, env);
  const go = (location) => new Response(null, { status: 302, headers: { location, "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } });
  if (!me) return go(`/auth/login?next=${encodeURIComponent(`/showroom#${code}`)}`);
  if (!me.pseudo || !me.terms_accepted_at) return go("/moi");
  await hit(env, `contact:user:${me.id}`, 40, 86400);
  const u = await findVisible(env, code);
  const url = u && CONTACT_NETWORKS.includes(network) ? parse(u.contacts, {})[network] : null;
  if (!url) return new Response("Lien de contact introuvable", { status: 404 });
  return go(url);
}

// ───────── Recommandations ─────────

export async function recommend(request, env) {
  const me = await requireUser(request, env);
  const body = await readJson(request);
  const target = await findVisible(env, body.code);
  if (!target) throw new HttpError(404, "not_found");
  if (target.id === me.id) throw new HttpError(400, "invalid", { field: "code", reason: "Vous ne pouvez pas vous recommander vous-même" });
  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM recommendations WHERE from_user = ?1 AND to_user = ?2").bind(me.id, target.id).run();
    return json({ ok: true, recommended: false });
  }
  const message = cleanText(body.message, "message", 200);
  await env.DB.prepare(
    `INSERT INTO recommendations (from_user, to_user, message, created_at) VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT (from_user, to_user) DO UPDATE SET message = excluded.message`
  )
    .bind(me.id, target.id, message, Date.now())
    .run();
  return json({ ok: true, recommended: true });
}

// ───────── Signalements et modération ─────────

export async function report(request, env) {
  const me = await requireUser(request, env);
  const body = await readJson(request);
  const target = await findVisible(env, body.code);
  if (!target) throw new HttpError(404, "not_found");
  const reason = cleanText(body.reason, "reason", 500);
  if (reason.length < 5) throw new HttpError(400, "invalid", { field: "reason", reason: "Expliquez la raison en quelques mots" });
  await env.DB.prepare(
    `INSERT INTO reports (reporter, target, reason, created_at) VALUES (?1, ?2, ?3, ?4)
     ON CONFLICT (reporter, target) DO UPDATE SET reason = excluded.reason, status = 'open', created_at = excluded.created_at`
  )
    .bind(me.id, target.id, reason, Date.now())
    .run();
  return json({ ok: true });
}

async function requireAdmin(request, env) {
  const me = await requireUser(request, env);
  if (!isAdmin(me, env)) throw new HttpError(403, "forbidden");
  return me;
}

export async function adminReports(request, env) {
  await requireAdmin(request, env);
  const { results } = await env.DB.prepare(
    `SELECT r.id, r.reason, r.status, r.created_at, t.code AS target_code, t.pseudo AS target_pseudo, t.hidden AS target_hidden,
            f.code AS reporter_code, f.pseudo AS reporter_pseudo
     FROM reports r JOIN users t ON t.id = r.target JOIN users f ON f.id = r.reporter
     ORDER BY r.status = 'open' DESC, r.created_at DESC LIMIT 200`
  ).all();
  return json({ reports: results });
}

export async function adminModerate(request, env) {
  await requireAdmin(request, env);
  const body = await readJson(request);
  if (body.reportId && ["open", "closed"].includes(body.status)) {
    await env.DB.prepare("UPDATE reports SET status = ?1 WHERE id = ?2").bind(body.status, Number(body.reportId)).run();
  }
  if (body.code && typeof body.hidden === "boolean") {
    if (!/^VD-[0-9A-Z]{5}$/.test(body.code)) throw new HttpError(400, "invalid", { field: "code" });
    await env.DB.prepare("UPDATE users SET hidden = ?1 WHERE code = ?2").bind(body.hidden ? 1 : 0, body.code).run();
  }
  return json({ ok: true });
}
