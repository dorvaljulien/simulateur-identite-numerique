/* =====================================================================
   PARTIE 2D — SIMULATEUR IdentiPass+
   Navigateur fictif (Trouvo, HabitatAdapt, IdentiPass+, intermédiaire)
   + téléphone (NumérID, SMS, appels) + journal des clics.
   Les correspondances avec les vrais services sont dans le corrigé.
   Aucune aide pédagogique n'est affichée.
   ===================================================================== */
const P = CONFIG.personnage;
const SC = CONFIG.simulateur;
const L = (cible, cat) => `data-log="${cible}|${cat}"`;
let simTimers = [];
let bannerTimer = null;

function S() { return E.sim; }
function F() { return E.sim.f; }
function later(fn, sec) { const id = setTimeout(() => { simTimers = simTimers.filter(x => x !== id); if (E && E.sim && E.reponses['2D'].etape === 'sim') fn(); }, sec * 1000); simTimers.push(id); }
function clearSimTimers() { simTimers.forEach(clearTimeout); simTimers = []; }

/* ---------- État initial du simulateur ---------- */
function nouvelEtatSim() {
  return {
    tAcc: 0, url: 'trouvo.sim', hist: ['trouvo.sim'], histIdx: 0,
    ph: { ecran: 'home', notifs: [], sms: [], reqs: [], appels: [], pin: null, call: null, essaisFaux: 0, bloqueJusqua: 0, web: null, nid: 0 },
    f: {
      rechercheLancee: false, resultatSponsoriseClique: false, intermediairePaye: false, siteOfficielAtteint: false, siteOfficielAvantPaiement: null,
      ancienIdentifiantEssais: 0, cartidEssais: 0, numeridChoisi: false, essaisRatesAvantNumerid: null,
      codesFaux: 0, blocagesNumerid: 0, authOk: false, session: false, consentement: false,
      pirate: { programmee: false, envoyee: false, etat: null, codeSaisi: false },
      depot: false, numeroDossier: null, numeroFiscalSaisi: null, numeroFiscalCorrect: null,
      incidents: { index: 0, appel: null, appelRefus: 0, smsCodeRecu: false, smsFrais: { recu: false, lienClique: false, paye: false } },
      deconnecte: false, deconnexionApresDepot: false, finDemarche: null
    },
    ev: [], cpt: { utile: 0, piege: 0, 'sans-objet': 0, neutre: 0 }
  };
}
function simTick(dt) {
  if (E && E.sim && E.partie === '2D' && E.reponses['2D'].etape === 'sim') {
    E.sim.tAcc += dt;
    majHorloge();
    const ph = E.sim.ph;
    if (ph.bloqueJusqua && E.sim.tAcc >= ph.bloqueJusqua) { ph.bloqueJusqua = 0; if (ph.ecran === 'numerid') renderPhone(); }
  }
}

/* ---------- Journal ---------- */
function journal(zone, cible, categorie, detail) {
  const s = S(); const e = { t: hhmmss(s.tAcc), zone, cible, categorie };
  if (detail) e.detail = detail;
  s.ev.push(e); sauver();
}
function journalClic(zone, cible, categorie) { const s = S(); if (s.cpt[categorie] != null) s.cpt[categorie]++; journal(zone, cible, categorie); }

function exportSimulateur() {
  const s = E.sim, f = s.f;
  return {
    dureeSimulateur: Math.round(s.tAcc),
    compteurs: { clicsUtiles: s.cpt.utile, clicsPieges: s.cpt.piege, clicsSansObjet: s.cpt['sans-objet'], clicsNeutres: s.cpt.neutre,
      clicsTotal: s.cpt.utile + s.cpt.piege + s.cpt['sans-objet'] + s.cpt.neutre },
    resultats: {
      rechercheLancee: f.rechercheLancee,
      resultatSponsoriseClique: f.resultatSponsoriseClique, intermediairePaye: f.intermediairePaye,
      siteOfficielAtteint: f.siteOfficielAtteint, siteOfficielAtteintSansPayer: f.siteOfficielAtteint && !f.intermediairePaye,
      ancienIdentifiantEssais: f.ancienIdentifiantEssais, cartidEssais: f.cartidEssais,
      numeridChoisi: f.numeridChoisi, essaisRatesAvantNumerid: f.essaisRatesAvantNumerid,
      codesNumeridFaux: f.codesFaux, blocagesNumerid: f.blocagesNumerid,
      connexionIdentiPassPlusReussie: f.authOk || f.session || f.depot, consentementAccepte: f.consentement,
      demandePirate: { service: V().sim.servicePirate, envoyee: f.pirate.envoyee, reponse: f.pirate.envoyee ? (f.pirate.etat || 'ignoree') : 'non-envoyee', confirmeeAuMoinsUneFois: !!f.pirate.confirmeeAuMoinsUneFois, codeSaisiApresConfirmation: f.pirate.codeSaisi },
      demandeDeposee: f.depot, numeroDossier: f.numeroDossier, numeroFiscalSaisi: f.numeroFiscalSaisi, numeroFiscalCorrect: f.numeroFiscalCorrect,
      ordreIncidents: V().sim.ordreIncidents,
      appelFauxConseiller: f.incidents.appel || (f.depot ? 'non-survenu' : 'non-survenu (demande non deposee)'),
      appelRefus: f.incidents.appelRefus,
      smsFrais: f.incidents.smsFrais,
      deconnexion: f.deconnecte, deconnexionApresDepot: f.deconnexionApresDepot,
      finDemarche: f.finDemarche
    },
    evenements: s.ev
  };
}

/* ---------- Carte personnage ---------- */
function carteHtml() {
  return `<div class="idcard"><div class="photo">👵</div><div>
    <h3>${P.civilite} ${P.prenom} ${P.nom.toUpperCase()}</h3><div class="sub">${P.age} ans — vit seule à ${P.ville} (Bretagne)</div>
    <table>
      <tr><td>Née le</td><td>${P.naissance}</td></tr>
      <tr><td>Adresse</td><td>${P.adresse}, ${P.cp} ${P.ville}</td></tr>
      <tr><td>Téléphone</td><td>${P.telephone}</td></tr>
      <tr><td>Numéro fiscal</td><td><code>${P.numeroFiscal}</code></td></tr>
      <tr><td>Compte Fiscalis</td><td>identifiant : numéro fiscal<br>mot de passe : <code>${P.fiscalis.motDePasse}</code></td></tr>
      <tr><td>Compte Santéa</td><td>identifiant : <code>${P.santea.identifiant}</code><br>mot de passe : <code>${P.santea.motDePasse}</code></td></tr>
      <tr><td>NumérID</td><td>identité numérique installée sur <b>son</b> téléphone (${P.numerid.verifiee})<br>code secret : <code>${P.numerid.codeSecret}</code></td></tr>
      <tr><td>Carte d'identité</td><td>${P.carteIdentite}</td></tr>
    </table></div></div>
    <div class="postit">${P.proches.join('<br>')}</div>`;
}
function ouvrirCarte() {
  const o = document.createElement('div'); o.className = 'overlay';
  o.innerHTML = `<div class="modal carte"><div class="mh"><h2>🪪 Ma carte — qui suis-je ?</h2><span class="close">✕</span></div><div class="mb">${carteHtml()}</div></div>`;
  o.addEventListener('click', e => { if (e.target === o || e.target.closest('.close')) o.remove(); });
  document.body.appendChild(o);
}

const MISSION = 'Mme Prigent veut demander l\'aide de l\'État pour remplacer sa baignoire par une douche de plain-pied. Vous jouez Mme Prigent : elle fait la démarche elle-même, sur son ordinateur et son téléphone.';

/* =====================================================================
   RENDU DE LA PARTIE 2D
   ===================================================================== */
RENDUS['2D'] = main => {
  const R = E.reponses['2D'];
  if (R.etape === 'prediction') return renderPrediction(main);
  if (R.etape === 'sim') return renderSim(main);
  return renderQuestionsFin(main);
};

