// lib/markdown/datapad-markdown-plugins.ts
//
// Plugin layer for the Datapad renderer.
// Install:
//   pnpm add remark-gfm remark-directive rehype-slug rehype-autolink-headings \
//            github-slugger unist-util-visit
//
// Optional (math):      remark-math rehype-katex katex
// Optional (raw HTML):  rehype-raw rehype-sanitize

import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import type { Root } from "mdast";
import type { Plugin } from "unified";

/* ------------------------------------------------------------------ *
 * 1. Block directives  ->  <div data-dp="callout" data-type="warning">
 * ------------------------------------------------------------------ *
 * Author writes:
 *   :::callout{type=warning title="Watch the clock"}
 *   Body text.
 *   :::
 *
 * remark-directive parses it; this plugin maps it onto a plain div with
 * data-* attributes, which DatapadMarkdown's `div` component dispatches on.
 * Adding a new block type = add a name here + a branch in the component map.
 */

export const DATAPAD_BLOCKS = [
  "callout",
  "terminal",
  "objective",
  "spoiler",
  "grid",
  "card",
  "steps",
  "figure",
] as const;

export const DATAPAD_INLINE = ["kbd", "tag"] as const;

const BLOCK_SET = new Set<string>(DATAPAD_BLOCKS);
const INLINE_SET = new Set<string>(DATAPAD_INLINE);

export const remarkDatapadDirectives: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, (node: any) => {
    if (
      node.type !== "containerDirective" &&
      node.type !== "leafDirective" &&
      node.type !== "textDirective"
    ) {
      return;
    }

    const attrs: Record<string, string> = node.attributes ?? {};
    const data = node.data ?? (node.data = {});

    if (node.type === "textDirective") {
      if (!INLINE_SET.has(node.name)) return;
      data.hName = node.name === "kbd" ? "kbd" : "span";
      data.hProperties = {
        "data-dp": node.name,
        ...prefixAttrs(attrs),
      };
      return;
    }

    if (!BLOCK_SET.has(node.name)) {
      // Unknown directive: render its text instead of silently eating it,
      // so a typo in the source is visible to the author rather than invisible.
      data.hName = "div";
      data.hProperties = { "data-dp": "unknown", "data-name": node.name };
      return;
    }

    data.hName = "div";
    data.hProperties = { "data-dp": node.name, ...prefixAttrs(attrs) };
  });
};

function prefixAttrs(attrs: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(attrs)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [`data-${k.toLowerCase()}`, String(v)])
  );
}

/* ------------------------------------------------------------------ *
 * 2. Code fence metadata
 * ------------------------------------------------------------------ *
 * ```ts title="lib/api.ts" highlight={3,7} nolines
 *
 * The meta string is dropped by mdast-util-to-hast by default, so copy it
 * onto the <code> element as data-meta before the hast conversion happens.
 */

export const remarkCodeMeta: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, "code", (node: any) => {
    if (!node.meta) return;
    node.data = node.data ?? {};
    node.data.hProperties = {
      ...(node.data.hProperties ?? {}),
      "data-meta": node.meta,
    };
  });
};

export interface CodeMeta {
  title?: string;
  highlight: number[];
  showLineNumbers: boolean;
}

export function parseCodeMeta(meta?: string): CodeMeta {
  const out: CodeMeta = { highlight: [], showLineNumbers: true };
  if (!meta) return out;

  const title = /(?:title|file)=(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(meta);
  if (title) out.title = title[1] ?? title[2] ?? title[3];

  const hl = /highlight=\{([^}]*)\}/.exec(meta);
  if (hl) {
    out.highlight = hl[1]
      .split(",")
      .flatMap((part) => {
        const range = /^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(part);
        if (range) {
          const [a, b] = [Number(range[1]), Number(range[2])];
          return Array.from({ length: b - a + 1 }, (_, i) => a + i);
        }
        const n = Number(part.trim());
        return Number.isFinite(n) ? [n] : [];
      });
  }

  if (/\bnolines\b/.test(meta)) out.showLineNumbers = false;
  return out;
}

/* ------------------------------------------------------------------ *
 * 3. Table of contents extraction
 * ------------------------------------------------------------------ *
 * Built from the raw source with the same slugger rehype-slug uses, so the
 * generated ids match the ones on the rendered headings exactly — including
 * de-duplication suffixes (`overview`, `overview-1`, ...).
 */

export interface TocEntry {
  id: string;
  title: string;
  depth: number;
}

export function extractToc(
  markdown: string,
  { minDepth = 2, maxDepth = 3 }: { minDepth?: number; maxDepth?: number } = {}
): TocEntry[] {
  if (!markdown) return [];

  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];

  const source = stripFrontmatter(markdown);
  const lines = source.split("\n");

  let fence: string | null = null;

  for (const line of lines) {
    const fenceMatch = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (fence && line.trim().startsWith(fence)) fence = null;
      else if (!fence) fence = fenceMatch[1];
      continue;
    }
    if (fence) continue;

    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) continue;

    const depth = heading[1].length;
    const title = cleanInline(heading[2]);
    // Slug every heading so numbering stays in step with rehype-slug, even
    // for depths we don't surface in the TOC.
    const id = slugger.slug(title);
    if (depth < minDepth || depth > maxDepth) continue;

    entries.push({ id, title, depth });
  }

  return entries;
}

function stripFrontmatter(md: string) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function cleanInline(text: string) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1")
    .replace(/__([^_]*)__/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/* ------------------------------------------------------------------ *
 * 4. Frontmatter (optional metadata block at the top of a datapad)
 * ------------------------------------------------------------------ */

export interface DatapadFrontmatter {
  [key: string]: string;
}

/** Minimal flat key: value parser. Enough for classification/author/updated. */
export function readFrontmatter(markdown: string): {
  meta: DatapadFrontmatter;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(markdown ?? "");
  if (!match) return { meta: {}, body: markdown ?? "" };

  const meta: DatapadFrontmatter = {};
  for (const line of match[1].split("\n")) {
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim());
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }

  return { meta, body: markdown.slice(match[0].length) };
}