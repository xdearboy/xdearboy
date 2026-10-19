import { W, esc, frame, mocha, panel, sectionTitle, tag, ui_ } from "../theme.mjs";

const groups = [
  ["code", ["rust", "go", "python", "typescript", "bash"]],
  ["platform & network", ["linux", "docker", "kubernetes", "k3s", "helm", "haproxy", "nginx"]],
  ["data & observability", ["prometheus", "grafana", "clickhouse", "postgresql"]],
  ["delivery", ["github actions", "react", "vite", "tailwind"]],
];

const KEY_W = 150;
const ROW = 40;

export const stack = () => {
  let n = 0;
  let y = 84;
  const rows = groups
    .map(([key, items]) => {
      let x = 36 + KEY_W;
      let cy = y;
      const tags = items
        .map((text) => {
          let t = tag({ x, y: cy, text, delay: 0.1 + n * 0.04 });
          if (x + t.w > W - 36) {
            x = 36 + KEY_W;
            cy += ROW;
            t = tag({ x, y: cy, text, delay: 0.1 + n * 0.04 });
          }
          n++;
          x += t.w + 8;
          return t.svg;
        })
        .join("");
      const out = `<text x="36" y="${y + 19}" font-size="14" font-weight="700">${esc(key)}</text>${tags}`;
      y = cy + ROW + 6;
      return out;
    })
    .join("");
  const H = y + 10;
  return frame({ height: H, label: "stack", body: panel(W, H) + sectionTitle("stack") + rows });
};
