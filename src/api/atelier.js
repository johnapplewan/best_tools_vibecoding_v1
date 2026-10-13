// Atelier « Créer ici » : projets à plusieurs, équipe, missions, calendrier, réunions, décisions,
// mise en ligne, et protection du porteur (codes de récupération, relances, intérim encadré).
// Spécification : docs/plateforme/creer-ici.md
import { json, readJson, HttpError, sha256 } from "../lib/http.js";
import { hit, ipKey } from "../lib/ratelimit.js";
import { ensureSchema } from "../lib/schema.js";
import { currentUser, requireUser, isAdmin } from "../lib/session.js";
import {
  cleanText, cleanMultiline, cleanDay, cleanGithubRepo, cleanGithubItem, cleanHttps, cleanChannel, projectThumbnail,
} from "../lib/validate.js";
import { TOOL_IDS } from "../../public/assets/tools.js";

const DAY = 86400e3;
const bad = (field, reason) => new HttpError(400, "invalid", { field, reason });
const parse = (s, fallback) => {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
};

export const STATUS = {
  draft: "Brouillon", review: "En validation", recruiting: "Recrute", active: "En cours", paused: "En pause",
  testing: "En recette", launch_review: "Mise en ligne en vérification", live: "En ligne", archived: "Archivé",
};
const PUBLIC_STATUS = ["recruiting", "active", "paused", "testing", "launch_review", "live", "archived"];
const WORKING = ["recruiting", "active", "paused", "testing", "launch_review"];
const LEVELS = ["all", "beginner", "intermediate", "advanced"];
const LICENSES = ["MIT", "Apache-2.0", "GPL-3.0", "AGPL-3.0", "MPL-2.0", "CC-BY-4.0", "Autre"];
const CHECKLIST = ["goal", "readme", "license", "secrets", "privacy", "demo", "review"];
const MOODS = ["sun", "cloud", "rain"];
const REMINDERS = [14, 21, 28]; // jours sans activité du porteur → relances 1, 2, 3
const INTERIM_AFTER = 35; // jours
const OPPOSITION_DAYS = 7;

// ───────── Lecture ─────────

async function loadProject(env, id) {
  const p = await env.DB.prepare("SELECT * FROM cp_projects WHERE id = ?1").bind(Number(id)).first();
  if (!p) throw new HttpError(404, "not_found");
  return p;
}

async function teamOf(env, pid) {
  const { results } = await env.DB.prepare(
    `SELECT m.*, u.code, u.pseudo, u.avatar_mode, u.github_avatar, u.hidden
     FROM cp_members m JOIN users u ON u.id = m.user_id WHERE m.project_id = ?1 ORDER BY m.joined_at`
  ).bind(pid).all();
  return results;
}

const leadId = (p) => (p.interim_status === "active" && p.co_id ? p.co_id : p.owner_id);

function ctxOf(p, team, user, env) {
  const me = user ? team.find((m) => m.user_id === user.id && m.active) : null;
  return {
    user,
    admin: isAdmin(user, env),
    member: !!me,
    owner: !!user && user.id === p.owner_id,
    co: !!user && user.id === p.co_id && !!p.co_accepted_at,
    lead: !!user && user.id === leadId(p),
  };
}

const need = (cond, reason = "Action non autorisée") => {
  if (!cond) throw new HttpError(403, "forbidden", { reason });
};

function memberOut(m, p) {
  return {
    code: m.code,
    pseudo: m.hidden ? "Membre masqué" : m.pseudo,
    avatar: !m.hidden && m.avatar_mode === "github" ? m.github_avatar : null,
    skill: m.skill,
    role: m.user_id === p.owner_id ? "owner" : m.user_id === p.co_id && p.co_accepted_at ? "co" : m.user_id === p.co_id ? "co_invited" : "contributor",
    founder: m.user_id === p.founder_id,
    active: !!m.active,
    credited: !!m.credited,
    charterSigned: m.charter_version > 0 && m.charter_version === p.charter_version,
  };
}

function cardOut(p, extra = {}) {
  return {
    id: p.id, name: p.name, pitch: p.pitch, status: p.status, statusLabel: STATUS[p.status], level: p.level,
    roles: parse(p.roles, []), tools: parse(p.tools, []), thumbnail: projectThumbnail(p.repo_url, p.image_id, false),
    createdHere: p.status === "live" || (p.status === "archived" && !!p.live_at), updated_at: p.updated_at, ...extra,
  };
}

const userCode = async (env, id) => (id ? (await env.DB.prepare("SELECT code, pseudo FROM users WHERE id = ?1").bind(id).first()) : null);

// Liste : projets publics, mes projets, et la file de l'admin.
export async function list(request, env) {
  await ensureSchema(env.DB);
  const user = await currentUser(request, env);
  const { results } = await env.DB.prepare(
    `SELECT p.*, (SELECT COUNT(*) FROM cp_members m WHERE m.project_id = p.id AND m.active = 1) AS team_size
     FROM cp_projects p WHERE p.status IN (${PUBLIC_STATUS.map((s) => `'${s}'`).join(",")}) ORDER BY p.updated_at DESC LIMIT 300`
  ).all();
  const out = { projects: results.map((p) => cardOut(p, { teamSize: p.team_size })), mine: [], queue: null, notifications: [] };
  if (user) {
    const mine = await env.DB.prepare(
      `SELECT p.* FROM cp_projects p JOIN cp_members m ON m.project_id = p.id AND m.user_id = ?1 AND m.active = 1 ORDER BY p.updated_at DESC`
    ).bind(user.id).all();
    out.mine = mine.results.map((p) => cardOut(p, { role: p.owner_id === user.id ? "owner" : p.co_id === user.id ? "co" : "contributor" }));
    out.notifications = (await env.DB.prepare(
      "SELECT id, text, link, read_at, created_at FROM notifications WHERE user_id = ?1 ORDER BY created_at DESC LIMIT 30"
    ).bind(user.id).all()).results;
    if (isAdmin(user, env)) {
      const q = await env.DB.prepare(
        "SELECT * FROM cp_projects WHERE status IN ('review', 'launch_review') OR interim_status = 'admin' ORDER BY updated_at"
      ).all();
      out.queue = q.results.map((p) => cardOut(p, { interim: p.interim_status }));
    }
  }
  return json(out);
}