function renderPrediction(main) {
  const R = E.reponses['2D'];
  main.innerHTML = `<div class="page"><h1>Une démarche avec IdentiPass+</h1>
    <div class="mission"><b>Mission.</b> ${MISSION}</div>
    <div class="pred"><div class="carteinline">${carteHtml()}</div><div>
      <div class="consigne" style="margin-top:0"><b>Avant de commencer.</b> Pour cette démarche, il faudra se connecter avec <b>IdentiPass+</b>. Regardez la carte de Mme Prigent.<br><b>Quel compte va fonctionner ? Pourquoi les autres non ?</b></div>
      <textarea rows="8" id="pred"></textarea>
      <p style="font-size:13px;color:#666">Votre prédiction sera verrouillée, puis le simulateur s'ouvrira. La carte de Mme Prigent restera disponible avec le bouton « Ma carte ».</p>
      <button class="btn" id="btnpred">Valider ma prédiction et ouvrir le simulateur</button></div></div></div>`;
  lier($('#pred', main), () => R.prediction, x => R.prediction = x);
  $('#btnpred', main).onclick = async () => {
    const vide = !R.prediction.trim();
    if (!await confirmer('Valider la prédiction ?', (vide ? '<p style="color:#8a4b00"><b>Attention : votre prédiction est vide.</b></p>' : '') + '<p>Vous ne pourrez plus la modifier.</p>', 'Valider', 'Revenir')) return;
    R.predictionValidee = true; R.etape = 'sim';
    E.sim = nouvelEtatSim(); E.sim.tDebut2D = Math.round(E.durees['2D']);
    sauver(); afficherPartie();
  };
}

function renderQuestionsFin(main) {
  const v = V().sim, Q = E.reponses['2D'].questionsFin;
  main.innerHTML = `<div class="page"><h1>Questions de fin</h1>
    <div class="consigne">Le simulateur est terminé. Répondez avec vos mots.</div>
    <div class="sit"><h2>Question 1</h2><div class="dit"><span class="av">💬</span><span>${h(v.q1)}</span></div><textarea rows="4" data-k="q1"></textarea></div>
    <div class="sit"><h2>Question 2</h2><div class="dit"><span class="av">💬</span><span>${h(v.q2)}</span></div><textarea rows="4" data-k="q2"></textarea></div>
    <div class="sit"><h2>Question 3</h2><p style="margin:0 0 8px">En vrai, comment s'appellent ces services ?</p>
      <div style="display:grid;grid-template-columns:150px 1fr;gap:8px;align-items:center">
      <b>IdentiPass+</b><input class="txt" data-k="q3IdentiPassPlus" maxlength="80"><b>NumérID</b><input class="txt" data-k="q3NumerID" maxlength="80"><b>CartID</b><input class="txt" data-k="q3CartID" maxlength="80"></div></div></div>`;
  $$('[data-k]', main).forEach(el => lier(el, () => Q[el.dataset.k], x => Q[el.dataset.k] = x));
  footbar('', null, () => $$('[data-k]', main).filter(el => !el.value.trim()).length);
}

/* ---------- Coque du simulateur ---------- */
function renderSim(main) {
  main.className = 'sim';
  main.innerHTML = `<div id="sim">
    <div id="simbar"><span class="mtx"><b>Mission :</b>${h(MISSION)}</span>
      <button ${L('ma-carte', 'neutre')} data-act="carte">🪪 Ma carte</button>
      <button class="end" ${L('j-ai-termine', 'neutre')} data-act="terminer">J'ai terminé la démarche</button></div>
    <div id="simmain">
      <div id="browser">
        <div id="tabstrip"><div class="btab"><span class="fav" id="tabfav"></span><span class="ttl" id="tabttl"></span></div>
          <span class="tbtn" style="width:24px;height:24px;font-size:16px" ${L('nouvel-onglet', 'sans-objet')}>+</span></div>
        <div id="toolbar">
          <button class="tbtn" id="btnback" ${L('navigateur-precedent', 'neutre')} data-act="back">←</button>
          <button class="tbtn" id="btnfwd" ${L('navigateur-suivant', 'neutre')} data-act="fwd">→</button>
          <button class="tbtn" ${L('navigateur-actualiser', 'neutre')} data-act="reload">⟳</button>
          <div id="omnibox"><span class="secure">🔒</span><span id="urlbar"></span><span ${L('favori', 'sans-objet')} style="color:#5f6368">☆</span></div>
          <button class="tbtn" ${L('telechargements', 'sans-objet')}>⤓</button>
          <button class="tbtn" ${L('profil-navigateur', 'sans-objet')}>👤</button>
          <button class="tbtn" ${L('menu-navigateur', 'sans-objet')}>⋮</button>
        </div>
        <div id="viewport"></div><div id="loadingbar"></div>
      </div>
      <div id="phonecol"><div id="phone"><div class="scr" id="phscr"></div></div></div>
    </div></div>`;
  const sim = $('#sim', main);
  sim.addEventListener('click', onSimClick);
  sim.addEventListener('submit', e => e.preventDefault());
  reprendreSim();
  renderBrowser(); renderPhone();
}

/* Remet les minuteurs en route (début, ou reprise après rechargement) */
function reprendreSim() {
  clearSimTimers();
  const s = S(), f = s.f, ph = s.ph;
  ph.pin = null; ph.web = ph.web || null;
  if (ph.call && ph.call.etape !== 'fin') { ph.call.etape = 'ring'; programmerSonnerieMax(); }
  if (ph.call && ph.call.etape === 'fin') ph.call = null;
  if (f.pirate.programmee && !f.pirate.envoyee) later(envoyerPirate, SC.delaiDemandePirate);
  if (f.depot && !ph.call) programmerIncidentSuivant();
  const u = parse(s.url);
  if (u.host === 'identipass.sim' && u.path === '/plus/consentement' && !f.authOk) s.url = 'identipass.sim/plus?service=habitatadapt';
}

/* ---------- Clics ---------- */
function onSimClick(e) {
  const lg = e.target.closest('[data-log]');
  if (lg) {
    const [cible, cat] = lg.dataset.log.split('|');
    const zone = lg.closest('#phone') ? 'telephone' : lg.closest('#simbar') ? 'barre' : 'navigateur';
    journalClic(zone, cible, cat);
  }
  const go = e.target.closest('[data-go]');
  if (go) { navigate(go.dataset.go); return; }
  const act = e.target.closest('[data-act]');
  if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act](act);
}

const ACTIONS = {
  carte: () => ouvrirCarte(),
  terminer: () => terminerDemarche(),
  back: () => { const s = S(); if (s.histIdx > 0) { s.histIdx--; s.url = s.hist[s.histIdx]; renderBrowser(true); } },
  fwd: () => { const s = S(); if (s.histIdx < s.hist.length - 1) { s.histIdx++; s.url = s.hist[s.histIdx]; renderBrowser(true); } },
  reload: () => renderBrowser(true),
  /* Trouvo */
  rechercher: () => { F().rechercheLancee = true; navigate('trouvo.sim/recherche?q=' + encodeURIComponent('aide douche personne âgée')); },
  /* intermédiaire */
  payer49: () => { const f = F(); f.intermediairePaye = true; if (!f.siteOfficielAtteint) f.siteOfficielAvantPaiement = false; journal('navigateur', 'paiement-intermediaire-49', 'evenement', 'paiement de 49 € enregistré'); navigate('adapt-senior-dossier.fr/commande'); },
  /* HabitatAdapt */
  ancien: () => { const f = F(); f.ancienIdentifiantEssais++; navigate('habitat-adapt.gouv.sim/connexion?ancien=1', true); },
  envoyerDemande: () => envoyerDemande(),
  deconnexion: () => { const f = F(); f.session = false; f.authOk = false; f.deconnecte = true; if (f.depot) f.deconnexionApresDepot = true; journal('navigateur', 'deconnexion', 'evenement', f.depot ? 'après le dépôt' : 'avant le dépôt'); navigate('habitat-adapt.gouv.sim?deco=1'); },
  /* IdentiPass+ */
  choixNumerid: () => choisirNumerid(),
  choixCartid: () => { const f = F(); f.cartidEssais++; navigate('identipass.sim/plus?service=habitatadapt&msg=cartid', true); },
  consentOui: () => { const f = F(); if (!f.authOk) return navigate('identipass.sim/plus?service=habitatadapt'); f.consentement = true; f.session = true; journal('navigateur', 'connexion-habitatadapt', 'evenement', 'connectée via IdentiPass+'); navigate('habitat-adapt.gouv.sim/demande'); },
  consentNon: () => { F().authOk = false; navigate('habitat-adapt.gouv.sim/connexion'); },
  /* Téléphone */
  phHome: () => { const ph = S().ph; ph.ecran = 'home'; ph.web = null; renderPhone(); },
  phApp: el => { const ph = S().ph; ph.ecran = el.dataset.app; if (el.dataset.app === 'messages') ph.thread = null; renderPhone(); },
  phNotif: el => { const ph = S().ph; const n = ph.notifs.find(x => x.id === el.dataset.id); if (n) { n.lu = true; ph.ecran = n.app; if (n.app === 'messages') ph.thread = n.de; } hideBanner(); renderPhone(); },
  phThread: el => { const ph = S().ph; ph.thread = el.dataset.de; ph.sms.filter(m => m.de === ph.thread).forEach(m => m.lu = true); renderPhone(); },
  phThreadBack: () => { S().ph.thread = null; renderPhone(); },
  reqOui: el => demarrerPin(el.dataset.id),
  reqNon: el => repondreReq(el.dataset.id, 'refusee'),
  pinKey: el => saisirPin(el.dataset.k),
  pinAnnuler: () => { S().ph.pin = null; renderPhone(); },
  appelDecrocher: () => decrocher(),
  appelRefuser: () => refuserAppel(),
  appelChoix: el => finAppel(el.dataset.c),
  smsLien: el => { const f = F(); f.incidents.smsFrais.lienClique = true; const ph = S().ph; ph.web = el.dataset.url; ph.ecran = 'web'; renderPhone(); },
  payerFrais: () => { const f = F(); f.incidents.smsFrais.paye = true; journal('telephone', 'paiement-frais-sms', 'evenement', 'paiement des frais ' + V().sim.smsFrais.montant); S().ph.web = V().sim.smsFrais.domaine + '/ok'; renderPhone(); }
};

