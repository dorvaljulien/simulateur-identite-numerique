/* =====================================================================
   LOGOS DES SERVICES INVENTÉS
   Images facultatives : dossier logos/ à la racine (voir logos/LISEZMOI.md),
   intégrées par build.js. Sans image, on garde les logos dessinés en CSS.
   Les NOMS se changent dans noms-services.js (racine), pas ici.
   Clés : fiscalis, santea, identipass, numerid, cartid, formacompte, agrimut,
   idnomade, trouvo, maboite, aideDemarches, infoPratique.
   ===================================================================== */
const LOGOS = (typeof LOGOS_IMAGES !== 'undefined') ? LOGOS_IMAGES : {};

/* Première lettre d'un nom (pastilles) : suit le nom choisi dans noms-services.js */
function initiale(nom) { const m = String(nom).match(/[\p{L}\p{N}]/u); return m ? m[0].toUpperCase() : '?'; }

/* Logo « en grand » : image logos/<clé>.png si elle existe, sinon le logo dessiné */
function logo(cle, dessine, hauteur) {
  const img = LOGOS[cle];
  return img ? `<img class="logo-img" src="${img}" alt="" style="height:${hauteur || 36}px;width:auto;max-width:280px;object-fit:contain;display:block">` : dessine;
}
/* Petite icône carrée (onglet, pastille, résultat de recherche) : image <clé>-icone, sinon <clé>, sinon la lettre */
function iconeImg(cle) { return LOGOS[cle + '-icone'] || LOGOS[cle]; }
function iconeContenu(cle, lettre) { const img = iconeImg(cle); return img ? `<img src="${img}" alt="" style="width:100%;height:100%;object-fit:contain;display:block">` : lettre; }
function iconeFond(cle, couleur) { return iconeImg(cle) ? '#fff' : couleur; }
/* [fond, contenu] pour les favicons et pastilles */
function ico(cle, couleur, lettre) { return [iconeFond(cle, couleur), iconeContenu(cle, lettre)]; }
function favIco(cle, couleur, lettre) { return { bg: iconeFond(cle, couleur), t: iconeContenu(cle, lettre) }; }
/* Sigle d'un nom de plusieurs mots : « Aide Démarches Express » → ADE */
function sigle(nom) { return (String(nom).match(/[\p{L}\p{N}]+/gu) || []).map(w => w[0].toUpperCase()).join('').slice(0, 4) || '?'; }
/* Logo en deux couleurs coupé à la dernière majuscule : « MaBoîte » → Ma + Boîte */
function deuxTons(nom) {
  const s = String(nom); let i = -1;
  for (let k = s.length - 1; k > 0; k--) if (/\p{Lu}/u.test(s[k]) && /\p{Ll}/u.test(s[k - 1])) { i = k; break; }
  return i < 0 ? `<span>${s}</span>` : `${s.slice(0, i)}<span>${s.slice(i)}</span>`;
}
/* Logo du moteur de recherche : une couleur par lettre */
const COULEURS_TROUVO = ['#e8590c', '#0c8599', '#e8590c', '#5c940d', '#0c8599', '#862e9c'];
function lettresCouleurs(nom) { return [...String(nom)].map((c, i) => `<span style="color:${COULEURS_TROUVO[i % COULEURS_TROUVO.length]}">${c}</span>`).join(''); }