// Fiche complète. Le public voit la fiche, l'équipe, les jalons et le journal ; l'équipe voit tout le reste.
export async function get(request, env, id) {
  await ensureSchema(env.DB);
  const user = await currentUser(request, env);
  let p = await loadProject(env, id);
  p = await ownerSeen(env, p);
  const team = await teamOf(env, p.id);
  const c = ctxOf(p, team, user, env);
  if (!PUBLIC_STATUS.includes(p.status)) need(c.member || c.admin, "Ce projet n'est pas encore public");
  const db = env.DB;
  const [events, journal] = await Promise.all([
    db.prepare("SELECT * FROM cp_events WHERE project_id = ?1 ORDER BY day, time").bind(p.id).all(),
    db.prepare("SELECT text, created_at FROM cp_journal WHERE project_id = ?1 ORDER BY created_at DESC LIMIT 200").bind(p.id).all(),
  ]);
  const byId = new Map(team.map((m) => [m.user_id, m]));
  const codeOf = (uid) => byId.get(uid)?.code || null;
  const out = {
    project: {
      id: p.id, name: p.name, pitch: p.pitch, problem: p.problem, objective: p.objective, scope_in: p.scope_in, scope_out: p.scope_out,
      roles: parse(p.roles, []), commitment: p.commitment, duration: p.duration, level: p.level, tools: parse(p.tools, []),
      license: p.license, repo_url: p.repo_url, demo_url: p.demo_url, thumbnail: projectThumbnail(p.repo_url, p.image_id, false),
      image_id: c.lead ? p.image_id : undefined,
      status: p.status, statusLabel: STATUS[p.status], adminNote: c.member || c.admin ? p.admin_note : null,
      createdHere: !!p.live_at, live_at: p.live_at, created_at: p.created_at,
      frozen: !!p.frozen_at, interim: p.interim_status, interimUntil: p.interim_until,
      founder: codeOf(p.founder_id) || (await userCode(env, p.founder_id))?.code,
      retro: p.live_at ? parse(p.retro, {}) : undefined,
    },
    team: team.filter((m) => m.active || m.credited || m.user_id === p.founder_id).map((m) => memberOut(m, p)),
    events: events.results.filter((e) => c.member || e.kind === "milestone"),
    journal: journal.results,
    viewer: {
      loggedIn: !!user, onboarded: !!user?.pseudo && !!user?.terms_accepted_at, code: user?.code || null,
      member: c.member, owner: c.owner, co: c.co, lead: c.lead, admin: c.admin,
      coInvited: !!user && user.id === p.co_id && !p.co_accepted_at,
    },
  };
  if (user && !c.member) {
    const app = await db.prepare("SELECT status FROM cp_applications WHERE project_id = ?1 AND user_id = ?2 ORDER BY id DESC").bind(p.id, user.id).first();
    out.viewer.application = app?.status || null;
  }
  if (c.member || c.admin) {
    const [missions, meetings, decisions, weather] = await Promise.all([
      db.prepare("SELECT * FROM cp_missions WHERE project_id = ?1 ORDER BY status = 'done', due IS NULL, due, id").bind(p.id).all(),
      db.prepare("SELECT * FROM cp_meetings WHERE project_id = ?1 ORDER BY day DESC, id DESC").bind(p.id).all(),
      db.prepare("SELECT * FROM cp_decisions WHERE project_id = ?1 ORDER BY day DESC, id DESC").bind(p.id).all(),
      db.prepare("SELECT user_id, mood FROM cp_weather WHERE project_id = ?1 AND week = ?2").bind(p.id, isoWeek()).all(),
    ]);
    Object.assign(out.project, {
      channel_url: p.channel_url, charter: parse(p.charter, {}), charterVersion: p.charter_version, checklist: parse(p.checklist, {}),
      retro: parse(p.retro, {}), reminderStage: p.reminder_stage,
    });
    const now = Date.now();
    out.missions = missions.results.map((m) => ({
      id: m.id, title: m.title, description: m.description, done_when: m.done_when, size: m.size, due: m.due, status: m.status,
      assignee: codeOf(m.assignee_id), createdBy: codeOf(m.created_by), issue_url: m.issue_url, pr_url: m.pr_url,
      nudged: !!m.nudged_at, reassignable: canReassign(m, now, byId),
    }));
    out.meetings = meetings.results.map((m) => ({
      id: m.id, day: m.day, participants: parse(m.participants, []), agenda: m.agenda, decisions: m.decisions, actions: parse(m.actions, []),
      createdBy: codeOf(m.created_by),
    }));
    out.decisions = decisions.results.map((d) => ({ id: d.id, day: d.day, decision: d.decision, reason: d.reason, meeting_id: d.meeting_id }));
    out.weather = weather.results.map((w) => ({ code: codeOf(w.user_id), mood: w.mood }));
    if (p.interim_status) {
      const votes = (await db.prepare("SELECT user_id, yes FROM cp_votes WHERE project_id = ?1").bind(p.id).all()).results;
      out.interimVotes = { yes: votes.filter((v) => v.yes).length, no: votes.filter((v) => !v.yes).length, voters: voters(team, p).length, mine: user ? votes.find((v) => v.user_id === user.id)?.yes ?? null : null };
    }
    if (c.owner || c.co) {
      const seen = (await db.prepare("SELECT last_seen_at FROM users WHERE id = ?1").bind(p.owner_id).first())?.last_seen_at || p.created_at;
      out.continuity = {
        ownerInactiveDays: Math.floor((now - Math.max(seen, p.created_at)) / DAY),
        reminders: REMINDERS, interimAfter: INTERIM_AFTER,
        codesLeft: c.owner ? (await db.prepare("SELECT COUNT(*) AS n FROM cp_recovery WHERE project_id = ?1 AND used_at IS NULL").bind(p.id).first()).n : undefined,
      };
    }
  }
  if (c.lead) {
    const apps = await db.prepare(
      `SELECT a.id, a.skill, a.message, a.created_at, u.code, u.pseudo FROM cp_applications a JOIN users u ON u.id = a.user_id
       WHERE a.project_id = ?1 AND a.status = 'pending' ORDER BY a.created_at`
    ).bind(p.id).all();
    out.applications = apps.results;
  }
  return json(out);
}

const voters = (team, p) => team.filter((m) => m.active && m.user_id !== p.owner_id);

// Une mission assignée ne peut être réattribuée par le porteur qu'après la relance amicale (14 j) restée
// sans réponse 7 jours, ou si son responsable a quitté le projet.
function canReassign(m, now, byId) {
  if (!m.assignee_id || m.status === "done") return true;
  if (!byId.get(m.assignee_id)?.active) return true;
  return !!m.nudged_at && now - m.nudged_at >= 7 * DAY && m.activity_at <= m.nudged_at;
}

// ───────── Création et fiche ─────────

function cleanFiche(body, p = {}) {
  const name = cleanText(body.name, "name", 60);
  if (!name) throw bad("name", "Le nom du projet est obligatoire");
  const roles = (Array.isArray(body.roles) ? body.roles : []).slice(0, 8).map((r, i) => {
    const role = cleanText(r?.role, `roles.${i}`, 40);
    const slots = Math.max(1, Math.min(10, Number(r?.slots) || 1));
    return role ? { role, slots } : null;
  }).filter(Boolean);
  return {
    name,
    pitch: cleanText(body.pitch, "pitch", 140),
    problem: cleanMultiline(body.problem, "problem", 600),
    objective: cleanText(body.objective, "objective", 200),
    scope_in: cleanMultiline(body.scope_in, "scope_in", 800),
    scope_out: cleanMultiline(body.scope_out, "scope_out", 800),
    roles: JSON.stringify(roles),
    commitment: cleanText(body.commitment, "commitment", 60),
    duration: cleanText(body.duration, "duration", 60),
    level: LEVELS.includes(body.level) ? body.level : "all",
    tools: JSON.stringify((Array.isArray(body.tools) ? [...new Set(body.tools)] : []).filter((t) => TOOL_IDS.has(t)).slice(0, 10)),
    license: LICENSES.includes(body.license) ? body.license : p.license || "MIT",
    channel_url: cleanChannel(body.channel_url, "channel_url"),
    repo_url: cleanGithubRepo(body.repo_url, "repo_url"),
    demo_url: cleanHttps(body.demo_url, "demo_url"),
  };
}

const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function newRecoveryCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const s = [...bytes].map((b) => RECOVERY_ALPHABET[b % RECOVERY_ALPHABET.length]).join("");
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
}
const normCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const codeHash = (pid, code) => sha256(`cp:${pid}:${normCode(code)}`);

async function issueCodes(env, pid) {
  const codes = Array.from({ length: 8 }, newRecoveryCode);
  const hashes = await Promise.all(codes.map((c) => codeHash(pid, c)));
  await env.DB.batch([
    env.DB.prepare("DELETE FROM cp_recovery WHERE project_id = ?1").bind(pid),
    ...hashes.map((h) => env.DB.prepare("INSERT INTO cp_recovery (project_id, code_hash) VALUES (?1, ?2)").bind(pid, h)),
  ]);
  return codes;
}

export async function create(request, env) {
  const user = await requireUser(request, env);
  await hit(env, `cp-create:user:${user.id}`, 5, 86400);
  const body = await readJson(request, 64 * 1024);
  if (body.acceptRules !== true) throw bad("acceptRules", "Vous devez accepter les règles de continuité");
  const f = cleanFiche(body);
  const now = Date.now();
  const row = await env.DB.prepare(
    `INSERT INTO cp_projects (owner_id, founder_id, name, pitch, problem, objective, scope_in, scope_out, roles, commitment, duration, level, tools,
       license, channel_url, repo_url, demo_url, created_at, updated_at)
     VALUES (?1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?17) RETURNING id`
  ).bind(user.id, f.name, f.pitch, f.problem, f.objective, f.scope_in, f.scope_out, f.roles, f.commitment, f.duration, f.level, f.tools,
    f.license, f.channel_url, f.repo_url, f.demo_url, now).first();
  await env.DB.prepare("INSERT INTO cp_members (project_id, user_id, skill, joined_at) VALUES (?1, ?2, 'Porteur de projet', ?3)").bind(row.id, user.id, now).run();
  await journal(env, row.id, `Projet créé par ${user.pseudo} (${user.code}), qui en est le porteur. Règles de continuité acceptées.`);
  const codes = await issueCodes(env, row.id);
  return json({ ok: true, id: row.id, recoveryCodes: codes });
}

