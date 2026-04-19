import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { XMLParser } from "fast-xml-parser";

const checkboxRe = /^- \[(?<checked>[xX ])\] (?<name>.+?)\s*$/;
const headingRe = /^##\s+(?<name>.+?)\s*$/;
const urlRe = /^https?:\/\//i;
const htmlTagRe = /<[^>]+>/g;
const whitespaceRe = /\s+/g;

function parseArgs(argv) {
  const options = {
    categories: "seed-categories.md",
    outputDir: "seeds",
    historyFile: "data/seed-history.json",
    count: 3,
    seedDate: new Date().toISOString().slice(0, 10),
    branchName: null,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    const nextValue = argv[index + 1];
    if (nextValue == null) {
      throw new Error(`Missing value for ${arg}`);
    }

    switch (arg) {
      case "--categories":
        options.categories = nextValue;
        break;
      case "--output-dir":
        options.outputDir = nextValue;
        break;
      case "--history-file":
        options.historyFile = nextValue;
        break;
      case "--count":
        options.count = Number(nextValue);
        break;
      case "--seed-date":
        options.seedDate = nextValue;
        break;
      case "--branch-name":
        options.branchName = nextValue;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }

    index += 1;
  }

  if (!Number.isInteger(options.count) || options.count <= 0) {
    throw new Error("--count must be a positive integer");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.seedDate)) {
    throw new Error("--seed-date must be in YYYY-MM-DD format");
  }

  return options;
}

async function parseCategoryMarkdown(filePath) {
  const text = await fs.readFile(filePath, "utf8");
  const enabled = [];
  const sections = new Map();
  let currentSection = null;

  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const headingMatch = headingRe.exec(line);
    if (headingMatch) {
      currentSection = headingMatch.groups.name;
      if (!sections.has(currentSection)) {
        sections.set(currentSection, []);
      }
      continue;
    }

    const checkboxMatch = checkboxRe.exec(line);
    if (checkboxMatch && currentSection == null) {
      if (checkboxMatch.groups.checked.toLowerCase() === "x") {
        enabled.push(checkboxMatch.groups.name);
      }
      continue;
    }

    if (currentSection && line.startsWith("- ")) {
      const candidate = line.slice(2).trim();
      if (urlRe.test(candidate)) {
        sections.get(currentSection).push(candidate);
      }
    }
  }

  if (enabled.length === 0) {
    throw new Error("No enabled categories found in seed-categories.md");
  }

  const missing = enabled.filter((name) => !sections.has(name) || sections.get(name).length === 0);
  if (missing.length > 0) {
    throw new Error(`Checked categories are missing feed URLs: ${missing.join(", ")}`);
  }

  return Object.fromEntries(enabled.map((name) => [name, sections.get(name)]));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "daily-seed-generator/1.0 (+https://github.com/nakamoto0922/vault)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function toArray(value) {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function textValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    if (typeof value["#text"] === "string") {
      return value["#text"].trim();
    }
    if (typeof value.__cdata === "string") {
      return value.__cdata.trim();
    }
  }
  return "";
}

function stripHtml(text) {
  return text
    .replaceAll(/&nbsp;/giu, " ")
    .replaceAll(/&amp;/giu, "&")
    .replaceAll(/&lt;/giu, "<")
    .replaceAll(/&gt;/giu, ">")
    .replace(htmlTagRe, " ")
    .replace(whitespaceRe, " ")
    .trim();
}

function truncateSummary(text, limit = 420) {
  if (text.length <= limit) {
    return text;
  }

  let shortened = text.slice(0, limit - 1).trimEnd();
  const lastSpace = shortened.lastIndexOf(" ");
  if (lastSpace > 200) {
    shortened = shortened.slice(0, lastSpace);
  }
  return `${shortened}…`;
}

function parseFeed(xmlText, { category, feedUrl }) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    textNodeName: "#text",
    cdataPropName: "__cdata",
    trimValues: true,
    processEntities: false,
  });

  const parsed = parser.parse(xmlText);
  const entries = [];

  if (parsed.rss?.channel) {
    const channel = parsed.rss.channel;
    const feedTitle = textValue(channel.title) || feedUrl;
    for (const item of toArray(channel.item)) {
      const title = textValue(item.title) || "Untitled";
      const url = textValue(item.link);
      const summary = truncateSummary(stripHtml(textValue(item.description)));
      const published = textValue(item.pubDate);
      const entryId = textValue(item.guid) || url || title;
      if (!url) {
        continue;
      }
      entries.push({
        category,
        feedUrl,
        feedTitle,
        entryId,
        title,
        url,
        published,
        summary,
      });
    }
    return entries;
  }

  if (parsed.feed) {
    const feed = parsed.feed;
    const feedTitle = textValue(feed.title) || feedUrl;
    for (const entry of toArray(feed.entry)) {
      const title = textValue(entry.title) || "Untitled";
      const summary = truncateSummary(stripHtml(textValue(entry.summary) || textValue(entry.content)));
      const published = textValue(entry.published) || textValue(entry.updated);
      const entryId = textValue(entry.id) || title;
      let url = "";

      for (const link of toArray(entry.link)) {
        const href = textValue(link.href);
        const rel = textValue(link.rel) || "alternate";
        if (href && rel === "alternate") {
          url = href;
          break;
        }
        if (href && !url) {
          url = href;
        }
      }

      if (!url) {
        continue;
      }

      entries.push({
        category,
        feedUrl,
        feedTitle,
        entryId,
        title,
        url,
        published,
        summary,
      });
    }
    return entries;
  }

  throw new Error(`Unsupported feed format for ${feedUrl}`);
}