/* ---------- Fin de la démarche ---------- */
async function terminerDemarche() {
  const s = S(), f = s.f, ph = s.ph;
  if (ph.call && ph.call.etape !== 'fin') { toast(ph.call.etape === 'ring' ? 'Votre téléphone sonne.' : 'Vous êtes au téléphone.'); return; }
  if (f.depot && f.incidents.index < V().sim.ordreIncidents.length) {
    clearSimTimers(); if (f.pirate.programmee && !f.pirate.envoyee) envoyerPirate(); demarrerIncident(); toast('Votre téléphone vibre.'); return;
  }
  if (!await confirmer('Terminer la démarche ?', '<p>Vous allez passer aux questions de fin.</p><p><b>Vous ne pourrez plus revenir dans le simulateur.</b></p>', 'Passer aux questions', 'Revenir au simulateur')) return;
  f.finDemarche = { t: hhmmss(s.tAcc), demandeDeposee: f.depot };
  if (f.pirate.envoyee && !f.pirate.etat) journal('telephone', 'demande-pirate-ignoree', 'evenement', 'aucune réponse à la demande ' + V().sim.servicePirate);
  journal('barre', 'fin-demarche', 'evenement');
  clearSimTimers(); hideBanner();
  E.reponses['2D'].etape = 'questions'; sauver(); afficherPartie();
}

/* =====================================================================
   NAVIGATEUR
   ===================================================================== */
function parse(url) {
  const [hp, q = ''] = url.split('?'); const i = hp.indexOf('/');
  const host = i < 0 ? hp : hp.slice(0, i), path = i < 0 ? '/' : hp.slice(i) || '/';
  const params = {}; q.split('&').filter(Boolean).forEach(kv => { const [k, v = ''] = kv.split('='); params[decodeURIComponent(k)] = decodeURIComponent(v); });
  return { host, path, params };
}
function navigate(url, replace) {
  const s = S();
  if (replace) s.hist[s.histIdx] = url;
  else { s.hist = s.hist.slice(0, s.histIdx + 1); s.hist.push(url); s.histIdx = s.hist.length - 1; }
  s.url = url; sauver(); renderBrowser(true);
}
function renderBrowser(anim) {
  const s = S(); const u = parse(s.url);
  const site = SITES[u.host];
  const pg = site ? site(u) : { title: 'Page inaccessible', fav: ['#999', '!'], cls: '', html: '<div class="neutralpage"><h2>Ce site est inaccessible</h2></div>' };
  if (pg.redirect) { s.url = pg.redirect; s.hist[s.histIdx] = pg.redirect; return renderBrowser(anim); }
  $('#tabttl').textContent = pg.title; const fv = $('#tabfav'); fv.style.background = pg.fav[0]; fv.textContent = pg.fav[1];
  const shown = s.url.split('?')[0]; const i = shown.indexOf('/');
  $('#urlbar').innerHTML = `<span class="host">${h(i < 0 ? shown : shown.slice(0, i))}</span><span class="rest">${h(i < 0 ? '' : shown.slice(i))}</span>`;
  const vp = $('#viewport'); vp.innerHTML = `<div class="pg ${pg.cls || ''}">${pg.html}</div>`; vp.scrollTop = 0;
  $('#btnback').disabled = s.histIdx <= 0; $('#btnfwd').disabled = s.histIdx >= s.hist.length - 1;
  if (pg.after) pg.after();
  if (anim) { const lb = $('#loadingbar'); lb.style.transition = 'none'; lb.style.width = '0'; requestAnimationFrame(() => { lb.style.transition = 'width .35s ease-out'; lb.style.width = '100%'; setTimeout(() => { lb.style.width = '0'; lb.style.transition = 'none'; }, 420); }); }
  sauver();
}

const SITES = {};

/* ---------- Trouvo ---------- */
const tvLogo = '<div class="tv-logo"><span>T</span><span>r</span><span>o</span><span>u</span><span>v</span><span>o</span></div>';
SITES['trouvo.sim'] = u => {
  if (u.path === '/recherche') {
    const res = (spons, f, nm, url, go, titre, desc, cat, cible, links) => `<div class="tv-r">${spons ? '<div class="spons">Sponsorisé</div>' : ''}
      <div class="site" data-go="${go}" ${L(cible, cat)}><span class="f" style="background:${f[0]}">${f[1]}</span><span><span class="nm">${nm}</span><br><span class="u">${url}</span></span></div>
      <h3 data-go="${go}" ${L(cible, cat)}>${titre}</h3><p>${desc}</p>${links || ''}</div>`;
    return { title: 'aide douche personne âgée - Recherche Trouvo', fav: ['#e8590c', 'T'], cls: 'tv',
      html: `<div class="tv-rhead"><span data-go="trouvo.sim" ${L('trouvo-logo', 'neutre')}>${tvLogo}</span><div class="tv-box"><span class="qv">aide douche personne âgée</span><span>🔍</span></div></div>
      <div class="tv-rtabs"><span class="on">Tous</span><span ${L('trouvo-onglet-images', 'sans-objet')}>Images</span><span ${L('trouvo-onglet-actualites', 'sans-objet')}>Actualités</span><span ${L('trouvo-onglet-videos', 'sans-objet')}>Vidéos</span><span ${L('trouvo-onglet-cartes', 'sans-objet')}>Cartes</span></div>
      <div class="tv-results"><div class="stat">Environ 2 140 000 résultats (0,38 secondes)</div>
      ${res(true, ['#999', '⓪'], 'Adapt\'Senior Dossier', 'https://adapt-senior-dossier.fr', 'adapt-senior-dossier.fr', 'Montage de votre dossier d\'aide douche senior — 49 €',
        'Ne perdez plus de temps avec l\'administration ! Nos conseillers montent votre dossier d\'aide pour votre douche de plain-pied. Réponse rapide, accompagnement complet.', 'piege', 'resultat-sponsorise')}
      ${res(false, ['#24506b', 'H'], 'HabitatAdapt', 'https://habitat-adapt.gouv.sim', 'habitat-adapt.gouv.sim', 'HabitatAdapt — Adapter son logement au vieillissement',
        'Aide de l\'État pour financer les travaux d\'adaptation du logement des personnes âgées ou en situation de handicap : douche de plain-pied, monte-escalier, barres d\'appui…', 'utile', 'resultat-officiel',
        `<div class="links"><span data-go="habitat-adapt.gouv.sim/connexion" ${L('resultat-officiel-deposer', 'utile')}>Déposer une demande</span><span data-go="habitat-adapt.gouv.sim/page?t=Qui peut en bénéficier ?" ${L('resultat-officiel-qui', 'sans-objet')}>Qui peut en bénéficier ?</span><span data-go="habitat-adapt.gouv.sim/page?t=Questions fréquentes" ${L('resultat-officiel-faq', 'sans-objet')}>Questions fréquentes</span></div>`)}
      ${res(false, ['#c2410c', 'M'], 'Maison & Confort', 'https://www.maison-confort-blog.fr › salle-de-bain', 'maison-confort-blog.fr/salle-de-bain-senior', '10 idées pour une salle de bain sûre après 70 ans',
        'Sol antidérapant, siège de douche, éclairage : nos conseils pour une salle de bain adaptée, sans gros travaux. Publié le 4 sept. 2026.', 'sans-objet', 'resultat-blog')}
      ${res(false, ['#5b7a3a', 'F'], 'Forum Seniors Bretagne', 'https://www.forum-seniors-bzh.fr › logement', 'forum-seniors-bzh.fr/sujet-douche', 'Aide pour remplacer ma baignoire ? — Forum Seniors Bretagne',
        '« Bonjour, ma mère a 80 ans et n\'arrive plus à enjamber sa baignoire. Quelqu\'un a déjà eu une aide pour ça ? » — 14 réponses', 'sans-objet', 'resultat-forum')}
      <div class="tv-also"><h4>Autres recherches</h4><div>${['douche italienne prix', 'siège de douche', 'barre d\'appui salle de bain', 'aide ménagère retraite'].map((x, i) => `<span ${L('trouvo-autre-recherche-' + (i + 1), 'sans-objet')}>${x}</span>`).join('')}</div></div></div>` };
  }
  return { title: 'Nouvel onglet', fav: ['#e8590c', 'T'], cls: 'tv',
    html: `<div class="tv-home">${tvLogo}<div class="tv-box"><span>🔍</span><span class="qv">aide douche personne âgée</span></div>
      <div class="tv-btns"><span data-act="rechercher" ${L('lancer-recherche', 'utile')}>Recherche Trouvo</span><span ${L('j-ai-de-la-chance', 'sans-objet')}>J'ai de la chance</span></div>
      <div class="tv-feed">${[['#dbe4ff', '🌧️', 'Météo : averses et vent fort attendus sur le Finistère', 'Ouest Météo · il y a 2 h'], ['#ffe8cc', '🎄', 'Marché de Noël de Plouzévet : le programme', 'La Gazette locale · il y a 5 h'], ['#d3f9d8', '🥕', 'Les légumes de saison à petit prix', 'Cuisine Bretonne · hier']]
        .map((n, i) => `<div ${L('trouvo-actualite-' + (i + 1), 'sans-objet')}><div class="im" style="background:${n[0]}">${n[1]}</div><p>${n[2]}</p><small>${n[3]}</small></div>`).join('')}</div></div>` };
};

