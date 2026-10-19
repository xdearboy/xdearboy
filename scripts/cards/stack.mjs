import { c, CW, delay, esc, frame, panel } from "../theme.mjs";

const groups = [
  ["lang", c.mauve, ["Rust", "Python", "TypeScript", "Bash", "Go"]],
  ["infra", c.blue, ["Linux", "Docker", "Kubernetes", "k3s", "HAProxy", "Nginx", "Helm"]],
  ["ops", c.peach, ["GitHub Actions", "Prometheus", "Grafana", "ClickHouse", "PostgreSQL"]],
  ["web", c.green, ["React", "Vite", "Tailwind", "Elysia"]],
];

const FS = 12;
const PAD = 24;
const ROW = 40;
const H = 64 + groups.length * ROW + 4;

export const stack = () => {
  let n = 0;
  const rows = groups
    .map(([label, color, items], gi) => {
      const y = 62 + gi * ROW;
      let x = PAD + 64;
      const chips = items
        .map((item) => {
          const w = item.length * FS * CW + 24;
          const out = `<g class="rise" ${delay(0.1 + n++ * 0.05)}><rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="28" rx="8" fill="${c.mantle}" stroke="${c.surface0}"/><circle cx="${x + 11}" cy="${y + 14}" r="3" fill="${color}"/><text x="${x + 20}" y="${y + 18.5}" font-size="${FS}">${esc(item)}</text></g>`;
          x += w + 8;
          return out;
        })
        .join("");
      return `<text x="${PAD}" y="${y + 18.5}" font-size="12" style="fill:${c.overlay}">${label}</text>${chips}`;
    })
    .join("");

  const body = panel(H) + `<text x="${PAD}" y="40" font-size="13" font-weight="700" style="fill:${c.overlay}"># stack</text>` + rows;
  return frame({ height: H, label: "Tech stack", body });
};
