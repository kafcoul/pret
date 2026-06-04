/**
 * Génère les assets PNG nécessaires à partir des SVG sources.
 * Usage: node scripts/generate-assets.mjs
 * Requis: npm install --save-dev sharp
 */
import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

async function generate() {
    console.log('🖼  Génération des assets PNG…\n');

    // 1. OG Image (1200×630)
    await sharp(resolve(publicDir, 'og-image.svg'))
        .resize(1200, 630)
        .png()
        .toFile(resolve(publicDir, 'og-image.png'));
    console.log('  ✅ og-image.png (1200×630)');

    // 2. Apple Touch Icon (180×180) — from logo badge area
    const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none">
      <rect width="180" height="180" rx="32" fill="#0F2B4C"/>
      <rect x="30" y="40" width="120" height="100" rx="20" fill="#C8963E"/>
      <text x="90" y="108" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="56" fill="white">SFF</text>
    </svg>`;
    await sharp(Buffer.from(appleTouchSvg))
        .resize(180, 180)
        .png()
        .toFile(resolve(publicDir, 'apple-touch-icon.png'));
    console.log('  ✅ apple-touch-icon.png (180×180)');

    // 3. PWA Icon 192×192
    const iconSvg192 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" fill="none">
      <rect width="192" height="192" rx="32" fill="#0F2B4C"/>
      <rect x="32" y="44" width="128" height="104" rx="20" fill="#C8963E"/>
      <text x="96" y="114" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="60" fill="white">SFF</text>
    </svg>`;
    await sharp(Buffer.from(iconSvg192))
        .resize(192, 192)
        .png()
        .toFile(resolve(publicDir, 'icon-192.png'));
    console.log('  ✅ icon-192.png (192×192)');

    // 4. PWA Icon 512×512
    const iconSvg512 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
      <rect width="512" height="512" rx="64" fill="#0F2B4C"/>
      <rect x="80" y="110" width="352" height="292" rx="48" fill="#C8963E"/>
      <text x="256" y="296" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="160" fill="white">SFF</text>
    </svg>`;
    await sharp(Buffer.from(iconSvg512))
        .resize(512, 512)
        .png()
        .toFile(resolve(publicDir, 'icon-512.png'));
    console.log('  ✅ icon-512.png (512×512)');

    console.log('\n🎉 Tous les assets ont été générés avec succès!');
}

generate().catch((err) => {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
});
