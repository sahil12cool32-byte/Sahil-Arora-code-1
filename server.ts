/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// In AI Studio / Cloud Run container, NGINX listens on PORT 8080 and reverse-proxies to DEFAULT_APP_PORT (3000).
// If process.env.PORT is 8080 or matches NGINX_PORT, the app must bind to port 3000 to prevent EADDRINUSE crash.
const port =
  process.env.PORT &&
  process.env.PORT !== '8080' &&
  process.env.PORT !== process.env.NGINX_PORT
    ? parseInt(process.env.PORT, 10)
    : parseInt(process.env.DEFAULT_APP_PORT || '3000', 10);

const host = '0.0.0.0';

const distPath = path.resolve(__dirname, 'dist');

// Serve health check
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Check if production build exists
if (fs.existsSync(distPath)) {
  // Serve static files from Vite build output
  app.use(express.static(distPath, { maxAge: '1h' }));

  // Fallback to index.html for SPA routes
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // In development fallback if dist is not yet built
  app.get('*', (_req: Request, res: Response) => {
    res.status(200).send('App is compiling or running in development mode. Please run "npm run build".');
  });
}

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
