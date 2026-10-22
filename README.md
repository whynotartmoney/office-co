# office-co

Bilingual office micro-tools for the working day. English and 中文.

**Proprietary. All rights reserved.**

This repository is public so the product can be built and deployed. It is closed source. No license is granted to use, copy, modify, merge, publish, distribute, sublicense, or sell this software or any part of it. There is no open-source license.

## Buy Me a Coffee

https://buymeacoffee.com/whynotartmoney

## What it is

Sixteen desk tools that run in the browser. Eight are free. Eight are Pro and stay locked until a license key is accepted.

Text typed into a tool stays on the device. The only network request is the Pro license check.

## Pro unlock

1. Open Menu → Pro.
2. Paste a license key and choose **Unlock with key**.
3. The app sends `{ "key": "<license>" }` to the OpenX license check.
4. When the response is `valid === true`, this browser stores `openx-pro-ok` and Pro tools open.
5. **Unlock on this device** is available after a key has been accepted. It keeps the unlock in this browser only. There is no account.

Do not commit license keys.

## Tools

Free: word counter, case converter, UUID v4, timestamp, percentage, color contrast, Base64, lorem ipsum.

Pro: JSON/YAML, CSV ↔ JSON, regex tester, text diff, QR code, password generator, Markdown preview, unit converter (length, weight, temperature, area).

Each tool has a stable address at `/t/<slug>`.

## Local development

```bash
npm install
npm run dev
npm test
npm run build
```

The dev server runs at http://localhost:3000. Theme, language, and the last opened tool are stored in `localStorage`. The default theme is light silver-gray. The default language is English.

## Deploy

This is a Next.js App Router project, ready for Vercel. No server of this app is required beyond static hosting of the client. Pro validation calls the existing OpenX endpoint from the browser.
