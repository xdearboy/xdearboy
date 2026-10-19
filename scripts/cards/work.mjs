import { W, d, esc, frame, mocha, panel, sectionTitle, ui_, wrap } from "../theme.mjs";

const groups = [
  {
    label: "SYSTEMS & NETWORK",
    accent: mocha.mauve,
    items: [
      ["tachyon", "HTTP/HTTPS engine in C with Linux kTLS"],
      ["mfetch", "system information utility written in Rust"],
    ],
  },
  {
    label: "DEVELOPER TOOLS",
    accent: mocha.blue,
    items: [
      ["neogate-sdk", "TypeScript SDK, MCP server and playbooks"],
      ["dec64", "Python library for recursive Base64 decoding"],
    ],
  },
  {
    label: "UTILITIES & CONFIG",
    accent: mocha.green,
    items: [
      ["pastecreator", "Pastebin publisher with CLI and GUI"],
      ["dotfiles", "my macOS terminal and development environment"],
    ],
  },
];

const PAD = 36;
const GAP = 22;
const COL = (W - PAD * 2 - GAP * 2) / 3;
const H = 290;

export const work = () => {
  const cols = groups
    .map((group, i) => {
      const x = PAD + i * (COL + GAP);
      const headerY = 96;
      const items = group.items
        .map(([name, description], item) => {
          const y = 136 + item * 74;
          const lines = wrap(description, 27, 2);
          return `<g class="up" ${d(0.22 + i * 0.1 + item * 0.08)}><circle cx="${x}" cy="${y - 4}" r="4" fill="${group.accent}"/><text x="${x + 13}" y="${y + 1}" font-size="15" font-weight="700">${esc(name)}</text>${lines.map((line, k) => `<text x="${x + 13}" y="${y + 23 + k * 17}" font-size="12" style="fill:${mocha.subtext}">${esc(line)}</text>`).join("")}</g>`;
        })
        .join("");
      return `<g><g class="up" ${d(0.1 + i * 0.1)}><line x1="${x}" x2="${x + COL}" y1="${headerY - 13}" y2="${headerY - 13}" stroke="${group.accent}" stroke-width="2"/><text x="${x}" y="${headerY + 8}" font-size="12" font-weight="700" style="fill:${ui_.muted}">${esc(group.label)}</text></g>${items}</g>`;
    })
    .join("");

  return frame({
    height: H,
    label: "open source",
    body: panel(W, H) + sectionTitle("open source") + `<line x1="${PAD}" x2="${W - PAD}" y1="72" y2="72" stroke="${ui_.border}"/>` + cols + `<text x="${W - PAD}" y="${H - 20}" font-size="13" text-anchor="end" style="fill:${mocha.mauve}">all repositories →</text>`,
  });
};
