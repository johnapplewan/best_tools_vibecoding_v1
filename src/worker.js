// Point d'entrée du Worker : l'API (/api/*) est traitée ici, tout le reste est servi
// depuis le dossier public/ (fichiers statiques).
import * as ratings from "./api/ratings.js";
import * as stars from "./api/stars.js";

const ROUTES = { "/api/ratings": ratings, "/api/stars": stars };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return Response.redirect(new URL("/outils", url), 302);
    }

    const route = ROUTES[url.pathname];
    if (route) {
      const handler = request.method === "GET" ? route.onRequestGet : request.method === "POST" ? route.onRequestPost : null;
      if (!handler) return new Response("Method Not Allowed", { status: 405 });
      try {
        return await handler({ request, env, waitUntil: (p) => ctx.waitUntil(p) });
      } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "server_error" }), { status: 500, headers: { "content-type": "application/json" } });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
