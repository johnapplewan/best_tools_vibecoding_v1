// Point d'entrée du Worker : l'API et la connexion sont traitées ici, tout le reste est servi
// depuis le dossier public/ (fichiers statiques).
import * as ratings from "./api/ratings.js";
import * as stars from "./api/stars.js";
import * as auth from "./api/auth.js";
import * as members from "./api/members.js";
import { HttpError, assertSameOrigin, json } from "./lib/http.js";

// [méthode, chemin (RegExp), gestionnaire, modifie des données ?]
const ROUTES = [
  ["GET", /^\/api\/ratings$/, (req, env, ctx) => ratings.onRequestGet({ request: req, env, waitUntil: (p) => ctx.waitUntil(p) })],
  ["POST", /^\/api\/ratings$/, (req, env, ctx) => ratings.onRequestPost({ request: req, env, waitUntil: (p) => ctx.waitUntil(p) }), true],
  ["GET", /^\/api\/stars$/, (req, env, ctx) => stars.onRequestGet({ request: req, env, waitUntil: (p) => ctx.waitUntil(p) })],

  ["GET", /^\/auth\/login$/, auth.login],
  ["GET", /^\/auth\/callback$/, auth.callback],
  ["POST", /^\/auth\/logout$/, auth.logout, true],
  ["GET", /^\/auth\/dev-login$/, auth.devLogin],

  ["GET", /^\/api\/me$/, members.getMe],
  ["POST", /^\/api\/me\/onboarding$/, members.onboarding, true],
  ["PUT", /^\/api\/me\/profile$/, members.updateProfile, true],
  ["PUT", /^\/api\/me\/projects$/, members.updateProjects, true],
  ["POST", /^\/api\/me\/delete$/, members.deleteMe, true],

  ["GET", /^\/api\/showroom$/, members.listShowroom],
  ["GET", /^\/api\/showroom\/(VD-[0-9A-Z]{5})$/, members.getMember],
  ["POST", /^\/api\/recommend$/, members.recommend, true],
  ["DELETE", /^\/api\/recommend$/, members.recommend, true],
  ["POST", /^\/api\/report$/, members.report, true],
  ["GET", /^\/c\/(VD-[0-9A-Z]{5})\/([a-z]+)$/, members.contactRedirect],

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
      const [, re, handler, mutates] = route;
      try {
        if (mutates) assertSameOrigin(request);
        if (!env.DB && url.pathname !== "/auth/login") throw new HttpError(503, "storage_unavailable");
        const params = url.pathname.match(re).slice(1);
        return await handler(request, env, ...params, ctx);
      } catch (e) {
        if (e instanceof HttpError) return json({ error: e.code, ...e.extra }, e.status);
        console.error(e);
        return json({ error: "server_error" }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
