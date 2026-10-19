import { W, d, dots, fmt, frame, mocha, panel, sectionTitle, ui_ } from "../theme.mjs";

const H = 176;

export const streak = (p) => {
  const cols = [
    [p.current, "current streak", "days in a row"],
    [p.longest, "longest streak", "days in a row"],
    [p.activeDays, "active days", "in the last year"],
  ];
  const colW = (W - 72) / 3;
  const body = cols
    .map(([v, l, s], i) => {
      const x = 36 + i * colW;
      return `${i ? `<line x1="${x - 18}" x2="${x - 18}" y1="82" y2="146" stroke="${ui_.border}"/>` : ""}<g class="up" ${d(0.1 + i * 0.1)}><text x="${x}" y="116" font-size="46" font-weight="700" style="fill:${mocha.mauve}">${fmt(v)}</text><text x="${x}" y="138" font-size="13" font-weight="700">${l}</text><text x="${x}" y="156" font-size="12" style="fill:${ui_.muted}">${s}</text></g>`;
    })
    .join("");
  return frame({ height: H, label: "streak", body: panel(W, H) + dots({ x: W - 150, y: 30, cols: 8, rows: 4, gap: 16, from: "tr" }) + sectionTitle("streak") + body });
};
