# Personal AI Business Agent

A starter AI assistant for preparing X/Twitter content. It generates editable drafts and deliberately does **not** publish automatically.

## Run locally

```bash
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000.

## Current features

- AI post generation through `/api/agent`
- Professional, casual, educational, and humorous tones
- 280-character limit
- Editable draft review
- Save, edit, and delete up to 20 drafts in browser local storage
- Explicit review-first workflow; nothing is published automatically

## Next integration steps

1. Replace local storage with authenticated, database-backed drafts.
2. Implement X OAuth 2.0 with encrypted access/refresh tokens.
3. Connect the official X API for publishing.
4. Add a scheduler and an approval endpoint requiring `confirm: true`.
5. Add per-user rate limits, audit logs, moderation, and retry handling.

Do not put API keys in client-side code or commit `.env.local`. Do not use browser automation to bypass X controls, CAPTCHAs, or rate limits.
