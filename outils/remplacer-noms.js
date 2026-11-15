// Remplace, dans le code assemblé, les noms et adresses d'origine des services
// inventés par ceux choisis dans noms-services.js. Utilisé par les deux build.js.
const path = require('path');

const LETTRE = '\\p{L}\\p{N}_';
const motCle = s => sansAccents(s).toUpperCase().replace(/[\s\-'’.]/g, '');
const echapRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sansAccents = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

function charger() {
  const f = path.join(__dirname, '..', 'noms-services.js');
  delete require.cache[require.resolve(f)];
  return require(f);
}

function verifier(cfg) {
  const erreurs = [];
  for (const [ancien, nouveau] of Object.entries(cfg.noms)) {
    if (!nouveau || !String(nouveau).trim()) erreurs.push(`nom vide pour « ${ancien} »`);
    else if (/["`\\$<>]/.test(nouveau)) erreurs.push(`« ${nouveau} » contient un caractère interdit (" \` \\ $ < >)`);
  }
  for (const [ancien, nouveau] of Object.entries(cfg.adresses)) {
    if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(nouveau || '')) erreurs.push(`adresse « ${nouveau} » (pour ${ancien}) : minuscules sans accent, chiffres, points et tirets seulement`);
  }
  if (erreurs.length) { console.error('Erreur dans noms-services.js :\n - ' + erreurs.join('\n - ')); process.exit(1); }
}

/* Paires [texte d'origine, remplacement], variantes en majuscules comprises */
function paires(cfg) {
  const noms = new Map();
  const ajouter = (a, n) => { if (a && !noms.has(a)) noms.set(a, n); };
  for (const [a, n0] of Object.entries(cfg.noms)) {
    const n = String(n0).trim().replace(/'/g, '’');
    ajouter(a, n);
    // MAJUSCULES : avec accents si l'original en a (« SANTÉA »)…
    const A = a.toLocaleUpperCase('fr');
    if (A !== sansAccents(A)) ajouter(A, n.toLocaleUpperCase('fr'));
    // … sinon forme « mot-clé » du moteur de recherche (même règle que norm() du simulateur :
    // sans accent, sans espace, tiret, point ni apostrophe) : FISCALIS, SANTEA, IDENTIPASS
    ajouter(motCle(a), motCle(n));
  }
  return { noms, adresses: new Map(Object.entries(cfg.adresses)) };
}

function creer() {
  const cfg = charger(); verifier(cfg);
  const { noms, adresses } = paires(cfg);
  const change = [...noms].some(([a, n]) => a.replace(/'/g, '’') !== n) || [...adresses].some(([a, n]) => a !== n);
  // Noms : mot entier ; une apostrophe du nom peut être écrite ' ou \' (chaîne JS) ou ’
  const motifNom = a => echapRe(a).replace(/'/g, "(?:\\\\'|'|’)");
  const triees = m => [...m.keys()].sort((x, y) => y.length - x.length);
  const reNoms = new RegExp(`(?<![${LETTRE}])(${triees(noms).map(motifNom).join('|')})(?![${LETTRE}])`, 'gu');
  const reAdr = new RegExp(`(?<![${LETTRE}.-])(${triees(adresses).map(echapRe).join('|')})(?![${LETTRE}-])`, 'gu');
  const cleNom = new Map([...noms].map(([a, n]) => [a.replace(/'/g, '’'), n]));
  return {
    change,
    remplacer(code) {
      if (!change) return code;
      code = code.replace(reAdr, m => adresses.get(m));
      return code.replace(reNoms, m => cleNom.get(m.replace(/\\'|'/g, '’')));
    }
  };
}

module.exports = { creer };
