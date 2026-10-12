// Nombre d'étoiles GitHub des outils, mis en cache 12 h sur le réseau Cloudflare
// (évite la limite de 60 requêtes/heure de l'API GitHub sans authentification).
// Variable optionnelle : GITHUB_TOKEN (lecture publique seulement) pour relever la limite.
import { REPOS } from "../../assets/tools.js";

const TTL = 12 * 60 * 60;

async function fetchStars(repo, env) {
  const headers = { "user-agent": "best-tools-vibecoding", accept: "application/vnd.github+json" };
  if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers,
    cf: { cacheTtl: TTL, cacheEverything: true },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
}

export async function onRequestGet({ request, env, waitUntil }) {
  const cache = caches.default;
  const key = new Request(new URL("/api/stars?v=1", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  const entries = await Promise.all(REPOS.map(async (r) => [r, await fetchStars(r, env).catch(() => null)]));
  const stars = Object.fromEntries(entries.filter(([, n]) => n !== null));

  const res = new Response(JSON.stringify({ stars, fetchedAt: new Date().toISOString() }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": `public, max-age=${TTL}` },
  });
  // On ne met en cache que si la majorité des dépôts a répondu (sinon limite GitHub atteinte).
  if (Object.keys(stars).length >= REPOS.length / 2) waitUntil(cache.put(key, res.clone()));
  return res;
}
