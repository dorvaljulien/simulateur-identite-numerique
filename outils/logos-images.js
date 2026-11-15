// Lit un dossier logos/ et renvoie le code JS « const LOGOS_IMAGES = {...} » (images en data URI).
// Fichiers : <clé>.png|svg|jpg|jpeg|webp|gif et <clé>-icone.<ext>
const fs = require('fs');
const path = require('path');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif' };
module.exports = function logosImages(dir) {
  const logos = {};
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).sort()) {
    const ext = path.extname(f).toLowerCase(); if (!MIME[ext]) continue;
    logos[path.basename(f, path.extname(f))] = `data:${MIME[ext]};base64,` + fs.readFileSync(path.join(dir, f)).toString('base64');
  }
  const cles = Object.keys(logos);
  return { cles, js: `/* Logos inlinés par build.js : ${cles.length ? cles.join(', ') : 'aucun'} */\nconst LOGOS_IMAGES = ${JSON.stringify(logos)};` };
};
