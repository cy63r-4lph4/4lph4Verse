"use client";

// components/datapad/DatapadMarkdown.tsx
//
// The single source of truth for how datapad markdown looks.
// Every element an author can produce is mapped here — nothing falls back to
// browser defaults, so a page can never render as unstyled black-on-white.

import { useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Info,
  Link2,
  Radiation,
  Target,
  TerminalSquare,
  Zap,
} from "lucide-react";
import { cn } from "@verse/ui";
import {
  parseCodeMeta,
  remarkCodeMeta,
  remarkDatapadDirectives,
} from "@verse/arena-web/lib/markdown/datapad-markdown-plugins";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Flatten a React children tree back to plain text (for copy + line counts). */
function toText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  const props = (node as any)?.props;
  return props ? toText(props.children) : "";
}

/* ------------------------------------------------------------------ */
/* Code block — the terminal frame                                     */
/* ------------------------------------------------------------------ */

const LANGUAGE_LABELS: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  py: "python",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  json: "json",
  yml: "yaml",
  text: "plaintext",
};

function CodeBlock({
  code,
  language,
  meta,
}: {
  code: string;
  language: string;
  meta?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { title, highlight, showLineNumbers } = useMemo(
    () => parseCodeMeta(meta),
    [meta]
  );

  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const label = LANGUAGE_LABELS[language] ?? language;
  const gutter = showLineNumbers && lines.length > 1;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className="relative my-8 rounded-xl overflow-hidden border border-cyan-500/20 bg-black/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <figcaption className="flex items-center justify-between gap-4 px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/20">
        <div className="flex items-center gap-2 min-w-0 text-cyan-500/60">
          <TerminalSquare size={14} className="flex-none" />
          <span className="font-mono text-[10px] uppercase tracking-widest flex-none">
            {label}
          </span>
          {title && (
            <>
              <span className="text-cyan-500/20 flex-none">/</span>
              <span className="font-mono text-[10px] text-cyan-300/70 truncate">
                {title}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
          className="flex-none flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>

      <div className="overflow-x-auto styled-scrollbar">
        <pre className="p-4 font-mono text-sm leading-relaxed text-cyan-50 min-w-max">
          <code>
            {lines.map((line, i) => {
              const n = i + 1;
              const hot = highlight.includes(n);
              return (
                <span
                  key={n}
                  className={cn(
                    "block -mx-4 px-4",
                    hot &&
                      "bg-cyan-500/10 border-l-2 border-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.06)]"
                  )}
                >
                  {gutter && (
                    <span className="select-none inline-block w-8 pr-4 text-right text-cyan-500/25 tabular-nums">
                      {n}
                    </span>
                  )}
                  {line || "\u00A0"}
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Directive blocks                                                    */
/* ------------------------------------------------------------------ */

const CALLOUTS = {
  info: {
    icon: Info,
    ring: "border-cyan-500/30",
    wash: "bg-cyan-950/25",
    accent: "text-cyan-300",
    bar: "bg-cyan-400",
    fallbackTitle: "Transmission",
  },
  warning: {
    icon: AlertTriangle,
    ring: "border-amber-500/30",
    wash: "bg-amber-950/20",
    accent: "text-amber-300",
    bar: "bg-amber-400",
    fallbackTitle: "Caution",
  },
  danger: {
    icon: Radiation,
    ring: "border-rose-500/30",
    wash: "bg-rose-950/20",
    accent: "text-rose-300",
    bar: "bg-rose-400",
    fallbackTitle: "Hazard",
  },
  success: {
    icon: Check,
    ring: "border-emerald-500/30",
    wash: "bg-emerald-950/20",
    accent: "text-emerald-300",
    bar: "bg-emerald-400",
    fallbackTitle: "Confirmed",
  },
  tip: {
    icon: Zap,
    ring: "border-violet-500/30",
    wash: "bg-violet-950/20",
    accent: "text-violet-300",
    bar: "bg-violet-400",
    fallbackTitle: "Field note",
  },
} as const;

type CalloutType = keyof typeof CALLOUTS;

function Callout({
  type,
  title,
  children,
}: {
  type?: string;
  title?: string;
  children: ReactNode;
}) {
  const key = (type ?? "info") as CalloutType;
  const tone = CALLOUTS[key] ?? CALLOUTS.info;
  const Icon = tone.icon;

  return (
    <aside
      className={cn(
        "relative my-8 flex gap-4 rounded-xl border p-4 md:p-5 pl-5",
        tone.ring,
        tone.wash
      )}
    >
      <span
        className={cn("absolute left-0 top-4 bottom-4 w-0.5 rounded-r", tone.bar)}
        aria-hidden
      />
      <Icon size={18} className={cn("mt-0.5 flex-none", tone.accent)} />
      <div className="min-w-0 flex-1 [&>*:last-child]:mb-0">
        <p
          className={cn(
            "font-display text-xs font-black uppercase tracking-widest mb-2",
            tone.accent
          )}
        >
          {title ?? tone.fallbackTitle}
        </p>
        {children}
      </div>
    </aside>
  );
}

function ObjectivePanel({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="my-10 rounded-xl border border-cyan-500/25 bg-gradient-to-b from-cyan-950/30 to-black/40 p-5 md:p-6">
      <header className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-500/15">
        <Target size={16} className="text-cyan-400" />
        <h4 className="font-display text-sm font-black uppercase tracking-widest text-cyan-200">
          {title ?? "Mission objectives"}
        </h4>
      </header>
      <div className="[&_ul]:list-none [&_ul]:pl-0 [&_li]:relative [&_li]:pl-6 [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:top-[0.55em] [&_li:before]:h-1.5 [&_li:before]:w-1.5 [&_li:before]:rotate-45 [&_li:before]:bg-cyan-400 [&_li:before]:content-[''] [&>*:last-child]:mb-0">
        {children}
      </div>
    </section>
  );
}

function TerminalBlock({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-8 rounded-xl overflow-hidden border border-emerald-500/20 bg-black/70">
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/30 border-b border-emerald-500/20">
        <TerminalSquare size={14} className="text-emerald-400/70" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/70">
          {title ?? "session"}
        </span>
      </div>
      <div className="p-4 font-mono text-sm text-emerald-100/90 leading-relaxed [&_p]:font-mono [&_p]:text-sm [&_p]:text-emerald-100/90 [&_p]:mb-2 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

function Spoiler({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <details className="group my-8 rounded-xl border border-white/10 bg-white/[0.02] open:border-cyan-500/25 open:bg-cyan-950/10">
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 font-display text-xs font-black uppercase tracking-widest text-white/60 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 marker:content-['']">
        {title ?? "Reveal"}
        <ChevronDown
          size={16}
          className="flex-none transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="px-5 pb-5 [&>*:last-child]:mb-0">{children}</div>
    </details>
  );
}

function Grid({ cols, children }: { cols?: string; children: ReactNode }) {
  const n = Number(cols) === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={cn("my-8 grid grid-cols-1 gap-4", n)}>{children}</div>
  );
}

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-cyan-500/25 transition-colors [&>*:last-child]:mb-0 [&_p]:text-base [&_p]:mb-3">
      {title && (
        <h5 className="font-display text-sm font-bold uppercase tracking-wide text-cyan-200 mb-3">
          {title}
        </h5>
      )}
      {children}
    </div>
  );
}

function Steps({ children }: { children: ReactNode }) {
  // Expects a single ordered list inside. Each item becomes a node on a
  // vertical line, with its number rendered as a marker on the spine.
  return (
    <div className="my-10 [&_ol]:list-none [&_ol]:pl-0 [&_ol]:m-0 [&_ol]:space-y-0 [&_ol]:[counter-reset:dp-step]">
      <div className="[&_li]:relative [&_li]:pl-12 [&_li]:pb-8 [&_li]:border-l [&_li]:border-cyan-500/20 [&_li]:ml-4 [&_li:last-child]:border-transparent [&_li:last-child]:pb-0 [&_li]:[counter-increment:dp-step] [&_li:before]:content-[counter(dp-step)] [&_li:before]:absolute [&_li:before]:-left-4 [&_li:before]:top-0 [&_li:before]:flex [&_li:before]:h-8 [&_li:before]:w-8 [&_li:before]:items-center [&_li:before]:justify-center [&_li:before]:rounded-full [&_li:before]:border [&_li:before]:border-cyan-500/30 [&_li:before]:bg-black [&_li:before]:font-mono [&_li:before]:text-xs [&_li:before]:text-cyan-300">
        {children}
      </div>
    </div>
  );
}

function Figure({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-10">
      <div className="rounded-xl overflow-hidden border border-cyan-500/20 bg-black/40 [&_img]:w-full [&_img]:block [&_p]:m-0">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-widest text-cyan-500/50 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Component map                                                       */
/* ------------------------------------------------------------------ */

const headingBase = "font-display scroll-mt-28 group/heading relative";

function Anchor({ id }: { id?: string }) {
  if (!id) return null;
  return (
    <Link2
      size={14}
      aria-hidden
      className="absolute -left-6 top-1/2 -translate-y-1/2 hidden md:block text-cyan-500/0 group-hover/heading:text-cyan-500/50 transition-colors"
    />
  );
}

export const datapadComponents: Record<string, any> = {
  /* --- dispatch for every directive block --- */
  div: ({ node, children, ...props }: any) => {
    switch (props["data-dp"]) {
      case "callout":
        return (
          <Callout type={props["data-type"]} title={props["data-title"]}>
            {children}
          </Callout>
        );
      case "objective":
        return <ObjectivePanel title={props["data-title"]}>{children}</ObjectivePanel>;
      case "terminal":
        return <TerminalBlock title={props["data-title"]}>{children}</TerminalBlock>;
      case "spoiler":
        return <Spoiler title={props["data-title"]}>{children}</Spoiler>;
      case "grid":
        return <Grid cols={props["data-cols"]}>{children}</Grid>;
      case "card":
        return <Card title={props["data-title"]}>{children}</Card>;
      case "steps":
        return <Steps>{children}</Steps>;
      case "figure":
        return <Figure caption={props["data-caption"]}>{children}</Figure>;
      case "unknown":
        return (
          <div className="my-6 rounded-lg border border-dashed border-amber-500/40 bg-amber-950/10 p-4 font-mono text-xs text-amber-300/80">
            Unknown block “{props["data-name"]}”. Check the datapad authoring
            guide for the supported list.
            <div className="mt-2 text-white/60 font-sans">{children}</div>
          </div>
        );
      default:
        return <div {...props}>{children}</div>;
    }
  },

  span: ({ node, children, ...props }: any) => {
    if (props["data-dp"] === "tag") {
      return (
        <span className="inline-flex items-center rounded border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan-300 align-middle">
          {children}
        </span>
      );
    }
    return <span {...props}>{children}</span>;
  },

  kbd: ({ children }: any) => (
    <kbd className="inline-flex items-center rounded border border-white/20 border-b-2 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white/90 align-middle">
      {children}
    </kbd>
  ),

  /* --- headings --- */
  h1: ({ node, children, ...props }: any) => (
    <h1
      {...props}
      className={cn(
        headingBase,
        "text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-500 uppercase tracking-wide mt-12 mb-8"
      )}
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }: any) => (
    <h2
      {...props}
      className={cn(
        headingBase,
        "text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mt-14 mb-6 border-b border-cyan-500/20 pb-2"
      )}
    >
      <Anchor id={props.id} />
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }: any) => (
    <h3
      {...props}
      className={cn(
        headingBase,
        "text-lg md:text-xl font-bold text-cyan-300 mt-10 mb-4 uppercase tracking-wide"
      )}
    >
      <Anchor id={props.id} />
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }: any) => (
    <h4
      {...props}
      className={cn(headingBase, "text-base font-bold text-white/90 mt-8 mb-3")}
    >
      {children}
    </h4>
  ),
  h5: ({ node, children, ...props }: any) => (
    <h5
      {...props}
      className={cn(
        headingBase,
        "text-sm font-bold uppercase tracking-widest text-cyan-400/70 mt-6 mb-2"
      )}
    >
      {children}
    </h5>
  ),
  h6: ({ node, children, ...props }: any) => (
    <h6
      {...props}
      className={cn(
        headingBase,
        "text-xs font-bold uppercase tracking-widest text-white/40 mt-6 mb-2"
      )}
    >
      {children}
    </h6>
  ),

  /* --- text --- */
  p: ({ node, ...props }: any) => (
    <p
      className="font-sans text-white/80 text-base md:text-lg leading-relaxed mb-6 max-w-[68ch]"
      {...props}
    />
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-bold text-cyan-100" {...props} />
  ),
  em: ({ node, ...props }: any) => (
    <em className="italic text-cyan-200" {...props} />
  ),
  del: ({ node, ...props }: any) => (
    <del className="text-white/40 decoration-rose-400/60" {...props} />
  ),
  hr: () => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
  ),
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="border-l-4 border-cyan-500 bg-cyan-950/20 p-4 md:p-6 my-8 rounded-r-xl italic text-cyan-100 font-sans shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] [&>*:last-child]:mb-0"
      {...props}
    />
  ),

  /* --- lists --- */
  ul: ({ node, className, ...props }: any) => {
    // GFM task lists get a flat layout; ordinary lists keep the bullet.
    const isTaskList = /contains-task-list/.test(className ?? "");
    return (
      <ul
        className={cn(
          "mb-6 space-y-2 font-sans text-white/80",
          isTaskList ? "list-none pl-0" : "list-disc pl-6 marker:text-cyan-500"
        )}
        {...props}
      />
    );
  },
  ol: ({ node, ...props }: any) => (
    <ol
      className="list-decimal pl-6 space-y-2 mb-6 font-sans text-white/80 marker:text-cyan-500 marker:font-mono"
      {...props}
    />
  ),
  li: ({ node, className, children, ...props }: any) => (
    <li
      className={cn(
        "pl-1 leading-relaxed [&>p]:mb-2 [&>ul]:mt-2 [&>ol]:mt-2",
        /task-list-item/.test(className ?? "") &&
          "flex items-start gap-3 pl-0 [&>input]:mt-1.5",
        className
      )}
      {...props}
    >
      {children}
    </li>
  ),
  input: ({ node, ...props }: any) =>
    props.type === "checkbox" ? (
      <input
        {...props}
        disabled
        className="h-4 w-4 flex-none appearance-none rounded border border-cyan-500/40 bg-black/50 checked:bg-cyan-500 checked:shadow-[0_0_8px_rgba(34,211,238,0.5)]"
      />
    ) : (
      <input {...props} />
    ),

  /* --- links --- */
  a: ({ node, href, children, className, ...props }: any) => {
    // rehype-autolink-headings wraps heading text in an <a>; it must stay
    // invisible or every heading turns into a cyan underlined link.
    if (/heading-anchor/.test(className ?? "")) {
      return (
        <a
          href={href}
          className="no-underline text-inherit focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-sm"
          {...props}
        >
          {children}
        </a>
      );
    }

    const external = /^https?:\/\//.test(href ?? "");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-sm"
        {...props}
      >
        {children}
      </a>
    );
  },

  /* --- code --- */
  pre: ({ node, children }: any) => {
    const child: any = Array.isArray(children) ? children[0] : children;
    const cls: string = child?.props?.className ?? "";
    const language = /language-([\w-]+)/.exec(cls)?.[1] ?? "text";
    const meta: string | undefined = child?.props?.["data-meta"];
    return (
      <CodeBlock
        code={toText(child?.props?.children)}
        language={language}
        meta={meta}
      />
    );
  },
  code: ({ node, className, children, ...props }: any) => {
    // Only inline code reaches here as a leaf — fenced code is intercepted
    // by `pre` above, which reads the language off this element's className.
    if (/language-/.test(className ?? "")) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="bg-cyan-950/50 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-[0.9em] border border-cyan-500/20"
        {...props}
      >
        {children}
      </code>
    );
  },

  /* --- tables (needs remark-gfm) --- */
  table: ({ node, ...props }: any) => (
    <div className="w-full overflow-x-auto styled-scrollbar my-8 border border-cyan-500/20 rounded-xl bg-black/40">
      <table
        className="w-full text-left font-sans text-sm md:text-base border-collapse"
        {...props}
      />
    </div>
  ),
  thead: ({ node, ...props }: any) => <thead {...props} />,
  th: ({ node, ...props }: any) => (
    <th
      className="p-4 border-b border-cyan-500/30 bg-cyan-950/40 font-display font-bold uppercase tracking-wide text-cyan-300 whitespace-nowrap"
      {...props}
    />
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="group hover:bg-white/[0.02] transition-colors" {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="p-4 border-b border-white/5 text-white/80 align-top" {...props} />
  ),

  /* --- media --- */
  img: ({ node, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      loading="lazy"
      className="w-full rounded-xl border border-cyan-500/20 my-8"
      {...props}
    />
  ),

  /* --- GFM footnotes --- */
  section: ({ node, className, children, ...props }: any) =>
    /footnotes/.test(className ?? "") ? (
      <section
        className="mt-16 pt-6 border-t border-cyan-500/20 text-sm text-white/50 [&_p]:text-sm [&_p]:mb-2 [&_li]:text-sm"
        {...props}
      >
        <h2 className="font-display text-xs font-black uppercase tracking-widest text-cyan-500/60 mb-4">
          Footnotes
        </h2>
        {children}
      </section>
    ) : (
      <section className={className} {...props}>
        {children}
      </section>
    ),
};

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

const REMARK_PLUGINS = [
  remarkGfm,
  remarkDirective,
  remarkDatapadDirectives,
  remarkCodeMeta,
];

const REHYPE_PLUGINS: any[] = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    { behavior: "wrap", properties: { className: "heading-anchor" } },
  ],
];

export default function DatapadMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={datapadComponents}
    >
      {content}
    </ReactMarkdown>
  );
}