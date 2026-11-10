# Security policy

## Supported versions

Security fixes target the current `main` branch and the GitHub Pages site it publishes. Older tags and copies do not receive separate fixes. Include the commit SHA, tag, or URL you tested in your report.

## What to report

Report vulnerabilities in Uno's prompt builder, GitHub Pages site, or optional live playground code. Examples include script injection, unintended disclosure of prompt text or credentials, and bypasses of the playground's access controls.

Use GitHub Issues for ordinary bugs and feature requests. An unexpected AI response is a security issue when it demonstrates a concrete impact, such as exposing data or bypassing a security control.

## Report a vulnerability privately

Go to [Uno's Security Advisories](https://github.com/cdanescmd/Uno/security/advisories) and select **Report a vulnerability** if the button is available. If it isn't available, open an issue asking for a private contact channel. Keep vulnerability details out of public issues, pull requests, and comments.

In the private report, include:

- The affected page or component and the version or commit you tested.
- Steps to reproduce the issue using sample data, plus the expected and observed behavior.
- The impact and any conditions needed to reproduce it.
- Sanitized screenshots or logs, if useful.

Remove API keys, beta access codes, private prompts, and personal information from your report. Use test data and systems you control, and coordinate public disclosure with the maintainer so there is time to investigate and fix the issue.
