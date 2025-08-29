import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { mountStatic } from './static.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
mountStatic(app);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Stream chat via Cursor-compatible API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = process.env.CURSOR_MODEL || 'gpt-4o', temperature = 0.7 } = req.body || {};
    if (!process.env.CURSOR_API_KEY) {
      res.status(500).json({ error: 'Missing CURSOR_API_KEY' });
      return;
    }
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Body must include messages: Array' });
      return;
    }

    // Prefer documented Cursor endpoint if available; fallback to OpenAI-compatible path
    const baseUrl = process.env.CURSOR_API_BASE_URL || 'https://api.cursor.sh';
    const url = `${baseUrl}/v1/chat/completions`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CURSOR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature,
        stream: true,
        messages
      })
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).send(text || 'Upstream error');
      return;
    }

    // Pipe SSE stream directly
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    upstream.body.on('data', (chunk) => {
      res.write(chunk);
    });
    upstream.body.on('end', () => {
      res.end();
    });
    upstream.body.on('error', (err) => {
      console.error('Upstream stream error', err);
      try { res.end(); } catch {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