async function loadHistory(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { seen_ids: [] };
    }
    throw error;
  }
}

async function saveHistory(filePath, history) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(history, null, 2)}\n`, "utf8");
}

async function collectEntries(categoryFeeds) {
  const grouped = {};
  for (const [category, feedUrls] of Object.entries(categoryFeeds)) {
    grouped[category] = [];
    for (const feedUrl of feedUrls) {
      const xmlText = await fetchText(feedUrl);
      grouped[category].push(...parseFeed(xmlText, { category, feedUrl }));
    }
  }
  return grouped;
}

function createSeededRandom(seed) {
  let state = 0;
  for (const char of seed) {
    state = (state * 31 + char.charCodeAt(0)) >>> 0;
  }

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function shuffle(list, randomFn) {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomFn() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function selectEntries(groupedEntries, { seenIds, count, randomFn }) {
  const available = new Map();

  for (const [category, entries] of Object.entries(groupedEntries)) {
    const unseen = entries.filter((entry) => !seenIds.has(entry.entryId));
    const bucket = unseen.length > 0 ? unseen : entries;
    const shuffled = shuffle(bucket, randomFn);
    if (shuffled.length > 0) {
      available.set(category, shuffled);
    }
  }

  if (available.size === 0) {
    throw new Error("No feed entries were available for the enabled categories.");
  }

  let categoryOrder = shuffle([...available.keys()], randomFn);
  const selected = [];

  while (selected.length < count && categoryOrder.length > 0) {
    const nextRound = [];
    for (const category of categoryOrder) {
      const bucket = available.get(category);
      if (bucket.length > 0 && selected.length < count) {
        selected.push(bucket.shift());
      }
      if (bucket.length > 0) {
        nextRound.push(category);
      }
    }
    categoryOrder = nextRound;
  }

  return selected;
}

function wrapParagraph(text, width = 88) {
  const words = text.split(/\s+/u).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.join("\n");
}

function buildMarkdown(entries, { seedDate, branchName, generatedAt }) {
  const categories = [...new Set(entries.map((entry) => entry.category))].sort();
  const lines = [
    "---",
    "tags:",
    "  - seed",
    `seed_date: ${seedDate}`,
    `item_count: ${entries.length}`,
    "categories:",
    ...categories.map((category) => `  - ${category}`),
    `branch: ${branchName}`,
    `generated_at: ${generatedAt}`,
    "---",
    "",
    `# Seed ${seedDate}`,
    "",
    `${entries.length} 件の学習の種をまとめました。3 分ほどで流し読みして、気になったものだけ深掘りする前提です。`,
    "",
  ];

  entries.forEach((entry, index) => {
    const summary =
      entry.summary ||
      "概要を取得できなかったため、リンク先でタイトルから内容を確認してください。";

    lines.push(`## ${index + 1}. ${entry.title}`);
    lines.push("");
    lines.push(`- Category: ${entry.category}`);
    lines.push(`- Source: ${entry.feedTitle}`);
    lines.push(`- Published: ${entry.published || "unknown"}`);
    lines.push(`- Link: ${entry.url}`);
    lines.push("");
    lines.push(wrapParagraph(summary));
    lines.push("");
    lines.push("### 次に見るなら");
    lines.push("");
    lines.push(`- まずは ${entry.category} の文脈で何が新しいのかだけ確認する。`);
    lines.push("- 深掘りするならリンク先を開いて、要点を 1 行メモする。");
    lines.push("");
  });

  return `${lines.join("\n").trimEnd()}\n`;
}

async function writeNote(outputDir, { seedDate, markdown }) {
  await fs.mkdir(outputDir, { recursive: true });
  const branchDate = seedDate.replaceAll("-", "");
  const notePath = path.join(outputDir, `seed-${branchDate}.md`);
  await fs.writeFile(notePath, markdown, "utf8");
  return notePath;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const branchName = options.branchName ?? `seed-${options.seedDate.replaceAll("-", "")}`;
  const generatedAt = new Date().toISOString();

  const categoryFeeds = await parseCategoryMarkdown(options.categories);
  const history = await loadHistory(options.historyFile);
  const seenIds = new Set(history.seen_ids ?? []);
  const groupedEntries = await collectEntries(categoryFeeds);
  const randomFn = createSeededRandom(options.seedDate);
  const selected = selectEntries(groupedEntries, {
    seenIds,
    count: options.count,
    randomFn,
  });
  const markdown = buildMarkdown(selected, {
    seedDate: options.seedDate,
    branchName,
    generatedAt,
  });

  if (options.dryRun) {
    process.stdout.write(markdown);
    return;
  }

  const notePath = await writeNote(options.outputDir, {
    seedDate: options.seedDate,
    markdown,
  });

  selected.forEach((entry) => seenIds.add(entry.entryId));
  history.seen_ids = [...seenIds].sort();
  await saveHistory(options.historyFile, history);

  process.stdout.write(`Wrote ${notePath}\n`);
  process.stdout.write(`Updated ${options.historyFile}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
