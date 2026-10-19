import { W, d, fmt, frame, label, mix, mocha, panel, sectionTitle, ui_ } from "../theme.mjs";

const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;
const ramp = [0.12, 0.3, 0.5, 0.75, 1].map((t) => mix(ui_.panel, mocha.mauve, t));
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const stats = (p) => {
  const items = [
    [p.commits, "commits / year"],
    [p.pulls, "pull requests"],
    [p.stars, "stars earned"],
    [p.repos, "public repos"],
  ];
  const colW = (W - 72) / 4;
  const numbers = items
    .map(([v, l], i) => {
      const x = 36 + i * colW;
      return `${i ? `<line x1="${x - 16}" x2="${x - 16}" y1="82" y2="136" stroke="${ui_.border}"/>` : ""}<g class="up" ${d(0.1 + i * 0.08)}><text x="${x}" y="112" font-size="34" font-weight="700" style="fill:${mocha.mauve}">${fmt(v)}</text><text x="${x}" y="134" font-size="13" style="fill:${ui_.muted}">${l}</text></g>`;
    })
    .join("");

  const ly = 160;
  const rowH = 28;
  const barX = 160;
  const barW = W - 36 - 36 - barX - 70 + 36;
  const langs = p.languages
    .map((l, i) => {
      const y = ly + 54 + i * rowH;
      const w = Math.max(6, l.share * barW);
      return `<g class="up" ${d(0.3 + i * 0.08)}><text x="52" y="${y + 4}" font-size="13" font-weight="700">${l.name.toLowerCase()}</text><rect x="${barX}" y="${y - 6}" width="${barW}" height="10" rx="5" fill="${mix(ui_.bg, mocha.text, 0.08)}"/><rect class="grow" ${d(0.5 + i * 0.1)} x="${barX}" y="${y - 6}" width="${w.toFixed(1)}" height="10" rx="5" fill="url(#g)"/><text x="${W - 52}" y="${y + 4}" font-size="13" text-anchor="end" style="fill:${mocha.subtext}">${(l.share * 100).toFixed(1)}%</text></g>`;
    })
    .join("");
  const langH = 54 + (p.languages.length - 1) * rowH + 24;
  const langBox = `<rect x="36.5" y="${ly + 0.5}" width="${W - 73}" height="${langH}" rx="8" fill="${ui_.panel}" stroke="${ui_.border}"/>${label("top languages", 52, ly + 28)}${langs}`;

  const hy = ly + langH + 16;
  const innerW = W - 73;
  const hh = 7 * PITCH + 90;
  const gx = 52 + 34;
  const gy = hy + 52;
  let lastMonth = -1;
  let lastX = -99;
  const months = p.weeks
    .map((w, i) => {
      const m = new Date(w[0].date).getUTCMonth();
      if (m === lastMonth) return "";
      lastMonth = m;
      const x = gx + i * PITCH;
      if (x - lastX < 36) return "";
      lastX = x;
      return `<text x="${x}" y="${hy + 40}" font-size="11" style="fill:${ui_.muted}">${MONTHS[m]}</text>`;
    })
    .join("");
  const days = [["mon", 1], ["wed", 3], ["fri", 5]]
    .map(([t, r]) => `<text x="52" y="${gy + r * PITCH + 9}" font-size="11" style="fill:${ui_.muted}">${t}</text>`)
    .join("");
  const cells = p.weeks
    .map((w, i) => `<g class="fade" ${d(0.2 + i * 0.02)}>${w.map((c, r) => `<rect x="${gx + i * PITCH}" y="${gy + r * PITCH}" width="${CELL}" height="${CELL}" rx="2" fill="${ramp[c.level]}"/>`).join("")}</g>`)
    .join("");
  const fy = gy + 7 * PITCH + 18;
  const legend = ramp.slice(1).map((f, i) => `<rect x="${W - 52 - 34 - 4 * 14 + i * 14}" y="${fy - 9}" width="${CELL}" height="${CELL}" rx="2" fill="${f}"/>`).join("");
  const heat = `<rect x="36.5" y="${hy + 0.5}" width="${innerW}" height="${hh}" rx="8" fill="${ui_.panel}" stroke="${ui_.border}"/>${label("contributions", 52, hy + 24)}${months}${days}${cells}<text x="52" y="${fy}" font-size="12" style="fill:${ui_.muted}">${fmt(p.contributions)} github contributions in the last year</text><text x="${W - 52 - 34 - 4 * 14 - 8}" y="${fy}" font-size="12" text-anchor="end" style="fill:${ui_.muted}">less</text>${legend}<text x="${W - 52}" y="${fy}" font-size="12" text-anchor="end" style="fill:${ui_.muted}">more</text>`;

  const H = hy + hh + 36;
  const defs = `<linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${mix(mocha.mauve, mocha.base, 0.35)}"/><stop offset="1" stop-color="${mocha.mauve}"/></linearGradient>`;
  return frame({ height: H, label: "github activity", defs, body: panel(W, H) + sectionTitle("github activity") + numbers + langBox + heat });
};
