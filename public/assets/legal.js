// Affiche une page légale (CGU ou charte) à partir de son fichier Markdown.
// Petit convertisseur intégré (titres, paragraphes, listes, tableaux, citations, gras, liens),
// suffisant pour nos textes : aucune dépendance externe.
import { renderNav, renderFooter, esc, $ } from "/assets/app.js";

function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => {
      const url = href.replace(/^cgu\.md/, "/cgu").replace(/^charte\.md/, "/charte").replace(/&amp;/g, "&");
      const safe = /^(https:\/\/|\/|#)/.test(url) ? url : "#";
      return `<a href="${esc(safe)}"${safe.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
    });
}

export function markdown(md) {
  const lines = md.replace(/\r/g, "").split("\n");
  const out = [];
  let i = 0;
  const isTable = (l) => /^\s*\|.*\|\s*$/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      const level = m[1].length;
      const id = m[2].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      out.push(`<h${level} id="${id}">${inline(m[2])}</h${level}>`); i++; continue;
    }
    if (/^---+$/.test(line.trim())) { out.push("<hr>"); i++; continue; }
    if (line.startsWith(">")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`); continue;
    }
    if (isTable(line)) {
      const rows = [];
      while (i < lines.length && isTable(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const body = rows.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("");
      out.push(`<table><thead><tr>${cells(rows[0]).map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && lines[i].trim() && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        const l = lines[i++];
        if (/^\s*([-*]|\d+\.)\s+/.test(l) && !/^\s{2,}/.test(l)) items.push(l.replace(/^\s*([-*]|\d+\.)\s+/, ""));
        else if (items.length) items[items.length - 1] += `<br>${l.trim().replace(/^[-*]\s+/, "• ")}`;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((it) => `<li>${it.includes("<br>") ? it.split("<br>").map(inline).join("<br>") : inline(it)}</li>`).join("")}</${tag}>`);
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|---|\s*\||\s*([-*]|\d+\.)\s)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
  }
  return out.join("\n");
}

const page = document.body.dataset.doc; // "cgu" ou "charte"
renderNav(`/${page}`);
renderFooter();
const md = await fetch(`/legal/${page}.md`).then((r) => r.text());
$("#doc").innerHTML = markdown(md);
if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
