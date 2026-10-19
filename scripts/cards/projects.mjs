import { c, CW, delay, esc, frame, langColor, panel } from "../theme.mjs";

const COLS = 3;
const GAP = 14;
const PAD = 24;
const CARD_W = (840 - PAD * 2 - GAP * (COLS - 1)) / COLS;
const CARD_H = 112;
const FS = 11.5;
const PER_LINE = Math.floor((CARD_W - 32) / (FS * CW));

const wrap = (text, max, lines) => {
  const out = [];
  let cur = "";
  for (const word of (text ?? "").split(/\s+/).filter(Boolean)) {
    if (!cur) cur = word;
    else if ((cur + " " + word).length <= max) cur += " " + word;
    else {
      out.push(cur);
      cur = word;
    }
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    out.length = lines;
    out[lines - 1] = out[lines - 1].slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
  }
  return out.map((l) => (l.length > max ? l.slice(0, max - 1) + "…" : l));
};

export const projects = (p) => {
  const list = p.projects.slice(0, 6);
  const rows = Math.ceil(list.length / COLS);
  const H = 64 + rows * (CARD_H + GAP) - GAP + PAD;

  const cards = list
    .map((r, i) => {
      const x = PAD + (i % COLS) * (CARD_W + GAP);
      const y = 56 + Math.floor(i / COLS) * (CARD_H + GAP);
      const desc = wrap(r.description || "no description", PER_LINE, 2)
        .map((l, k) => `<text x="${x + 16}" y="${y + 56 + k * 16}" font-size="${FS}" style="fill:${c.text}" opacity=".75">${esc(l)}</text>`)
        .join("");
      const lang = r.primaryLanguage?.name;
      const footer = `${lang ? `<circle cx="${x + 20}" cy="${y + CARD_H - 16}" r="4" fill="${langColor(lang)}"/><text x="${x + 30}" y="${y + CARD_H - 12}" font-size="11" style="fill:${c.overlay}">${esc(lang)}</text>` : ""}<text x="${x + CARD_W - 16}" y="${y + CARD_H - 12}" font-size="11" text-anchor="end" style="fill:${c.overlay}">★ ${r.stargazerCount}</text>`;
      return `<a href="${esc(r.url)}" target="_blank"><g class="rise" ${delay(0.1 + i * 0.1)}><rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="10" fill="${c.mantle}" stroke="${c.surface0}"/><text x="${x + 16}" y="${y + 30}" font-size="14" font-weight="700" style="fill:${c.mauve}">${esc(r.name.length > PER_LINE - 2 ? r.name.slice(0, PER_LINE - 3) + "…" : r.name)}</text>${desc}${footer}</g></a>`;
    })
    .join("");

  const body =
    panel(H) + `<text x="${PAD}" y="40" font-size="13" font-weight="700" style="fill:${c.overlay}"># projects</text>` + cards;
  return frame({ height: H, label: "Projects", body });
};
