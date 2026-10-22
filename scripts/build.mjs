import { mkdirSync, writeFileSync } from "node:fs";
import { fetchProfile } from "./github.mjs";
import { hero } from "./cards/hero.mjs";
import { about } from "./cards/about.mjs";
import { experience } from "./cards/experience.mjs";
import { stack } from "./cards/stack.mjs";
import { work } from "./cards/work.mjs";
import { stats } from "./cards/stats.mjs";
import { streak } from "./cards/streak.mjs";
import { button, divider, footer } from "./cards/extras.mjs";

const login = process.env.PROFILE_LOGIN ?? "xdearboy";
const root = new URL("../", import.meta.url);
const out = new URL("assets/", root);
mkdirSync(out, { recursive: true });

const profile = await fetchProfile(login);
const buttons = [
  { id: "web", text: "d3vo.ru", iconName: "globe", primary: true, href: "https://d3vo.ru" },
  { id: "tg", text: "telegram", iconName: "telegram", href: "https://t.me/contactfiuimwix_bot" },
  { id: "waka", text: "wakatime", iconName: "wakatime", href: "https://wakatime.com/@xdearboy" },
  { id: "cw", text: "codewars", iconName: "codewars", href: "https://www.codewars.com/users/xdearboy" },
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
  work: work(),
  ...Object.fromEntries(buttons.map((b) => [`button-${b.id}`, button(b)])),
};;

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(new URL(`${name}.svg`, out), svg);
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}

const img = (name, alt, width = "100%") => `<img src="assets/${name}.svg" width="${width}" alt="${alt}">`;
const link = (href, inner) => `<a href="${href}">${inner}</a>`;

const readme = `<div align="center">

${img("hero", "Hi, I'm xdearboy")}

<br /><br />

<div align="center">

${buttons.map((b) => link(b.href, img(`button-${b.id}`, b.text, "auto"))).join(" ")}

</div>

${img("about", "About me")}

${img("experience", "Experience")}

${img("stack", "Tech stack")}

${link("https://github.com/xdearboy?tab=repositories", img("work", "Open source — view all repositories"))}

${img("stats", "GitHub activity")}

${img("streak", "Streak")}

${img("divider", "")}

${img("footer", "updated")}

</div>
`;
writeFileSync(new URL("README.md", root), readme);