export async function update(request, env, id) {
  const user = await requireUser(request, env);
  let p = await ownerSeen(env, await loadProject(env, id));
  const c = ctxOf(p, await teamOf(env, p.id), user, env);
  need(c.lead, "Seul le porteur peut modifier la fiche");
  need(["draft", "recruiting", "active", "paused", "testing"].includes(p.status), "La fiche ne peut plus être modifiée à cette étape");
  const body = await readJson(request, 64 * 1024);
  const f = cleanFiche(body, p);
  // Pendant un intérim, la licence reste celle choisie par le porteur.
  if (!c.owner) f.license = p.license;
  let imageId = typeof body.image_id === "string" && /^img_[a-f0-9]{32}$/.test(body.image_id) ? body.image_id : null;
  if (imageId && imageId !== p.image_id) {
    const own = await env.DB.prepare("SELECT 1 FROM project_images WHERE id = ?1 AND user_id = ?2").bind(imageId, user.id).first();
    if (!own) imageId = p.image_id;
  }
  await env.DB.prepare(
    `UPDATE cp_projects SET name = ?1, pitch = ?2, problem = ?3, objective = ?4, scope_in = ?5, scope_out = ?6, roles = ?7, commitment = ?8,
       duration = ?9, level = ?10, tools = ?11, license = ?12, channel_url = ?13, repo_url = ?14, demo_url = ?15, image_id = ?16, updated_at = ?17
     WHERE id = ?18`
  ).bind(f.name, f.pitch, f.problem, f.objective, f.scope_in, f.scope_out, f.roles, f.commitment, f.duration, f.level, f.tools, f.license,
    f.channel_url, f.repo_url, f.demo_url, imageId, Date.now(), p.id).run();
  if (f.license !== p.license) await journal(env, p.id, `Licence changée : ${p.license} → ${f.license}.`);
  return json({ ok: true });
}

// ───────── Actions sur le projet ─────────

async function journal(env, pid, text) {
  await env.DB.prepare("INSERT INTO cp_journal (project_id, text, created_at) VALUES (?1, ?2, ?3)").bind(pid, text, Date.now()).run();
}

async function notify(env, userIds, text, link) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (!ids.length) return;
  const now = Date.now();
  await env.DB.batch(ids.map((u) => env.DB.prepare("INSERT INTO notifications (user_id, text, link, created_at) VALUES (?1, ?2, ?3, ?4)").bind(u, text, link, now)));
}

async function adminIds(env) {
  const ids = String(env.ADMIN_GITHUB_IDS || "").split(",").map((s) => s.trim()).filter((s) => /^\d+$/.test(s));
  if (!ids.length) return [];
  const { results } = await env.DB.prepare(`SELECT id FROM users WHERE github_id IN (${ids.join(",")})`).all();
  return results.map((r) => r.id);
}

const link = (p) => `/projet?id=${p.id}`;
const setStatus = (env, p, status) => env.DB.prepare("UPDATE cp_projects SET status = ?1, updated_at = ?2 WHERE id = ?3").bind(status, Date.now(), p.id).run();

async function findTeamMember(env, team, code) {
  const m = team.find((t) => t.code === code && t.active);
  if (!m) throw bad("code", "Ce membre ne fait pas partie de l'équipe");
  return m;
}

// Le porteur est de retour : les relances s'arrêtent et tout intérim (même actif) prend fin.
async function ownerSeen(env, p) {
  if (!p.reminder_stage && !p.interim_status) return p;
  const owner = await env.DB.prepare("SELECT last_seen_at FROM users WHERE id = ?1").bind(p.owner_id).first();
  const seen = owner?.last_seen_at || 0;
  const back = p.interim_status ? seen > (p.interim_at || 0) : Date.now() - seen < REMINDERS[0] * DAY;
  if (!back) return p;
  const hadInterim = p.interim_status;
  await env.DB.batch([
    env.DB.prepare("UPDATE cp_projects SET reminder_stage = 0, interim_status = NULL, interim_at = NULL, interim_until = NULL WHERE id = ?1").bind(p.id),
    env.DB.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(p.id),
  ]);
  if (hadInterim) {
    await journal(env, p.id, "Le porteur est de retour : l'intérim est annulé et il reprend son rôle.");
    const team = await teamOf(env, p.id);
    await notify(env, team.filter((m) => m.active).map((m) => m.user_id), `« ${p.name} » : le porteur est de retour, l'intérim est annulé.`, link(p));
  }
  return { ...p, reminder_stage: 0, interim_status: null, interim_at: null, interim_until: null };
}