/* ---------- Pages sans objet (blog, forum) ---------- */
SITES['maison-confort-blog.fr'] = () => ({ title: '10 idées pour une salle de bain sûre — Maison & Confort', fav: ['#c2410c', 'M'], cls: '',
  html: `<div class="tv-art"><div class="meta">Maison &amp; Confort · Aménagement · 4 septembre 2026</div><h1>10 idées pour une salle de bain sûre après 70 ans</h1>
    <p>La salle de bain est la pièce de la maison où l'on tombe le plus. Quelques changements simples limitent les risques : un tapis antidérapant, une barre d'appui près de la baignoire, un éclairage qui s'allume tout seul la nuit.</p>
    <p>Un siège de douche ou un rehausseur de toilettes coûtent peu et changent la vie. Pour les travaux plus importants, comme remplacer la baignoire par une douche de plain-pied, comptez plusieurs milliers d'euros selon la configuration de la pièce.</p>
    <p>Pensez aussi à la couleur : un sol et des murs bien contrastés aident à mieux voir les bords et les marches.</p>
    <p style="color:#888" ${L('blog-commentaires', 'sans-objet')}>💬 6 commentaires</p></div>` });
SITES['forum-seniors-bzh.fr'] = () => ({ title: 'Aide pour remplacer ma baignoire ? — Forum Seniors Bretagne', fav: ['#5b7a3a', 'F'], cls: 'forum',
  html: `<div class="fh">Forum Seniors Bretagne › Logement</div>
    ${[['Maryvonne29', 'Bonjour, ma mère a 80 ans et n\'arrive plus à enjamber sa baignoire. Quelqu\'un a déjà eu une aide pour ça ?'], ['Jo_Brest', 'Oui, on l\'a fait l\'an dernier pour mon père. C\'était long mais ça a marché. Il faut des devis d\'artisans.'], ['Gwenn', 'Attention aux démarcheurs qui appellent après. Nous, on a eu plein d\'appels.'], ['Maryvonne29', 'Merci à vous deux !']]
      .map((p, i) => `<div class="fp"><div class="au"><b>${p[0]}</b><br>Membre</div><div class="tx">${p[1]}<div style="margin-top:6px;font-size:11px;color:#5b7a3a" ${L('forum-repondre-' + (i + 1), 'sans-objet')}>↩ Répondre</div></div></div>`).join('')}` });

/* ---------- Intermédiaire payant ---------- */
SITES['adapt-senior-dossier.fr'] = u => {
  F().resultatSponsoriseClique = true;
  if (u.path === '/commande') return { title: 'Commande enregistrée — Adapt\'Senior Dossier', fav: ['#0f6e5e', 'A'], cls: 'asd',
    html: `<div class="hd"><span class="lg">Adapt'<span>Senior</span> Dossier</span></div>
      <div class="neutralpage"><h2>Commande enregistrée</h2><p>Référence : ASD-2026-11873</p><p>Un conseiller vous contactera.</p>
      <p><span style="text-decoration:underline;color:#0f6e5e" data-act="back" ${L('intermediaire-retour', 'neutre')}>← Retour</span></p></div>` };
  return { title: 'Adapt\'Senior Dossier — Votre dossier d\'aide douche senior', fav: ['#0f6e5e', 'A'], cls: 'asd',
    html: `<div class="hd"><span class="lg">Adapt'<span>Senior</span> Dossier</span><span class="tel" ${L('intermediaire-telephone', 'sans-objet')}>📞 Rappel gratuit</span></div>
      <div class="hero"><div><h1>Votre aide pour une douche de plain-pied, sans stress</h1>
        <ul><li>✔ Dossier monté par nos conseillers</li><li>✔ Vérification de votre éligibilité</li><li>✔ Suivi jusqu'à la réponse</li><li>✔ Plus de 12 000 seniors accompagnés</li></ul></div>
        <div class="box"><div>Montage complet du dossier</div><div class="price">49 €</div><div style="font-size:12px;color:#556">Paiement avec votre carte enregistrée •••• 4417</div>
        <span class="pay" data-act="payer49" ${L('paiement-intermediaire', 'piege')}>Payer 49 €</span></div></div>
      <div class="rev">${[['★★★★★', '« Très rapide, je recommande. » — Jeanine, 77 ans'], ['★★★★★', '« Conseiller très gentil au téléphone. » — Robert, 81 ans'], ['★★★★☆', '« Bon service, un peu cher. » — Monique, 72 ans']]
        .map((r, i) => `<div ${L('intermediaire-avis-' + (i + 1), 'sans-objet')}><div class="stars">${r[0]}</div>${r[1]}</div>`).join('')}</div>
      <div class="small">Adapt'Senior Dossier est un service privé d'accompagnement administratif, indépendant de l'administration. La démarche peut être réalisée gratuitement par vos soins. Le paiement rémunère uniquement notre prestation.</div>` };
};

