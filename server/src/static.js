import { readFileSync } from 'fs';
import { resolve } from 'path';

export function mountStatic(app) {
  app.get('/', (_req, res) => {
    const html = readFileSync(resolve(process.cwd(), 'src/index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
}

