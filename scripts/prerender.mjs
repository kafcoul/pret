/**
 * Pre-render script for SEO
 * Generates static HTML for each route at build time using Puppeteer.
 * This ensures search engines and social media crawlers see fully rendered content.
 *
 * Usage: node scripts/prerender.mjs
 * Run after `vite build` completes.
 */

import { launch } from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

// All public routes to pre-render
const ROUTES = [
    '/',
    '/profil',
    '/services/particuliers',
    '/services/financement-temporaire',
    '/services/consolidation-dettes',
    '/services/deuxieme-chance-credit',
    '/services/entreprises',
    '/services/eviter-faillite',
    '/demande-en-ligne',
    '/nous-joindre',
    '/calculateur',
    '/faq',
    '/politique-confidentialite',
];

// Simple static file server for the dist folder
function startServer(port) {
    return new Promise((resolve) => {
        const server = createServer((req, res) => {
            let filePath = join(DIST_DIR, req.url === '/' ? '/index.html' : req.url);

            // SPA fallback: if file doesn't exist, serve index.html
            if (!existsSync(filePath)) {
                filePath = join(DIST_DIR, 'index.html');
            }

            try {
                const content = readFileSync(filePath);
                const ext = filePath.split('.').pop();
                const mimeTypes = {
                    html: 'text/html',
                    js: 'application/javascript',
                    css: 'text/css',
                    svg: 'image/svg+xml',
                    png: 'image/png',
                    json: 'application/json',
                    woff2: 'font/woff2',
                    woff: 'font/woff',
                    ttf: 'font/ttf',
                };
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
                res.end(content);
            } catch {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        server.listen(port, () => {
            console.log(`📦 Static server running on http://localhost:${port}`);
            resolve(server);
        });
    });
}

async function prerender() {
    const PORT = 4173;
    const server = await startServer(PORT);

    console.log('🚀 Launching Puppeteer for pre-rendering...');
    const browser = await launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let successCount = 0;
    let failCount = 0;

    for (const route of ROUTES) {
        try {
            const page = await browser.newPage();

            // Navigate and wait for network to be idle (all requests settled)
            await page.goto(`http://localhost:${PORT}${route}`, {
                waitUntil: 'networkidle0',
                timeout: 30000,
            });

            // Wait a bit more for React to fully render + JSON-LD injection
            await page.waitForFunction(() => {
                return document.querySelector('#root')?.children.length > 0;
            }, { timeout: 10000 });

            // Extra wait for dynamic content (CMS, Supabase data)
            await new Promise((r) => setTimeout(r, 2000));

            // Get the fully rendered HTML
            const html = await page.content();

            // Determine output path
            const outputDir = route === '/'
                ? DIST_DIR
                : join(DIST_DIR, ...route.split('/').filter(Boolean));

            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true });
            }

            const outputFile = join(outputDir, 'index.html');
            writeFileSync(outputFile, html, 'utf-8');

            console.log(`  ✅ ${route} → ${outputFile.replace(DIST_DIR, 'dist')}`);
            successCount++;

            await page.close();
        } catch (err) {
            console.error(`  ❌ ${route} — ${err.message}`);
            failCount++;
        }
    }

    await browser.close();
    server.close();

    console.log(`\n🏁 Pre-rendering complete: ${successCount} succeeded, ${failCount} failed`);
    console.log('   Static HTML files are ready for search engine crawlers!');
}

prerender().catch((err) => {
    console.error('Pre-rendering failed:', err);
    process.exit(1);
});