export async function action(request, env, id) {
  const user = await requireUser(request, env);
  let p = await ownerSeen(env, await loadProject(env, id));
  const team = await teamOf(env, p.id);
  const c = ctxOf(p, team, user, env);
  const body = await readJson(request, 32 * 1024);
  const now = Date.now();
  const db = env.DB;
  const activeIds = () => team.filter((m) => m.active).map((m) => m.user_id);
  const who = `${user.pseudo} (${user.code})`;

  switch (body.action) {
    // ── Cycle de vie ──
    case "submit": {
      need(c.owner && p.status === "draft", "Seul le porteur peut envoyer un brouillon en validation");
      need(p.pitch && p.objective && parse(p.roles, []).length, "Complétez le pitch, l'objectif et au moins un rôle recherché");
      await db.prepare("UPDATE cp_projects SET status = 'review', admin_note = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
      await notify(env, await adminIds(env), `Nouveau projet « ${p.name} » à valider.`, link(p));
      break;
    }
    case "start": {
      need(c.lead && ["recruiting", "paused"].includes(p.status));
      need(p.co_id && p.co_accepted_at, "Un co-porteur ayant accepté son rôle est obligatoire pour démarrer");
      await setStatus(env, p, "active");
      await journal(env, p.id, p.status === "paused" ? "Le projet reprend." : "Le projet passe « En cours ».");
      break;
    }
    case "pause": {
      need(c.lead && p.status === "active");
      await setStatus(env, p, "paused");
      await journal(env, p.id, "Le projet est mis en pause.");
      break;
    }
    case "recruit": {
      need(c.lead && ["active", "paused"].includes(p.status));
      await setStatus(env, p, "recruiting");
      await journal(env, p.id, "Le projet recrute à nouveau.");
      break;
    }
    case "testing": {
      need(c.lead && p.status === "active");
      await setStatus(env, p, "testing");
      await journal(env, p.id, "Le projet passe en recette.");
      break;
    }
    case "back_to_work": {
      need(c.lead && p.status === "testing");
      await setStatus(env, p, "active");
      await journal(env, p.id, "Retour en réalisation.");
      break;
    }
    case "checklist": {
      need(c.lead && p.status === "testing");
      const list = Object.fromEntries(CHECKLIST.map((k) => [k, !!body.checklist?.[k]]));
      await db.prepare("UPDATE cp_projects SET checklist = ?1, updated_at = ?2 WHERE id = ?3").bind(JSON.stringify(list), now, p.id).run();
      break;
    }
    case "request_launch": {
      need(c.owner && p.status === "testing", "Seul le porteur peut demander la mise en ligne");
      const list = parse(p.checklist, {});
      need(CHECKLIST.every((k) => list[k]), "Cochez toute la checklist de mise en ligne");
      need(p.demo_url && p.repo_url, "Ajoutez le lien du dépôt et le lien de démo");
      await db.prepare("UPDATE cp_projects SET status = 'launch_review', admin_note = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
      await journal(env, p.id, "Mise en ligne demandée : vérification par l'admin.");
      await notify(env, await adminIds(env), `« ${p.name} » demande sa mise en ligne.`, link(p));
      break;
    }
    case "retro": {
      need(c.lead && p.status === "live");
      const next = ["maintenance", "v2", "archive"].includes(body.retro?.next) ? body.retro.next : "maintenance";
      const retro = {
        worked: cleanMultiline(body.retro?.worked, "worked", 1000),
        change: cleanMultiline(body.retro?.change, "change", 1000),
        learned: cleanMultiline(body.retro?.learned, "learned", 1000),
        next,
        maintainer: cleanText(body.retro?.maintainer, "maintainer", 60),
      };
      await db.prepare("UPDATE cp_projects SET retro = ?1, updated_at = ?2 WHERE id = ?3").bind(JSON.stringify(retro), now, p.id).run();
      break;
    }
    case "archive": {
      need(c.owner && p.status !== "review", "Seul le porteur peut archiver le projet");
      need(p.status !== "archived");
      await setStatus(env, p, "archived");
      await journal(env, p.id, "Projet archivé par le porteur.");
      break;
    }
    case "delete_draft": {
      need(c.owner && p.status === "draft", "Seul un brouillon peut être supprimé");
      await db.batch(["cp_members", "cp_applications", "cp_missions", "cp_events", "cp_meetings", "cp_decisions", "cp_journal", "cp_recovery", "cp_votes", "cp_weather"]
        .map((t) => db.prepare(`DELETE FROM ${t} WHERE project_id = ?1`).bind(p.id))
        .concat(db.prepare("DELETE FROM cp_projects WHERE id = ?1").bind(p.id)));
      return json({ ok: true, deleted: true });
    }

    // ── Équipe ──
    case "apply": {
      need(!c.member, "Vous faites déjà partie de l'équipe");
      need(["recruiting", "active"].includes(p.status), "Ce projet ne recrute pas");
      await hit(env, `cp-apply:user:${user.id}`, 20, 86400);
      const pending = await db.prepare("SELECT 1 FROM cp_applications WHERE project_id = ?1 AND user_id = ?2 AND status = 'pending'").bind(p.id, user.id).first();
      need(!pending, "Votre candidature est déjà en attente");
      const skill = cleanText(body.skill, "skill", 40);
      const message = cleanMultiline(body.message, "message", 600);
      if (!skill) throw bad("skill", "Choisissez un rôle");
      if (message.length < 20) throw bad("message", "Présentez-vous en quelques phrases (pourquoi vous, ce que vous savez faire, votre temps disponible)");
      await db.prepare("INSERT INTO cp_applications (project_id, user_id, skill, message, created_at) VALUES (?1, ?2, ?3, ?4, ?5)").bind(p.id, user.id, skill, message, now).run();
      await notify(env, [leadId(p)], `Nouvelle candidature de ${who} sur « ${p.name} ».`, `${link(p)}#equipe`);
      break;
    }
    case "answer": {
      need(c.lead);
      const app = await db.prepare("SELECT * FROM cp_applications WHERE id = ?1 AND project_id = ?2 AND status = 'pending'").bind(Number(body.id), p.id).first();
      if (!app) throw new HttpError(404, "not_found");
      const accept = body.accept === true;
      await db.prepare("UPDATE cp_applications SET status = ?1, answered_at = ?2 WHERE id = ?3").bind(accept ? "accepted" : "refused", now, app.id).run();
      const cand = await userCode(env, app.user_id);
      if (accept) {
        await db.prepare(
          `INSERT INTO cp_members (project_id, user_id, skill, joined_at) VALUES (?1, ?2, ?3, ?4)
           ON CONFLICT (project_id, user_id) DO UPDATE SET active = 1, skill = excluded.skill, left_at = NULL, joined_at = excluded.joined_at`
        ).bind(p.id, app.user_id, app.skill, now).run();
        await journal(env, p.id, `${cand.pseudo} (${cand.code}) rejoint l'équipe : ${app.skill}.`);
      }
      await notify(env, [app.user_id], accept ? `Bienvenue dans l'équipe de « ${p.name} » 🎉` : `Votre candidature sur « ${p.name} » n'a pas été retenue cette fois.`, link(p));
      break;
    }
    case "invite_co": {
      need(c.owner, "Seul le porteur choisit son co-porteur");
      const m = await findTeamMember(env, team, body.code);
      need(m.user_id !== p.owner_id, "Le porteur ne peut pas être son propre co-porteur");
      await db.prepare("UPDATE cp_projects SET co_id = ?1, co_accepted_at = NULL, updated_at = ?2 WHERE id = ?3").bind(m.user_id, now, p.id).run();
      await journal(env, p.id, `${m.pseudo} (${m.code}) est proposé comme co-porteur.`);
      await notify(env, [m.user_id], `On vous propose d'être co-porteur de « ${p.name} ». Lisez les règles et acceptez (ou non) votre rôle.`, `${link(p)}#equipe`);
      break;
    }
    case "accept_co": {
      need(user.id === p.co_id && !p.co_accepted_at, "Aucune proposition de co-porteur en attente");
      need(body.acceptRules === true, "Vous devez accepter les règles de continuité");
      await db.prepare("UPDATE cp_projects SET co_accepted_at = ?1, updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
      await journal(env, p.id, `${who} accepte le rôle de co-porteur et les règles de continuité.`);
      await notify(env, [p.owner_id], `${who} a accepté d'être co-porteur de « ${p.name} ».`, link(p));
      break;
    }
    case "decline_co": {
      need(user.id === p.co_id && !p.co_accepted_at);
      await db.prepare("UPDATE cp_projects SET co_id = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
      await journal(env, p.id, `${who} décline le rôle de co-porteur.`);
      await notify(env, [p.owner_id], `${who} a décliné le rôle de co-porteur de « ${p.name} ».`, link(p));
      break;
    }
    case "handover": {
      // Transmission VOLONTAIRE du rôle de porteur, uniquement par le porteur lui-même, au co-porteur.
      need(c.owner && p.co_id && p.co_accepted_at, "Seul le porteur peut transmettre son rôle, et seulement à un co-porteur");
      need(body.confirm === true);
      const co = team.find((m) => m.user_id === p.co_id);
      await db.prepare("UPDATE cp_projects SET owner_id = ?1, co_id = NULL, co_accepted_at = NULL, interim_status = NULL, updated_at = ?2 WHERE id = ?3").bind(p.co_id, now, p.id).run();
      await db.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(p.id).run();
      await journal(env, p.id, `${who} transmet volontairement le rôle de porteur à ${co.pseudo} (${co.code}). Le fondateur reste crédité.`);
      await notify(env, activeIds(), `« ${p.name} » : ${co.pseudo} devient porteur du projet.`, link(p));
      await issueCodes(env, p.id); // les anciens codes ne valent plus rien
      break;
    }
    case "remove_member": {
      need(c.lead);
      const m = await findTeamMember(env, team, body.code);
      need(m.user_id !== p.owner_id, "Le porteur ne peut jamais être retiré de l'équipe");
      need(m.user_id !== user.id);
      await leave(env, p, m);
      await journal(env, p.id, `${m.pseudo} (${m.code}) quitte l'équipe (retiré par le porteur). Ses contributions restent créditées.`);
      await notify(env, [m.user_id], `Vous ne faites plus partie de l'équipe de « ${p.name} ».`, link(p));
      break;
    }
    case "leave": {
      need(c.member, "Vous ne faites pas partie de l'équipe");
      need(!c.owner, "Le porteur ne peut pas quitter son projet : transmettez votre rôle au co-porteur, ou archivez le projet");
      await leave(env, p, team.find((m) => m.user_id === user.id));
      await journal(env, p.id, `${who} quitte l'équipe. Ses missions en cours sont libérées et ses contributions restent créditées.`);
      await notify(env, [leadId(p)], `${who} a quitté l'équipe de « ${p.name} ».`, `${link(p)}#equipe`);
      break;
    }
    case "charter": {
      need(c.lead);
      const ch = body.charter || {};
      const charter = {
        hours: cleanText(ch.hours, "hours", 80),
        channel: cleanText(ch.channel, "channel", 120),
        delay: cleanText(ch.delay, "delay", 40),
        code: cleanMultiline(ch.code, "code", 600),
        ai: cleanMultiline(ch.ai, "ai", 400),
        decisions: cleanMultiline(ch.decisions, "decisions", 300),
        leaving: cleanMultiline(ch.leaving, "leaving", 300),
      };
      await db.prepare("UPDATE cp_projects SET charter = ?1, charter_version = charter_version + 1, updated_at = ?2 WHERE id = ?3").bind(JSON.stringify(charter), now, p.id).run();
      await journal(env, p.id, "La charte d'équipe a été mise à jour : chaque membre est invité à la signer.");
      await notify(env, activeIds().filter((u) => u !== user.id), `« ${p.name} » : la charte d'équipe est à signer.`, `${link(p)}#equipe`);
      break;
    }
    case "sign_charter": {
      need(c.member && p.charter_version > 0, "Aucune charte à signer");
      await db.prepare("UPDATE cp_members SET charter_version = ?1 WHERE project_id = ?2 AND user_id = ?3").bind(p.charter_version, p.id, user.id).run();
      break;
    }
    case "weather": {
      need(c.member);
      need(MOODS.includes(body.mood), "Météo inconnue");
      await db.prepare(
        "INSERT INTO cp_weather (project_id, user_id, week, mood) VALUES (?1, ?2, ?3, ?4) ON CONFLICT (project_id, user_id, week) DO UPDATE SET mood = excluded.mood"
      ).bind(p.id, user.id, isoWeek(), body.mood).run();
      break;
    }

    // ── Continuité ──
    case "regen_codes": {
      need(c.owner, "Réservé au porteur");
      const codes = await issueCodes(env, p.id);
      await journal(env, p.id, "Le porteur a généré de nouveaux codes de récupération.");
      return json({ ok: true, recoveryCodes: codes });
    }
    case "unfreeze": {
      need(c.owner && p.frozen_at, "Réservé au porteur");
      await db.prepare("UPDATE cp_projects SET frozen_at = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
      await journal(env, p.id, "Le porteur est disponible à nouveau : le projet n'est plus gelé.");
      await notify(env, activeIds(), `« ${p.name} » : le porteur est de retour.`, link(p));
      break;
    }
    case "interim_request": {
      need(c.co, "Seul le co-porteur peut demander l'intérim");
      need(!p.frozen_at, "Le porteur a signalé son indisponibilité : le projet est gelé, aucun intérim n'est possible");
      need(!p.interim_status, "Une demande d'intérim est déjà en cours");
      need(WORKING.includes(p.status), "Pas d'intérim à cette étape");
      const seen = (await db.prepare("SELECT last_seen_at FROM users WHERE id = ?1").bind(p.owner_id).first())?.last_seen_at || p.created_at;
      const days = (now - Math.max(seen, p.created_at)) / DAY;
      need(p.reminder_stage >= 3 && days >= INTERIM_AFTER, `L'intérim n'est possible qu'après les 3 relances, à J+${INTERIM_AFTER} sans activité du porteur`);
      await db.batch([
        db.prepare("UPDATE cp_projects SET interim_status = 'voting', interim_at = ?1, interim_until = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id),
        db.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(p.id),
        db.prepare("INSERT INTO cp_votes (project_id, user_id, yes) VALUES (?1, ?2, 1)").bind(p.id, user.id),
      ]);
      await journal(env, p.id, `Le co-porteur ${who} demande l'intérim. Vote de l'équipe en cours.`);
      await notify(env, activeIds().filter((u) => u !== user.id), `« ${p.name} » : le co-porteur demande l'intérim. Votez dans l'onglet Équipe.`, `${link(p)}#equipe`);
      await maybeAdvanceVote(env, p, team);
      break;
    }
    case "interim_vote": {
      need(c.member && !c.owner && p.interim_status === "voting", "Aucun vote en cours");
      await db.prepare("INSERT INTO cp_votes (project_id, user_id, yes) VALUES (?1, ?2, ?3) ON CONFLICT (project_id, user_id) DO UPDATE SET yes = excluded.yes")
        .bind(p.id, user.id, body.yes === true ? 1 : 0).run();
      await maybeAdvanceVote(env, p, team);
      break;
    }
    case "interim_cancel": {
      need((c.owner || c.co) && p.interim_status, "Aucun intérim en cours");
      await db.batch([
        db.prepare("UPDATE cp_projects SET interim_status = NULL, interim_at = NULL, interim_until = NULL, reminder_stage = 0, updated_at = ?1 WHERE id = ?2").bind(now, p.id),
        db.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(p.id),
      ]);
      await journal(env, p.id, c.owner ? "Le porteur annule l'intérim et reprend son rôle." : "Le co-porteur retire sa demande d'intérim.");
      await notify(env, activeIds(), `« ${p.name} » : l'intérim est annulé.`, link(p));
      break;
    }
    default:
      throw bad("action", "Action inconnue");
  }
  return json({ ok: true });
}

// Majorité de l'équipe (hors porteur) → la demande passe à l'admin.
async function maybeAdvanceVote(env, p, team) {
  const votes = (await env.DB.prepare("SELECT yes FROM cp_votes WHERE project_id = ?1").bind(p.id).all()).results;
  const total = voters(team, p).length;
  if (votes.filter((v) => v.yes).length * 2 > total) {
    await env.DB.prepare("UPDATE cp_projects SET interim_status = 'admin', updated_at = ?1 WHERE id = ?2 AND interim_status = 'voting'").bind(Date.now(), p.id).run();
    await journal(env, p.id, "La majorité de l'équipe soutient l'intérim. En attente de la validation de l'admin.");
    await notify(env, await adminIds(env), `« ${p.name} » : demande d'intérim à valider.`, `${link(p)}#equipe`);
  }
}

async function leave(env, p, m) {
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("UPDATE cp_members SET active = 0, left_at = ?1 WHERE project_id = ?2 AND user_id = ?3").bind(now, p.id, m.user_id),
    env.DB.prepare("UPDATE cp_missions SET assignee_id = NULL, status = CASE WHEN status = 'done' THEN status ELSE 'todo' END, activity_at = ?1 WHERE project_id = ?2 AND assignee_id = ?3 AND status != 'done'").bind(now, p.id, m.user_id),
    env.DB.prepare("DELETE FROM cp_votes WHERE project_id = ?1 AND user_id = ?2").bind(p.id, m.user_id),
    ...(p.co_id === m.user_id ? [env.DB.prepare("UPDATE cp_projects SET co_id = NULL, co_accepted_at = NULL, interim_status = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id)] : []),
  ]);
}

// ───────── Missions, calendrier, réunions, décisions ─────────

const SIZES = ["S", "M", "L"];
const MSTATUS = ["todo", "doing", "review", "done"];

export async function mission(request, env, id) {
  const user = await requireUser(request, env);
  const p = await ownerSeen(env, await loadProject(env, id));
  const team = await teamOf(env, p.id);
  const c = ctxOf(p, team, user, env);
  need(c.member, "Réservé à l'équipe");
  need(WORKING.includes(p.status) || p.status === "live", "Le projet n'est pas ouvert aux missions");
  const body = await readJson(request, 32 * 1024);
  const db = env.DB;
  const now = Date.now();
  const byCode = new Map(team.filter((m) => m.active).map((m) => [m.code, m]));
  const byId = new Map(team.map((m) => [m.user_id, m]));

  if (body.op === "create") {
    const f = missionFields(body);
    let assignee = null;
    if (body.assignee) {
      const m = byCode.get(body.assignee);
      if (!m) throw bad("assignee", "Ce membre ne fait pas partie de l'équipe");
      need(c.lead || m.user_id === user.id, "Seul le porteur attribue une mission à quelqu'un d'autre");
      assignee = m.user_id;
    }
    const row = await db.prepare(
      `INSERT INTO cp_missions (project_id, title, description, done_when, size, due, assignee_id, created_by, issue_url, activity_at, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?10) RETURNING id`
    ).bind(p.id, f.title, f.description, f.done_when, f.size, f.due, assignee, user.id, f.issue_url, now).first();
    // Action de réunion transformée en mission.
    if (body.meeting_id != null && Number.isInteger(body.action_index)) {
      const mt = await db.prepare("SELECT * FROM cp_meetings WHERE id = ?1 AND project_id = ?2").bind(Number(body.meeting_id), p.id).first();
      if (mt) {
        const actions = parse(mt.actions, []);
        if (actions[body.action_index]) {
          actions[body.action_index].mission_id = row.id;
          await db.prepare("UPDATE cp_meetings SET actions = ?1 WHERE id = ?2").bind(JSON.stringify(actions), mt.id).run();
        }
      }
    }
    if (assignee && assignee !== user.id) await notify(env, [assignee], `« ${p.name} » : une mission vous est attribuée : ${f.title}.`, `${link(p)}#missions`);
    return json({ ok: true, id: row.id });
  }

  const m = await db.prepare("SELECT * FROM cp_missions WHERE id = ?1 AND project_id = ?2").bind(Number(body.id), p.id).first();
  if (!m) throw new HttpError(404, "not_found");
  const mine = m.assignee_id === user.id;

  if (body.op === "delete") {
    need(c.lead || (m.created_by === user.id && !m.assignee_id), "Seul le porteur peut supprimer cette mission");
    await db.prepare("DELETE FROM cp_missions WHERE id = ?1").bind(m.id).run();
    return json({ ok: true });
  }
  if (body.op === "take") {
    need(!m.assignee_id || !byId.get(m.assignee_id)?.active, "Cette mission a déjà un responsable");
    await db.prepare("UPDATE cp_missions SET assignee_id = ?1, status = CASE WHEN status = 'todo' THEN 'doing' ELSE status END, activity_at = ?2, nudged_at = NULL WHERE id = ?3").bind(user.id, now, m.id).run();
    return json({ ok: true });
  }
  if (body.op === "release") {
    need(mine || c.lead);
    need(mine || canReassign(m, now, byId), "Relance amicale à J+14 puis 7 jours sans réponse nécessaires avant de réattribuer");
    await db.prepare("UPDATE cp_missions SET assignee_id = NULL, status = CASE WHEN status = 'done' THEN status ELSE 'todo' END, activity_at = ?1, nudged_at = NULL WHERE id = ?2").bind(now, m.id).run();
    return json({ ok: true });
  }
  if (body.op === "assign") {
    need(c.lead, "Seul le porteur attribue les missions");
    const target = byCode.get(body.assignee);
    if (!target) throw bad("assignee", "Ce membre ne fait pas partie de l'équipe");
    need(canReassign(m, now, byId) || m.assignee_id === target.user_id, "Relance amicale à J+14 puis 7 jours sans réponse nécessaires avant de réattribuer");
    await db.prepare("UPDATE cp_missions SET assignee_id = ?1, activity_at = ?2, nudged_at = NULL WHERE id = ?3").bind(target.user_id, now, m.id).run();
    if (target.user_id !== user.id) await notify(env, [target.user_id], `« ${p.name} » : une mission vous est attribuée : ${m.title}.`, `${link(p)}#missions`);
    return json({ ok: true });
  }
  if (body.op === "update") {
    need(c.lead || mine || m.created_by === user.id, "Seul le responsable de la mission ou le porteur peut la modifier");
    const f = missionFields(body);
    const status = MSTATUS.includes(body.status) ? body.status : m.status;
    need(status !== "done" || c.lead || mine, "Seul le responsable ou le porteur peut terminer la mission");
    const pr = cleanGithubItem(body.pr_url, "pr_url");
    await db.prepare(
      `UPDATE cp_missions SET title = ?1, description = ?2, done_when = ?3, size = ?4, due = ?5, issue_url = ?6, pr_url = ?7, status = ?8,
         activity_at = ?9, nudged_at = CASE WHEN ?10 THEN NULL ELSE nudged_at END WHERE id = ?11`
    ).bind(f.title, f.description, f.done_when, f.size, f.due, f.issue_url, pr, status, mine ? now : m.activity_at, mine ? 1 : 0, m.id).run();
    return json({ ok: true });
  }
  throw bad("op", "Opération inconnue");
}

function missionFields(body) {
  const title = cleanText(body.title, "title", 100);
  if (!title) throw bad("title", "Le titre est obligatoire");
  return {
    title,
    description: cleanMultiline(body.description, "description", 1500),
    done_when: cleanMultiline(body.done_when, "done_when", 600),
    size: SIZES.includes(body.size) ? body.size : "M",
    due: cleanDay(body.due, "due", false),
    issue_url: cleanGithubItem(body.issue_url, "issue_url"),
  };
}

export async function event(request, env, id) {
  const user = await requireUser(request, env);
  const p = await ownerSeen(env, await loadProject(env, id));
  const c = ctxOf(p, await teamOf(env, p.id), user, env);
  need(c.lead, "Seul le porteur gère le calendrier");
  const body = await readJson(request);
  const db = env.DB;
  if (body.op === "create") {
    const kind = ["milestone", "cycle", "meeting"].includes(body.kind) ? body.kind : "milestone";
    const title = cleanText(body.title, "title", 100);
    if (!title) throw bad("title", "Le titre est obligatoire");
    const day = cleanDay(body.day, "day");
    const end = kind === "cycle" ? cleanDay(body.end_day, "end_day") : null;
    if (end && end < day) throw bad("end_day", "La fin doit être après le début");
    const time = kind === "meeting" && /^\d{2}:\d{2}$/.test(body.time || "") ? body.time : null;
    await db.prepare("INSERT INTO cp_events (project_id, kind, title, day, end_day, time) VALUES (?1, ?2, ?3, ?4, ?5, ?6)").bind(p.id, kind, title, day, end, time).run();
  } else if (body.op === "toggle") {
    await db.prepare("UPDATE cp_events SET done = 1 - done WHERE id = ?1 AND project_id = ?2").bind(Number(body.id), p.id).run();
  } else if (body.op === "delete") {
    await db.prepare("DELETE FROM cp_events WHERE id = ?1 AND project_id = ?2").bind(Number(body.id), p.id).run();
  } else throw bad("op", "Opération inconnue");
  return json({ ok: true });
}

export async function meeting(request, env, id) {
  const user = await requireUser(request, env);
  const p = await ownerSeen(env, await loadProject(env, id));
  const team = await teamOf(env, p.id);
  const c = ctxOf(p, team, user, env);
  need(c.member, "Réservé à l'équipe");
  const body = await readJson(request, 64 * 1024);
  const db = env.DB;
  const now = Date.now();
  const codes = new Set(team.map((m) => m.code));
  if (body.op === "delete") {
    const mt = await db.prepare("SELECT created_by FROM cp_meetings WHERE id = ?1 AND project_id = ?2").bind(Number(body.id), p.id).first();
    if (!mt) throw new HttpError(404, "not_found");
    need(c.lead || mt.created_by === user.id);
    await db.batch([
      db.prepare("DELETE FROM cp_meetings WHERE id = ?1").bind(Number(body.id)),
      db.prepare("UPDATE cp_decisions SET meeting_id = NULL WHERE meeting_id = ?1").bind(Number(body.id)),
    ]);
    return json({ ok: true });
  }
  const day = cleanDay(body.day, "day");
  const participants = (Array.isArray(body.participants) ? body.participants : []).slice(0, 30)
    .filter((x) => codes.has(x?.code)).map((x) => ({ code: x.code, weather: MOODS.includes(x.weather) ? x.weather : null }));
  const agenda = cleanMultiline(body.agenda, "agenda", 2000);
  const decisions = cleanMultiline(body.decisions, "decisions", 2000);
  const actions = (Array.isArray(body.actions) ? body.actions : []).slice(0, 30).map((a, i) => {
    const what = cleanText(a?.what, `actions.${i}`, 160);
    if (!what) return null;
    return { what, who: codes.has(a?.who) ? a.who : null, due: cleanDay(a?.due, `actions.${i}.due`, false), mission_id: Number(a?.mission_id) || null };
  }).filter(Boolean);
  let mid = Number(body.id) || null;
  if (mid) {
    const mt = await db.prepare("SELECT created_by FROM cp_meetings WHERE id = ?1 AND project_id = ?2").bind(mid, p.id).first();
    if (!mt) throw new HttpError(404, "not_found");
    need(c.lead || mt.created_by === user.id, "Seul l'auteur de la fiche ou le porteur peut la modifier");
    await db.prepare("UPDATE cp_meetings SET day = ?1, participants = ?2, agenda = ?3, decisions = ?4, actions = ?5 WHERE id = ?6")
      .bind(day, JSON.stringify(participants), agenda, decisions, JSON.stringify(actions), mid).run();
  } else {
    mid = (await db.prepare(
      "INSERT INTO cp_meetings (project_id, day, participants, agenda, decisions, actions, created_by, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8) RETURNING id"
    ).bind(p.id, day, JSON.stringify(participants), agenda, decisions, JSON.stringify(actions), user.id, now).first()).id;
  }
  // Report des décisions dans le journal des décisions (une ligne = une décision).
  if (body.logDecisions === true && decisions) {
    const lines = decisions.split("\n").map((l) => l.replace(/^[-•*\s]+/, "").trim()).filter(Boolean).slice(0, 20);
    const existing = new Set((await db.prepare("SELECT decision FROM cp_decisions WHERE meeting_id = ?1").bind(mid).all()).results.map((r) => r.decision));
    const fresh = lines.filter((l) => !existing.has(l.slice(0, 300)));
    if (fresh.length) {
      await db.batch(fresh.map((l) => db.prepare(
        "INSERT INTO cp_decisions (project_id, day, decision, reason, meeting_id, created_by, created_at) VALUES (?1, ?2, ?3, '', ?4, ?5, ?6)"
      ).bind(p.id, day, l.slice(0, 300), mid, user.id, now)));
    }
  }
  return json({ ok: true, id: mid });
}

export async function decision(request, env, id) {
  const user = await requireUser(request, env);
  const p = await ownerSeen(env, await loadProject(env, id));
  const c = ctxOf(p, await teamOf(env, p.id), user, env);
  need(c.member, "Réservé à l'équipe");
  const body = await readJson(request);
  if (body.op === "delete") {
    need(c.lead, "Seul le porteur peut retirer une décision");
    await env.DB.prepare("DELETE FROM cp_decisions WHERE id = ?1 AND project_id = ?2").bind(Number(body.id), p.id).run();
    return json({ ok: true });
  }
  const text = cleanText(body.decision, "decision", 300);
  if (!text) throw bad("decision", "Décrivez la décision");
  await env.DB.prepare("INSERT INTO cp_decisions (project_id, day, decision, reason, created_by, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
    .bind(p.id, cleanDay(body.day, "day"), text, cleanText(body.reason, "reason", 500), user.id, Date.now()).run();
  return json({ ok: true });
}

// ───────── Codes de récupération (sans connexion pour l'alerte) ─────────

async function useCode(env, pid, code) {
  const hash = await codeHash(pid, code);
  const res = await env.DB.prepare("UPDATE cp_recovery SET used_at = ?1 WHERE project_id = ?2 AND code_hash = ?3 AND used_at IS NULL")
    .bind(Date.now(), pid, hash).run();
  return res.meta.changes === 1;
}

// « Je suis indisponible » : page publique, sans connexion. Gèle le projet : aucun intérim ni transfert possible.
export async function freeze(request, env) {
  await ensureSchema(env.DB);
  const body = await readJson(request);
  const pid = Number(body.project);
  await hit(env, `cp-code:project:${pid}`, 10, 86400);
  const p = await env.DB.prepare("SELECT * FROM cp_projects WHERE id = ?1").bind(pid).first();
  const generic = new HttpError(400, "invalid", { field: "code", reason: "Projet ou code incorrect" });
  if (!p || !(await useCode(env, pid, body.code))) throw generic;
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("UPDATE cp_projects SET frozen_at = ?1, interim_status = NULL, interim_at = NULL, interim_until = NULL, updated_at = ?1 WHERE id = ?2").bind(now, pid),
    env.DB.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(pid),
  ]);
  await journal(env, pid, "Le porteur a signalé qu'il est indisponible (code de récupération). Le projet est gelé : aucun intérim ni transfert possible.");
  const team = await teamOf(env, pid);
  await notify(env, [...team.filter((m) => m.active).map((m) => m.user_id), ...(await adminIds(env))],
    `« ${p.name} » : le porteur est indisponible pour le moment. Le projet est gelé, il le reprendra à son retour.`, link(p));
  return json({ ok: true, name: p.name });
}

// Reprendre son rôle de porteur depuis un autre compte GitHub (compte d'origine perdu).
export async function recover(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const pid = Number(body.project);
  await hit(env, `cp-code:project:${pid}`, 10, 86400);
  await hit(env, `cp-recover:user:${user.id}`, 5, 3600);
  const p = await env.DB.prepare("SELECT * FROM cp_projects WHERE id = ?1").bind(pid).first();
  if (!p || !(await useCode(env, pid, body.code))) throw new HttpError(400, "invalid", { field: "code", reason: "Projet ou code incorrect" });
  if (p.owner_id === user.id) return json({ ok: true, id: pid });
  const now = Date.now();
  const old = await userCode(env, p.owner_id);
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE cp_projects SET owner_id = ?1, co_id = CASE WHEN co_id = ?1 THEN NULL ELSE co_id END,
         co_accepted_at = CASE WHEN co_id = ?1 THEN NULL ELSE co_accepted_at END,
         frozen_at = NULL, reminder_stage = 0, interim_status = NULL, interim_at = NULL, interim_until = NULL, updated_at = ?2 WHERE id = ?3`
    ).bind(user.id, now, pid),
    env.DB.prepare("UPDATE cp_members SET active = 0, left_at = ?1 WHERE project_id = ?2 AND user_id = ?3").bind(now, pid, p.owner_id),
    env.DB.prepare(
      `INSERT INTO cp_members (project_id, user_id, skill, joined_at) VALUES (?1, ?2, 'Porteur de projet', ?3)
       ON CONFLICT (project_id, user_id) DO UPDATE SET active = 1, skill = 'Porteur de projet', left_at = NULL`
    ).bind(pid, user.id, now),
    env.DB.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(pid),
  ]);
  await journal(env, pid, `Le porteur a repris son rôle depuis un nouveau compte : ${user.pseudo} (${user.code}), avec un code de récupération. Ancien compte : ${old?.code || "?"}.`);
  const team = await teamOf(env, pid);
  await notify(env, [...team.filter((m) => m.active).map((m) => m.user_id), p.owner_id, ...(await adminIds(env))],
    `« ${p.name} » : le porteur a repris son rôle depuis un nouveau compte (${user.code}).`, link(p));
  return json({ ok: true, id: pid });
}

// ───────── Notifications ─────────

export async function readNotifications(request, env) {
  const user = await requireUser(request, env, { onboarded: false });
  await env.DB.batch([
    env.DB.prepare("UPDATE notifications SET read_at = ?1 WHERE user_id = ?2 AND read_at IS NULL").bind(Date.now(), user.id),
    env.DB.prepare("DELETE FROM notifications WHERE user_id = ?1 AND created_at < ?2").bind(user.id, Date.now() - 90 * DAY),
  ]);
  return json({ ok: true });
}

export async function unreadCount(env, userId) {
  try {
    return (await env.DB.prepare("SELECT COUNT(*) AS n FROM notifications WHERE user_id = ?1 AND read_at IS NULL").bind(userId).first()).n;
  } catch {
    return 0;
  }
}

// ───────── Admin ─────────

export async function adminAction(request, env) {
  const user = await requireUser(request, env);
  need(isAdmin(user, env), "Réservé à l'admin");
  const body = await readJson(request);
  const p = await loadProject(env, body.project);
  const note = cleanText(body.note, "note", 500);
  const now = Date.now();
  const db = env.DB;
  const team = await teamOf(env, p.id);
  const everyone = team.filter((m) => m.active).map((m) => m.user_id);
  switch (body.action) {
    case "approve":
      need(p.status === "review");
      await db.prepare("UPDATE cp_projects SET status = 'recruiting', admin_note = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
      await journal(env, p.id, "Projet validé : il est publié et recrute.");
      await notify(env, [p.owner_id], `« ${p.name} » est validé et publié : il recrute 🎉`, link(p));
      break;
    case "reject":
      need(p.status === "review");
      await db.prepare("UPDATE cp_projects SET status = 'draft', admin_note = ?1, updated_at = ?2 WHERE id = ?3").bind(note || "À compléter", now, p.id).run();
      await notify(env, [p.owner_id], `« ${p.name} » doit être complété avant publication : ${note || "voir la fiche"}.`, link(p));
      break;
    case "launch_ok": {
      need(p.status === "launch_review");
      // Crédits figés : membres présents à la mise en ligne, avec au moins une mission terminée (le porteur est toujours crédité).
      await db.batch([
        db.prepare(
          `UPDATE cp_members SET credited = 1 WHERE project_id = ?1 AND active = 1 AND (user_id = ?2 OR user_id IN
             (SELECT assignee_id FROM cp_missions WHERE project_id = ?1 AND status = 'done' AND assignee_id IS NOT NULL))`
        ).bind(p.id, p.owner_id),
        db.prepare("UPDATE cp_members SET credited = 1 WHERE project_id = ?1 AND user_id = ?2").bind(p.id, p.founder_id),
        db.prepare("UPDATE cp_projects SET status = 'live', live_at = ?1, admin_note = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id),
      ]);
      await journal(env, p.id, "Mise en ligne vérifiée : le projet reçoit le label « Créé ici ». Crédits figés.");
      await notify(env, everyone, `« ${p.name} » est en ligne avec le label « Créé ici » 🎉 Pensez à la rétrospective.`, link(p));
      break;
    }
    case "launch_no":
      need(p.status === "launch_review");
      await db.prepare("UPDATE cp_projects SET status = 'testing', admin_note = ?1, updated_at = ?2 WHERE id = ?3").bind(note || "À revoir", now, p.id).run();
      await journal(env, p.id, "Mise en ligne refusée pour l'instant : retour en recette.");
      await notify(env, [leadId(p)], `« ${p.name} » : mise en ligne à revoir : ${note || "voir la fiche"}.`, link(p));
      break;
    case "interim_ok":
      need(p.interim_status === "admin");
      await db.prepare("UPDATE cp_projects SET interim_status = 'opposition', interim_until = ?1, updated_at = ?2 WHERE id = ?3").bind(now + OPPOSITION_DAYS * DAY, now, p.id).run();
      await journal(env, p.id, `L'admin valide l'intérim. Délai d'opposition de ${OPPOSITION_DAYS} jours : le porteur peut tout annuler.`);
      await notify(env, [...everyone, p.owner_id], `« ${p.name} » : intérim validé, il démarrera dans ${OPPOSITION_DAYS} jours sauf retour du porteur.`, link(p));
      break;
    case "interim_no":
      need(p.interim_status === "admin");
      await db.batch([
        db.prepare("UPDATE cp_projects SET interim_status = NULL, interim_at = NULL, updated_at = ?1 WHERE id = ?2").bind(now, p.id),
        db.prepare("DELETE FROM cp_votes WHERE project_id = ?1").bind(p.id),
      ]);
      await journal(env, p.id, `L'admin refuse l'intérim${note ? ` : ${note}` : ""}.`);
      await notify(env, everyone, `« ${p.name} » : l'intérim est refusé par l'admin.`, link(p));
      break;
    default:
      throw bad("action", "Action inconnue");
  }
  return json({ ok: true });
}

// ───────── Tâche planifiée (une fois par heure) ─────────

export async function scheduled(env) {
  if (!env.DB) return;
  await ensureSchema(env.DB);
  const db = env.DB;
  const now = Date.now();

  // 1. Relances du porteur inactif (J+14, J+21, J+28).
  const { results } = await db.prepare(
    `SELECT p.*, COALESCE(u.last_seen_at, p.created_at) AS seen FROM cp_projects p JOIN users u ON u.id = p.owner_id
     WHERE p.status IN (${WORKING.map((s) => `'${s}'`).join(",")}) AND p.frozen_at IS NULL`
  ).all();
  for (const p of results) {
    const days = (now - Math.max(p.seen, p.created_at)) / DAY;
    const target = REMINDERS.filter((d) => days >= d).length;
    if (target <= p.reminder_stage) continue;
    await db.prepare("UPDATE cp_projects SET reminder_stage = ?1 WHERE id = ?2").bind(target, p.id).run();
    const team = await teamOf(env, p.id);
    const others = team.filter((m) => m.active && m.user_id !== p.owner_id).map((m) => m.user_id);
    const co = p.co_accepted_at ? [p.co_id] : [];
    const d = REMINDERS[target - 1];
    await notify(env, [p.owner_id], `Relance ${target}/3 : votre équipe de « ${p.name} » vous attend (aucune activité depuis ${d} jours). Une simple visite suffit.`, link(p));
    if (target >= 2) await notify(env, co, `« ${p.name} » : relance ${target}/3 envoyée au porteur (inactif depuis ${d} jours).`, `${link(p)}#equipe`);
    if (target >= 3) await notify(env, others, `« ${p.name} » : le porteur est sans activité depuis ${d} jours. Si vous pouvez le joindre, faites-le. À J+${INTERIM_AFTER}, le co-porteur pourra demander l'intérim.`, `${link(p)}#equipe`);
    await journal(env, p.id, `Relance ${target}/3 envoyée au porteur (sans activité depuis ${d} jours).`);
  }

  // 2. Fin du délai d'opposition → intérim actif.
  const { results: due } = await db.prepare("SELECT * FROM cp_projects WHERE interim_status = 'opposition' AND interim_until <= ?1").bind(now).all();
  for (const p0 of due) {
    const p = await ownerSeen(env, p0);
    if (p.interim_status !== "opposition") continue;
    await db.prepare("UPDATE cp_projects SET interim_status = 'active', updated_at = ?1 WHERE id = ?2").bind(now, p.id).run();
    const co = await userCode(env, p.co_id);
    await journal(env, p.id, `Intérim actif : ${co?.pseudo} (${co?.code}) gère l'équipe et les missions. Il ne peut ni changer la licence, ni supprimer le projet, ni retirer le porteur. Le porteur reprend son rôle dès son retour.`);
    const team = await teamOf(env, p.id);
    await notify(env, [...team.filter((m) => m.active).map((m) => m.user_id), p.owner_id], `« ${p.name} » : l'intérim du co-porteur a commencé.`, link(p));
  }

  // 3. Missions sans activité depuis 14 jours → relance amicale à leur responsable.
  const { results: idle } = await db.prepare(
    `SELECT m.id, m.title, m.assignee_id, p.id AS pid, p.name FROM cp_missions m JOIN cp_projects p ON p.id = m.project_id
     WHERE m.status != 'done' AND m.assignee_id IS NOT NULL AND m.nudged_at IS NULL AND m.activity_at < ?1
       AND p.status IN (${WORKING.map((s) => `'${s}'`).join(",")})`
  ).bind(now - 14 * DAY).all();
  for (const m of idle) {
    await db.prepare("UPDATE cp_missions SET nudged_at = ?1 WHERE id = ?2").bind(now, m.id).run();
    await notify(env, [m.assignee_id], `Petite relance amicale 🙂 : la mission « ${m.title} » (« ${m.name} ») n'a pas bougé depuis 14 jours. Où en êtes-vous ? Sans réponse sous 7 jours, le porteur pourra la réattribuer.`, `/projet?id=${m.pid}#missions`);
  }
}

// ───────── Utilitaires ─────────

export function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d - Date.UTC(year, 0, 1)) / DAY + 1) / 7);
  return `${year}-S${String(week).padStart(2, "0")}`;
}

// Projets « Créé ici » à afficher en 5ᵉ projet bonus sur la fiche du showroom.
export async function bonusFor(env, userIds) {
  if (!userIds.length) return new Map();
  try {
    const { results } = await env.DB.prepare(
      `SELECT m.user_id, p.id, p.name, p.pitch, p.repo_url, p.demo_url, p.image_id, p.live_at FROM cp_members m JOIN cp_projects p ON p.id = m.project_id
       WHERE m.credited = 1 AND p.live_at IS NOT NULL ORDER BY p.live_at DESC`
    ).all();
    const want = new Set(userIds);
    const out = new Map();
    for (const r of results) {
      if (!want.has(r.user_id)) continue;
      if (!out.has(r.user_id)) out.set(r.user_id, { count: 0, project: null });
      const b = out.get(r.user_id);
      b.count++;
      b.project ||= { id: r.id, title: r.name, pitch: r.pitch, github_url: r.repo_url, demo_url: r.demo_url, thumbnail: projectThumbnail(r.repo_url, r.image_id, false), createdHere: true };
    }
    return out;
  } catch {
    return new Map();
  }
}
