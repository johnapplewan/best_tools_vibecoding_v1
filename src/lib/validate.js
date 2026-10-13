// Validation des données saisies par les membres.
// Règle d'or : aucune donnée personnelle (numéro, email, nom) ne doit pouvoir être publiée.
import { HttpError } from "./http.js";
import { TOOL_IDS } from "../../public/assets/tools.js";

export const TERMS_VERSION = "2026-10-12";

export const SPECIALTIES = [
  "Front-end", "Back-end", "Full-stack", "IA / agents", "Mobile", "Design UI/UX", "Automatisation",
  "No-code / low-code", "Data", "DevOps / cloud", "Sécurité", "Jeux", "Produit", "Contenu / vidéo",
];

const RESERVED = new Set(["admin", "administrateur", "moderateur", "moderation", "support", "vibetools", "vibe-tools", "root", "system", "anonyme"]);

const bad = (field, reason) => new HttpError(400, "invalid", { field, reason });

// Détecte un numéro de téléphone (9 chiffres ou plus, séparateurs ignorés) ou une adresse email.
// 9 chiffres minimum pour laisser passer les dates (2026-10-12 = 8 chiffres).
export function containsPersonalData(text) {
  if (!text) return false;
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(text)) return true;
  return /\d(?:[\s.\-()]*\d){8,}/.test(text);
}

export function cleanText(value, field, max) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (text.length > max) throw bad(field, `${max} caractères maximum`);
  if (containsPersonalData(text)) throw bad(field, "Pas de numéro de téléphone ni d'email");
  return text;
}

export function cleanPseudo(value) {
  const pseudo = String(value ?? "").trim();
  if (!/^[A-Za-z0-9_-]{3,24}$/.test(pseudo)) throw bad("pseudo", "3 à 24 caractères : lettres, chiffres, _ ou -");
  if (RESERVED.has(pseudo.toLowerCase())) throw bad("pseudo", "Ce pseudo est réservé");
  if (/\d{6,}/.test(pseudo)) throw bad("pseudo", "Pas de longue suite de chiffres");
  return pseudo;
}

export function cleanSpecialties(value) {
  const list = Array.isArray(value) ? [...new Set(value)] : [];
  if (list.length > 5) throw bad("specialties", "5 spécialités maximum");
  for (const s of list) if (!SPECIALTIES.includes(s)) throw bad("specialties", "Spécialité inconnue");
  return list;
}

// ── Liens de contact : uniquement par pseudo ou lien d'invitation, jamais par numéro ──
const CONTACT_RULES = {
  telegram: {
    normalize: (v) => (/^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v) ? `https://t.me/${v.replace(/^@/, "")}` : v),
    test: (u) => /^https:\/\/t\.me\/(?:[A-Za-z][A-Za-z0-9_]{4,31}|\+[A-Za-z0-9_-]*[A-Za-z_-][A-Za-z0-9_-]*|joinchat\/[A-Za-z0-9_-]+)\/?$/.test(u),
    hint: "@pseudo, t.me/pseudo ou lien d'invitation de groupe",
  },
  signal: {
    test: (u) => /^https:\/\/(?:signal\.me\/#eu\/[A-Za-z0-9_\-+/=]+|signal\.group\/#[A-Za-z0-9_\-+/=]+)$/.test(u),
    hint: "lien de nom d'utilisateur signal.me/#eu/… ou lien de groupe signal.group",
  },
  whatsapp: {
    test: (u) => /^https:\/\/(?:wa\.me\/qr\/[A-Z0-9]{6,}|chat\.whatsapp\.com\/[A-Za-z0-9]{10,}|(?:www\.)?whatsapp\.com\/channel\/[A-Za-z0-9]{10,})\/?$/.test(u),
    hint: "lien QR wa.me/qr/…, ou lien de groupe ou de chaîne (jamais wa.me/numéro)",
  },
  x: {
    normalize: (v) => (/^@?[A-Za-z0-9_]{1,15}$/.test(v) ? `https://x.com/${v.replace(/^@/, "")}` : v.replace("://twitter.com/", "://x.com/")),
    test: (u) => /^https:\/\/(?:www\.)?x\.com\/[A-Za-z0-9_]{1,15}\/?$/.test(u),
    hint: "@pseudo ou x.com/pseudo",
  },
  instagram: {
    normalize: (v) => (/^@?[A-Za-z0-9_.]{1,30}$/.test(v) ? `https://instagram.com/${v.replace(/^@/, "")}` : v),
    test: (u) => /^https:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}\/?$/.test(u),
    hint: "@pseudo ou instagram.com/pseudo",
  },
  linkedin: {
    test: (u) => /^https:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/(?:in|company)\/[A-Za-z0-9_%-]{2,100}\/?$/.test(u),
    hint: "linkedin.com/in/… (attention : l'adresse contient souvent votre vrai nom)",
  },
  website: {
    test: (u) => {
      try {
        const url = new URL(u);
        return url.protocol === "https:" && u.length <= 200;
      } catch {
        return false;
      }
    },
    hint: "adresse en https://",
  },
};
export const CONTACT_NETWORKS = Object.keys(CONTACT_RULES);