/* ---------- HabitatAdapt ---------- */
function haTop() {
  const f = F();
  const right = f.session
    ? `<span class="ha-user">👤 ${P.prenom} ${P.nom.toUpperCase()} · <span class="ha-btn sec" style="padding:4px 10px;font-size:11.5px" data-act="deconnexion" ${L('se-deconnecter', 'utile')}>Se déconnecter</span></span>`
    : `<span class="acc" data-go="habitat-adapt.gouv.sim/connexion" ${L('ha-mon-espace', 'utile')}>Mon espace</span>`;
  return `<div class="ha-top"><div class="in"><div class="ha-logo" data-go="habitat-adapt.gouv.sim" ${L('ha-logo', 'neutre')}><span class="m"></span><span><b>HabitatAdapt</b><small>Adapter son logement pour bien vieillir</small></span></div>
    <span class="sp"></span><span class="util">${['Accessibilité', 'Plan du site', 'Contact'].map(x => `<span data-go="habitat-adapt.gouv.sim/page?t=${encodeURIComponent(x)}" ${L('ha-lien-' + x.toLowerCase().replace(/ /g, '-'), 'sans-objet')}>${x}</span>`).join('')}</span>${right}</div></div>
    <div class="ha-nav"><div class="in"><span data-go="habitat-adapt.gouv.sim" ${L('ha-menu-accueil', 'neutre')}>Accueil</span>${['Les aides', 'Actualités', 'Questions fréquentes', 'Trouver un artisan', 'Nous contacter'].map(x => `<span data-go="habitat-adapt.gouv.sim/page?t=${encodeURIComponent(x)}" ${L('ha-menu-' + x.toLowerCase().replace(/ /g, '-'), 'sans-objet')}>${x}</span>`).join('')}</div></div>`;
}
function haFoot() {
  return `<div class="ha-foot"><div class="in">${['Mentions légales', 'Données personnelles', 'Gestion des cookies', 'Accessibilité : partiellement conforme', 'Plan du site'].map(x => `<span data-go="habitat-adapt.gouv.sim/page?t=${encodeURIComponent(x)}" ${L('ha-pied-' + x.split(' ')[0].toLowerCase(), 'sans-objet')}>${x}</span>`).join('')}<span style="margin-left:auto">HabitatAdapt — service public (fictif)</span></div></div>`;
}
SITES['habitat-adapt.gouv.sim'] = u => {
  const f = F(); f.siteOfficielAtteint = true; if (f.siteOfficielAvantPaiement === null) f.siteOfficielAvantPaiement = !f.intermediairePaye;
  const base = { fav: ['#24506b', 'H'], cls: 'ha' };
  const wrap = x => haTop() + `<div class="ha-wrap">${x}</div>` + haFoot();
  if (u.path === '/page') {
    const t = u.params.t || 'Page';
    return Object.assign({}, base, { title: t + ' | HabitatAdapt', html: wrap(`<div class="ha-crumbs">Accueil › ${h(t)}</div><div class="ha-card" style="max-width:none"><h1>${h(t)}</h1>
      <p style="line-height:1.7">Cette rubrique est en cours de mise à jour. Les informations seront bientôt disponibles.</p>
      <p style="line-height:1.7">L'aide HabitatAdapt finance une partie des travaux d'adaptation du logement pour les personnes de 70 ans et plus, ou de 60 à 69 ans en perte d'autonomie, sous conditions de ressources.</p>
      <p><span style="text-decoration:underline;color:#24506b" data-go="habitat-adapt.gouv.sim" ${L('ha-retour-accueil', 'neutre')}>← Retour à l'accueil</span></p></div>`) });
  }
  if (u.path === '/connexion') {
    if (f.session) return { redirect: f.depot ? 'habitat-adapt.gouv.sim/confirmation' : 'habitat-adapt.gouv.sim/demande' };
    return Object.assign({}, base, { title: 'Connexion — Déposer une demande | HabitatAdapt', html: wrap(`<div class="ha-crumbs">Accueil › Déposer une demande</div>
      <div class="ha-card"><h1>Déposer une demande d'aide</h1><p style="line-height:1.6">Pour déposer une demande, identifiez-vous.</p>
      ${u.params.ancien ? '<div class="err">La connexion par mot de passe n\'est plus possible. Utilisez IdentiPass+.</div>' : ''}
      <div style="text-align:center;margin:22px 0"><button type="button" class="ip-button" data-go="identipass.sim/plus?service=habitatadapt" ${L('bouton-identipass-plus', 'utile')}><span class="k">🔑</span><span class="l"><small>S'identifier avec</small><b>IdentiPass<sup>+</sup></b></span></button></div>
      <p style="text-align:center;font-size:12px"><span style="text-decoration:underline;color:#24506b" data-go="habitat-adapt.gouv.sim/page?t=${encodeURIComponent('Qu\'est-ce que IdentiPass+ ?')}" ${L('ha-quest-ce-identipass', 'sans-objet')}>Qu'est-ce que IdentiPass+ ?</span></p>
      <hr style="border:0;border-top:1px solid #e3e0d8;margin:18px 0">
      <p style="font-size:12.5px"><span style="text-decoration:underline;color:#24506b" data-act="ancien" ${L('ancien-identifiant', 'piege')}>Se connecter avec mon ancien identifiant et mot de passe</span></p></div>`) });
  }
  if (u.path === '/demande') {
    if (!f.session) return { redirect: 'habitat-adapt.gouv.sim/connexion' };
    if (f.depot) return { redirect: 'habitat-adapt.gouv.sim/confirmation' };
    const fo = E.reponses['2D'].formulaire;
    return Object.assign({}, base, { title: 'Ma demande | HabitatAdapt', html: wrap(`<div class="ha-crumbs">Accueil › Mon espace › Nouvelle demande</div>
      <div class="ha-card"><h1>Nouvelle demande d'aide</h1>
      <div class="ha-ro"><b>Informations transmises par IdentiPass+</b><br>${P.prenom} ${P.nom.toUpperCase()} — née le ${P.naissance} — sexe : féminin<br>${P.adresse}, ${P.cp} ${P.ville}</div>
      <div id="haerr"></div>
      <div class="ha-f"><label>Type de travaux *</label><select id="fa-type"><option value="">— Choisir —</option>${['Remplacement d\'une baignoire par une douche de plain-pied', 'Installation d\'un monte-escalier', 'Pose de barres d\'appui', 'Élargissement des portes', 'Installation de WC surélevés', 'Autres travaux'].map(x => `<option>${x}</option>`).join('')}</select></div>
      <div class="ha-f"><label>Adresse du logement à adapter *</label><input id="fa-adresse" autocomplete="off"></div>
      <div class="ha-f"><label>Numéro fiscal *</label><input id="fa-fiscal" autocomplete="off"><div class="hint">13 chiffres, inscrits sur votre avis d'impôt.</div></div>
      <div class="ha-f"><label>Téléphone *</label><input id="fa-tel" autocomplete="off"></div>
      <div style="margin-top:16px"><button class="ha-btn" data-act="envoyerDemande" ${L('envoyer-demande', 'utile')}>Envoyer ma demande</button></div></div>`),
      after: () => {
        const map = { 'fa-type': 'typeTravaux', 'fa-adresse': 'adresseLogement', 'fa-fiscal': 'numeroFiscal', 'fa-tel': 'telephone' };
        Object.entries(map).forEach(([id, k]) => { const el = $('#' + id); el.value = fo[k] || ''; el.addEventListener('input', () => { fo[k] = el.value; sauver(); }); el.addEventListener('change', () => { fo[k] = el.value; sauver(); }); });
      } });
  }
  if (u.path === '/confirmation') {
    if (!f.depot) return { redirect: 'habitat-adapt.gouv.sim/connexion' };
    return Object.assign({}, base, { title: 'Demande enregistrée | HabitatAdapt', html: wrap(`<div class="ha-card"><h1>Demande enregistrée</h1>
      <div class="ok">Demande n° <b>${f.numeroDossier}</b> enregistrée.</div>
      <p style="line-height:1.6">Vous recevrez une réponse par courrier. Vous pouvez suivre votre demande dans votre espace.</p>
      <p><span class="ha-btn sec" ${L('ha-suivre-demande', 'sans-objet')}>Suivre ma demande</span></p></div>`) });
  }
  /* accueil */
  return Object.assign({}, base, { title: 'HabitatAdapt — Adapter son logement au vieillissement', html: wrap(`
    ${u.params.deco ? '<div class="ha-card" style="max-width:none;margin:0 0 12px;padding:10px 16px">Vous êtes déconnectée.</div>' : ''}
    <div class="ha-hero"><div><h1>Adapter son logement pour continuer à vivre chez soi</h1>
      <p>Douche de plain-pied, monte-escalier, barres d'appui : l'État peut financer une partie de vos travaux d'adaptation.</p>
      <p style="font-size:12.5px;color:#5b6670">Pour les personnes de 70 ans et plus, ou de 60 à 69 ans en perte d'autonomie, sous conditions de ressources.</p>
      <span class="ha-btn" data-go="habitat-adapt.gouv.sim/connexion" ${L('deposer-une-demande', 'utile')}>Déposer une demande</span>
      <span class="ha-btn sec" style="margin-left:8px" ${L('ha-simuler-droits', 'sans-objet')}>Simuler mes droits</span></div>
      <div class="side"><b>Avant de commencer</b><br>• Un ou plusieurs devis d'artisans<br>• Votre numéro fiscal<br>• Une identité numérique vérifiée pour vous connecter</div></div>
    <div class="ha-cols">${[['Qui peut en bénéficier ?', 'Les propriétaires occupants et les locataires, selon leurs ressources et leur âge.'], ['Quels travaux ?', 'Salle de bain, accès au logement, circulation intérieure, domotique.'], ['Combien ?', 'Une partie du montant des travaux, selon vos revenus. Le reste reste à votre charge.']]
      .map((c, i) => `<div><h3>${c[0]}</h3>${c[1]}<br><span style="color:#24506b;text-decoration:underline" ${L('ha-en-savoir-plus-' + (i + 1), 'sans-objet')}>En savoir plus</span></div>`).join('')}</div>
    <div class="ha-news"><b>Actualités</b><ul>${['Nouveau : connexion avec une identité numérique vérifiée', 'Trouver un artisan qualifié près de chez vous', 'Témoignage : « Ma douche de plain-pied a changé mon quotidien »'].map((x, i) => `<li ${L('ha-actualite-' + (i + 1), 'sans-objet')}>${x}</li>`).join('')}</ul></div>`) });
};

