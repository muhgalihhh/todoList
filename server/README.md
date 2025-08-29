## Cursor Chat Backend

Environment variables (copy `.env.example` to `.env`):

```
PORT=3001
CURSOR_API_BASE_URL=https://api.cursor.sh
CURSOR_API_KEY=sk-...
CURSOR_MODEL=gpt-4o
```

Install and run:

```
npm i
npm run dev
```

Endpoints:
- `GET /api/health` returns `{ ok: true }`.
- `POST /api/chat` streams Server-Sent Events compatible with Cursor Chat Completions.

Usage:

1) Copy `.env.example` to `.env` and put your Cursor API key in `CURSOR_API_KEY`.
2) Open `http://localhost:3001` in the browser.
3) Type a message and the assistant will stream a response.

