import { readFileSync } from "node:fs";
import { CW, W, d, dots, frame, icon, mocha, panel, ui_ } from "../theme.mjs";

const H = 236;
const avatar = readFileSync(new URL("../../assets/avatar.jpg", import.meta.url)).toString("base64");
const SUB = "devops / sre engineer · systems, networks and web protection";

export const hero = () => {
  const size = 15;
  const cw = size * CW;
  const tx = 176;
  const ty = 118;
  const n = SUB.length;
  const start = 0.9;
  const dur = n * 0.035;
  const widths = Array.from({ length: n + 1 }, (_, i) => (i * cw).toFixed(1)).join(";");

  const meta = [
    ["server", "AS214745 · independent network"],
    ["map-pin", "tver, russia · utc+3"],
    ["code-xml", "rust · go · python · typescript"],
  ];
  let mx = 36;
  const metaSvg = meta
    .map(([ic, t], i) => {
      const out = `<g class="up" ${d(0.5 + i * 0.12)}>${icon(ic, mx, 192, 16, ui_.muted)}<text x="${mx + 24}" y="204" font-size="13" style="fill:${mocha.subtext}">${t}</text></g>`;
      mx += 24 + t.length * 13 * CW + 28;
      return out;
    })
    .join("");

  const defs = `<clipPath id="av"><rect x="36" y="36" width="120" height="120" rx="20"/></clipPath>
<clipPath id="ty"><rect x="${tx}" y="${ty - 18}" width="0" height="26"><animate attributeName="width" values="${widths}" calcMode="discrete" begin="${start}s" dur="${dur.toFixed(2)}s" fill="freeze"/></rect></clipPath>`;

  const body =
    panel(W, H) +
    dots({ x: W - 176, y: 30, cols: 10, rows: 8, gap: 16, from: "tr" }) +
    `<g class="up"><image href="data:image/jpeg;base64,${avatar}" x="36" y="36" width="120" height="120" preserveAspectRatio="xMidYMid slice" clip-path="url(#av)"/><rect x="36.5" y="36.5" width="119" height="119" rx="19.5" fill="none" stroke="${ui_.border}"/></g>` +
    `<g class="up" ${d(0.15)}><text x="${tx}" y="76" font-size="36" font-weight="700">xdearboy</text><text x="${tx + 8 * 36 * CW + 14}" y="76" font-size="20" style="fill:${ui_.muted}">// @xdearboy<tspan class="blink" style="fill:${mocha.mauve}">_</tspan></text></g>` +
    `<text x="${tx}" y="${ty}" font-size="${size}" clip-path="url(#ty)" style="fill:${mocha.subtext}">${SUB}</text>` +
    `<line x1="36" x2="${W - 36}" y1="172" y2="172" stroke="${ui_.border}"/>` +
    metaSvg;

  return frame({ height: H, label: "xdearboy — devops / sre engineer", defs, body });
};
