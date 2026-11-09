"use strict";

(() => {
  const endpoint = document.querySelector('meta[name="uno-playground-endpoint"]').content.trim();
  if (!endpoint.startsWith("https://")) return;

  const panel = document.querySelector("#playground");
  const form = document.querySelector("#prompt-form");
  const prompt = document.querySelector("#generated-prompt");
  const code = document.querySelector("#beta-code");
  const button = document.querySelector("#run-preview");
  const status = document.querySelector("#preview-status");
  const output = document.querySelector("#preview-output");
  const result = document.querySelector("#preview-result");
  let activeRequest;

  function resetPreview() {
    activeRequest?.abort();
    activeRequest = undefined;
    output.hidden = true;
    result.value = "";
    status.textContent = "";
    button.disabled = false;
  }

  form.addEventListener("input", resetPreview);
  form.addEventListener("submit", resetPreview);
  document.querySelector("#load-example").addEventListener("click", resetPreview);

  button.addEventListener("click", async () => {
    if (!prompt.value || !code.value.trim()) {
      status.textContent = "Build a prompt and enter the beta access code.";
      return;
    }

    resetPreview();
    const controller = new AbortController();
    activeRequest = controller;
    status.textContent = "Running AI preview…";
    button.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${code.value.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.value }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(25_000)]),
      });
      const data = await response.json();
      if (activeRequest !== controller) return;
      if (!response.ok || !data.text) {
        status.textContent = data.error || "The AI preview is unavailable.";
        return;
      }
      result.value = data.text;
      output.hidden = false;
      status.textContent = "AI preview ready.";
    } catch {
      if (activeRequest === controller) status.textContent = "The AI preview is unavailable.";
    } finally {
      if (activeRequest === controller) {
        activeRequest = undefined;
        button.disabled = false;
      }
    }
  });

  panel.hidden = false;
})();
