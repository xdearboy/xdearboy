import { mkdirSync, writeFileSync } from "node:fs";
import { fetchProfile } from "./github.mjs";
import { hero } from "./cards/hero.mjs";
import { about } from "./cards/about.mjs";
import { experience } from "./cards/experience.mjs";
import { stack } from "./cards/stack.mjs";
import { project } from "./cards/project.mjs";
import { stats } from "./cards/stats.mjs";
import { streak } from "./cards/streak.mjs";
import { button, divider, footer } from "./cards/extras.mjs";

const login = process.env.PROFILE_LOGIN ?? "xdearboy";
const root = new URL("../", import.meta.url);
const out = new URL("assets/", root);
mkdirSync(out, { recursive: true });

const profile = await fetchProfile(login);
const repos = profile.projects.slice(0, 6);

const buttons = [
  { id: "web", text: "d3vo.ru", iconName: "globe", primary: true, href: "https://d3vo.ru" },
  { id: "tg", text: "Telegram", iconName: "telegram", href: "https://t.me/contactfiuimwix_bot" },
  { id: "waka", text: "WakaTime", iconName: "wakatime", href: "https://wakatime.com/@xdearboy" },
  { id: "cw", text: "Codewars", iconName: "codewars", href: "https://www.codewars.com/users/xdearboy" },
];

const files = {
  hero: hero(),
  about: about(),
  experience: experience(),
  stack: stack(),
  stats: stats(profile),
  streak: streak(profile),
  divider: divider(),
  footer: footer(new Date().toISOString().slice(0, 16).replace("T", " ") + " utc"),
  ...Object.fromEntries(repos.map((r, i) => [`project-${i + 1}`, project(r)])),
  ...Object.fromEntries(buttons.map((b) => [`button-${b.id}`, button(b)])),
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(new URL(`${name}.svg`, out), svg);
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}

const img = (name, alt, width = "100%") => `<img src="assets/${name}.svg" width="${width}" alt="${alt}">`;
const link = (href, inner) => `<a href="${href}">${inner}</a>`;

const projectRows = [];
for (let i = 0; i < repos.length; i += 2)
  projectRows.push(
    repos
      .slice(i, i + 2)
      .map((r, k) => link(r.url, img(`project-${i + k + 1}`, r.name, "49%")))
      .join("&nbsp;"),
  );

const readme = `<div align="center">

${img("hero", "Hi, I'm xdearboy")}

${buttons.map((b) => link(b.href, img(`button-${b.id}`, b.text, "auto"))).join("&nbsp;&nbsp;")}

${img("about", "About me")}

${img("experience", "Experience")}

${img("stack", "Tech stack")}

${projectRows.join("\n\n")}

${img("stats", "GitHub activity")}

${img("streak", "Streak")}

${img("divider", "")}

${img("footer", "updated")}

</div>
`;
writeFileSync(new URL("README.md", root), readme);
