"use strict";

const examples = {
  web: "Make the hero button full width on mobile. Keep the desktop layout and other buttons intact.",
  code: "Fix duplicate rows when saving twice. Keep the public interface. Code budget ≤ 12 changed lines.",
  image: "Remove the tie from the attached headshot. Keep the face, crop, pose, and lighting.",
  video: "Add a slow push-in to the attached clip. Keep the timing and existing audio.",
};

function buildPrompt(request) {
  return [
    "Use the Uno preflight for this request.",
    `Request: ${request.trim()}`,
    "Before acting, identify the current version and what must stay intact. Look for an existing setting, component, code path, or direct media edit. Choose the smallest complete change. If an edit requires a missing source, ask for it.",
    "Check any reply, code, prompt, or generation limits before acting. Count changed code lines as additions plus deletions. Stop before an action if a hard limit cannot be met or verified.",
    "For Preview only, describe the proposed action and stop. For Prompt only, return a paste-ready prompt without running a generator. Otherwise do the work with the tools available. Default to one attempt and one result for media generation. Verify the result and report it briefly.",
  ].join("\n\n");
}

const form = document.querySelector("#prompt-form");
const requestField = document.querySelector("#change-request");
const action = document.querySelector("#builder-action");
const examplePicker = document.querySelector("#load-example");
const output = document.querySelector("#builder-output");
const generated = document.querySelector("#generated-prompt");
const status = document.querySelector("#builder-status");

function updateAction() {
  const hasRequest = Boolean(requestField.value.trim());
  action.textContent = hasRequest ? "Build prompt" : "Try an example";
  if (hasRequest) {
    examplePicker.hidden = true;
    action.removeAttribute("aria-expanded");
    action.removeAttribute("aria-controls");
  } else {
    action.setAttribute("aria-expanded", String(!examplePicker.hidden));
    action.setAttribute("aria-controls", examplePicker.id);
  }
}

function clearOutput() {
  output.hidden = true;
  generated.value = "";
  status.textContent = "";
  updateAction();
}

form.addEventListener("input", clearOutput);
form.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || examplePicker.hidden) return;
  examplePicker.hidden = true;
  updateAction();
  action.focus();
});

examplePicker.addEventListener("click", (event) => {
  const key = event.target.dataset.example;
  if (!key) return;
  requestField.value = examples[key];
  clearOutput();
  status.textContent = "Example loaded. Edit it or build your prompt.";
  requestField.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const request = requestField.value.trim();
  if (!request) {
    examplePicker.hidden = !examplePicker.hidden;
    updateAction();
    return;
  }
  generated.value = buildPrompt(request);
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

requestField.disabled = false;
action.disabled = false;
updateAction();
