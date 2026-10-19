import { W, d, frame, mocha, panel, sectionTitle, ui_, wrap, esc } from "../theme.mjs";

const paragraphs = [
  "hey! i'm xdearboy, a devops / sre engineer working across systems, networks and web protection. i build services around reliable edge infrastructure and maintain my own autonomous system, AS214745.",
  "i work mostly with kubernetes and linux, and write small practical tools in rust, go, python and typescript. based in tver, russia · utc+3.",
];
const FS = 15;
const LH = 24;
const MAX = Math.floor((W - 72) / (FS * 0.6));

export const about = () => {
  let y = 92;
  const body = paragraphs
    .map((p, i) => {
      const lines = wrap(p, MAX);
      const out = lines
        .map((l, k) => {
          const html = esc(l).replace("xdearboy", `<tspan font-weight="700">xdearboy</tspan>`);
          return `<text x="36" y="${y + k * LH}" font-size="${FS}" style="fill:${mocha.subtext}">${html}</text>`;
        })
        .join("");
      const g = `<g class="up" ${d(0.15 + i * 0.15)}>${out}</g>`;
      y += lines.length * LH + 12;
      return g;
    })
    .join("");
  const H = y + 12;
  return frame({ height: H, label: "about me", body: panel(W, H) + sectionTitle("about me") + body });
};
