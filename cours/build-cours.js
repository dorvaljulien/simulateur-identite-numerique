// Génère le cours élève (.docx). Usage : node cours/build-cours.js
// puis : soffice --headless --convert-to odt cours/cours-identite-numerique.docx --outdir cours
const fs = require('fs'), path = require('path');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, AlignmentType, VerticalAlign, PageBreak, Footer, PageNumber } = D;

const W = 10432;                       // largeur utile (A4, marges 1,3 cm), en DXA
const PX = W / 15;                     // largeur utile en pixels (1 px = 15 DXA)
const C = { teal: '0F5C63', tealL: 'E3F2F1', or: 'A35F00', orL: 'FFF3DC', gris: 'F2F4F5', txt: '1D2B2E', rouge: 'A3261E', rougeL: 'FCE9E7', vert: '1B6B3A', vertL: 'E6F4EA' };
const FONT = 'Arial';
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noB = { top: none, bottom: none, left: none, right: none };

// **gras** dans une chaîne → TextRun
function runs(s, o = {}) {
  o = Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
  const bold = o.bold; delete o.bold;
  if (bold) return [new TextRun(Object.assign({ text: String(s).replace(/\*\*/g, ''), bold: true, font: FONT }, o))];
  return String(s).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(t => t.startsWith('**')
    ? new TextRun(Object.assign({ text: t.slice(2, -2), bold: true, font: FONT }, o))
    : new TextRun(Object.assign({ text: t, font: FONT }, o)));
}
const P = (s, o = {}) => new Paragraph({ children: runs(s, { size: o.size || 21, color: o.color || C.txt, bold: o.bold, italics: o.italics }), alignment: o.align, spacing: { before: o.before || 0, after: o.after == null ? 80 : o.after, line: o.line || 264 }, keepNext: o.keepNext });
const bullet = (s, o = {}) => new Paragraph({ children: runs(s, { size: o.size || 21, color: C.txt }), numbering: { reference: 'puces', level: 0 }, spacing: { after: 40, line: 260 } });
const gap = (n = 80) => new Paragraph({ children: [], spacing: { before: 0, after: 0, line: n, lineRule: 'exact' } });

