import { c, CW, W, delay, esc, frame, panel } from "../theme.mjs";

const H = 300;
const LINE = 28;
const TOP = 86;
const SPEED = 0.045;

const lines = [
  { prompt: true, text: "whoami", size: 16 },
  { text: "xdearboy", size: 38, weight: 700, fill: c.mauve, gap: 14 },
  { prompt: true, text: "cat about.txt", size: 16 },
  { text: "DevOps / SRE engineer  ·  Tver, RU  ·  coding since 2018", size: 15, fill: c.text },
  { text: "terminals, small fast tools, infra that fixes itself", size: 15, fill: c.overlay },
  { prompt: true, text: "open d3vo.ru", size: 16, last: true },
];

export const hero = () => {
  let y = TOP;
  let t = 0.5;
  let body = "";
  const x0 = 36;

  for (const l of lines) {
    const size = l.size;
    const cw = size * CW;
    const px = l.prompt ? x0 + cw * 2 : x0;
    const n = l.text.length;
    const dur = n * SPEED;
    const id = `c${Math.round(y)}`;
    const widths = Array.from({ length: n + 1 }, (_, i) => (i * cw).toFixed(2)).join(";");
    const xs = Array.from({ length: n + 1 }, (_, i) => (px + i * cw).toFixed(2)).join(";");
    const baseline = y + (l.gap ?? 0);

    body += `<clipPath id="${id}"><rect x="${px}" y="${baseline - size - 4}" width="0" height="${size + 12}"><animate attributeName="width" values="${widths}" calcMode="discrete" begin="${t.toFixed(2)}s" dur="${dur.toFixed(2)}s" fill="freeze"/></rect></clipPath>`;
    if (l.prompt) body += `<text x="${x0}" y="${baseline}" font-size="${size}" font-weight="700" style="fill:${c.green}" opacity="0"><set attributeName="opacity" to="1" begin="${t.toFixed(2)}s"/>$</text>`;
    body += `<text x="${px}" y="${baseline}" font-size="${size}" font-weight="${l.weight ?? 400}" style="fill:${l.fill ?? c.text}" clip-path="url(#${id})">${esc(l.text)}</text>`;

    const curH = size + 4;
    body += `<rect y="${baseline - size + 1}" width="${Math.max(2, size * 0.5)}" height="${curH}" rx="1" fill="${c.mauve}" opacity="0"><animate attributeName="x" values="${xs}" calcMode="discrete" begin="${t.toFixed(2)}s" dur="${dur.toFixed(2)}s" fill="freeze"/><set attributeName="opacity" to="1" begin="${t.toFixed(2)}s"/>${
      l.last
        ? `<animate attributeName="opacity" values="1;0;1" dur="1.1s" begin="${(t + dur).toFixed(2)}s" repeatCount="indefinite" calcMode="discrete"/>`
        : `<set attributeName="opacity" to="0" begin="${(t + dur + 0.05).toFixed(2)}s"/>`
    }</rect>`;

    t += dur + 0.35;
    y += LINE + (l.gap ?? 0);
  }

  const dots = [c.red, c.yellow, c.green]
    .map((f, i) => `<circle cx="${28 + i * 20}" cy="26" r="6" fill="${f}" opacity=".85"/>`)
    .join("");

  const dotGrid = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 14 }, (_, col) => {
      const d = Math.hypot(col - 13, r - 8);
      return `<circle cx="${W - 250 + col * 17}" cy="${H - 170 + r * 17}" r="1.6" fill="${c.mauve}" opacity="${Math.max(0.05, 0.55 - d * 0.05).toFixed(2)}"/>`;
    }).join(""),
  ).join("");

  const defs = `<radialGradient id="glow" cx="85%" cy="90%" r="60%"><stop offset="0" stop-color="${c.mauve}" stop-opacity=".22"/><stop offset="1" stop-color="${c.mauve}" stop-opacity="0"/></radialGradient>
<clipPath id="card"><rect width="${W}" height="${H}" rx="14"/></clipPath>`;

  const inner = `<g clip-path="url(#card)"><rect width="${W}" height="${H}" fill="url(#glow)"/><rect width="${W}" height="44" fill="${c.mantle}"/><line x1="0" x2="${W}" y1="44" y2="44" stroke="${c.surface1}"/>${dots}<text x="${W / 2}" y="30" font-size="12" text-anchor="middle" style="fill:${c.overlay}">xdearboy@d3vo ~ zsh</text><g class="fade" ${delay(1.2)}>${dotGrid}</g></g>`;

  return frame({
    height: H,
    label: "xdearboy — DevOps / SRE engineer",
    defs,
    body: panel(H) + inner + body,
  });
};
