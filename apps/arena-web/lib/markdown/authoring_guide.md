# Datapad authoring guide

Everything a datapad can contain, and exactly how the reader renders it. If a
construct isn't listed here, the renderer either ignores it or shows a warning
block — it will never fall back to unstyled HTML.

Flavour: CommonMark + GitHub extensions (tables, task lists, strikethrough,
footnotes, autolinks) + a small set of `:::` blocks specific to this app.

---

## Frontmatter

Optional. Must be the very first thing in the file. Flat `key: value` pairs
only — no nested YAML.

```
---
title: Signal Interception Basics
classification: LEVEL 2
updated: 2026-03-04
---
```

`title` overrides the resource title in the header. `classification` appears in
the header eyebrow. Unknown keys are parsed and ignored, so adding your own is
harmless. The frontmatter block is stripped before rendering — it never shows up
in the body.

---

## Headings, and what the index uses

| You write | Renders as | In the index? |
|---|---|---|
| `# Title` | Large gradient display heading | No |
| `## Section` | White heading with a rule under it | **Yes** |
| `### Subsection` | Cyan heading | **Yes**, indented |
| `#### …` | Small white heading | No |
| `##### …` | Cyan uppercase label | No |
| `###### …` | Grey uppercase label | No |

Rules that matter:

- **A heading is only a heading when `#` starts the line** and is followed by a
  space. `#Section` is a paragraph. Indenting four or more spaces makes it code.
- **The index is built from `##` and `###` only.** If a page has fewer than two
  of them, no index renders at all. This is the main lever you have over
  navigation: to get a page into the index, use `##`.
- Use one `#` per datapad, at the top, or none at all — the resource title is
  already in the header.
- Don't skip levels (`##` then `####`). The index will look correct but the
  visual hierarchy won't.

### Link targets

Every `##`–`######` heading gets an id generated from its text: lowercased,
spaces to hyphens, punctuation dropped. `## Signal Decay & Drift` becomes
`#signal-decay--drift`. Duplicate headings get `-1`, `-2` suffixes in document
order.

Link to any of them from anywhere in the page:

```md
See [signal decay](#signal-decay--drift) before running the exercise.
```

Internal links scroll smoothly within the reader and update the URL, so a
shared link with `#signal-decay--drift` on the end opens at that section.

---

## Code

Fence with three backticks and **always name the language** — it becomes the
label on the terminal frame.

````md
```ts
export const relay = createRelay({ retries: 3 });
```
````

Optional metadata goes on the fence line:

````md
```ts title="lib/relay.ts" highlight={2,5-7}
```
````

| Meta | Effect |
|---|---|
| `title="lib/relay.ts"` | Filename shown next to the language label |
| `highlight={2,5-7}` | Those lines get a cyan bar and wash |
| `nolines` | Turns off the line-number gutter |

Line numbers are on by default for any fence with more than one line. Every
block gets a copy button. Long lines scroll horizontally rather than wrapping —
that's deliberate, so indentation stays readable.

Use `` `backticks` `` for inline code: a variable, a flag, a short path. Inline
code is styled as a cyan chip and doesn't get a terminal frame.

**Common mistakes:** a fence with no language renders as `plaintext`; unclosed
fences swallow the rest of the document; indenting a fence inside a list item
needs the fence indented to match the item's text.

---

## Custom blocks

Three colons, a name, optional attributes in braces, three colons to close.
Attribute values with spaces need quotes.

```md
:::callout{type=warning title="Signal loss"}
Relay drift over 40ms will fail the assessment.
:::
```

Blocks can contain any markdown — paragraphs, lists, code fences, other blocks.

### `callout`

The general-purpose aside. `type` picks the colour and icon.

| `type` | Use it for |
|---|---|
| `info` *(default)* | Context, background, "worth knowing" |
| `warning` | Something that will go wrong if ignored |
| `danger` | Destructive or irreversible actions |
| `success` | Confirmation, expected output, "you're done when…" |
| `tip` | Shortcuts, field notes, optional depth |

`title` is optional; each type has a sensible default.

### `objective`

The mission-objectives panel. Put a list inside; the bullets become cyan
diamonds.

```md
:::objective{title="By the end of this datapad"}
- Trace a signal through three relay hops
- Read a decay curve
:::
```

### `terminal`

A session transcript — monospace, green. Use it for commands and their output
as a conversation, not for source code (use a fenced block for that).

