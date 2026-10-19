import { execFileSync } from "node:child_process";

const token = () => {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
};

const repoFields = "name description stargazerCount url primaryLanguage{name}";

const query = `query($login:String!){user(login:$login){
  followers{totalCount}
  repositories(ownerAffiliations:OWNER,isFork:false,privacy:PUBLIC,first:100){
    totalCount
    nodes{stargazerCount languages(first:6,orderBy:{field:SIZE,direction:DESC}){edges{size node{name}}}}
  }
  pinnedItems(first:6,types:REPOSITORY){nodes{... on Repository{${repoFields}}}}
  recent:repositories(ownerAffiliations:OWNER,isFork:false,privacy:PUBLIC,first:6,orderBy:{field:PUSHED_AT,direction:DESC}){nodes{${repoFields}}}
  contributionsCollection{
    totalCommitContributions totalPullRequestContributions totalIssueContributions
    contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}
  }
}}`;

const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const streaks = (days) => {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  const trimmed = days.at(-1)?.count === 0 ? days.slice(0, -1) : days;
  for (let i = trimmed.length - 1; i >= 0 && trimmed[i].count > 0; i--) current++;
  return { current, longest };
};

export const fetchProfile = async (login) => {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json));
  const u = json.data.user;

  const sizes = new Map();
  for (const r of u.repositories.nodes)
    for (const e of r.languages.edges) sizes.set(e.node.name, (sizes.get(e.node.name) ?? 0) + e.size);
  const total = [...sizes.values()].reduce((a, b) => a + b, 0);
  const languages = [...sizes]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, size]) => ({ name, share: size / total }));

  const cc = u.contributionsCollection;
  const days = cc.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] }));
  const weeks = cc.contributionCalendar.weeks.map((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] })),
  );

  const projects = [...u.pinnedItems.nodes, ...u.recent.nodes]
    .filter((repo, index, all) => all.findIndex((other) => other.name === repo.name) === index)
    .slice(0, 6);

  return {
    login,
    followers: u.followers.totalCount,
    repos: u.repositories.totalCount,
    stars: u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0),
    commits: cc.totalCommitContributions,
    pulls: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    contributions: cc.contributionCalendar.totalContributions,
    activeDays: days.filter((d) => d.count > 0).length,
    weeks,
    languages,
    projects,
    ...streaks(days),
  };
};
