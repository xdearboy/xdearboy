import { readFileSync } from "node:fs";
import { brand, ui } from "./icons.mjs";

export const mocha = {
  base: "#1e1e2e",
  text: "#cdd6f4",
  subtext: "#a6adc8",
  overlay: "#6c7086",
  mauve: "#cba6f7",
  pink: "#f5c2e7",
  blue: "#89b4fa",
  peach: "#fab387",
  green: "#a6e3a1",
  red: "#f38ba8",
  yellow: "#f9e2af",
};

export const W = 840;
export const CW = 0.6;

export const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const pb = p(b);
  return `#${p(a)
    .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0"))
    .join("")}`;
};

export const ui_ = {
  bg: mocha.base,
  panel: mix(mocha.base, mocha.text, 0.035),
  border: mix(mocha.base, mocha.text, 0.14),
  muted: mocha.overlay,
};

const fontFile = (weight) =>
  `@font-face{font-family:JB;font-weight:${weight};src:url(data:font/woff2;base64,${readFileSync(
    new URL(`../fonts/jetbrains-mono-latin-${weight}-normal.woff2`, import.meta.url),
  ).toString("base64")}) format("woff2")}`;

const css = `
text{font-family:JB,"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;fill:${mocha.text}}
.up{animation:up .7s cubic-bezier(.2,.8,.2,1) both}
.fade{animation:fade .8s ease both}
.grow{transform-box:fill-box;transform-origin:left center;animation:grow 1s cubic-bezier(.2,.8,.2,1) both}
.pulse{animation:pulse 4s ease-in-out infinite}
.blink{animation:blink 1.1s step-end infinite}
@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);

export const d = (s) => `style="animation-delay:${s.toFixed(2)}s"`;

export const frame = ({ width = W, height, label, body, defs = "", weights = [400, 700] }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style>${weights.map(fontFile).join("")}${css}</style><defs>${defs}</defs>${body}</svg>`;

export const panel = (width, height, r = 10) =>
  `<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="${r}" fill="${ui_.bg}" stroke="${ui_.border}"/>`;

export const icon = (name, x, y, size, color) => {
  const g = `transform="translate(${x} ${y}) scale(${size / 24})"`;
  if (brand[name]) return `<path ${g} d="${brand[name]}" fill="${color}"/>`;
  return `<g ${g} fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ui[name]}</g>`;
};

export const textWidth = (s, size) => s.length * size * CW;

export const fmt = (n) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n >= 1000 ? n.toLocaleString("en-US") : String(n));

export const wrap = (text, max, lines) => {
  const out = [];
  let cur = "";
  for (const w of (text ?? "").split(/\s+/).filter(Boolean)) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= max) cur += " " + w;
    else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  if (lines && out.length > lines) {
    out.length = lines;
    out[lines - 1] = out[lines - 1].slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
  }
  return out.map((l) => (l.length > max ? l.slice(0, max - 1) + "…" : l));
};

export const tag = ({ x, y, text, size = 13, h = 28, delay = 0, color = mocha.text, border = ui_.border }) => {
  const w = Math.round(textWidth(text, size) + 24);
  return {
    w,
    svg: `<g class="up" ${d(delay)}><rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="6" fill="${ui_.panel}" stroke="${border}"/><text x="${x + 12}" y="${y + h / 2 + size * 0.35}" font-size="${size}" style="fill:${color}">${esc(text)}</text></g>`,
  };
};

export const dots = ({ x, y, cols, rows, gap = 16, from = "br" }) => {
  let out = "";
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const dx = from.includes("r") ? cols - 1 - c : c;
      const dy = from.includes("b") ? rows - 1 - r : r;
      const dist = Math.hypot(dx, dy) / Math.hypot(cols, rows);
      const o = Math.max(0.06, 0.5 - dist * 0.7);
      const pulse = (c * 7 + r * 13) % 5 === 0;
      out += `<circle ${pulse ? `class="pulse" style="animation-delay:${((c + r) % 6) * 0.5}s"` : ""} cx="${x + c * gap}" cy="${y + r * gap}" r="1.5" fill="${mocha.mauve}" opacity="${o.toFixed(2)}"/>`;
    }
  return out;
};

export const sectionTitle = (text, x = 36, y = 52) =>
  `<text class="up" x="${x}" y="${y}" font-size="20" font-weight="700">${esc(text)}</text>`;

export const label = (text, x, y, anchor = "start") =>
  `<text x="${x}" y="${y}" font-size="12" letter-spacing="1.2" text-anchor="${anchor}" style="fill:${ui_.muted}">${esc(text.toUpperCase())}</text>`;