function envoyerDemande() {
  const f = F(), fo = E.reponses['2D'].formulaire;
  ['typeTravaux', 'adresseLogement', 'numeroFiscal', 'telephone'].forEach(k => { fo[k] = (fo[k] || '').trim(); });
  if (!fo.typeTravaux || !fo.adresseLogement || !fo.numeroFiscal || !fo.telephone) {
    $('#haerr').innerHTML = '<div class="err">Veuillez compléter les champs obligatoires.</div>';
    journal('navigateur', 'formulaire-incomplet', 'evenement'); return;
  }
  f.depot = true;
  f.numeroDossier = 'HA-' + String(Math.floor(10000 + Math.random() * 89999));
  f.numeroFiscalSaisi = fo.numeroFiscal;
  f.numeroFiscalCorrect = fo.numeroFiscal.replace(/\D/g, '') === P.numeroFiscal.replace(/\D/g, '');
  journal('navigateur', 'demande-deposee', 'evenement', `n° ${f.numeroDossier} ; numéro fiscal ${f.numeroFiscalCorrect ? 'correct' : 'incorrect'}`);
  navigate('habitat-adapt.gouv.sim/confirmation');
  if (!f.pirate.envoyee) { clearSimTimers(); later(envoyerPirate, 2); later(programmerIncidentSuivant, 4); }
  else programmerIncidentSuivant();
}

/* ---------- IdentiPass+ ---------- */
function ipTop() {
  return `<div class="ip-top"><div class="in"><div class="ip-logo"><span class="k">🔑</span>IdentiPass<sup>+</sup></div><span style="font-size:12px;opacity:.75">La connexion renforcée aux services publics (fictive)</span>
    <span class="sp"></span><span class="lnk" ${L('identipass-aide', 'sans-objet')}>Aide</span></div></div>`;
}
SITES['identipass.sim'] = u => {
  const f = F(), base = { fav: ['#2b3440', '🔑'], cls: 'ip' };
  if (u.path === '/plus/attente') {
    return Object.assign({}, base, { title: 'IdentiPass+ — Confirmation', html: ipTop() + `<div class="ip-main"><div class="ip-wait">
      <h1>Connexion avec NumérID</h1><div class="spin"></div>
      <p style="font-size:15px">Confirmez la connexion dans l'application NumérID sur votre téléphone.</p></div>
      <p style="font-size:12.5px;margin-top:20px"><span style="text-decoration:underline" data-go="identipass.sim/plus?service=habitatadapt" ${L('identipass-autre-identite', 'neutre')}>← Choisir une autre identité</span></p></div>` });
  }
  if (u.path === '/plus/consentement') {
    if (!f.authOk) return { redirect: 'identipass.sim/plus?service=habitatadapt' };
    return Object.assign({}, base, { title: 'IdentiPass+ — Autorisation', html: ipTop() + `<div class="ip-main"><h1>Transmission de vos informations</h1>
      <div class="svc">Vous êtes connectée avec <b style="color:#00787a">NumérID</b>.</div>
      <p><b>HabitatAdapt</b> va recevoir :</p>
      <ul class="ip-consent"><li><span>Nom de naissance</span><b>${P.nom.toUpperCase()}</b></li><li><span>Prénom</span><b>${P.prenom}</b></li><li><span>Date et lieu de naissance</span><b>${P.naissance}</b></li><li><span>Sexe</span><b>Féminin</b></li><li><span>Adresse</span><b>${P.adresse}, ${P.cp} ${P.ville}</b></li></ul>
      <div style="display:flex;gap:10px;margin-top:16px"><span class="ip-btn" data-act="consentOui" ${L('consentement-continuer', 'utile')}>Continuer</span><span class="ip-btn ghost" data-act="consentNon" ${L('consentement-annuler', 'neutre')}>Annuler</span></div></div>`,
      after: () => { if (!f.pirate.programmee) { f.pirate.programmee = true; later(envoyerPirate, SC.delaiDemandePirate); } } });
  }
  /* choix de l'identité */
  const msg = u.params.msg === 'cartid' ? '<div class="ip-alert">Vous n\'avez pas d\'identité CartID. Elle nécessite une carte d\'identité au format carte bancaire et une certification en mairie.</div>'
    : u.params.msg === 'refus' ? '<div class="ip-alert">La connexion a été refusée depuis votre téléphone.</div>' : '';
  return Object.assign({}, base, { title: 'IdentiPass+ — Choix de l\'identité', html: ipTop() + `<div class="ip-main"><h1>Je choisis mon identité numérique</h1>
    <div class="svc">Vous souhaitez accéder à : <b>HabitatAdapt</b></div>${msg}
    <div class="ip-grid">
      <div class="ip-acc" data-act="choixNumerid" ${L('identipass-numerid', 'utile')}><span class="lg" style="background:#00787a">ID</span><b>NumérID</b><small>identité numérique</small></div>
      <div class="ip-acc" data-act="choixCartid" ${L('identipass-cartid', 'piege')}><span class="lg" style="background:#7a3f8f">C</span><b>CartID</b><small>identité numérique avec carte d'identité</small></div>
    </div>
    <p class="ip-small">Les comptes à mot de passe ne sont pas acceptés pour cette démarche.</p>
    <p style="font-size:12.5px;margin-top:16px"><span style="text-decoration:underline" data-go="habitat-adapt.gouv.sim/connexion" ${L('identipass-retour-habitatadapt', 'neutre')}>← Revenir sur HabitatAdapt</span></p></div>` });
};

function choisirNumerid() {
  const f = F(), ph = S().ph;
  if (!f.numeridChoisi) { f.numeridChoisi = true; f.essaisRatesAvantNumerid = f.ancienIdentifiantEssais + f.cartidEssais; }
  navigate('identipass.sim/plus/attente?service=habitatadapt');
  const enAttente = ph.reqs.find(r => r.legit && r.etat === 'attente');
  if (!enAttente) later(() => nouvelleDemandeNumerid(true), SC.delaiNotificationNumerid);
}

/* =====================================================================
   TÉLÉPHONE
   ===================================================================== */
function heurePhone(off = 0) {
  const [hh, mm] = SC.heureDepart.split(':').map(Number);
  const m = hh * 60 + mm + Math.floor(((E.sim ? E.sim.tAcc : 0) + off) / 60);
  return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}
function majHorloge() { $$('.ph-clock').forEach(x => x.textContent = heurePhone()); }

function notifier(app, titre, texte, extra = {}) {
  const ph = S().ph; ph.nid++;
  const n = Object.assign({ id: 'n' + ph.nid, app, titre, texte, heure: heurePhone(), lu: false }, extra);
  ph.notifs.push(n); sauver(); renderPhone(); showBanner(n);
}
function showBanner(n) {
  const scr = $('#phscr'); if (!scr) return;
  hideBanner();
  const b = document.createElement('div'); b.className = 'ph-banner'; b.id = 'phbanner';
  b.dataset.act = 'phNotif'; b.dataset.id = n.id; b.dataset.log = `notification-${n.cible || n.app}|neutre`;
  b.innerHTML = `<b>${h(n.titre)} · maintenant</b>${h(n.texte)}`;
  scr.appendChild(b);
  bannerTimer = setTimeout(hideBanner, 6000);
}
function hideBanner() { clearTimeout(bannerTimer); const b = $('#phbanner'); if (b) b.remove(); }

function recevoirSms(de, texte, extra = {}) {
  const ph = S().ph;
  ph.sms.push(Object.assign({ de, texte, heure: heurePhone(), lu: false }, extra));
  notifier('messages', 'Messages — ' + de, texte, { de, cible: extra.cible || 'sms' });
}