// Bandeau de section : numéro + titre
function H(n, titre) {
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [620, W - 620], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: 620, type: WidthType.DXA }, borders: noB, shading: { type: ShadingType.CLEAR, fill: C.or }, verticalAlign: VerticalAlign.CENTER, margins: { top: 70, bottom: 70, left: 60, right: 60 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, children: [new TextRun({ text: String(n), bold: true, size: 30, color: 'FFFFFF', font: FONT })] })] }),
    new TableCell({ width: { size: W - 620, type: WidthType.DXA }, borders: noB, shading: { type: ShadingType.CLEAR, fill: C.teal }, verticalAlign: VerticalAlign.CENTER, margins: { top: 70, bottom: 70, left: 160, right: 100 },
      children: [new Paragraph({ keepNext: true, children: [new TextRun({ text: titre, bold: true, size: 27, color: 'FFFFFF', font: FONT })] })] })] })] });
}
// Rangée de tuiles : [{ t: titre, l: [lignes], fill, color }]
function tiles(list, o = {}) {
  const n = list.length, g = 140, w = Math.floor((W - g * (n - 1)) / n);
  const widths = []; list.forEach((_, i) => { widths.push(i === n - 1 ? W - (w + g) * (n - 1) : w); if (i < n - 1) widths.push(g); });
  const cells = [];
  list.forEach((t, i) => {
    const edge = { style: BorderStyle.SINGLE, size: 8, color: t.color || C.teal };
    cells.push(new TableCell({ width: { size: widths[i * 2], type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: t.fill || C.tealL }, borders: { top: { style: BorderStyle.SINGLE, size: 24, color: t.color || C.teal }, bottom: edge, left: edge, right: edge },
      margins: { top: 90, bottom: 90, left: 130, right: 130 }, verticalAlign: o.center ? VerticalAlign.CENTER : VerticalAlign.TOP,
      children: [].concat(t.t ? [new Paragraph({ alignment: o.center ? AlignmentType.CENTER : undefined, spacing: { after: 50 }, children: runs(t.t, { bold: true, size: o.tsize || 22, color: t.color || C.teal }) })] : [],
        (t.l || []).map(x => typeof x === 'string' ? new Paragraph({ alignment: o.center ? AlignmentType.CENTER : undefined, spacing: { after: 40, line: 252 }, children: runs(x, { size: o.size || 20, color: C.txt }) }) : x)) }));
    if (i < n - 1) cells.push(new TableCell({ width: { size: g, type: WidthType.DXA }, borders: noB, children: [new Paragraph({ children: [] })] }));
  });
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [new TableRow({ cantSplit: true, children: cells })] });
}
const mono = s => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: s, font: 'Courier New', bold: true, size: 21, color: C.txt })] });
// Encadré pleine largeur
function box(children, fill = C.orL, color = C.or, w = W) {
  return new Table({ width: { size: w, type: WidthType.DXA }, columnWidths: [w], rows: [new TableRow({ cantSplit: true, children: [new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill },
    borders: { top: none, bottom: none, right: none, left: { style: BorderStyle.SINGLE, size: 36, color } }, margins: { top: 90, bottom: 70, left: 180, right: 140 }, children })] })] });
}
// Image (largeur en px ; hauteur calculée)
function dims(file) { const b = fs.readFileSync(file); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }
function img(rel, wpx) {
  const f = path.join(__dirname, rel), d = dims(f);
  return new ImageRun({ type: 'png', data: fs.readFileSync(f), transformation: { width: Math.round(wpx), height: Math.round(wpx * d.h / d.w) } });
}
const picture = (rel, wpx, o = {}) => new Paragraph({ alignment: o.left ? AlignmentType.LEFT : AlignmentType.CENTER, spacing: { before: o.before || 40, after: o.after == null ? 40 : o.after }, keepNext: true, children: [img(rel, wpx)] });
const legend = s => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: runs(s, { size: 17, italics: true, color: '555555' }) });
// Deux colonnes libres (sans bordure)
function cols(left, right, wl) {
  const g = 200, wr = W - wl - g;
  const cell = (w, ch) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: noB, verticalAlign: VerticalAlign.TOP, children: ch });
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [wl, g, wr], rows: [new TableRow({ cantSplit: true, children: [cell(wl, left), cell(g, [new Paragraph({ children: [] })]), cell(wr, right)] })] });
}
// Tableau à en-tête
function grid(head, rows, widths, o = {}) {
  const b = { style: BorderStyle.SINGLE, size: 4, color: 'B8C4C6' }, bb = { top: b, bottom: b, left: b, right: b };
  const cell = (s, i, hd, fill) => new TableCell({ width: { size: widths[i], type: WidthType.DXA }, borders: bb, shading: { type: ShadingType.CLEAR, fill: hd ? C.teal : (fill || (i === 0 ? C.gris : 'FFFFFF')) }, margins: { top: 50, bottom: 50, left: 90, right: 90 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: o.center && i > 0 ? AlignmentType.CENTER : undefined, spacing: { after: 0, line: 240 }, children: runs(s, { size: o.size || 18, bold: hd || (i === 0 && !o.plainFirst), color: hd ? 'FFFFFF' : C.txt }) })] });
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [new TableRow({ tableHeader: true, cantSplit: true, children: head.map((s, i) => cell(s, i, true)) })]
    .concat(rows.map(r => new TableRow({ cantSplit: true, children: r.map((s, i) => cell(s, i, false, /^✔/.test(s) ? C.vertL : /^✘/.test(s) ? C.rougeL : null)) }))) });
}
const pageBreak = () => new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } });

/* ============================== CONTENU ============================== */
const body = [];
const add = (...x) => body.push(...x);

