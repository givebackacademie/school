// import dotenv from 'dotenv';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
// import { environments } from './environments/environment';

const browserDistFolder = join(import.meta.dirname, '../browser');
// import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app';
const app = express();
const angularApp = new AngularNodeAppEngine();
// import * as serviceAccount from '../serviceAccountKey.json';
// Firestore instance
require('dotenv').config();
/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

var admin = require('firebase-admin');
if (admin.apps.length === 0) {
  await admin.initializeApp({
    credential: admin.credential.cert(process.env['SECRET_KEYS']),
  });
}

app.get('/sitemap.xml', async (req, res) => {
  const db = await admin.firestore();

  const allurls = [];
  const snapshot = await db.collection('carousel').get();
  const posts = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  const urls = posts
    .map((doc: any) => {
      const slug = doc['slug'];
      return `<url><loc>http://localhost:4200/post/${slug}
      </loc>
         <lastmod>2022-06-04</lastmod>
      </url>`;
    })
    .join('\n');
  allurls.push(urls);
  const snapshot2 = await db.collection('topics').get();
  const posts2 = snapshot2.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  const urls2 = posts2
    .map((doc: any) => {
      const slug = doc['slug']; // or use doc.data().slug
      console.log(slug);
      return `<url><loc>http://localhost:4200/post/${slug}
      </loc>
         <lastmod>2022-06-04</lastmod>
      </url>`;
    })
    .join('\n');
  allurls.push(urls2);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allurls.join('\n')}
  </urlset>`;
  console.log(sitemap);
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
