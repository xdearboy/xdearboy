import { mkdirSync, writeFileSync } from "node:fs";
import { fetchProfile } from "./github.mjs";
import { hero } from "./cards/hero.mjs";
import { stats } from "./cards/stats.mjs";
import { activity } from "./cards/activity.mjs";
import { projects } from "./cards/projects.mjs";
import { stack } from "./cards/stack.mjs";

const login = process.env.PROFILE_LOGIN ?? "xdearboy";
const out = new URL("../assets/", import.meta.url);
mkdirSync(out, { recursive: true });

const profile = await fetchProfile(login);
const cards = { hero: hero(), stats: stats(profile), activity: activity(profile), projects: projects(profile), stack: stack() };

for (const [name, svg] of Object.entries(cards)) {
  writeFileSync(new URL(`${name}.svg`, out), svg);
  console.log(`${name}.svg ${(svg.length / 1024).toFixed(1)} KB`);
}
