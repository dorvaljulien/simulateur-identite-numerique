/* =====================================================================
   SERVICES FICTIFS DE L'ÉVALUATION : adresses, couleurs, icônes, logos
   ---------------------------------------------------------------------
   Les NOMS et les ADRESSES se changent dans noms-services.js, à la racine
   du dépôt (commun au simulateur et à l'évaluation), PAS ICI : au moment de
   node build.js, chaque nom d'origine écrit ci-dessous est remplacé par le
   nouveau nom choisi là-bas.

   Ici, on peut changer : `couleur` et `lettre` des petites icônes (sans
   `lettre`, c'est la première lettre du nom), `slogan`, `description`.
   Pour mettre un vrai LOGO (image) : dossier logos/ (voir logos/LISEZMOI.md).

   Ne pas changer les clés (trouvo, habitatAdapt…) : le code, l'export
   des copies et le corrigé s'en servent.

   Les correspondances avec les vrais services NE SONT PAS ici (ce sont
   des réponses) : voir le corrigé. Seule exception : `enVrai` d'IdentiPass+,
   affiché volontairement aux élèves.
   Après toute modification : node build.js
   ===================================================================== */
const SERVICES = {
  trouvo: {
    nom: 'Trouvo', domaine: 'trouvo.sim', couleur: '#e8590c',
    // couleurs des lettres du logo dessiné (une par lettre, reprises en boucle)
    couleursLogo: ['#e8590c', '#0c8599', '#e8590c', '#5c940d', '#0c8599', '#862e9c']
  },
  habitatAdapt: {
    nom: 'HabitatAdapt', domaine: 'habitat-adapt.gouv.sim', couleur: '#24506b',
    slogan: 'Adapter son logement pour bien vieillir',
    prefixeDossier: 'HA'          // numéro de demande : HA-12345
  },
  identipassPlus: {
    nom: 'IdentiPass+', nomHtml: 'IdentiPass<sup>+</sup>', domaine: 'identipass.sim', lettre: '🔑', couleur: '#2b3440',
    slogan: 'La connexion renforcée aux services publics',
    enVrai: 'FranceConnect+'      // affiché aux élèves
  },
  identipass: {                   // version « simple » (la demande pirate passe par là)
    nom: 'IdentiPass', domaine: 'identipass.sim', lettre: '🔑', couleur: '#2b3440'
  },
  numerid: { nom: 'NumérID', lettre: 'ID', couleur: '#00787a', description: 'identité numérique' },
  cartid: { nom: 'CartID', couleur: '#7a3f8f', description: 'identité numérique avec carte d\'identité' },
  fiscalis: { nom: 'Fiscalis', couleur: '#1f4e79' },
  santea: { nom: 'Santéa', couleur: '#0b7a75' },
  adaptSenior: {                  // intermédiaire payant (résultat sponsorisé)
    nom: 'Adapt\'Senior Dossier', domaine: 'adapt-senior-dossier.fr',
    couleur: '#0f6e5e', lettreResultat: '⓪', couleurResultat: '#999'
  },
  maisonConfort: { nom: 'Maison & Confort', domaine: 'maison-confort-blog.fr', couleur: '#c2410c' },
  forumSeniors: { nom: 'Forum Seniors Bretagne', domaine: 'forum-seniors-bzh.fr', couleur: '#5b7a3a' }
};

/* ---------- Outils (rien à modifier en dessous) ---------- */
const SV = SERVICES;
// Images ajoutées par build.js depuis le dossier logos/ (objet vide s'il n'y en a pas)
const LOGOS = (typeof LOGOS_IMAGES !== 'undefined') ? LOGOS_IMAGES : {};

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Première lettre d'un nom */
function initiale(n) { const m = String(n).match(/[\p{L}\p{N}]/u); return m ? m[0].toUpperCase() : '?'; }
/* Nom affiché (texte brut) / mis en forme (HTML) */
function nom(cle) { return SV[cle].nom; }
function nomHtml(cle) { return SV[cle].nomHtml || esc(SV[cle].nom); }
/* Remplace {cle} par le nom du service dans un texte de CONFIG : « un compte {fiscalis} » */
function nommer(t) { return String(t).replace(/\{(\w+)\}/g, (m, k) => SV[k] ? SV[k].nom : m); }

/* Logo « en grand » (en-tête de site) : image du dossier logos/ si elle existe, sinon le logo dessiné */
function logo(cle, dessine, hauteur) {
  const img = LOGOS[cle];
  return img ? `<img class="logo-img" src="${img}" alt="${esc(nom(cle))}" style="height:${hauteur || 32}px">` : dessine;
}
/* Contenu d'une petite icône carrée (onglet, appli, pastille) : image <cle>-icone, sinon image <cle>, sinon la lettre */
function iconeContenu(cle, lettre) {
  const img = LOGOS[cle + '-icone'] || LOGOS[cle];
  return img ? `<img class="ico-img" src="${img}" alt="">` : esc(lettre != null ? lettre : (SV[cle].lettre || initiale(SV[cle].nom)));
}
/* Fond de cette icône : blanc s'il y a une image */
function iconeFond(cle, couleur) { return (LOGOS[cle + '-icone'] || LOGOS[cle]) ? '#fff' : (couleur || SV[cle].couleur); }
/* Favicon d'onglet : [fond, contenu HTML] */
function favicon(cle) { return [iconeFond(cle), iconeContenu(cle)]; }
