/* =====================================================================
   NOYAU : état, sauvegarde locale, en-tête, navigation entre parties,
   fenêtres de confirmation, export de la copie, remise à zéro.
   ===================================================================== */
const PARTIES = ['1A', '1B', '2A', '2B', '2C', '2D', 'fin'];
const NOMS_PARTIES = {
  '1A': 'Site officiel ou site à éviter ?',
  '1B': 'Que dire à la personne ?',
  '2A': 'Gérer ses mots de passe',
  '2B': 'La double authentification',
  '2C': 'Est-ce de la double authentification ?',
  '2D': 'Une démarche avec le simulateur',
  fin: 'Enregistrer ma copie'
};

let E = null;            // état de la copie (sauvegardé dans localStorage)
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const V = () => CONFIG.variantes[E.variante];

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function idAleatoire() { const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 8; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
function mmss(s) { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
function hhmmss(s) { s = Math.max(0, Math.round(s)); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(x => String(x).padStart(2, '0')).join(':'); }

/* ---------- Stockage ---------- */
function sauver() { if (!E) return; try { localStorage.setItem(CONFIG.cleStockage, JSON.stringify(E)); } catch (e) { /* stockage indisponible : on continue */ } }
function lireSauvegarde() { try { const t = localStorage.getItem(CONFIG.cleStockage); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function effacerSauvegarde() { try { localStorage.removeItem(CONFIG.cleStockage); } catch (e) { } }

function nouvelleCopie(variante) {
  const v = CONFIG.variantes[variante];
  return {
    evaluation: CONFIG.evaluation, version: CONFIG.version, variante, idCopie: idAleatoire(),
    debut: new Date().toISOString(), fin: null, partie: '1A', valides: {}, exporte: false,
    durees: { '1A': 0, '1B': 0, '2A': 0, '2B': 0, '2C': 0, '2D': 0, fin: 0 },
    ordres: {
      '1A': shuffle(v.cartes1A.map(c => c.id)),
      '2A': shuffle(CONFIG.motsDePasse.map(m => m.id)),
      '2C': shuffle(v.situations2C.map(c => c.id))
    },
    reponses: {
      '1A': {}, '1B': { s1: { dire: '', questions: ['', ''], ensuite: '' }, flash: '', s3: { dire: '', questions: ['', ''], ensuite: '' } },
      '2A': { justification: '' }, '2B': '', '2C': {},
      '2D': { prediction: '', predictionValidee: false, formulaire: {}, questionsFin: { q1: '', q2: '', q3: {} }, etape: 'prediction' }
    },
    sim: null
  };
}

/* ---------- Chronomètres ---------- */
let dernierTick = Date.now();
function tick() {
  const t = Date.now(), dt = (t - dernierTick) / 1000; dernierTick = t;
  if (!E || E.exporte) return;
  if (dt > 0 && dt < 30) {   // un trou (onglet fermé) ne compte pas
    E.durees[E.partie] = (E.durees[E.partie] || 0) + dt;
    if (typeof simTick === 'function') simTick(dt);
  }
  majEnTete();
}
setInterval(() => { tick(); }, 1000);
setInterval(() => { sauver(); }, 5000);

function totalSecondes() { return Object.values(E.durees).reduce((a, b) => a + b, 0); }

/* ---------- En-tête : progression + temps ---------- */
function majEnTete() {
  const top = $('#evtop'); if (!top || !E) return;
  const p = E.partie, conseil = CONFIG.tempsConseilles[p];
  const ecoule = E.durees[p] || 0;
  const liste = PARTIES.filter(x => x !== 'fin'), rang = liste.indexOf(p);
  $('.partname', top).innerHTML = p === 'fin' ? `<small>C'est fini !</small>${h(NOMS_PARTIES[p])}`
    : `<small>Partie ${rang + 1} sur ${liste.length} · ${p}</small>${h(NOMS_PARTIES[p])}`;
  $('.steps', top).innerHTML = liste.map(x => `<span class="${E.valides[x] ? 'done' : x === p ? 'cur' : ''}">${E.valides[x] ? '✓ ' : ''}${x}</span>`).join('');
  // Chronomètre de la partie : temps restant (compte à rebours), puis dépassement
  const chrono = $('.chrono', top);
  if (conseil) {
    const total = conseil * 60, reste = total - ecoule;
    const etat = reste < 0 ? 'over' : reste < 60 ? 'last' : '';
    chrono.className = 'chrono ' + etat;
    chrono.innerHTML = reste >= 0
      ? `<span class="lbl">Temps restant pour cette partie</span><span class="val">${mmss(reste)}</span><span class="sur">sur ${conseil} min</span><i style="width:${Math.min(100, 100 * ecoule / total).toFixed(1)}%"></i>`
      : `<span class="lbl">Temps conseillé dépassé de</span><span class="val">+${mmss(-reste)}</span><span class="sur">passez à la suite</span><i style="width:100%"></i>`;
  } else { chrono.className = 'chrono hidden'; chrono.innerHTML = ''; }
  const totConseil = Object.values(CONFIG.tempsConseilles).reduce((a, b) => a + b, 0);
  $('.total', top).innerHTML = `Temps total<b>${Math.floor(totalSecondes() / 60)} min</b><small>sur ${totConseil} min</small>`;
  $('.idc', top).textContent = E.idCopie;
}

function montrerEnTete() {
  if ($('#evtop')) return;
  const d = document.createElement('div'); d.id = 'evtop';
  d.innerHTML = `<span class="partname"></span><span class="steps"></span><span class="chrono"></span><span class="total"></span><span class="idc" title="Numéro de copie"></span>`;
  document.body.appendChild(d);
  const m = document.createElement('div'); m.id = 'evmain'; document.body.appendChild(m);
}

/* ---------- Fenêtres ---------- */
function confirmer(titre, texte, oui = 'Valider', non = 'Annuler') {
  return new Promise(res => {
    const o = document.createElement('div'); o.className = 'overlay';
    o.innerHTML = `<div class="modal confirm"><div class="mh"><h2>${titre}</h2></div><div class="mb">${texte}</div>
      <div class="mf">${non ? `<button class="btn ghost" data-r="0">${non}</button>` : ''}<button class="btn" data-r="1">${oui}</button></div></div>`;
    o.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (b) { o.remove(); res(b.dataset.r === '1'); } });
    document.body.appendChild(o);
    setTimeout(() => { const b = $('[data-r="1"]', o); if (b) b.focus(); }, 30);
  });
}
let toastTimer = null;
function toast(msg, ms = 3200) {
  let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
}

/* ---------- Navigation entre parties ---------- */
function afficherPartie() {
  montrerEnTete(); majEnTete();
  const main = $('#evmain');
  main.className = ''; main.scrollTop = 0;
  $$('.footbar').forEach(f => f.remove());
  RENDUS[E.partie](main);
}

async function validerPartie(verifVide) {
  const vides = verifVide ? verifVide() : 0;
  const msg = (vides ? `<p style="color:#8a4b00"><b>Attention : ${vides} réponse${vides > 1 ? 's' : ''} ${vides > 1 ? 'sont vides' : 'est vide'}.</b></p>` : '') +
    '<p>Une fois cette partie validée, <b>vous ne pourrez plus revenir en arrière</b> pour la modifier.</p>';
  if (!await confirmer('Valider cette partie ?', msg, 'Valider', 'Revenir à la partie')) return false;
  E.valides[E.partie] = true;
  E.partie = PARTIES[PARTIES.indexOf(E.partie) + 1];
  sauver(); afficherPartie();
  return true;
}

function footbar(html, onValider, verifVide) {
  const f = document.createElement('div'); f.className = 'footbar';
  f.innerHTML = `<span class="info">${html || ''}</span><button class="btn" id="btnvalider">Valider cette partie</button>`;
  document.body.appendChild(f);
  $('#btnvalider', f).onclick = () => { if (onValider) onValider(); validerPartie(verifVide); };
  return f;
}

/* Enregistre la valeur d'un champ dans l'état à chaque frappe */
function lier(el, get, set) { el.value = get() || ''; el.addEventListener('input', () => { set(el.value); sauver(); }); }

/* ---------- Export ---------- */
function construireExport() {
  const v = V(), R = E.reponses;
  const out = {
    evaluation: CONFIG.evaluation, version: CONFIG.version, variante: E.variante, idCopie: E.idCopie,
    debut: E.debut, fin: E.fin || new Date().toISOString(),
    dureesParPartie: Object.fromEntries(Object.entries(E.durees).map(([k, s]) => [k, Math.round(s)])),
    reponses: {
      '1A': E.ordres['1A'].map((id, i) => { const c = v.cartes1A.find(x => x.id === id); const r = R['1A'][id] || {};
        return { item: id, ordreAffiche: i + 1, support: c.type, adresseOuLien: adresseCarte(c), choix: r.choix || null, justification: r.justification || '' }; }),
      '1B': { situation1: R['1B'].s1, questionFlash: R['1B'].flash, situation2: R['1B'].s3 },
      '2A': { classement: (R['2A'].classement || E.ordres['2A']).map((id, i) => ({ rang: i + 1, item: id, lettre: lettre2A(id), texte: CONFIG.motsDePasse.find(m => m.id === id).texte })),
        classementModifie: !!R['2A'].modifie, justification: R['2A'].justification },
      '2B': R['2B'],
      '2C': E.ordres['2C'].map((id, i) => { const s = v.situations2C.find(x => x.id === id); const r = R['2C'][id] || {};
        const o = { item: id, ordreAffiche: i + 1, situation: s.texte, reponse: r.reponse || null }; if (s.etoile) o.justification = r.justification || ''; return o; }),
      '2D': { prediction: R['2D'].prediction, formulaire: R['2D'].formulaire, questionsFin: R['2D'].questionsFin }
    },
    simulateur: E.sim ? exportSimulateur() : null
  };
  return JSON.stringify(out, null, 2);
}

async function exporterCopie() {
  if (!E.fin) { E.fin = new Date().toISOString(); sauver(); }
  const json = construireExport();
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  if (window.showSaveFilePicker) {
    try {
      const fh = await window.showSaveFilePicker({ suggestedName: 'evaluation-demarches.json', types: [{ description: 'Copie (JSON)', accept: { 'application/json': ['.json'] } }] });
      const w = await fh.createWritable(); await w.write(blob); await w.close();
      return true;
    } catch (e) {
      if (e && e.name === 'AbortError') return false;   // l'élève a fermé la fenêtre
      /* sinon : on passe au téléchargement classique */
    }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'evaluation-demarches.json';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  return true;
}

/* ---------- Remise à zéro (professeur) ---------- */
async function remiseAZero(demander = true) {
  if (demander && !await confirmer('Remise à zéro', '<p>Effacer <b>toute</b> copie en cours sur cet ordinateur et revenir à l\'accueil ?</p><p style="color:#8a1f17">Une copie non exportée sera perdue.</p>', 'Tout effacer', 'Annuler')) return;
  effacerSauvegarde(); E = null; location.reload();
}
document.addEventListener('keydown', e => { if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); remiseAZero(true); } });

/* ---------- Accueil ---------- */
function afficherAccueil() {
  const w = document.createElement('div'); w.className = 'welcome';
  w.innerHTML = `<div class="wbox"><div>
      <h1>Démarches en ligne et identité numérique</h1>
      <div class="sub">Évaluation d'informatique — 1ère SAPAT — 60 minutes</div>
      <ul>
        <li>L'évaluation a deux parties : <b>1. Sites officiels et conseils</b>, puis <b>2. Identité numérique</b>, avec un simulateur.</li>
        <li>Chaque partie se termine par le bouton <b>« Valider cette partie »</b>. Ensuite, <b>on ne peut plus revenir en arrière</b>.</li>
        <li>En haut de l'écran : <b>le temps qu'il reste</b> pour la partie en cours. C'est une indication, rien ne se bloque. Si le temps est dépassé, passez à la suite.</li>
        <li>Répondez avec vos mots, en phrases courtes. <b>N'écrivez pas votre nom.</b></li>
        <li>À la fin, vous enregistrerez votre copie avec le nom donné par le professeur.</li>
      </ul>
      <div class="warn">Tous les sites, noms et numéros du simulateur sont inventés. Ne saisissez jamais vos vraies informations.</div>
    </div><div class="codebox">
      <h2>Code de séance</h2><p>Saisissez le code écrit au tableau.</p>
      <input id="codeinput" maxlength="4" inputmode="numeric" autocomplete="off">
      <div class="err" id="codeerr"></div>
      <button class="btn" id="codeok">Commencer</button>
      <div id="resume"></div>
    </div></div>`;
  document.body.appendChild(w);
  const inp = $('#codeinput', w), err = $('#codeerr', w);
  inp.focus();
  const go = async () => {
    const code = inp.value.trim(); err.textContent = ''; $('#resume', w).innerHTML = '';
    if (code === CONFIG.codeRemiseAZero) { inp.value = ''; return remiseAZero(true); }
    const variante = CONFIG.codesSeance[code];
    if (!variante) { err.textContent = 'Code incorrect.'; inp.select(); return; }
    const sav = lireSauvegarde();
    if (sav && !sav.exporte && sav.evaluation === CONFIG.evaluation) {
      if (sav.variante !== variante) { err.textContent = 'Une autre copie est en cours sur cet ordinateur. Appelez le professeur.'; return; }
      $('#resume', w).innerHTML = `<div class="resume">Une copie commencée sur cet ordinateur n'a pas été enregistrée (copie ${h(sav.idCopie)}, partie ${h(sav.partie)}).<br><button class="btn" id="btnresume" style="margin-top:8px">Reprendre la copie en cours</button></div>`;
      $('#btnresume', w).onclick = () => { E = sav; w.remove(); dernierTick = Date.now(); afficherPartie(); };
      $('#codeok', w).disabled = true;
      return;
    }
    E = nouvelleCopie(variante); sauver();
    w.remove(); dernierTick = Date.now(); afficherPartie();
  };
  $('#codeok', w).onclick = go;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  inp.addEventListener('input', () => { $('#codeok', w).disabled = false; $('#resume', w).innerHTML = ''; err.textContent = ''; });
}

const RENDUS = {};   // rempli par parties.js et simulateur.js
window.addEventListener('beforeunload', () => sauver());
window.addEventListener('load', () => { afficherAccueil(); });
