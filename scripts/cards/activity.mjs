import { c, fmt, frame, mix, panel, delay } from "../theme.mjs";

const CELL = 12;
const GAP = 3;
const H = 272;
const X0 = 24;
const Y0 = 66;

const fills = [c.surface0, ...[0.3, 0.55, 0.8, 1].map((t) => mix(c.surface0, c.mauve, t))];

export const activity = (p) => {
  const cells = p.weeks
    .map((week, wi) =>
      week
        .map((d, di) => {
          const x = X0 + wi * (CELL + GAP);
          const y = Y0 + di * (CELL + GAP);
          return `<rect class="fade" ${delay(0.15 + wi * 0.015)} x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${fills[d.level]}"/>`;
        })
        .join(""),
    )
    .join("");

  const legend = fills
    .map((f, i) => `<rect x="${702 + i * 15}" y="${Y0 + 7 * (CELL + GAP) + 10}" width="${CELL}" height="${CELL}" rx="3" fill="${f}"/>`)
    .join("");

  const stat = (x, value, label, color) =>
    `<g class="rise" ${delay(0.9)}><text x="${x}" y="${H - 38}" font-size="24" font-weight="700" style="fill:${color}">${fmt(value)}</text><text x="${x}" y="${H - 18}" font-size="11" style="fill:${c.overlay}">${label}</text></g>`;

  const body =
    panel(H) +
    `<text x="${X0}" y="40" font-size="13" font-weight="700" style="fill:${c.overlay}"># activity</text>` +
    `<text x="816" y="40" font-size="12" text-anchor="end" style="fill:${c.overlay}">${fmt(p.contributions)} contributions in the last year</text>` +
    cells +
    `<text x="684" y="${Y0 + 7 * (CELL + GAP) + 20}" font-size="10" text-anchor="end" style="fill:${c.overlay}">less</text>` +
    `<text x="${702 + 5 * 15 + 4}" y="${Y0 + 7 * (CELL + GAP) + 20}" font-size="10" style="fill:${c.overlay}">more</text>` +
    legend +
    stat(X0, p.current, "current streak, days", c.green) +
    stat(X0 + 220, p.longest, "longest streak, days", c.peach) +
    stat(X0 + 440, p.activeDays, "active days", c.blue);

  return frame({ height: H, label: "GitHub contribution activity", body });
};
