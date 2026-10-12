// Nombre d'étoiles GitHub des outils, gardé 12 h dans D1 (le cache HTTP de Cloudflare
// ne fonctionne pas sur workers.dev). Évite la limite de 60 requêtes/heure de GitHub.
// Variable optionnelle : GITHUB_TOKEN (lecture publique seulement) pour relever la limite.
import { REPOS } from "../../public/assets/tools.js";

const TTL_MS = 12 * 60 * 60 * 1000;

const json = (body) =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" },
  });

async function fetchStars(repo, env) {
  const headers = { "user-agent": "best-tools-vibecoding", accept: "application/vnd.github+json" };
  if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
}

export async function onRequestGet({ env }) {
  let cached = null;
  if (env.DB) {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL)").run();
    cached = await env.DB.prepare("SELECT value, updated_at FROM cache WHERE key = 'stars'").first();
    if (cached && Date.now() - cached.updated_at < TTL_MS) return json(JSON.parse(cached.value));
  }

  const entries = await Promise.all(REPOS.map(async (r) => [r, await fetchStars(r, env).catch(() => null)]));
  const stars = Object.fromEntries(entries.filter(([, n]) => n !== null));
  const body = { stars, fetchedAt: new Date().toISOString() };

  // On n'enregistre que si la majorité des dépôts a répondu (sinon limite GitHub atteinte).
  if (Object.keys(stars).length >= REPOS.length / 2) {
    if (env.DB) {
      await env.DB.prepare("INSERT OR REPLACE INTO cache (key, value, updated_at) VALUES ('stars', ?1, ?2)")
        .bind(JSON.stringify(body), Date.now())
        .run();
    }
    return json(body);
  }
  // Réponse partielle : on préfère l'ancienne valeur si elle existe.
  return json(cached ? JSON.parse(cached.value) : body);
}
