# Uno live playground beta

The public prompt builder runs in the browser. The optional playground sends a built prompt to a Cloudflare Worker and returns a text preview from OpenAI. It cannot edit files, run code, or generate media.

## Enable the beta

1. From this directory, sign in to Cloudflare with Wrangler 4.36 or newer. Deploy the Worker with `npx wrangler deploy`. The endpoint returns an unavailable status until configured.
2. In the Worker's **Settings → Variables and Secrets**, add `OPENAI_API_KEY` and `BETA_ACCESS_CODE` as secrets. Use a new, randomly generated access code for this beta. Add `OPENAI_MODEL` as a variable with the ID of a text model available to your OpenAI API project. Keep all secrets out of Git and the HTML.
3. In `docs/index.html`, set the `uno-playground-endpoint` meta tag to the Worker's HTTPS URL ending in `/preview`. Commit the change and let GitHub Pages redeploy. Leave the field empty to hide the beta.
4. On the homepage, build a prompt and run the preview with the access code. Confirm that an incorrect code is rejected and a valid code returns a text response.

## Usage controls

The Worker accepts requests from the configured GitHub Pages origin, requires the beta access code, limits request size, and caps model output per request. Its rate limit is approximately six authorized requests per minute per Cloudflare location. It is not a global spending cap. Keep the access code private and monitor usage on the dedicated OpenAI API project.

The browser sends a built prompt only when a visitor clicks **Run AI preview**. The text goes to the Worker and OpenAI. Keep confidential material out of beta prompts.
