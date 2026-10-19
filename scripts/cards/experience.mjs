import { W, d, esc, frame, mocha, panel, sectionTitle, ui_ } from "../theme.mjs";

const jobs = [
  { period: "aug 2026 — now", company: "neogate", role: "founder & ceo, developer", now: true },
  { period: "nov 2025 — jul 2026", company: "intezio.net", role: "developer & tech support" },
  { period: "sep 2025 — jul 2026", company: "mitelis.net", role: "beta tester" },
  { period: "jul 2025 — now", company: "*** holding", role: "devops engineer", now: true },
  { period: "2023 — 2025", company: "msc group", role: "developer" },
];

const ROW = 58;
const LINE_X = 232;
const H = 84 + jobs.length * ROW + 4;

export const experience = () => {
  const top = 84 + 12;
  const rows = jobs
    .map((j, i) => {
      const y = top + i * ROW;
      const dot = j.now
        ? `<circle cx="${LINE_X}" cy="${y}" r="9" fill="${mocha.mauve}" opacity=".2" class="pulse"/><circle cx="${LINE_X}" cy="${y}" r="4.5" fill="${mocha.mauve}"/>`
        : `<circle cx="${LINE_X}" cy="${y}" r="4" fill="${ui_.bg}" stroke="${ui_.muted}" stroke-width="1.5"/>`;
      return `<g class="up" ${d(0.1 + i * 0.1)}><text x="36" y="${y + 5}" font-size="13" style="fill:${ui_.muted}">${j.period}</text>${dot}<text x="${LINE_X + 28}" y="${y + 1}" font-size="16" font-weight="700">${esc(j.company)}</text><text x="${LINE_X + 28}" y="${y + 21}" font-size="13" style="fill:${mocha.subtext}">${esc(j.role)}</text></g>`;
    })
    .join("");
  const line = `<line x1="${LINE_X}" x2="${LINE_X}" y1="${top}" y2="${top + (jobs.length - 1) * ROW}" stroke="${ui_.border}"/>`;
  return frame({ height: H, label: "experience", body: panel(W, H) + sectionTitle("experience") + line + rows });
};
