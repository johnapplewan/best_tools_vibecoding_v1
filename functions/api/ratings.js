// Avis visiteurs (1 à 5 étoiles), un seul vote par outil et par visiteur, sans email.
// Stockage : Cloudflare D1, lié au projet Pages sous le nom « DB ».
// Unicité : un visiteur est reconnu à la fois par un identifiant aléatoire stocké dans son
// navigateur et par l'empreinte hachée (SHA-256 + sel) de son adresse IP. Si l'un des deux a déjà
// voté pour cet outil, le vote est refusé. Aucune IP n'est stockée en clair.
import { TOOL_IDS } from "../../assets/tools.js";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS votes (
     tool TEXT NOT NULL,
     ip_hash TEXT NOT NULL,
     device TEXT NOT NULL,
     stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
     created_at INTEGER NOT NULL
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS votes_tool_ip ON votes (tool, ip_hash)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS votes_tool_device ON votes (tool, device)`,
];

let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  schemaReady = true;
}

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function ipOf(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "0.0.0.0";
}

const DEVICE_RE = /^[a-f0-9-]{16,64}$/i;

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "storage_unavailable" }, 503);
  await ensureSchema(env.DB);

  const { results } = await env.DB.prepare(
    "SELECT tool, COUNT(*) AS count, ROUND(AVG(stars), 2) AS avg FROM votes GROUP BY tool"
  ).all();
  const stats = {};
  for (const r of results) stats[r.tool] = { count: r.count, avg: r.avg };

  // Votes déjà émis par ce visiteur (appareil ou IP), pour griser les étoiles.
  const device = new URL(request.url).searchParams.get("device") || "";
  const ipHash = await sha256(ipOf(request) + (env.RATING_SALT || "vibe-tools"));
  const mine = {};
  const own = await env.DB.prepare("SELECT tool, stars FROM votes WHERE ip_hash = ?1 OR device = ?2")
    .bind(ipHash, DEVICE_RE.test(device) ? device : "-")
    .all();
  for (const r of own.results) mine[r.tool] = r.stars;

  return json({ stats, mine });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "storage_unavailable" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const { tool, stars, device } = body || {};
  if (!TOOL_IDS.has(tool)) return json({ error: "unknown_tool" }, 400);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return json({ error: "bad_stars" }, 400);
  if (typeof device !== "string" || !DEVICE_RE.test(device)) return json({ error: "bad_device" }, 400);

  await ensureSchema(env.DB);
  const ipHash = await sha256(ipOf(request) + (env.RATING_SALT || "vibe-tools"));

  try {
    await env.DB.prepare("INSERT INTO votes (tool, ip_hash, device, stars, created_at) VALUES (?1, ?2, ?3, ?4, ?5)")
      .bind(tool, ipHash, device, stars, Date.now())
      .run();
  } catch (e) {
    if (String(e?.message || e).includes("UNIQUE")) return json({ error: "already_voted" }, 409);
    throw e;
  }

  const agg = await env.DB.prepare("SELECT COUNT(*) AS count, ROUND(AVG(stars), 2) AS avg FROM votes WHERE tool = ?1")
    .bind(tool)
    .first();
  return json({ ok: true, tool, stars, stats: agg });
}
