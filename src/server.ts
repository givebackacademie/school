import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import 'zone.js/node';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

import { initializeApp } from 'firebase/app';

import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
const firebaseConfig = {
  projectId: 'givebackacademy',
  appId: '1:650578864838:web:31c961614dffba48cb85c7',
  storageBucket: 'givebackacademy.appspot.com',
  apiKey: 'AIzaSyCYoV_lBh_kJxpH6Uv4kQKlQO38C5wMfbc',
  authDomain: 'givebackacademy.firebaseapp.com',
  messagingSenderId: '650578864838',
};

const admin = initializeApp(firebaseConfig);
const db = getFirestore(admin);

app.get('/sitemap.xml', async (req, res) => {
  const allurls = [];

  const citiesCol = collection(db, 'carousel');
  const snapshot = await getDocs(citiesCol);
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
  // const snapshot2 = await db.collection('topics').get();
  // const posts2 = snapshot2.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  // const urls2 = posts2
  //   .map((doc: any) => {
  //     const slug = doc['slug']; // or use doc.data().slug
  //     console.log(slug);
  //     return `<url><loc>http://localhost:4200/post/${slug}
  //   </loc>
  //      <lastmod>2022-06-04</lastmod>
  //   </url>`;
  //   })
  //   .join('\n');
  // allurls.push(urls2);
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
