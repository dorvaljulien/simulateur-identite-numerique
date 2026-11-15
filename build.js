// Assemble les sources de src/ en un seul fichier HTML autonome.
// Usage : node build.js
// Noms des services inventés : noms-services.js ; logos (images) : dossier logos/
const fs = require('fs');
const path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const noms = require('./outils/remplacer-noms').creer();
const logos = require('./outils/logos-images')(path.join(__dirname, 'logos'));

const css = ['app.css', 'fiscalis.css', 'sites2.css'].map(src).join('\n');
// config.js en premier : CONFIG reste en tête du code, modifiable sans toucher à la logique
const js = noms.remplacer([src('config.js'), logos.js, ...['logos.js', 'core.js', 'mail.js', 'docs.js', 'site-fiscalis.js', 'site-sante-identite.js', 'site-trouvo.js', 'teacher.js'].map(src)].join('\n\n'));

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Simulateur Identité numérique</title>
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
const out = path.join(__dirname, 'simulateur-identite-numerique.html');
fs.writeFileSync(out, html, 'utf8');
console.log('OK :', out, Math.round(html.length / 1024) + ' Ko',
  noms.change ? '— noms remplacés selon noms-services.js' : '— noms d\'origine',
  logos.cles.length ? '— logos : ' + logos.cles.join(', ') : '— logos dessinés');
