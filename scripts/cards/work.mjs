import { W, d, esc, frame, label, mocha, panel, sectionTitle, ui_, wrap } from "../theme.mjs";

const groups = [
  {
    label: "NETWORK & WEB PROTECTION",
    accent: mocha.mauve,
    items: [
      ["neogate", "web protection platform, edge infrastructure and operations"],
      ["AS214745", "independent autonomous system and network operations"],
    ],
  },
  {
    label: "SYSTEMS & INFRASTRUCTURE",
    accent: mocha.blue,
    items: [
      ["tachyon", "high-throughput static HTTP/HTTPS engine in C with Linux kTLS"],
      ["mfetch", "memory-focused system information tool written in Rust"],
    ],
  },
  {
    label: "DEVELOPER TOOLS",
    accent: mocha.green,
    items: [
      ["neogate-sdk", "TypeScript SDK, MCP server and automation playbooks"],
      ["dec64 · pastecreator · dotfiles", "small tools, utilities and the environment I work from"],
    ],
  },
];

const left = 36;
const split = 250;
const top = 88;
const row = 76;
const H = top + groups.length * row + 12;

export const work = () => {
  const items = groups
    .map((group, gi) => {
      const y = top + gi * row;
      const parts = group.items
        .map(([name, desc], i) => {
          const x = split + i * 284;
          const lines = wrap(desc, 31, 2);
          return `<g class="up" ${d(0.14 + gi * 0.12 + i * 0.07)}><circle cx="${x}" cy="${y + 5}" r="4" fill="${group.accent}"/><text x="${x + 12}" y="${y + 10}" font-size="15" font-weight="700">${esc(name)}</text>${lines.map((line, k) => `<text x="${x + 12}" y="${y + 31 + k * 17}" font-size="12" style="fill:${mocha.subtext}">${esc(line)}</text>`).join("")}</g>`;
        })
        .join("");
      return `<g><text class="up" x="${left}" y="${y + 10}" font-size="12" font-weight="700" style="fill:${ui_.muted};animation-delay:${(0.1 + gi * 0.12).toFixed(2)}s">${esc(group.label)}</text>${parts}${gi < groups.length - 1 ? `<line x1="${left}" x2="${W - left}" y1="${y + row - 16}" y2="${y + row - 16}" stroke="${ui_.border}"/>` : ""}</g>`;
    })
    .join("");

  return frame({
    height: H,
    label: "selected work",
    body: panel(W, H) + sectionTitle("selected work") + items + `<text x="${W - 36}" y="${H - 18}" font-size="13" text-anchor="end" style="fill:${mocha.mauve}">github.com/xdearboy →</text>`,
  });
};
