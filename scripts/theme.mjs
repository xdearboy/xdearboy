import { readFileSync } from "node:fs";

export const c = {
  base: "#1e1e2e",
  mantle: "#181825",
  surface0: "#313244",
  surface1: "#45475a",
  overlay: "#6c7086",
  text: "#cdd6f4",
  mauve: "#cba6f7",
  blue: "#89b4fa",
  pink: "#f5c2e7",
  peach: "#fab387",
  green: "#a6e3a1",
  red: "#f38ba8",
  yellow: "#f9e2af",
};

export const chart = [c.mauve, c.blue, c.pink, c.peach, c.green, c.red, c.yellow];
const langColors = {
  TypeScript: c.mauve, JavaScript: c.yellow, Go: c.blue, Rust: c.peach, Python: c.green,
  Java: c.pink, C: c.overlay, "C++": c.red, Shell: c.green, Dockerfile: c.blue,
};
export const langColor = (name) =>
  langColors[name] ?? chart[[...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % chart.length];
export const W = 840;
export const CW = 0.6;

const font = (file, weight) =>
  `@font-face{font-family:JB;font-weight:${weight};src:url(data:font/woff2;base64,${readFileSync(
    new URL(`../fonts/${file}`, import.meta.url),
  ).toString("base64")}) format("woff2")}`;

const fontCss = font("jetbrains-mono-latin-400-normal.woff2", 400) + font("jetbrains-mono-latin-700-normal.woff2", 700);

const baseCss = `
text{font-family:JB,"JetBrains Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;fill:${c.text}}
.fade{opacity:0;animation:fade .7s ease-out forwards}
.rise{opacity:0;animation:rise .8s cubic-bezier(.2,.8,.2,1) forwards}
.grow{transform-box:fill-box;transform-origin:left center;transform:scaleX(0);animation:grow 1s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes fade{to{opacity:1}}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes grow{to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){.fade,.rise,.grow{animation-duration:.01s;animation-delay:0s!important}}
`;

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);

export const delay = (s) => `style="animation-delay:${s.toFixed(2)}s"`;

export const frame = ({ height, label, body, extraCss = "", defs = "" }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><style>${fontCss}${baseCss}${extraCss}</style><defs>${defs}</defs>${body}</svg>`;

export const panel = (height) =>
  `<rect x=".5" y=".5" width="${W - 1}" height="${height - 1}" rx="14" fill="${c.base}" stroke="${c.surface1}"/>`;

export const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r, g, bl] = p(a).map((v, i) => Math.round(v + (p(b)[i] - v) * t));
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

export const fmt = (n) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n >= 1000 ? n.toLocaleString("en-US") : String(n));
