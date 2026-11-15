// Assemble les sources de src/ en un seul fichier HTML autonome.
// Usage : node build.js
const fs = require('fs');
const path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const css = ['eval.css', 'simulateur.css'].map(src).join('\n');

// Logos facultatifs : logos/<clé>.png (ou .svg, .jpg, .webp) et logos/<clé>-icone.png
// La clé est celle de src/services.js (trouvo, habitatAdapt, identipassPlus, numerid…).
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif' };
const dirLogos = path.join(__dirname, 'logos');
const logos = {};
if (fs.existsSync(dirLogos)) {
  for (const f of fs.readdirSync(dirLogos).sort()) {
    const ext = path.extname(f).toLowerCase();
    if (!MIME[ext]) continue;
    const cle = path.basename(f, path.extname(f));
    logos[cle] = `data:${MIME[ext]};base64,` + fs.readFileSync(path.join(dirLogos, f)).toString('base64');
  }
}
const cles = Object.keys(logos);
const logosJs = `/* Logos inlinés par build.js depuis logos/ : ${cles.length ? cles.join(', ') : 'aucun'} */\nconst LOGOS_IMAGES = ${JSON.stringify(logos)};`;

// config.js en premier : CONFIG reste en tête du code, modifiable sans toucher à la logique
const js = [src('config.js'), logosJs, ...['services.js', 'core.js', 'parties.js', 'simulateur.js'].map(src)].join('\n\n');
const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Évaluation — Démarches en ligne et identité numérique</title>
<style>
${css}
</style>
</head>
<body>
<script>
${js}
</script>
</body>
</html>
`;
const out = path.join(__dirname, 'evaluation-demarches.html');
fs.writeFileSync(out, html, 'utf8');
console.log('OK :', out, Math.round(html.length / 1024) + ' Ko', cles.length ? '— logos : ' + cles.join(', ') : '— aucun logo image (logos dessinés)');
