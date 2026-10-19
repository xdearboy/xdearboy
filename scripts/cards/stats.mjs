import { c, delay, fmt, frame, langColor, panel } from "../theme.mjs";

const H = 252;

const tile = (x, y, value, label, color, i) =>
  `<g class="rise" ${delay(0.1 + i * 0.1)}><rect x="${x}" y="${y}" width="190" height="72" rx="10" fill="${c.mantle}" stroke="${c.surface0}"/><rect x="${x}" y="${y + 18}" width="3" height="36" rx="1.5" fill="${color}"/><text x="${x + 20}" y="${y + 38}" font-size="26" font-weight="700" style="fill:${color}">${fmt(value)}</text><text x="${x + 20}" y="${y + 58}" font-size="11" style="fill:${c.overlay}">${label}</text></g>`;

export const stats = (p) => {
  const tiles = [
    [p.commits, "commits / year", c.mauve],
    [p.pulls, "pull requests", c.blue],
    [p.stars, "stars earned", c.peach],
    [p.repos, "public repos", c.green],
  ];
  const grid = tiles.map(([v, l, col], i) => tile(28 + (i % 2) * 206, 62 + Math.floor(i / 2) * 88, v, l, col, i)).join("");

  const barX = 468;
  const barW = 344;
  let off = 0;
  let bar = "";
  let legend = "";
  p.languages.forEach((l, i) => {
    const w = Math.max(3, l.share * barW);
    bar += `<rect class="grow" ${delay(0.4 + i * 0.12)} x="${barX + off}" y="76" width="${Math.max(1, w - 3)}" height="12" rx="3" fill="${langColor(l.name)}"/>`;
    off += w;
    const ly = 122 + i * 17;
    legend += `<g class="fade" ${delay(0.6 + i * 0.1)}><circle cx="${barX + 5}" cy="${ly - 4}" r="4" fill="${langColor(l.name)}"/><text x="${barX + 20}" y="${ly}" font-size="12">${l.name}</text><text x="${barX + barW}" y="${ly}" font-size="12" text-anchor="end" style="fill:${c.overlay}">${(l.share * 100).toFixed(1)}%</text></g>`;
  });

  const title = (x, s) => `<text x="${x}" y="40" font-size="13" font-weight="700" style="fill:${c.overlay}"># ${s}</text>`;
  const body =
    panel(H) +
    title(28, "stats") +
    title(barX, "top languages") +
    grid +
    bar +
    legend +
    `<line x1="448" x2="448" y1="28" y2="${H - 28}" stroke="${c.surface0}"/>`;

  return frame({ height: H, label: "GitHub stats", body });
};