```md
:::terminal{title="relay-01"}
$ verse relay status
all systems nominal
:::
```

### `spoiler`

Collapsed by default. Answers, solutions, optional detours.

```md
:::spoiler{title="Solution"}
Hop 2 is the bottleneck.
:::
```

### `grid` and `card`

Side-by-side panels. `cols` accepts `2` (default) or `3`. Cards must be nested
inside a grid.

```md
:::grid{cols=2}
:::card{title="Passive"}
Listens only. Undetectable.
:::
:::card{title="Active"}
Faster, but announces you.
:::
:::
```

Nesting caveat: when one block sits inside another, the outer block needs
**more** colons than the inner one so the parser knows which is closing.

```md
::::grid{cols=2}
:::card{title="Passive"}
Listens only.
:::
::::
```

### `steps`

Turns an ordered list into a numbered vertical timeline. Put exactly one `1.`
list inside.

```md
:::steps
1. Power the relay.
2. Wait for the handshake tone.
3. Log the offset.
:::
```

### `figure`

Frames an image with a caption.

```md
:::figure{caption="Decay across three hops"}
![Decay curve](/media/decay.png)
:::
```

### Inline directives

`:kbd[Ctrl+K]` renders a keycap. `:tag[BETA]` renders a small cyan chip.

A misspelled block name (`:::callou`) renders a visible amber warning rather
than disappearing — if you see one in the reader, fix the name.

---

## Everything else

**Paragraphs** wrap at a comfortable measure automatically; don't hard-wrap mid
sentence in the source, since a single newline is not a line break. Two spaces
at the end of a line, or a blank line, is how you break.

**Lists** need a blank line before them. Nest with two spaces. Mixed content in
a list item works as long as continuation lines are indented to the text.

**Task lists** render as cyan checkboxes and are read-only in the reader:

```md
- [x] Calibrate
- [ ] Log the result
```

**Tables** use pipes. The header row and the `---` separator are both required;
alignment colons (`:---`, `:---:`, `---:`) are supported. Tables scroll
sideways on narrow screens rather than squashing, so a wide table is fine.

```md
| Hop | Latency | Status |
|-----|--------:|:------:|
| 01  |    12ms | green  |
```

**Blockquotes** (`>`) are styled as a highlighted pull-quote. For an
advisory note, a `callout` reads better than a quote.

**Links**: `[text](url)`. External links (anything starting `http`) open in a
new tab automatically. Internal `#anchor` links scroll in place.

**Images**: `![alt text](/path.png)`. Always write real alt text. A bare image
is full-width with a cyan border; wrap it in `figure` when it needs a caption.

**Horizontal rules** (`---` on its own line) render as a fading divider. Note
that `---` at the very top of a file starts frontmatter instead.

**Footnotes**: `Text[^1]` with `[^1]: The note.` anywhere below. All footnotes
collect at the bottom of the datapad under their own divider.

**Raw HTML is not rendered.** It's escaped and shown as text. Anything you need
a `<div>` for has a block above; if it doesn't, ask for it to be added rather
than working around it.

---

## Page shape that reads well

A datapad is read in a single scrolling column with the index pinned beside it.
What works:

1. Open with an `objective` block — readers decide whether to keep going in the
   first screen.
2. Break every 300–500 words with a `##`. Sections that never end make the
   index useless and the progress bar discouraging.
3. Alternate density. A table or code block after three paragraphs resets
   attention; four code blocks in a row do not.
4. Close with a `spoiler` self-check or a `callout{type=success}` stating what
   the reader should now be able to do — it's the hand-off to the assessment.

Progress is measured by scroll depth, so a very long datapad advances slowly.
Two 1,500-word datapads track a reader's progress better than one 3,000-word one.

---

## Reference card

```md
---
title: …
classification: …
---

## Section              → index entry
### Subsection          → nested index entry
`inline code`           → cyan chip
```lang title="f.ts" highlight={2,4-6} nolines
                        → terminal frame with copy button
:::callout{type=info|warning|danger|success|tip title="…"}
:::objective{title="…"}
:::terminal{title="…"}
:::spoiler{title="…"}
::::grid{cols=2|3} → :::card{title="…"}
:::steps                → wraps a 1. list
:::figure{caption="…"}
:kbd[Ctrl+K]   :tag[BETA]
| table | with | pipes |
- [ ] task list
[link](#heading-id)     → scrolls in place
Text[^1]                → footnote
```