// ---------- Page 1 ----------
add(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W - 3300, 3300], rows: [new TableRow({ children: [
  new TableCell({ width: { size: W - 3300, type: WidthType.DXA }, borders: noB, shading: { type: ShadingType.CLEAR, fill: C.teal }, margins: { top: 140, bottom: 140, left: 220, right: 100 }, children: [
    new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: 'Mon identité numérique', bold: true, size: 46, color: 'FFFFFF', font: FONT })] }),
    new Paragraph({ children: [new TextRun({ text: 'Prouver en ligne que c\'est bien moi', size: 23, color: 'D9EEEC', font: FONT })] })] }),
  new TableCell({ width: { size: 3300, type: WidthType.DXA }, borders: noB, shading: { type: ShadingType.CLEAR, fill: C.or }, verticalAlign: VerticalAlign.CENTER, margins: { top: 100, bottom: 100, left: 160, right: 160 }, children: [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 20 }, children: [new TextRun({ text: '1re SAPAT · TIM', bold: true, size: 21, color: 'FFFFFF', font: FONT })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Démarches en ligne (C8.2)', size: 19, color: 'FFFFFF', font: FONT })] })] })] })] }));
add(gap(120));
add(P('Sur internet, personne ne me voit. Chaque site doit vérifier que c\'est bien moi avant d\'ouvrir mon dossier. Ce cours reprend ce que vous avez vécu dans le simulateur avec Martine, et montre **les vrais sites**.', { after: 140 }));

add(H(1, 'Un mot de passe différent pour chaque site'), gap(90));
add(P('**Pourquoi ?** Des sites se font voler leur fichier de mots de passe. Si j\'utilise le même partout, un seul vol ouvre tous mes comptes.', { after: 110 }));
add(tiles([
  { t: 'Solution 1 (la meilleure) : le gestionnaire', l: ['Celui du navigateur, de Google ou d\'Apple.', 'Il **invente** et **retient** un mot de passe pour chaque site.', 'Il est protégé par mon compte Google ou Apple. Ce compte-là mérite une **phrase de passe** et la **double authentification**.'] },
  { t: 'Solution 2 : la « recette »', color: C.or, fill: C.orL, l: ['Une racine, par exemple **Crepe#Beurre**, puis 3 signes pris dans le nom du site : dernière lettre, première lettre, nombre de lettres.',
    mono('ameli   →  Crepe#Beurreia5'), mono('impots  →  Crepe#Beurresi6'), 'Le site m\'oblige à changer ? J\'ajoute 2, puis 3…', '**Limite :** si un mot de passe fuit, la recette peut se deviner.'] }
]));
add(gap(90));
add(box([P('**Repères officiels.** CNIL : 12 caractères variés (majuscule, chiffre, caractère spécial), ou une phrase de passe de 7 mots. Cybermalveillance.gouv.fr : un mot de passe par service, et un gestionnaire.', { size: 19, after: 20 })], C.gris, '7A8A8C'));
add(gap(130));

add(H(2, 'La double authentification : deux preuves au lieu d\'une'), gap(90));
add(tiles([
  { t: '🧠  Ce que je sais', l: ['Un mot de passe', 'Un code secret'] },
  { t: '📱  Ce que j\'ai', l: ['Mon téléphone', 'Ma boîte mail'] },
  { t: '👆  Ce que je suis', l: ['Mon empreinte', 'Mon visage'] }
], { center: true }));
add(gap(90));
add(bullet('**Impôts, ameli :** mon mot de passe, puis un **code à 6 chiffres reçu par mail**. Il ne sert qu\'une fois, pendant quelques minutes.'));
add(bullet('Je l\'active **dès qu\'on me la propose**. En priorité sur ma **boîte mail** et sur mon **compte Google ou Apple** : ce sont eux qui protègent tout le reste.'));

add(gap(170));
add(P('**Dans le simulateur… et en vrai**', { color: C.teal, size: 23, after: 70, keepNext: true }));
add(grid(['Dans le simulateur', 'En vrai', 'Dans le simulateur', 'En vrai'], [
  ['Fiscalis', 'impots.gouv.fr', 'NumérID', 'L\'Identité Numérique La Poste'],
  ['Santéa', 'ameli.fr', 'CartID', 'France Identité'],
  ['IdentiPass', 'FranceConnect', 'FormaCompte', 'Mon Compte Formation'],
  ['IdentiPass+', 'FranceConnect+', 'Aidants Relais', 'Aidants Connect']
], [2300, 2916, 2300, 2916], { size: 19 }));
add(P('Tous les sites du simulateur sont inventés. Ils reproduisent les difficultés des vrais sites, pas leur apparence.', { size: 18, italics: true, before: 60, after: 0 }));

// ---------- Page 2 ----------
add(pageBreak());
add(H(3, 'Me connecter avec mon propre compte'), gap(80));
add(P('Exemple : **impots.gouv.fr**. Dans le simulateur, c\'était **Fiscalis**. Le bouton de connexion est petit, **en haut à droite**.', { after: 40 }));
add(picture('captures/03_impots_bandeau_bouton_connexion.png', PX, { after: 60 }));
add(cols(
  [picture('captures/01_impots_page_connexion.png', 262, { before: 0, after: 0 })],
  [picture('captures/02_impots_ou_trouver_numero_fiscal.png', 285, { before: 0, after: 70, left: true }),
    box([P('**3 pièges vécus avec Martine**', { color: C.or, after: 50 }),
      bullet('**Les bons papiers.** Le dernier avis, à mon nom. Pas celui de l\'an dernier, pas celui du conjoint.', { size: 19 }),
      bullet('**Le nom de naissance**, pas le nom d\'usage.', { size: 19 }),
      bullet('**Le mail de confirmation n\'arrive pas ?** Je regarde dans les **Indésirables**.', { size: 19 })], C.orL, C.or, W - 4300 - 200)],
  4300));
add(legend('Captures d\'impots.gouv.fr : l\'en-tête du site, la page de connexion (avec le bouton FranceConnect, partie 4) et l\'aide « Où trouver votre numéro fiscal ? ».'));

add(gap(130));
add(H(4, 'FranceConnect : une porte, plusieurs clés'), gap(90));
add(P('FranceConnect n\'est **pas un compte de plus**. C\'est une **porte d\'entrée** commune à de très nombreux sites publics. Je l\'ouvre avec **un compte que j\'ai déjà** : c\'est ma clé. Dans le simulateur, c\'était **IdentiPass**.', { after: 60 }));
add(picture('captures/04_franceconnect_comment_utiliser_4_etapes.png', PX, { after: 20 }));
add(legend('Capture de franceconnect.gouv.fr : les 4 étapes.'));
// ---------- Page 3 ----------
add(pageBreak());
add(cols(
  [picture('captures/05_franceconnect_choix_du_compte.png', 318, { before: 0, after: 20 }), legend('Capture : le choix du compte.')],
  [P('**Les clés acceptées**', { color: C.teal, after: 50 }),
    bullet('3 **comptes à mot de passe** : impots.gouv.fr, ameli.fr, MSA.'),
    bullet('3 **identités numériques** : L\'Identité Numérique La Poste, France Identité, TrustMe.'),
    bullet('L\'Appli carte Vitale est en test (« BETA »).'),
    P('**À remarquer**', { color: C.teal, before: 80, after: 50 }),
    bullet('Un site peut refuser une clé. Exemple réel : **ameli n\'accepte pas le compte des impôts**.'),
    bullet('Avant d\'entrer, FranceConnect affiche **les informations transmises** au site. Je vérifie que ce sont les miennes.'),
    bullet('En bas : **Aidants Connect**, réservé aux aidants professionnels (partie 6).')],
  4900));
add(gap(60));
add(picture('captures/06_ameli_connexion_depuis_franceconnect.png', 500, { after: 20 }));
add(legend('Capture : j\'ai choisi ameli. C\'est ameli qui me demande mes identifiants. Le logo FranceConnect est en haut à droite.'));
add(box([P('**La limite.** Avec un compte impôts ou ameli, la clé est un **mot de passe**. Si quelqu\'un le connaît, il passe la porte **à ma place**.', { size: 21, after: 20 })], C.rougeL, C.rouge));

// ---------- Partie 5 (suite de la page 2, puis page 3) ----------
add(gap(150));
add(H(5, 'FranceConnect+ : la porte blindée'), gap(90));
add(P('Pour les démarches qui touchent à **l\'argent**, à **la santé** ou au **vote**, un mot de passe ne suffit plus. Dans le simulateur, c\'était **IdentiPass+**, pour s\'inscrire à une formation.', { after: 80 }));
add(tiles([
  { t: '🎓', l: ['**Formation**', '(CPF)'] }, { t: '🏠', l: ['**MaPrimeRénov\'**', 'aides aux travaux'] }, { t: '🩺', l: ['**Dossier médical**', 'sur ameli'] },
  { t: '✉️', l: ['**Lettre recommandée**', 'électronique'] }, { t: '🗳️', l: ['**Procuration de vote**', 'en ligne'] }, { t: '🏢', l: ['**Entreprises**', 'guichet unique'] }
], { size: 17, tsize: 26, center: true }));
add(P('Exemple : depuis 2022, il faut FranceConnect+ pour s\'inscrire à une formation avec son compte formation (CPF). C\'est une protection contre les arnaques.', { size: 19, before: 80, after: 0 }));
add(picture('images/schema-portes.png', PX, { before: 110, after: 0 }));
add(pageBreak());
add(picture('captures/07_franceconnect_plus_6_etapes.png', 640, { before: 0, after: 20 }));
add(legend('Capture de franceconnect.gouv.fr : avec FranceConnect+, 2 comptes seulement, et tout se confirme **sur le téléphone**.'));
add(P('**Compte ou identité numérique ?**', { color: C.teal, size: 23, before: 40, after: 70, keepNext: true }));
add(grid(['', 'Compte impots / ameli', 'L\'Identité Numérique La Poste', 'France Identité'], [
  ['Ce qu\'il prouve', 'J\'ai reçu un courrier', 'Ma pièce d\'identité a été contrôlée', 'Ma carte d\'identité a été lue et certifiée'],
  ['Pour l\'obtenir', 'Numéro reçu par courrier + mot de passe', 'Application + pièce d\'identité, vérifiée en ligne ou au bureau de poste', 'Application + nouvelle carte d\'identité (puce lue par le téléphone) + certification en mairie pour FranceConnect+'],
  ['Il faut avoir', 'Une adresse mail', 'Être majeur, un smartphone, un numéro de mobile', 'Être majeur, un smartphone qui lit les puces (NFC), la carte au format carte bancaire'],
  ['Pour se connecter', 'Mot de passe + code par mail', 'Confirmation dans l\'application + code secret', 'Confirmation dans l\'application (code ou empreinte)'],
  ['FranceConnect', '✔ oui', '✔ oui', '✔ oui'],
  ['FranceConnect+', '✘ non', '✔ oui', '✔ oui']
], [1700, 2500, 3000, W - 7200], { size: 19 }));
add(gap(110));
add(box([P('**À retenir**', { color: C.or, after: 60 }),
  bullet('L\'identité numérique est **sur le téléphone de la personne**. Personne d\'autre ne peut l\'utiliser à sa place, **même pour l\'aider**.'),
  bullet('Il faut être **majeur** : vous ne pouvez pas encore créer la vôtre. C\'est aussi pour cela que vous avez joué Martine.'),
  bullet('Ces sites et ces applications officiels sont **gratuits**.')]));

// ---------- Page 5 ----------
add(pageBreak());
add(H(6, 'Les bons réflexes'), gap(90));
add(P('**Reconnaître un faux mail**', { color: C.teal, size: 23, after: 40, keepNext: true }));
add(picture('images/faux-mail.png', 660, { before: 0, after: 100 }));
add(tiles([
  { t: 'Mot de passe oublié ?', l: ['Je clique sur **« Mot de passe oublié »**. C\'est prévu pour ça, et c\'est sans risque.'] },
  { t: 'Un mail qui me presse ?', l: ['Je **ne clique pas**. Je vais sur le site en tapant moi-même son adresse.'] },
  { t: 'Une demande sur mon téléphone ?', l: ['Je lis **quel site** demande. Je n\'ai rien demandé : **je refuse**.'] }
], { size: 19, tsize: 21 }));
add(gap(80));
add(tiles([
  { t: 'JAMAIS donnés à quelqu\'un', color: C.rouge, fill: C.rougeL, l: ['Mon **mot de passe**, un **code reçu**, mon **code secret**. Ni par téléphone, ni par mail, ni à un proche. Aucun service officiel ne les demande.'] },
  { t: 'Une démarche payante ?', color: C.rouge, fill: C.rougeL, l: ['Les sites officiels sont **gratuits** et finissent par **.gouv.fr**. Je me méfie des liens « Sponsorisé ».'] },
  { t: 'Un démarchage ?', color: C.rouge, fill: C.rougeL, l: ['Appel ou SMS pour « mes droits formation » : c\'est **interdit**. Je raccroche.'] }
], { size: 19, tsize: 21 }));
add(gap(110));
add(cols([box([P('**Quand j\'aide quelqu\'un : je fais AVEC, pas À LA PLACE.**', { color: C.teal, size: 23, after: 60 }),
  bullet('La personne tape **elle-même** son mot de passe et son code secret. Je ne les connais pas, je ne les note pas.'),
  bullet('Son identité numérique reste **sur son téléphone**, dans sa main.'),
  bullet('Les aidants professionnels ont un outil : **Aidants Connect**. La personne signe un mandat, et l\'aidant fait la démarche **sans jamais utiliser ses mots de passe**.'),
  P('→ Nous y reviendrons le 1er décembre : « Accompagner un tiers ».', { size: 19, italics: true, after: 10 })], C.tealL, C.teal, W - 2500 - 200)],
  [picture('images/telephone.png', 150, { before: 0, after: 0 })], W - 2500 - 200));
add(gap(120));
add(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W - 3400, 3400], rows: [new TableRow({ children: [
  new TableCell({ width: { size: W - 3400, type: WidthType.DXA }, borders: noB, verticalAlign: VerticalAlign.CENTER, children: [P('**Mon code de fin** (affiché à la fin du simulateur) :', { align: AlignmentType.RIGHT, after: 0 })] }),
  new TableCell({ width: { size: 3400, type: WidthType.DXA }, borders: { top: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, bottom: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, left: { style: BorderStyle.SINGLE, size: 12, color: C.teal }, right: { style: BorderStyle.SINGLE, size: 12, color: C.teal } }, margins: { top: 120, bottom: 120, left: 100, right: 100 },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '__ __ __ __ __', font: 'Courier New', size: 24, color: '777777' })] })] })] })] }));

const doc = new Document({
  creator: 'TIM', title: 'Mon identité numérique',
  styles: { default: { document: { run: { font: FONT, size: 21 } } } },
  numbering: { config: [{ reference: 'puces', levels: [{ level: 0, format: D.LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 200 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 680, bottom: 800, left: 737, right: 737, footer: 380 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mon identité numérique · 1re SAPAT · Les captures montrent les vrais sites ; les sites du simulateur sont inventés. · ', size: 15, color: '777777', font: FONT }), new TextRun({ children: [PageNumber.CURRENT], size: 15, color: '777777', font: FONT })] })] }) },
    children: body }]
});
Packer.toBuffer(doc).then(b => { const out = path.join(__dirname, 'cours-identite-numerique.docx'); fs.writeFileSync(out, b); console.log('OK', out, Math.round(b.length / 1024) + ' Ko'); });