export function cleanContacts(value) {
  const out = {};
  const input = value && typeof value === "object" ? value : {};
  for (const [net, rule] of Object.entries(CONTACT_RULES)) {
    let v = String(input[net] ?? "").trim();
    if (!v) continue;
    if (!/^https?:\/\//.test(v) && !rule.normalize) v = `https://${v}`;
    if (rule.normalize) v = rule.normalize(v);
    if (!/^https?:\/\//.test(v)) v = `https://${v}`;
    v = v.replace(/^http:\/\//, "https://");
    if (/wa\.me\/\+?\d/.test(v) || /signal\.me\/#p\//.test(v)) throw bad(`contacts.${net}`, "Les liens contenant un numéro de téléphone sont interdits");
    if (!rule.test(v)) throw bad(`contacts.${net}`, `Format attendu : ${rule.hint}`);
    if (net !== "whatsapp" && net !== "signal" && containsPersonalData(v)) throw bad(`contacts.${net}`, "Pas de numéro de téléphone ni d'email");
    out[net] = v;
  }
  return out;
}

export function cleanProjects(value) {
  const list = Array.isArray(value) ? value : [];
  if (list.length > 4) throw bad("projects", "4 projets maximum");
  return list.map((p, i) => {
    const field = `projects.${i}`;
    const title = cleanText(p?.title, `${field}.title`, 60);
    if (!title) throw bad(`${field}.title`, "Le nom du projet est obligatoire");
    const pitch = cleanText(p?.pitch, `${field}.pitch`, 280);
    let github_url = String(p?.github_url ?? "").trim().replace(/\/+$/, "");
    if (github_url) {
      if (!/^https?:\/\//.test(github_url)) github_url = `https://${github_url}`;
      github_url = github_url.replace(/^http:\/\//, "https://").replace("://www.github.com", "://github.com");
      if (!/^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/.test(github_url)) throw bad(`${field}.github_url`, "Format attendu : github.com/compte/depot");
    }
    let demo_url = String(p?.demo_url ?? "").trim();
    if (demo_url) {
      if (!/^https?:\/\//.test(demo_url)) demo_url = `https://${demo_url}`;
      demo_url = demo_url.replace(/^http:\/\//, "https://");
      if (!CONTACT_RULES.website.test(demo_url)) throw bad(`${field}.demo_url`, "Adresse https:// invalide");
    }
    const tools = Array.isArray(p?.tools) ? [...new Set(p.tools)].filter((t) => TOOL_IDS.has(t)).slice(0, 8) : [];
    const image_id = typeof p?.image_id === "string" && /^img_[a-f0-9]{32}$/.test(p.image_id) ? p.image_id : null;
    const repo_private = p?.repo_private === true;
    return { title, pitch, github_url: github_url || null, demo_url: demo_url || null, tools, image_id, repo_private, position: i };
  });
}

// Vignette : image envoyée par le membre, sinon aperçu GitHub (dépôt public uniquement), sinon rien.
export function projectThumbnail(githubUrl, imageId = null, repoPrivate = false) {
  if (imageId) return `/img/${imageId}`;
  if (!githubUrl || repoPrivate) return null;
  const path = githubUrl.replace("https://github.com/", "");
  return `https://opengraph.githubassets.com/1/${path}`;
}

// Image de projet : JPEG, PNG ou WebP uniquement (vérifié sur le contenu, pas sur l'extension), 400 Ko max.
export const IMAGE_MAX_BYTES = 400 * 1024;
export function sniffImage(bytes) {
  const b = bytes;
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 12 && String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

// Texte sur plusieurs lignes (descriptions, comptes rendus) : garde les retours à la ligne.
export function cleanMultiline(value, field, max) {
  const text = String(value ?? "").replace(/\r\n?/g, "\n").split("\n").map((l) => l.replace(/[ \t]+/g, " ").trimEnd()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (text.length > max) throw bad(field, `${max} caractères maximum`);
  if (containsPersonalData(text)) throw bad(field, "Pas de numéro de téléphone ni d'email");
  return text;
}

export function cleanDay(value, field, required = true) {
  const v = String(value ?? "").trim();
  if (!v && !required) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(`${v}T00:00:00Z`))) throw bad(field, "Date attendue : AAAA-MM-JJ");
  return v;
}

export function cleanGithubRepo(value, field) {
  let url = String(value ?? "").trim().replace(/\/+$/, "").replace(/\.git$/, "");
  if (!url) return null;
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  url = url.replace(/^http:\/\//, "https://").replace("://www.github.com", "://github.com");
  if (!/^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/.test(url)) throw bad(field, "Format attendu : github.com/compte/depot");
  return url;
}

// Lien vers une issue ou une PR GitHub.
export function cleanGithubItem(value, field) {
  let url = String(value ?? "").trim().replace(/\/+$/, "");
  if (!url) return null;
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  url = url.replace(/^http:\/\//, "https://").replace("://www.github.com", "://github.com");
  if (!/^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}\/(?:pull|issues)\/\d{1,7}$/.test(url)) throw bad(field, "Format attendu : github.com/compte/depot/pull/12 ou /issues/12");
  return url;
}

export function cleanHttps(value, field) {
  let url = String(value ?? "").trim();
  if (!url) return null;
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  url = url.replace(/^http:\/\//, "https://");
  if (!CONTACT_RULES.website.test(url)) throw bad(field, "Adresse https:// invalide");
  if (containsPersonalData(url)) throw bad(field, "Pas de numéro de téléphone ni d'email");
  return url;
}

// Canal de discussion d'une équipe : lien d'invitation de groupe uniquement (jamais un numéro).
export function cleanChannel(value, field) {
  let url = String(value ?? "").trim();
  if (!url) return null;
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  url = url.replace(/^http:\/\//, "https://");
  const ok = /^https:\/\/(?:t\.me\/(?:\+[A-Za-z0-9_-]+|joinchat\/[A-Za-z0-9_-]+|[A-Za-z][A-Za-z0-9_]{4,31})|signal\.group\/#[A-Za-z0-9_\-+/=]+|chat\.whatsapp\.com\/[A-Za-z0-9]{10,}|discord\.gg\/[A-Za-z0-9-]{2,32}|(?:www\.)?discord\.com\/invite\/[A-Za-z0-9-]{2,32})\/?$/.test(url);
  if (!ok) throw bad(field, "Lien de groupe Telegram, Signal, WhatsApp ou Discord attendu");
  return url;
}
