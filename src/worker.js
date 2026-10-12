// Point d'entrée du Worker : l'API et la connexion sont traitées ici, tout le reste est servi
// depuis le dossier public/ (fichiers statiques).
import * as ratings from "./api/ratings.js";
import * as stars from "./api/stars.js";
import * as auth from "./api/auth.js";
import * as members from "./api/members.js";
import * as veille from "./api/veille.js";
import { HttpError, assertSameOrigin, json } from "./lib/http.js";
import { hit, ipKey } from "./lib/ratelimit.js";

// [méthode, chemin (RegExp), gestionnaire, modifie des données ?, limite par IP [compteur, max, fenêtre en s]]
const ROUTES = [
  ["GET", /^\/api\/ratings$/, (req, env, ctx) => ratings.onRequestGet({ request: req, env, waitUntil: (p) => ctx.waitUntil(p) })],
  ["POST", /^\/api\/ratings$/, (req, env, ctx) => ratings.onRequestPost({ request: req, env, waitUntil: (p) => ctx.waitUntil(p) }), true, ["rate", 30, 3600]],
  ["GET", /^\/api\/stars$/, (req, env, ctx) => stars.onRequestGet({ request: req, env, waitUntil: (p) => ctx.waitUntil(p) })],

  ["GET", /^\/auth\/login$/, auth.login, false, ["auth", 30, 600]],
  ["GET", /^\/auth\/callback$/, auth.callback, false, ["auth", 30, 600]],
  ["POST", /^\/auth\/logout$/, auth.logout, true],
  ["GET", /^\/auth\/dev-login$/, auth.devLogin],

  ["GET", /^\/api\/me$/, members.getMe],
  ["POST", /^\/api\/me\/onboarding$/, members.onboarding, true, ["write", 120, 3600]],
  ["PUT", /^\/api\/me\/profile$/, members.updateProfile, true, ["write", 120, 3600]],
  ["PUT", /^\/api\/me\/projects$/, members.updateProjects, true, ["write", 120, 3600]],
  ["POST", /^\/api\/me\/delete$/, members.deleteMe, true],

  ["GET", /^\/api\/showroom$/, members.listShowroom, false, ["read", 300, 600]],
  ["GET", /^\/api\/showroom\/(VD-[0-9A-Z]{5})$/, members.getMember, false, ["read", 300, 600]],
  ["POST", /^\/api\/recommend$/, members.recommend, true, ["social", 40, 3600]],
  ["DELETE", /^\/api\/recommend$/, members.recommend, true, ["social", 40, 3600]],
  ["POST", /^\/api\/report$/, members.report, true, ["report", 10, 3600]],
  ["GET", /^\/c\/(VD-[0-9A-Z]{5})\/([a-z]+)$/, members.contactRedirect, false, ["contact", 100, 86400]],

  ["POST", /^\/api\/veille$/, veille.submit, true, ["veille", 60, 3600]],
  ["GET", /^\/api\/actualites$/, veille.news, false, ["read", 300, 600]],
  ["GET", /^\/api\/admin\/veille$/, veille.adminList],
  ["POST", /^\/api\/admin\/veille\/(\d+)\/run$/, veille.adminRun, true, ["veille-run", 30, 3600]],
  ["POST", /^\/api\/admin\/veille\/(\d+)$/, veille.adminUpdate, true],
  ["GET", /^\/api\/admin\/tokens$/, veille.adminTokens],
  ["POST", /^\/api\/admin\/tokens$/, veille.adminTokens, true],
  ["DELETE", /^\/api\/admin\/tokens$/, veille.adminTokens, true],

  ["GET", /^\/api\/admin\/reports$/, members.adminReports],
  ["POST", /^\/api\/admin\/moderate$/, members.adminModerate, true],
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return Response.redirect(new URL("/outils", url), 302);
    }

    const matching = ROUTES.filter(([, re]) => re.test(url.pathname));
    if (matching.length) {
      const route = matching.find(([method]) => method === request.method);
      if (!route) return new Response("Method Not Allowed", { status: 405 });
      const [, re, handler, mutates, limit] = route;
      try {
        if (mutates) assertSameOrigin(request);
        if (!env.DB && url.pathname !== "/auth/login") throw new HttpError(503, "storage_unavailable");
        if (limit) await hit(env, `${limit[0]}:ip:${await ipKey(request, env)}`, limit[1], limit[2]);
        const params = url.pathname.match(re).slice(1);
        return await handler(request, env, ...params, ctx);
      } catch (e) {
        if (e instanceof HttpError) {
          const headers = e.extra?.retryAfter ? { "retry-after": String(e.extra.retryAfter) } : {};
          // Pages ouvertes directement dans le navigateur : message lisible plutôt que du JSON.
          if (!url.pathname.startsWith("/api/") && e.status === 429) {
            return new Response("Trop de requêtes. Réessayez un peu plus tard.", { status: 429, headers: { "content-type": "text/plain; charset=utf-8", ...headers } });
          }
          return json({ error: e.code, ...e.extra }, e.status, headers);
        }
        console.error(e);
        return json({ error: "server_error" }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },

  // Tâche planifiée (voir « triggers » dans wrangler.jsonc) : traite la file de veille.
  async scheduled(controller, env, ctx) {
    await veille.scheduled(env);
  },
};
