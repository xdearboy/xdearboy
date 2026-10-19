import { CW, d, esc, frame, icon, mocha, panel, ui_, wrap } from "../theme.mjs";

const W = 412;
const H = 176;
const FS = 13;
const PER = Math.floor((W - 72) / (FS * CW));
const langColors = { TypeScript: mocha.mauve, JavaScript: mocha.yellow, Go: mocha.blue, Rust: mocha.peach, Python: mocha.green, Java: mocha.pink, C: mocha.subtext, "C++": mocha.red, Shell: mocha.green };

export const project = (repo) => {
  const name = repo.name.length > 20 ? repo.name.slice(0, 19) + "…" : repo.name;
  const lines = wrap(repo.description || "no description yet", PER, 3)
    .map((l, k) => `<text x="24" y="${76 + k * 20}" font-size="${FS}" style="fill:${mocha.subtext}">${esc(l)}</text>`)
    .join("");
  const lang = repo.primaryLanguage?.name;

  const body =
    panel(W, H) +
    `<text class="up" x="24" y="44" font-size="17" font-weight="700"><tspan font-weight="400" style="fill:${ui_.muted}">xdearboy/</tspan>${esc(name)}</text>` +
    `<g class="up" ${d(0.1)}>${lines}</g>` +
    `<line x1="24" x2="${W - 24}" y1="${H - 44}" y2="${H - 44}" stroke="${ui_.border}"/>` +
    `<g class="fade" ${d(0.3)}>${lang ? `<circle cx="29" cy="${H - 22}" r="4" fill="${langColors[lang] ?? mocha.mauve}"/><text x="40" y="${H - 18}" font-size="12" style="fill:${mocha.subtext}">${esc(lang.toLowerCase())}</text>` : ""}<text x="${W - 64}" y="${H - 18}" font-size="12" text-anchor="end" style="fill:${mocha.subtext}">★ ${repo.stargazerCount}</text>${icon("arrow-up-right", W - 48, H - 32, 18, mocha.mauve)}</g>`;
  return frame({ width: W, height: H, label: repo.name, body });
};