/* ---------- NumérID : demandes de connexion ---------- */
function nouvelleDemandeNumerid(legit) {
  const ph = S().ph; ph.nid++;
  const r = legit ? { id: 'r' + ph.nid, legit: true, service: 'HabitatAdapt', via: 'IdentiPass+', etat: 'attente' }
    : { id: 'r' + ph.nid, legit: false, service: V().sim.servicePirate, via: 'IdentiPass', etat: 'attente' };
  ph.reqs.push(r);
  journal('telephone', legit ? 'demande-numerid-habitatadapt' : 'demande-pirate-' + r.service.toLowerCase().replace('é', 'e'), 'evenement', 'notification reçue');
  notifier('numerid', 'NumérID', `Demande de connexion à ${r.service} via ${r.via}. Est-ce bien vous ?`, { cible: legit ? 'numerid' : 'numerid-pirate' });
}
function envoyerPirate() {
  const f = F(); if (f.pirate.envoyee) return;
  f.pirate.envoyee = true; nouvelleDemandeNumerid(false);
}
function demarrerPin(id) {
  const ph = S().ph, r = ph.reqs.find(x => x.id === id); if (!r || r.etat !== 'attente') return;
  if (ph.bloqueJusqua && S().tAcc < ph.bloqueJusqua) { renderPhone(); return; }
  if (!r.legit) { const f = F(); f.pirate.etat = 'confirmee'; f.pirate.confirmeeAuMoinsUneFois = true; journal('telephone', 'demande-pirate-confirmee', 'evenement'); }
  ph.pin = { id, saisie: '' }; renderPhone();
}
function saisirPin(k) {
  const s = S(), ph = s.ph; if (!ph.pin) return;
  if (ph.bloqueJusqua && s.tAcc < ph.bloqueJusqua) return;
  if (k === '⌫') ph.pin.saisie = ph.pin.saisie.slice(0, -1);
  else if (/\d/.test(k) && ph.pin.saisie.length < 6) ph.pin.saisie += k;
  ph.pin.err = '';
  if (ph.pin.saisie.length === 6) {
    const r = ph.reqs.find(x => x.id === ph.pin.id);
    if (ph.pin.saisie === P.numerid.codeSecret) {
      ph.pin = null; ph.essaisFaux = 0;
      if (r) repondreReq(r.id, 'confirmee', true); return;
    }
    const f = F(); f.codesFaux++; ph.essaisFaux++;
    journal('telephone', 'code-numerid-faux', 'piege');
    s.cpt.piege++;
    ph.pin.saisie = '';
    if (ph.essaisFaux >= SC.essaisCodeAvantBlocage) {
      ph.essaisFaux = 0; ph.bloqueJusqua = s.tAcc + SC.dureeBlocageNumerid; f.blocagesNumerid++;
      journal('telephone', 'numerid-bloquee', 'evenement', `${SC.dureeBlocageNumerid} s`);
      ph.pin = null;
    } else ph.pin.err = 'Échec de la vérification.';
  }
  renderPhone();
}
function repondreReq(id, etat, avecCode) {
  const s = S(), f = s.f, ph = s.ph, r = ph.reqs.find(x => x.id === id); if (!r || r.etat !== 'attente') return;
  r.etat = etat; r.t = hhmmss(s.tAcc);
  if (r.legit) {
    journal('telephone', 'numerid-habitatadapt-' + etat, 'evenement');
    if (etat === 'confirmee') { f.authOk = true; navigate('identipass.sim/plus/consentement?service=habitatadapt'); }
    else navigate('identipass.sim/plus?service=habitatadapt&msg=refus');
  } else {
    if (etat === 'refusee') { f.pirate.etat = 'refusee'; journal('telephone', 'demande-pirate-refusee', 'evenement'); }
    if (etat === 'confirmee' && avecCode) { f.pirate.codeSaisi = true; journal('telephone', 'demande-pirate-code-saisi', 'evenement'); }
  }
  ph.notifs.filter(n => n.app === 'numerid').forEach(n => n.lu = true);
  sauver(); renderPhone();
}

/* ---------- Incidents après le dépôt ---------- */
function programmerIncidentSuivant() {
  const f = F(); if (f.incidents.index >= V().sim.ordreIncidents.length) return;
  later(demarrerIncident, f.incidents.index === 0 ? SC.delaiPremierIncident : SC.delaiEntreIncidents);
}
function demarrerIncident() {
  const f = F(), k = V().sim.ordreIncidents[f.incidents.index]; if (!k) return;
  f.incidents.index++;
  if (k === 'appel') { lancerAppel(); return; }
  /* SMS de frais */
  const sf = V().sim.smsFrais; f.incidents.smsFrais.recu = true;
  journal('telephone', 'sms-frais-recu', 'evenement');
  recevoirSms(sf.expediteur, `HabitatAdapt : des frais de traitement de ${sf.montant} sont nécessaires pour valider votre dossier : ${sf.domaine}`, { lien: sf.domaine, cible: 'sms-frais' });
  later(programmerIncidentSuivant, 10);
}
function lancerAppel() {
  const ph = S().ph;
  ph.call = { etape: 'ring', numero: '02 61 91 08 43' };
  journal('telephone', 'appel-entrant', 'evenement', 'appel ' + (F().incidents.appelRefus ? 'renouvelé' : 'reçu'));
  hideBanner(); renderPhone(); programmerSonnerieMax();
}
function programmerSonnerieMax() { later(() => { const ph = S().ph; if (ph.call && ph.call.etape === 'ring') { journal('telephone', 'appel-sans-reponse', 'evenement'); refuserAppel(true); } }, 25); }
function decrocher() {
  const ph = S().ph; if (!ph.call) return;
  ph.call.etape = 'talk'; renderPhone();
  later(() => {
    const f = F(); if (f.incidents.smsCodeRecu) { if (S().ph.call) { S().ph.call.choix = true; renderPhone(); } return; } f.incidents.smsCodeRecu = true;
    recevoirSms('HabitatAdapt', 'HabitatAdapt : votre code de confirmation est 472915. Ne le communiquez à personne.', { cible: 'sms-code' });
    if (S().ph.call) { S().ph.call.choix = true; renderPhone(); }
  }, SC.delaiSmsApresAppel);
}
function refuserAppel(sansReponse) {
  const f = F(), ph = S().ph; f.incidents.appelRefus++;
  if (f.incidents.appelRefus >= 2) { f.incidents.appel = sansReponse ? 'sans-reponse' : 'refuse'; ph.appels.push({ numero: ph.call.numero, heure: heurePhone(), type: 'manqué' }); ph.call = null; renderPhone(); programmerIncidentSuivant(); return; }
  ph.appels.push({ numero: ph.call.numero, heure: heurePhone(), type: 'manqué' }); ph.call = null; renderPhone();
  later(lancerAppel, SC.delaiRappelSiRefus);
}
function finAppel(choix) {
  const f = F(), ph = S().ph; if (!ph.call) return;
  f.incidents.appel = choix;
  journal('telephone', 'appel-' + choix, 'evenement');
  const rep = { 'code-lu': '« Parfait, merci madame. Votre dossier est finalisé. Bonne journée. »', 'raccroche': '', 'rappel-plus-tard': '« Euh… Monsieur Martin, service des dossiers. Faites vite, sinon votre dossier sera annulé. »' }[choix];
  ph.call.etape = 'fin'; ph.call.rep = rep; ph.appels.push({ numero: ph.call.numero, heure: heurePhone(), type: 'reçu' });
  renderPhone();
  later(() => { S().ph.call = null; renderPhone(); programmerIncidentSuivant(); }, rep ? 4 : 1.5);
}

