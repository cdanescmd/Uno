# Uno

Give your AI assistant the change you want in one line. Uno tells it to check the current version, reuse what's already there, and choose the smallest complete edit before it writes a reply, changes a file, or runs a generation.

Uno is a reusable instruction file for web design, code, images, video, and other revisions. It works with the context and tools your assistant can actually access.

## Start here

1. **Load the rules once.** Paste or attach [`UNO.md`](UNO.md) to your chat. For a repo-aware assistant, ask it to read `UNO.md` and use it as the working instructions for the session. If your tool supports saved project instructions, you can put the rules there.
2. **Provide the current version.** Share the relevant file, screenshot, image, clip, or draft if it isn't already available. If you have several versions, identify which one to use.
3. **Say what to change.** Add a limit or preservation rule only when it matters.

> Use Uno for this session. On mobile, make the hero button full width.

When you start a new chat, load the rules again unless your tool reliably supplies them. A GitHub link or the word “Uno” alone may give the assistant too little context.

## Requests you can use

| Work | What to type | What Uno looks for first |
| --- | --- | --- |
| Web design | `Make the hero button full width on mobile.` | An existing mobile rule or component option |
| Code | `Fix duplicate rows when saving twice. Code budget ≤ 20 changed lines.` | The existing save path and any reusable duplicate check |
| Image edit | `Remove the tie. Keep face, crop, and lighting.` | A local edit to the supplied image |
| Image creation | `Create one 16:9 still of the motel exterior at dusk.` | One output using the available reference, if supplied |
| Video edit | `Add a slow push-in to this clip. Keep the timing and audio.` | A transform on the existing clip |
| Video creation | `Animate this still for five seconds. Slow push-in. Preview only.` | A single shot with clear motion and continuity |
| Writing | `Tighten paragraph two. Keep the quote verbatim.` | A revision of the named paragraph |

`Preview only` gives you a short description of the proposed action before any file edit or generation. `Prompt only` gives you the text to paste into a generator. See [examples and trial cases](EXAMPLES.md) for both.

## What gets limited

| Budget | Default | Explicit override |
| --- | --- | --- |
| Chat reply | Up to 3 prose lines for routine edits. A requested artifact is counted separately. | `Reply budget ≤ 1 line.` |
| Source changes | Smallest complete, readable change using existing code and design patterns. | `Code budget ≤ 12 changed lines.` |
| Generator prompt | Shortest prompt that carries the needed references, actions, and constraints. | `Prompt budget ≤ 80 words.` |
| Media outputs | One result from one generation attempt per media request. | `Generate 3 variants.` |

Code budgets count additions plus deletions across all files changed for the task. Replacing one line counts as two. A soft budget can bend for a complete result. A limit given as a maximum, `≤`, or “budget” is binding.

Uno is an instruction protocol. The assistant must have the source and tool access to apply changes, and it must follow the rules to respect budgets. For a hard code budget, Uno requires a countable patch before any write. Media preservation depends on the editor or generator's controls. If a tool cannot support a required constraint, Uno calls that out before running it.
