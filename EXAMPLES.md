# Try Uno

Load [`UNO.md`](UNO.md) once. Run each example in a fresh context or provide the stated baseline. These examples show what to check, since different tools produce different outputs.

## 1. Web design

**Baseline:** A shared button class and a stylesheet with an existing mobile breakpoint.

**Request:** “On mobile, make the hero button full width.”

**Check:** The assistant reuses the existing breakpoint or a suitable component option. Desktop and other buttons retain their behavior. The change stays within the relevant component or stylesheet.

## 2. Code with a hard line limit

**Baseline:** A repository with a failing duplicate-save case. An existing helper can enforce uniqueness at the relevant write point.

**Request:** “Fix duplicate rows when saving twice. Code budget ≤ 12 changed lines.”

**Check:** The assistant proposes a readable patch, counts additions and deletions before writing, and runs the relevant check if available. If the smallest correct patch exceeds the cap, the assistant reports the blocker before writing. If a replacement is represented by one addition and one deletion, it consumes two lines.

### A quick test with a known answer

Paste this snippet into a chat with Uno loaded:

```css
@media (max-width: 600px) {
  .hero-button {
    width: auto;
  }
}
```

Ask “Make the hero button full width on mobile. Code budget ≤ 2 changed lines.” The expected patch is:

```diff
-    width: auto;
+    width: 100%;
```

Repeat from the original snippet with a one-line budget. The assistant should explain that this replacement consumes two changed lines and stop before applying it.

## 3. Image edit

**Baseline:** An attached headshot.

**Request:** “Remove the tie. Keep my face, crop, and lighting.”

**Check:** The assistant targets the collar and tie area when a localized edit is available. It uses one attempt by default. With only text output available, it returns a concise prompt such as:

> Edit the supplied headshot. Remove the tie and leave the collar naturally open. Preserve the face, pose, crop, and lighting. Limit the edit to the tie and collar.

## 4. Image creation

**Request:** “Create one 16:9 film still. Worn motel exterior at dusk, with one lit upstairs window. Prompt only. Prompt budget ≤ 25 words.”

**Example output, 16 words:**

> Photorealistic film still of a worn motel at dusk, one lit upstairs window, wide 16:9 framing.

**Check:** The assistant returns only the prompt and runs no generator.

## 5. Video edit

**Baseline:** An attached five-second clip with audio.

**Request:** “Add a slow push-in. Keep the timing and audio. Preview only.”

**Example output:**

> Keyframe the existing clip from 100% to 104% across five seconds, keeping its framing centered and audio intact.

**Check:** The assistant proposes a direct transform and leaves the clip untouched during the preview. The degree of zoom is a reversible creative assumption.

## 6. Video creation

**Baseline:** An attached still showing a traveler in a side passage.

**Request:** “Animate this still for five seconds. Slow push-in. The traveler walks away with the suitcase. Prompt only.”

**Example output:**

> Use the supplied still as the first frame. Push slowly toward the house as the traveler walks away, pulling the suitcase. Keep the elevated diagonal angle and the house still.
>
> Duration: 5 seconds.

**Check:** The response supplies one shot prompt and its duration. The assistant makes no generation call.

## 7. Missing source

**Request:** “Remove the tie from the latest headshot.”

**Setup:** Start a new session with no headshot available.

**Check:** The assistant asks for the current headshot or its location in one question. It waits for that source before attempting an edit.
