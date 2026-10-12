// Fonctions communes aux pages de la plateforme : navigation, session, thème, avatars, appels API.

export const $ = (s, root = document) => root.querySelector(s);

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

// ── Thème clair / sombre (partagé avec /outils) ──
export function initTheme() {
  const saved = store.get("vt-theme");
  if (saved) document.documentElement.dataset.theme = saved;
}
function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  store.set("vt-theme", root.dataset.theme);
}

// ── Appels API ──
export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.reason || data.error || `HTTP ${res.status}`);
    Object.assign(err, { status: res.status, field: data.field, code: data.error });
    throw err;
  }
  return data;
}

let mePromise;
export function loadMe() {
  mePromise ||= api("/api/me").catch(() => ({ user: null, options: {} }));
  return mePromise;
}

export function loginUrl(next = location.pathname) {
  return `/auth/login?next=${encodeURIComponent(next)}`;
}

// ── Avatar : généré à partir de l'identifiant (aucune photo par défaut) ──
function hash(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
export function avatarHTML(member, size = "") {
  const cls = `avatar ${size}`;
  if (member.avatar) return `<span class="${cls}"><img src="${esc(member.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer"></span>`;
  const h = hash(member.code || member.pseudo);
  const a = h % 360, b = (a + 60 + (h >> 9) % 80) % 360;
  const letter = esc((member.pseudo || "?")[0].toUpperCase());
  return `<span class="${cls}" style="background:linear-gradient(135deg,hsl(${a} 75% 58%),hsl(${b} 80% 55%))">${letter}</span>`;
}

// ── Navigation commune ──
const GH_ICON = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
export { GH_ICON };

export async function renderNav(active) {
  initTheme();
  const nav = document.createElement("nav");
  nav.className = "top";
  const links = [["/outils", "Outils"], ["/actualites", "Actualités"], ["/showroom", "Showroom"]];
  nav.innerHTML = `<div class="wrap">
    <a class="logo" href="/outils"><span class="logo-mark">✦</span><span class="label">Vibe Tools</span></a>
    <div class="nav-links">${links.map(([h, l]) => `<a href="${h}"${h === active ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</div>
    <div class="spacer"></div>
    <button class="icon-btn" type="button" data-theme-toggle aria-label="Changer de thème">◐</button>
    <span data-me-slot></span>
  </div>`;
  document.body.prepend(nav);
  nav.querySelector("[data-theme-toggle]").addEventListener("click", toggleTheme);
  const { user } = await loadMe();
  if (user?.isAdmin) {
    nav.querySelector(".nav-links").insertAdjacentHTML("beforeend", `<a href="/admin"${active === "/admin" ? ' aria-current="page"' : ""}>🛡️ Veille</a>`);
  }
  const slot = nav.querySelector("[data-me-slot]");
  if (user?.pseudo && !user.needsOnboarding) {
    slot.innerHTML = `<a class="me-chip" href="/moi">${avatarHTML({ code: user.code, pseudo: user.pseudo, avatar: user.avatarMode === "github" ? user.githubAvatar : null }, "avatar-sm")}<span class="label">${esc(user.pseudo)}</span></a>`;
  } else if (user) {
    slot.innerHTML = `<a class="btn btn-sm btn-primary" href="/moi">Terminer l'inscription</a>`;
  } else {
    slot.innerHTML = `<a class="btn btn-sm btn-dark" href="${loginUrl()}">${GH_ICON}<span class="label-long">Se connecter</span></a>`;
  }
}

export function renderFooter() {
  const f = document.createElement("footer");
  f.innerHTML = `<div class="wrap"><span>Vibe Tools · communauté de vibe-devs · pseudonymes uniquement</span>
    <span><a href="/cgu">Conditions d'utilisation</a> · <a href="/charte">Charte</a></span></div>`;
  document.body.append(f);
}

export function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite");
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2800);
}

export const NETWORKS = {
  telegram: { label: "Telegram", icon: "✈️" },
  signal: { label: "Signal", icon: "🔵" },
  whatsapp: { label: "WhatsApp", icon: "🟢" },
  x: { label: "X", icon: "𝕏" },
  instagram: { label: "Instagram", icon: "📸" },
  linkedin: { label: "LinkedIn", icon: "💼" },
  website: { label: "Site web", icon: "🌐" },
};