/* ---------- Rendu du téléphone ---------- */
function renderPhone() {
  const scr = $('#phscr'); if (!scr || !E.sim) return;
  const s = S(), ph = s.ph;
  const nonLusSms = ph.sms.filter(m => !m.lu).length, attente = ph.reqs.filter(r => r.etat === 'attente').length;
  const sbar = `<div class="sbar"><span class="ph-clock">${heurePhone()}</span><span>📶 4G ▮▮▮</span></div>`;
  let body = '';
  const appHead = (t, extra = '') => `<div class="ah"><span class="bk" data-act="phHome" ${L('telephone-retour-accueil', 'neutre')}>‹</span>${t}${extra}</div>`;
  const ecran = ph.ecran;
  if (ecran === 'home') {
    const notifs = ph.notifs.filter(n => !n.lu).slice(-4).reverse();
    body = `<div class="ph-big ph-clock">${heurePhone()}</div><div class="ph-date">${SC.dateTelephone}</div>
      ${notifs.map(n => `<div class="ph-notif" data-act="phNotif" data-id="${n.id}" ${L('notification-' + (n.cible || n.app), 'neutre')}><b><span>${h(n.titre)}</span><span>${n.heure}</span></b>${h(n.texte)}</div>`).join('')}
      <div class="ph-apps">${[
        ['messages', '💬', 'Messages', '#34a853', 'neutre', nonLusSms], ['numerid', 'ID', 'NumérID', '#00787a', 'neutre', attente], ['telephone', '📞', 'Téléphone', '#1a73e8', 'neutre', 0], ['meteo', '🌦️', 'Météo', '#4a90d9', 'sans-objet', 0],
        ['photos', '🖼️', 'Photos', '#f4b400', 'sans-objet', 0], ['agenda', '📅', 'Agenda', '#e8eaed', 'sans-objet', 0], ['radio', '📻', 'Radio', '#8e44ad', 'sans-objet', 0], ['reglages', '⚙️', 'Réglages', '#78909c', 'sans-objet', 0]
      ].map(a => `<div class="ph-app" data-act="phApp" data-app="${a[0]}" ${L('appli-' + a[0], a[4])}><span class="ic" style="background:${a[3]};${a[0] === 'numerid' ? 'font-weight:700;font-size:15px;color:#fff' : ''}">${a[1]}${a[5] ? `<span class="bdg">${a[5]}</span>` : ''}</span>${a[2]}</div>`).join('')}</div>`;
  } else if (ecran === 'messages') {
    if (ph.thread) {
      const msgs = ph.sms.filter(m => m.de === ph.thread);
      body = `<div class="ph-appscr"><div class="ah"><span class="bk" data-act="phThreadBack" ${L('messages-retour', 'neutre')}>‹</span>${h(ph.thread)}</div>
        ${msgs.map(m => `<div class="ph-tm">Aujourd'hui ${m.heure}</div><div class="ph-bub">${m.lien ? h(m.texte).replace(h(m.lien), `<span class="lnk" data-act="smsLien" data-url="${h(m.lien)}" ${L('lien-sms-frais', 'piege')}>${h(m.lien)}</span>`) : h(m.texte)}</div>`).join('')}</div>`;
    } else {
      const fils = [...new Set(ph.sms.map(m => m.de))].reverse();
      body = `<div class="ph-appscr">${appHead('Messages')}${[...fils.map(de => { const last = ph.sms.filter(m => m.de === de).slice(-1)[0]; const nl = ph.sms.some(m => m.de === de && !m.lu);
          return `<div class="ph-row" data-act="phThread" data-de="${h(de)}" ${L('messages-fil', 'neutre')}><b>${nl ? '● ' : ''}${h(de)} <small>${last.heure}</small></b><span>${h(last.texte)}</span></div>`; }),
        `<div class="ph-row" ${L('messages-fil-sophie', 'sans-objet')}><b>Sophie <small>hier</small></b><span>Je passe dimanche, bisous maman</span></div>`,
        `<div class="ph-row" ${L('messages-fil-pharmacie', 'sans-objet')}><b>Pharmacie du Port <small>lun.</small></b><span>Votre commande est prête.</span></div>`].join('')}</div>`;
      ph.sms.forEach(m => m.lu = true);
    }
  } else if (ecran === 'numerid') {
    const bloque = ph.bloqueJusqua && s.tAcc < ph.bloqueJusqua;
    const enAttente = ph.reqs.filter(r => r.etat === 'attente');
    const traitees = ph.reqs.filter(r => r.etat !== 'attente').slice(-2).reverse();
    body = `<div class="ph-appscr nid">${appHead('<span class="lg">ID</span> NumérID')}
      <div class="who"><b>${P.prenom} ${P.nom.toUpperCase()}</b><br>Identité vérifiée ✓</div>
      ${bloque ? `<div class="req" style="border-color:#b3261e"><h4>Application temporairement bloquée</h4>Trop d'essais. Réessayez dans ${Math.ceil((ph.bloqueJusqua - s.tAcc) / 60)} min.</div>` : ''}
      ${enAttente.map(r => `<div class="req"><h4>Demande de connexion</h4>Demande de connexion à <b>${h(r.service)}</b> via ${h(r.via)}.<br>Est-ce bien vous ?
        <div class="btns"><span class="ok" data-act="reqOui" data-id="${r.id}" ${L(r.legit ? 'numerid-confirmer' : 'demande-pirate-confirmer', r.legit ? 'utile' : 'piege')}>Confirmer</span><span class="no" data-act="reqNon" data-id="${r.id}" ${L(r.legit ? 'numerid-refuser' : 'demande-pirate-refuser', r.legit ? 'neutre' : 'utile')}>Refuser</span></div></div>`).join('')}
      ${!enAttente.length && !bloque ? '<div class="done" style="background:#fff;color:#577;border:1px solid #d4e3e3">Aucune demande en attente.</div>' : ''}
      ${traitees.map(r => `<div class="done">${r.etat === 'confirmee' ? 'Connexion confirmée' : 'Demande refusée'} — ${h(r.service)}</div>`).join('')}
      <div class="menu"><div ${L('numerid-mes-connexions', 'sans-objet')}>📜 Mes connexions</div><div ${L('numerid-mon-identite', 'sans-objet')}>🪪 Mon identité</div><div ${L('numerid-parametres', 'sans-objet')}>⚙️ Paramètres</div></div></div>`;
  } else if (ecran === 'telephone') {
    body = `<div class="ph-appscr">${appHead('Téléphone')}${ph.appels.slice().reverse().map(a => `<div class="ph-row" ${L('journal-appel', 'sans-objet')}><b style="${a.type === 'manqué' ? 'color:#c5221f' : ''}">${a.numero} <small>${a.heure}</small></b><span>${a.type === 'manqué' ? 'Appel manqué' : 'Appel reçu'}</span></div>`).join('')}
      <div class="ph-row" ${L('journal-appel-sophie', 'sans-objet')}><b>Sophie <small>hier</small></b><span>Appel sortant</span></div><div class="ph-row" ${L('journal-appel-cabinet', 'sans-objet')}><b>Cabinet médical <small>lun.</small></b><span>Appel reçu</span></div></div>`;
  } else if (ecran === 'web') {
    const sf = V().sim.smsFrais, ok = (ph.web || '').endsWith('/ok');
    body = `<div class="ph-appscr ph-web"><div class="ah"><span class="bk" data-act="phHome" ${L('telephone-retour-accueil', 'neutre')}>‹</span><span style="font-weight:400;font-size:12px">Navigateur</span></div>
      <div class="wbar">🔒 ${h(sf.domaine)}</div><div class="payfrais"><div class="lg">HabitatAdapt</div>
      ${ok ? '<p><b>Paiement accepté.</b></p><p>Votre dossier est validé.</p>' : `<p>Validation de votre dossier</p><div>Frais de traitement :</div><div class="amt">${h(sf.montant)}</div>
        <div class="card">💳 Carte enregistrée •••• 4417</div><span class="pay" data-act="payerFrais" ${L('paiement-frais-sms', 'piege')}>Payer ${h(sf.montant)}</span>`}</div></div>`;
  } else {
    const noms = { meteo: ['Météo', 'Plouzévet : averses, 11 °C. Vent d\'ouest.'], photos: ['Photos', '1 248 photos'], agenda: ['Agenda', 'Jeudi : kiné à 10 h 30.'], radio: ['Radio', 'Aucune station en lecture.'], reglages: ['Réglages', 'Réglages du téléphone.'] };
    const a = noms[ecran] || ['', ''];
    body = `<div class="ph-appscr">${appHead(a[0])}<div class="ph-neutral">${a[1]}</div></div>`;
  }
  /* code secret */
  let over = '';
  if (ph.pin) {
    const r = ph.reqs.find(x => x.id === ph.pin.id);
    over = `<div class="pinpad"><div class="t">NumérID<br>Saisissez votre code secret pour confirmer la connexion${r ? ' à <b>' + h(r.service) + '</b>' : ''}.</div>
      <div class="dots">${[0, 1, 2, 3, 4, 5].map(i => `<i class="${i < ph.pin.saisie.length ? 'f' : ''}"></i>`).join('')}</div><div class="err">${h(ph.pin.err || '')}</div>
      <div class="keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(k => k ? `<span data-act="pinKey" data-k="${k}">${k}</span>` : '<i></i>').join('')}</div>
      <div class="cancel" data-act="pinAnnuler" ${L('code-numerid-annuler', 'neutre')}>Annuler</div></div>`;
  }
  /* appel */
  if (ph.call) {
    const c = ph.call;
    if (c.etape === 'ring') over += `<div class="call"><div class="sub">Appel entrant</div><div class="av">👤</div><div class="who">${c.numero}</div><div class="sub">France</div>
      <div class="ring"><div><span style="background:#e53935" data-act="appelRefuser" ${L('appel-refuser', 'neutre')}>✆</span><small>Refuser</small></div><div><span style="background:#34a853" data-act="appelDecrocher" ${L('appel-decrocher', 'neutre')}>✆</span><small>Décrocher</small></div></div></div>`;
    else if (c.etape === 'talk') over += `<div class="call"><div class="sub">En communication</div><div class="who" style="font-size:16px">${c.numero}</div>
      <div class="tr">« Bonjour, conseiller HabitatAdapt. Pour finaliser votre dossier, je vous envoie un code par SMS, il faut me le lire. »</div>
      ${c.choix ? `<div class="acts"><span data-act="appelChoix" data-c="code-lu" ${L('appel-lire-le-code', 'piege')}>Lire le code au conseiller</span><span data-act="appelChoix" data-c="raccroche" ${L('appel-raccrocher', 'utile')}>Raccrocher</span><span data-act="appelChoix" data-c="rappel-plus-tard" ${L('appel-demander-nom-rappeler', 'utile')}>Lui demander son nom et le rappeler plus tard</span></div>` : '<div class="sub" style="margin-top:auto">…</div>'}</div>`;
    else over += `<div class="call"><div class="sub">Appel terminé</div><div class="who" style="font-size:16px">${c.numero}</div>${c.rep ? `<div class="tr">${c.rep}</div>` : ''}</div>`;
  }
  const keepBanner = $('#phbanner');
  scr.innerHTML = sbar + `<div class="content">${body}</div>${over}<div class="homebar"><i data-act="phHome" ${L('telephone-bouton-accueil', 'neutre')}></i></div>`;
  if (keepBanner) scr.appendChild(keepBanner);
  sauver();
}
