"use strict";

const workTypes = {
  web: {
    label: "Web design",
    guidance: "Reuse an existing design token, component, or breakpoint where possible.",
    request: "Make the hero button full width on mobile.",
    preserve: "Keep the desktop layout and other buttons intact.",
  },
  code: {
    label: "Code",
    guidance: "Reuse existing code and check the smallest relevant test or build.",
    request: "Fix duplicate rows when saving twice.",
    preserve: "Keep the public interface and unrelated save behavior.",
  },
  image: {
    label: "Image",
    guidance: "Use the supplied image as the reference and target the requested region when editing.",
    request: "Remove the tie from the attached headshot.",
    preserve: "Keep the face, crop, pose, and lighting.",
  },
  video: {
    label: "Video",
    guidance: "For an existing clip, check for a direct timeline, transform, or audio edit before generating.",
    request: "Add a slow push-in to the attached clip.",
    preserve: "Keep the clip timing and existing audio.",
  },
};

const outputModes = {
  work: "Do the requested work if the necessary tools are available. Verify what changed and report it briefly.",
  preview: "Preview only. Describe the proposed action in up to three lines. Stop before editing or generating.",
  prompt: "Prompt only. Return one paste-ready prompt and any essential settings. Do not run a generator.",
};

const limits = [
  ["replyLines", "Reply budget", "prose lines, excluding the requested artifact"],
  ["codeLines", "Code budget", "changed lines (additions plus deletions across the patch)"],
  ["promptWords", "Generator prompt budget", "words (count any negative prompt too)"],
  ["attempts", "Generation budget", "attempts (count retries)"],
];

function buildPrompt(values) {
  const work = workTypes[values.type];
  const budgetLines = limits.flatMap(([field, label, unit]) => {
    const value = values[field];
    return value ? [`${label} ≤ ${Number(value)} ${unit}.`] : [];
  });
  return [
    `Use the Uno preflight for this ${work.label.toLowerCase()} request.`,
    `Request: ${values.request.trim()}`,
    values.preserve.trim() && `Preserve: ${values.preserve.trim()}`,
    "Before acting, identify the current version, look for reuse, and choose the smallest complete change. Preserve unrelated details. If an edit needs a missing source, ask for it.",
    work.guidance,
    ...budgetLines,
    "Check any explicit limits before acting. If a limit cannot be met or verified, stop and explain the blocker.",
    ["image", "video"].includes(values.type) && values.attempts === "" && "For media generation, default to one result and one attempt.",
    outputModes[values.mode],
  ].filter(Boolean).join("\n\n");
}

const form = document.querySelector("#prompt-form");
const fields = form.elements;
const output = document.querySelector("#builder-output");
const generated = document.querySelector("#generated-prompt");
const status = document.querySelector("#builder-status");

function clearOutput() {
  output.hidden = true;
  generated.value = "";
  status.textContent = "";
}

form.addEventListener("input", () => {
  fields.request.setCustomValidity("");
  clearOutput();
});

document.querySelector("#load-example").addEventListener("click", () => {
  const example = workTypes[fields.type.value];
  fields.request.value = example.request;
  fields.preserve.value = example.preserve;
  fields.request.setCustomValidity("");
  clearOutput();
  status.textContent = "Example loaded. You can edit it before building.";
  fields.request.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!fields.request.value.trim()) {
    fields.request.setCustomValidity("Enter a request before building a prompt.");
    fields.request.reportValidity();
    return;
  }

  const values = Object.fromEntries(new FormData(form));
  generated.value = buildPrompt(values);
  output.hidden = false;
  status.textContent = "Prompt ready to copy.";
});

document.querySelector("#copy-prompt").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generated.value);
    status.textContent = "Prompt copied.";
  } catch {
    generated.focus();
    generated.select();
    status.textContent = "Automatic copying is unavailable. Copy the selected text.";
  }
});

document.querySelector("#builder-fields").disabled = false;
