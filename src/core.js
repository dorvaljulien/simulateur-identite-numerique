/* =====================================================================
   MOTEUR : état, horloge, mails, téléphone, navigateur fictif, étapes
   ===================================================================== */
const P = PERSONNAGES[CONFIG.personnage];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[\s\-'’.]/g, '');
const digits = s => String(s || '').replace(/\D/g, '');
const rand6 = () => String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
const token = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8);
const fmtNF = n => n.replace(/(\d{4})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');

let S = null;          // état complet du simulateur (en mémoire uniquement)
const SITES = {};      // sites fictifs, enregistrés par les fichiers site-*.js

function freshState() {
  return {
    step: 0,
    phase2: 'avant',          // étape 2 : 'avant' ou 'apres' le saut dans le temps
    waitingCode: 0,           // n° d'étape terminée en attente du code de passage
    timers: [],
    clock: { base: 0, realStart: Date.now() },
    fiscalis: {
      account: null,          // { numero, mail, password, active, initialPassword }
      pending: null,          // compte en attente d'activation
      activationToken: null,
      failures: 0, lockedUntil: 0,
      code: null,             // { value, expires, used }
      loginStage: null,       // numéro saisi en attente du code
      loggedIn: false,
      resetTokens: {},        // token → { expires, used }
      oldPasswords: [],
      revealed: [],           // règles de mot de passe déjà révélées
      phishSent: false
    },
    numerid: { status: null, authOk: null, session: false },
    santea: { loggedIn: false },
    forma: { loggedIn: false, dossiers: [] },
    idp: { service: 'santea' },
    maboite: { loggedIn: true, passkey: false, view: 'list', folder: 'inbox', openId: null, settings: null, search: '' },
    browser: { saved: {}, never: {}, cookies: {}, envraiClosed: {} },
    tabs: [], activeTab: null,
    mails: [], notifs: [],
    incidents: { refus: 0, enregistre: null, codeExpire: false, bloque: false, fauxLu: false, fauxOuvert: false, fauxIdentifiants: false, avisAnDernier: false, avisConjoint: false,
      codeSecretFaux: false, refusPlus: false, fausseDemande: null, etape4: false }
  };
}

function later(fn, ms) { const id = setTimeout(fn, ms); S.timers.push(id); return id; }
function every(fn, ms) { const id = setInterval(fn, ms); S.timers.push(id); return id; }

/* ---------- Horloge fictive ---------- */
function setClock(o) {
  S.clock.base = new Date(o.annee, o.mois - 1, o.jour, o.heure, o.minute, 0).getTime();
  S.clock.realStart = Date.now();
}
function now() { return new Date(S.clock.base + (Date.now() - S.clock.realStart)); }
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOISC = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const hhmm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
const longDate = d => JOURS[d.getDay()] + ' ' + (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS[d.getMonth()];
const shortDate = d => d.getDate() + ' ' + MOISC[d.getMonth()];

/* ---------- Petits utilitaires d'interface ---------- */
function toast(msg, ms = 3500) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.add('hidden'), ms);
}
function openModal(title, bodyHtml, cls = '') {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal ${cls}"><div class="mh"><h2>${title}</h2><span class="close" title="Fermer">✕</span></div><div class="mb">${bodyHtml}</div></div>`;
  ov.querySelector('.close').onclick = () => ov.remove();
  ov.addEventListener('mousedown', e => { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
  return ov;
}

/* ---------- Mails ---------- */
let mailSeq = 1;
function deliverMail(m, opts = {}) {
  const delay = opts.delay != null ? opts.delay
    : (CONFIG.durees.delaiMailMin + Math.random() * (CONFIG.durees.delaiMailMax - CONFIG.durees.delaiMailMin)) * 1000;
  const doIt = () => {
    const mail = Object.assign({ id: mailSeq++, folder: 'inbox', read: false, etape: S.step, at: now().getTime() }, m);
    S.mails.unshift(mail);
    if (!opts.silent) {
      pushNotif('MaBoîte', mail.fromName, mail.subject);
      mail.fresh = true;
    }
    renderMail();
  };
  if (delay <= 0) doIt(); else later(doIt, delay);
}
function mailTime(m) {
  if (m.dayLabel) return m.dayLabel;
  const d = new Date(m.at), n = now();
  if (d.toDateString() === n.toDateString()) return hhmm(d);
  return shortDate(d);
}

/* ---------- Téléphone ---------- */
// pinRequest : demande affichée sur le téléphone.
//   stage 'confirm' : une application demande « Est-ce bien vous ? » (Non / Oui)
//   stage 'pin'     : saisie d'un code à 4 chiffres (code du téléphone, ou code secret d'une application)
let pinRequest = null;
function pushNotif(app, title, text) {
  S.notifs.unshift({ app, title, text, at: Date.now() });
  S.notifs = S.notifs.slice(0, 6);
  renderPhone();
}
function renderPhone() {
  const d = now();
  const unread = S.mails.filter(m => !m.read && m.folder === 'inbox').length;
  const notifs = S.notifs.slice(0, 3).map(n =>
    `<div class="notif ${Date.now() - n.at < 6000 ? 'fresh' : ''}"><b>${h(n.app)} · maintenant</b>${h(n.title)}<br>${h(n.text).slice(0, 60)}</div>`).join('');
  let pin = '';
  const R = pinRequest;
  if (R) {
    const app = R.app ? `<div class="app"><i></i>${h(R.app)}</div>` : '';
    if (R.stage === 'confirm') {
      pin = `<div class="pinpad">${app}<div class="t ask">${R.html}</div><div class="yn"><span data-pk="no">Non, refuser</span><span data-pk="yes" class="y">Oui, c'est moi</span></div></div>`;
    } else {
      const dots = [0, 1, 2, 3].map(i => `<i class="${i < R.typed.length ? 'f' : ''}"></i>`).join('');
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', R.app ? '✕' : '', '0', '⌫'].map(k => `<span data-k="${k}">${k}</span>`).join('');
      pin = `<div class="pinpad">${app}<div class="t">${h(R.text)}</div><div class="dots">${dots}</div><div class="err">${R.err || ''}</div><div class="keys">${keys}</div></div>`;
    }
  }
  $('#phone').classList.toggle('active', !!R);
  $('#phone').innerHTML = `<div class="scr"><div class="sbar"><span>${hhmm(d)}</span><span>📶 4G ▮▮▮▯</span></div>
    <div class="big">${hhmm(d)}</div><div class="date">${longDate(d)}</div>${notifs}${pin}</div>
    ${unread ? `<span class="badge">${unread}</span>` : ''}`;
  $('#deskclock').textContent = longDate(d) + ' — ' + hhmm(d);
}
function phoneShow(req) {
  // Une demande inattendue en cours passe d'abord : il faut y répondre avant de voir la suivante
  if (pinRequest && pinRequest.fake) { pinRequest.next = req; return; }
  pinRequest = req; renderPhone();
}
function phoneDone() {
  const next = pinRequest && pinRequest.next;
  pinRequest = next || null; renderPhone();
}
function phoneAskPin(text, onOk, onCancel) {
  phoneShow({ stage: 'pin', text, typed: '', onOk, onCancel, err: '', expect: P.pinTelephone });
}
/* Demande de confirmation d'une application (identité numérique) : « Est-ce bien vous ? » puis code secret */
function phoneAskConfirm(o) {
  phoneShow(Object.assign({ stage: 'confirm', typed: '', err: '', tries: 0 }, o));
}
function phoneCancel(id) { if (pinRequest && pinRequest.id === id) phoneDone(); else if (pinRequest && pinRequest.next && pinRequest.next.id === id) pinRequest.next = null; }
function phoneChoice(v) {
  const R = pinRequest;
  if (!R || R.stage !== 'confirm') return;
  if (v === 'yes') { R.stage = 'pin'; renderPhone(); return; }
  phoneDone(); R.onRefuse && R.onRefuse();
}
function phoneKey(k) {
  const R = pinRequest;
  if (!R || R.stage !== 'pin') return;
  if (k === '✕') { phoneDone(); (R.onRefuse || R.onCancel || (() => {}))(); return; }
  if (k === '⌫') R.typed = R.typed.slice(0, -1);
  else if (k && R.typed.length < 4) R.typed += k;
  R.err = '';
  if (R.typed.length === 4) {
    if (R.typed === R.expect) { phoneDone(); R.onOk && R.onOk(); return; }
    R.typed = ''; R.err = 'Code incorrect'; R.tries = (R.tries || 0) + 1;
    R.onWrong && R.onWrong(R);
    if (R.maxTries && R.tries >= R.maxTries) { phoneDone(); R.onBlocked && R.onBlocked(); return; }
  }
  renderPhone();
}

/* ---------- Navigateur fictif ---------- */
let tabSeq = 1;
function parseUrl(u) {
  u = String(u || '').trim().replace(/^https?:\/\//i, '');
  const m = u.match(/^([^\/?#]*)([^?#]*)(\?[^#]*)?/);
  const host = (m[1] || '').toLowerCase().replace(/^www\./, '');
  const path = m[2] || '/';
  const params = {};
  (m[3] || '').slice(1).split('&').filter(Boolean).forEach(kv => {
    const [k, v = ''] = kv.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
  });
  return { host, path, params, url: host + path + (m[3] || '') };
}
function curTab() { return S.tabs.find(t => t.id === S.activeTab); }
function openTab(url, focus = true) {
  const t = { id: tabSeq++, history: [], idx: -1, title: 'Nouvel onglet', fav: null };
  S.tabs.push(t);
  if (focus) S.activeTab = t.id;
  navigate(url || 'trouvo.sim', t);
  return t;
}
function closeTab(id) {
  const i = S.tabs.findIndex(t => t.id === id);
  if (i < 0) return;
  S.tabs.splice(i, 1);
  if (!S.tabs.length) { openTab('trouvo.sim'); return; }
  if (S.activeTab === id) S.activeTab = S.tabs[Math.max(0, i - 1)].id;
  renderBrowser();
}
function navigate(url, tab = curTab(), opts = {}) {
  const t = tab;
  // URL relative au site courant
  if (url.startsWith('/') && t.history[t.idx]) url = parseUrl(t.history[t.idx]).host + url;
  const p = parseUrl(url);
  if (!opts.replace) { t.history = t.history.slice(0, t.idx + 1); t.history.push(p.url); t.idx++; }
  else t.history[t.idx] = p.url;
  if (t.id === S.activeTab) renderBrowser(); else renderTabs();
  if (t.id === S.activeTab) { const lb = $('#loadingbar'); lb.style.transition = 'none'; lb.style.width = '0'; lb.offsetWidth; lb.style.transition = ''; lb.style.width = '100%'; setTimeout(() => lb.style.width = '0', 420); }
}
function goBack() { const t = curTab(); if (t.idx > 0) { t.idx--; renderBrowser(); } }
function goFwd() { const t = curTab(); if (t.idx < t.history.length - 1) { t.idx++; renderBrowser(); } }
function reload() { renderBrowser(); }
function ctxFor(t) {
  const p = parseUrl(t.history[t.idx]);
  return Object.assign(p, { tab: t, site: SITES[p.host] });
}
function renderTabs() {
  $('#tabstrip').innerHTML = S.tabs.map(t => {
    const p = parseUrl(t.history[t.idx] || '');
    const site = SITES[p.host];
    const fav = site ? site.fav : { bg: '#9aa0a6', t: '•' };
    return `<div class="btab ${t.id === S.activeTab ? 'active' : ''}" data-tab="${t.id}" title="${h(t.title)}">
      <span class="fav" style="background:${fav.bg}">${fav.t}</span><span class="ttl">${h(t.title)}</span><span class="x" data-close="${t.id}">✕</span></div>`;
  }).join('') + '<button id="newtabbtn" title="Nouvel onglet">+</button>';
}
function renderBrowser() {
  const t = curTab();
  if (!t) return;
  const ctx = ctxFor(t);
  const site = ctx.site;
  let out;
  if (!site) out = { title: ctx.host || 'Nouvel onglet', html: netError(ctx.host) };
  else out = site.render(ctx) || { title: site.name, html: '' };
  t.title = out.title;
  // Barre d'adresse
  const insecure = site && site.insecure;
  $('#secure').className = 'secure' + (insecure ? ' bad' : '');
  $('#secure').innerHTML = insecure ? '⚠ Non sécurisé' : (site ? '🔒' : 'ⓘ');
  $('#secure').title = insecure ? 'La connexion à ce site n\'est pas sécurisée' : 'La connexion est sécurisée';
  $('#urlinput').value = ctx.url === 'trouvo.sim/' ? '' : (insecure ? 'http://' : 'https://') + ctx.url;
  $('#urlinput').placeholder = 'Rechercher sur Trouvo ou saisir une adresse';
  $('#keyic').classList.toggle('hidden', !S.browser.saved[ctx.host]);
  $('#btnback').disabled = t.idx <= 0;
  $('#btnfwd').disabled = t.idx >= t.history.length - 1;
  // Contenu
  const vp = $('#viewport');
  let cookie = '';
  if (site && site.cookie && !S.browser.cookies[ctx.host]) cookie = site.cookie();
  vp.innerHTML = `<div class="page ${site ? site.cls || '' : ''}">${out.html}${cookie}</div>`;
  vp.scrollTop = 0;
  $('#pwdprompt').classList.add('hidden');
  // Cartouche « En vrai »
  const ev = $('#envraifloat');
  const evText = site && (typeof site.envrai === 'function' ? site.envrai(ctx) : site.envrai);
  if (evText && !S.browser.envraiClosed[ctx.host]) { ev.innerHTML = evText + '<span class="close" title="Masquer">✕</span>'; ev.classList.remove('hidden'); }
  else ev.classList.add('hidden');
  renderTabs();
  if (site && site.after) { try { site.after(vp.firstElementChild, ctx); } catch (e) { console.error(e); } }
  renderGate();
}
function netError(host) {
  return `<div class="neterr"><div class="dino">🦖</div><h1>Ce site est inaccessible</h1>
    <p>Impossible de trouver l'adresse IP du serveur de <b>${h(host)}</b>.</p>
    <p>Essayez de :</p><ul><li>Vérifier si l'adresse comporte une faute de frappe</li><li>Rechercher le site sur Trouvo</li></ul>
    <code>DNS_PROBE_FINISHED_NXDOMAIN</code>
    <p style="margin-top:40px;font-size:12px;color:#999">(Simulation : seuls les sites fictifs du simulateur sont accessibles.)</p></div>`;
}
function omniboxGo(v) {
  v = v.trim();
  if (!v) return;
  const looksUrl = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(v) && !/\s/.test(v);
  navigate(looksUrl ? v : 'trouvo.sim/recherche?q=' + encodeURIComponent(v));
}
function savedCreds(host) { return S.browser.saved[host] || null; }
function askSavePassword(host, user, pass, cb, update = false) {
  if (S.browser.never[host]) { cb && cb(null); return; }
  const pp = $('#pwdprompt');
  pp.innerHTML = `<h4>${update ? 'Mettre à jour le mot de passe' : 'Enregistrer le mot de passe'} pour ${h(host)} ?</h4>
    <div class="row"><label>Nom d'utilisateur</label><input value="${h(user)}" readonly></div>
    <div class="row"><label>Mot de passe</label><input type="password" value="${h(pass)}" readonly></div>
    <div class="note">Les mots de passe sont enregistrés dans le navigateur de cet ordinateur.</div>
    <div class="btns"><button data-pp="no">${update ? 'Non merci' : 'Jamais'}</button><button class="prim" data-pp="yes">${update ? 'Mettre à jour' : 'Enregistrer'}</button></div>`;
  pp.classList.remove('hidden');
  pp.onclick = e => {
    const b = e.target.closest('[data-pp]');
    if (!b) return;
    pp.classList.add('hidden');
    if (b.dataset.pp === 'yes') { S.browser.saved[host] = { user, pass }; $('#keyic').classList.remove('hidden'); toast('Mot de passe enregistré dans le navigateur.'); cb && cb(true); }
    else { if (!update) S.browser.never[host] = true; cb && cb(false); }
  };
}
function cookieBar(host, style, policyName) {
  return `<div class="cookiebar" style="${style}" data-cookiebar>
    <p><b>Gestion des cookies.</b> ${h(policyName)} utilise des cookies nécessaires au fonctionnement du site, ainsi que des cookies de mesure d'audience. Vous pouvez accepter ou refuser ces derniers, ou personnaliser vos choix. Pour en savoir plus, consultez notre <u>politique de gestion des cookies</u>.</p>
    <button data-act="cookie" data-v="perso" style="background:transparent;border:1px solid currentColor;color:inherit">Personnaliser</button>
    <button data-act="cookie" data-v="non" style="background:transparent;border:1px solid currentColor;color:inherit">Tout refuser</button>
    <button data-act="cookie" data-v="oui" style="background:#fff;border:1px solid #fff;color:#222;font-weight:600">Tout accepter</button></div>`;
}

/* ---------- Étapes, codes de passage, masque ---------- */
function setMission() {
  const key = S.step === 2 && S.phase2 === 'apres' ? '2b' : S.step;
  const txt = CONFIG.missions[key] || '';
  $('#mission').title = txt;
  $('#restartbtn').style.display = S.step >= 1 && S.step <= 4 ? '' : 'none';
  $('#mission').innerHTML = S.step ? `<b>${S.step >= 5 ? 'Fin' : 'Étape ' + S.step}</b>${h(txt)}` : '';
}
function completeStep(n) {
  if (S.waitingCode >= n) return;
  S.waitingCode = n;
  renderGate();
}
function renderGate() {
  let g = $('#gate');
  if (!S.waitingCode) { g && g.remove(); return; }
  if (!g) { g = document.createElement('div'); g.id = 'gate'; g.className = 'gate'; $('#browser').appendChild(g); }
  g.innerHTML = `<div class="box"><h2>✔ Étape ${S.waitingCode} terminée</h2>
    <p>Bravo, vous avez atteint l'objectif de cette étape.</p>
    <p>Levez la main : le professeur vous donnera le <b>code de passage</b> pour continuer.</p>
    <p class="arrow">Le code se saisit en haut à droite, dans « Code de passage ».</p></div>`;
}
/* Bouton « Recommencer l'étape » : remet le simulateur au début de l'étape en cours.
   Les incidents déjà relevés pour le récapitulatif sont conservés. */
function restartStep() {
  if (S.step < 1 || S.step > 4) return;
  if (!confirm('Recommencer l\'étape ' + S.step + ' depuis le début ?\n\nCe que vous avez fait dans cette étape sera effacé.')) return;
  if (S.step === 1) { const inc = S.incidents; resetAll(); $$('.fullscreen.welcome').forEach(o => o.remove()); S.incidents = inc; S.step = 1; setMission(); renderBrowser(); return; }
  gotoStep(S.step);
}
function enterCode(raw) {
  const c = digits(raw);
  const box = $('#codebox');
  const fail = () => { box.classList.remove('err'); void box.offsetWidth; box.classList.add('err'); };
  if (c.length !== 3) return fail();
  $('#codeinput').value = '';
  if (c === CONFIG.codes.reinitialisation) { if (confirm('Tout remettre à zéro ?')) resetAll(); return; }
  if (c === CONFIG.codes.etape2) return gotoStep(2);
  if (c === CONFIG.codes.etape3) return gotoStep(3);
  if (c === CONFIG.codes.etape4) return gotoStep(4);
  if (c === CONFIG.codes.recap) return gotoStep(5);
  fail();
}

/* Met le simulateur dans l'état attendu au début de l'étape n */
function gotoStep(n) {
  const prev = S.step;
  S.waitingCode = 0;
  $$('.overlay').forEach(o => o.remove());
  // On retire les mails produits pendant cette étape et les suivantes
  S.mails = S.mails.filter(m => m.etape < n || m.keep);
  S.notifs = []; pinRequest = null;
  Object.assign(S.maboite, { view: 'list', folder: 'inbox', openId: null, search: '' });
  const F = S.fiscalis;
  let notice = '';
  if (n >= 2) {
    if (!F.account || !F.account.active) {
      F.account = { numero: P.numeroFiscal, mail: P.mail, password: CONFIG.reprise.motDePasseFiscalis, initialPassword: CONFIG.reprise.motDePasseFiscalis, active: true };
      F.pending = null;
      notice = `Votre espace Fiscalis a été créé pour vous.<br>Numéro fiscal : <b>${fmtNF(P.numeroFiscal)}</b><br>Mot de passe : <b>${h(CONFIG.reprise.motDePasseFiscalis)}</b><br><br>Notez-le sur votre fiche.`;
    }
    if (!S.mails.some(m => m.tag === 'activation')) {
      deliverMail(mailActivationFiscalis('done'), { delay: 0, silent: true });
      S.mails[0].read = true; S.mails[0].etape = 1; S.mails[0].folder = 'spam';
    }
    F.loggedIn = false; F.failures = 0; F.lockedUntil = 0; F.code = null; F.loginStage = null; F.resetTokens = {};
  }
  if (n === 2) {
    S.step = 2; S.phase2 = 'avant';
    F.account.password = F.account.initialPassword;
    F.oldPasswords = []; F.phishSent = false;
    setClock(Object.assign({}, CONFIG.horloge.depart, { minute: CONFIG.horloge.depart.minute + 25 }));
    S.tabs.forEach(t => t.history = t.history.filter(u => !u.includes('/activation')));
    S.tabs = S.tabs.filter(t => t.history.length); if (!S.tabs.length) openTab('fiscalis.gouv.sim', true);
    S.activeTab = S.tabs[S.tabs.length - 1].id;
    navigate('fiscalis.gouv.sim');
  }
  if (n >= 3) {
    S.phase2 = 'apres';
    if (F.oldPasswords.length === 0) { F.oldPasswords.push(F.account.password); F.account.password = CONFIG.motDePasseChangeTelephone; }
    if (n === 3 || prev < 3) setClock(Object.assign({}, CONFIG.horloge.apresSaut, { minute: CONFIG.horloge.apresSaut.minute + 20 }));
    if (!S.mails.some(m => m.tag === 'inter')) addIntermediateMails(true);
    if (n < 5) { S.santea.loggedIn = false; S.numerid = { status: null, authOk: null, session: false }; S.forma = { loggedIn: false, dossiers: [] }; }
  }
  if (n === 3) {
    S.step = 3;
    S.tabs = []; openTab('trouvo.sim');
  }
  if (n === 4) {
    S.step = 4;
    setClock(Object.assign({}, CONFIG.horloge.apresSaut, { minute: CONFIG.horloge.apresSaut.minute + 45 }));
    S.tabs = []; openTab('trouvo.sim');
    const m = CONFIG.mailEtape4;
    if (m) deliverMail({ fromName: m.de, fromAddr: m.adresse, subject: m.objet, html: m.corps, etape: 4 }, { delay: 1500 });
    if (CONFIG.fausseDemande.active && !S.incidents.fausseDemande) later(fakeRequest, CONFIG.durees.delaiFausseDemande * 1000);
  }
  if (n === 5) { S.step = 5; showRecap(); }
  setMission(); renderMail(); renderPhone(); renderBrowser();
  if (notice) openModal('Reprise', `<div style="font-size:15px;line-height:1.6;max-width:420px">${notice}</div>`);
}

/* Saut dans le temps (après la première déconnexion de l'étape 2) */
function timeJump() {
  const el = document.createElement('div');
  el.className = 'fullscreen timejump';
  el.innerHTML = `<div class="tj"><h1>Trois semaines plus tard…</h1>
    <p>Vous avez changé votre mot de passe Fiscalis depuis votre téléphone la semaine dernière,<br>et vous ne l'avez noté nulle part.</p>
    <button>Continuer</button></div>`;
  document.body.appendChild(el);
  el.querySelector('button').onclick = () => {
    el.remove();
    const F = S.fiscalis;
    S.phase2 = 'apres';
    F.oldPasswords.push(F.account.password);
    F.account.password = CONFIG.motDePasseChangeTelephone;
    F.loggedIn = false; F.failures = 0; F.lockedUntil = 0; F.code = null; F.loginStage = null;
    setClock(CONFIG.horloge.apresSaut);
    S.notifs = [];
    addIntermediateMails(false);
    setMission();
    S.tabs.forEach(t => { t.history = [t.history[t.idx]]; t.idx = 0; });
    navigate('fiscalis.gouv.sim', curTab(), { replace: true });
    renderPhone(); renderMail();
  };
}
function addIntermediateMails(silent) {
  // du plus ancien au plus récent, pour que le plus récent soit en haut de la boîte
  CONFIG.mailsIntermediaires.slice().sort((a, b) => parseInt(a.jour) - parseInt(b.jour)).forEach((m, i) => {
    deliverMail({ fromName: m.de, fromAddr: m.adresse, subject: m.objet, html: m.corps, dayLabel: m.jour, tag: 'inter', etape: 2 },
      { delay: silent ? 0 : 400 + i * 350, silent: silent || i < 5 });
  });
}

/* ---------- Réinitialisation complète ---------- */
function resetAll() {
  if (S) S.timers.forEach(id => { clearTimeout(id); clearInterval(id); });
  $$('.overlay, .fullscreen').forEach(o => o.remove());
  S = freshState();
  pinRequest = null;
  setClock(CONFIG.horloge.depart);
  initialMails();
  S.tabs = []; openTab('trouvo.sim');
  setMission(); renderMail(); renderPhone();
  every(() => { renderPhone(); }, 15000);
  every(() => { if (S.mails.some(m => m.fresh)) { S.mails.forEach(m => m.fresh = false); } }, 4000);
  showWelcome();
}

/* ---------- Accueil (étape 0) ---------- */
function showWelcome() {
  const el = document.createElement('div');
  el.className = 'fullscreen welcome';
  el.innerHTML = `<div class="wbox"><div>
      <h1>Mon identité numérique</h1>
      <div class="when">${longDate(now()).replace(/^./, c => c.toUpperCase())} ${now().getFullYear()}, ${hhmm(now())}</div>
      <p style="font-size:15px;line-height:1.6">Aujourd'hui, vous êtes <b>${P.prenom} ${P.nomUsage}</b>. Vous allez faire vos démarches en ligne, comme à la maison.</p>
      <ol>
        <li>À gauche : un <b>navigateur internet</b>, comme Chrome ou Edge.</li>
        <li>À droite : votre <b>boîte mail</b> MaBoîte, votre <b>téléphone</b>, vos <b>papiers</b> et votre <b>carte</b>.</li>
        <li>En haut : votre mission du moment, et le champ « Code de passage ».</li>
        <li>Si vous êtes bloquée : vous levez la main. Il n'y a pas de bouton d'aide.</li>
      </ol>
      <div class="warn">Simulation pédagogique : tous les sites, noms et numéros sont inventés. Ne saisissez jamais vos vraies informations.</div>
      <button class="bigbtn">Commencer</button>
    </div><div class="mini">${carteHtml(true)}</div></div>`;
  document.body.appendChild(el);
  el.querySelector('.bigbtn').onclick = () => { el.remove(); S.step = 1; setMission(); renderBrowser(); };
}

/* ---------- Montage de l'interface ---------- */
function buildShell() {
  document.body.innerHTML = `
  <div id="app">
    <div id="topbar">
      <span class="simlabel" id="simlabel" title="">Simulation pédagogique — aucun site réel</span>
      <span class="mission" id="mission"></span>
      <button id="restartbtn" title="Recommencer l'étape en cours depuis le début">↺ Recommencer l'étape</button>
      <span class="codebox" id="codebox">Code de passage <input id="codeinput" maxlength="3" inputmode="numeric" autocomplete="off"><button id="codeok">OK</button></span>
    </div>
    <div id="main">
      <div id="browser">
        <div id="tabstrip"></div>
        <div id="toolbar">
          <button class="tbtn" id="btnback" title="Précédent">←</button>
          <button class="tbtn" id="btnfwd" title="Suivant">→</button>
          <button class="tbtn" id="btnreload" title="Actualiser">⟳</button>
          <div id="omnibox"><span class="secure" id="secure">🔒</span><input id="urlinput" spellcheck="false" autocomplete="off"><span class="omni-ic hidden" id="keyic" title="Mots de passe enregistrés">🔑</span><span class="omni-ic" title="Ajouter aux favoris">☆</span></div>
          <button class="tbtn" title="Téléchargements">⤓</button>
          <button class="tbtn" title="Profil">👤</button>
          <button class="tbtn" title="Personnaliser et contrôler">⋮</button>
        </div>
        <div id="viewport"></div>
        <div id="loadingbar"></div>
        <div id="pwdprompt" class="hidden"></div>
        <div id="envraifloat" class="envrai hidden"></div>
      </div>
      <div id="side">
        <div id="mail"></div>
        <div id="desk">
          <div id="phone" title="Téléphone"></div>
          <div id="deskitems">
            <button class="deskbtn" id="btnpapiers"><span class="ic">🗂️</span><span>Mes papiers<small>Le trieur de la maison</small></span></button>
            <button class="deskbtn" id="btncarte"><span class="ic">🪪</span><span>Ma carte<small>Qui suis-je ?</small></span></button>
            <div class="deskclock" id="deskclock"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  $('#codeok').onclick = () => enterCode($('#codeinput').value);
  $('#restartbtn').onclick = restartStep;
  $('#codeinput').addEventListener('keydown', e => { if (e.key === 'Enter') enterCode(e.target.value); });
  $('#btnback').onclick = goBack; $('#btnfwd').onclick = goFwd; $('#btnreload').onclick = reload;
  $('#urlinput').addEventListener('keydown', e => { if (e.key === 'Enter') { omniboxGo(e.target.value); e.target.blur(); } });
  $('#urlinput').addEventListener('focus', e => setTimeout(() => e.target.select(), 0));
  $('#keyic').onclick = () => { const c = savedCreds(parseUrl(curTab().history[curTab().idx]).host); if (c) toast('Mot de passe enregistré pour ' + c.user + ' : ••••••••'); };
  $('#tabstrip').addEventListener('click', e => {
    const x = e.target.closest('[data-close]');
    if (x) { closeTab(+x.dataset.close); return; }
    if (e.target.closest('#newtabbtn')) { openTab('trouvo.sim'); return; }
    const t = e.target.closest('[data-tab]');
    if (t) { S.activeTab = +t.dataset.tab; renderBrowser(); }
  });
  $('#envraifloat').addEventListener('click', e => {
    if (e.target.classList.contains('close')) { S.browser.envraiClosed[parseUrl(curTab().history[curTab().idx]).host] = true; $('#envraifloat').classList.add('hidden'); }
  });
  // Délégation des événements dans les pages des sites
  const vp = $('#viewport');
  vp.addEventListener('click', e => {
    const ctx = ctxFor(curTab());
    const act = e.target.closest('[data-act]');
    if (act) {
      e.preventDefault();
      if (act.dataset.act === 'cookie') { S.browser.cookies[ctx.host] = act.dataset.v; const cb = $('[data-cookiebar]', vp); cb && cb.remove(); return; }
      ctx.site && ctx.site.action && ctx.site.action(act.dataset.act, act, ctx, vp.firstElementChild);
      return;
    }
    const go = e.target.closest('[data-go]');
    if (go) { e.preventDefault(); if (go.dataset.newtab != null) openTab(go.dataset.go.startsWith('/') ? ctx.host + go.dataset.go : go.dataset.go); else navigate(go.dataset.go); return; }
    if (e.target.closest('a')) e.preventDefault();
  });
  vp.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target.closest('form[data-form]');
    const ctx = ctxFor(curTab());
    if (f && ctx.site && ctx.site.submit) ctx.site.submit(f.dataset.form, f, ctx, vp.firstElementChild);
  });
  // Bulle d'adresse en bas à gauche au survol d'un lien (comme un vrai navigateur)
  const status = document.createElement('div');
  status.style.cssText = 'position:absolute;left:0;bottom:0;background:#f1f3f4;border:1px solid #dadce0;border-left:0;border-bottom:0;border-radius:0 6px 0 0;padding:2px 8px;font-size:11.5px;color:#3c4043;z-index:35;display:none;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
  $('#browser').appendChild(status);
  vp.addEventListener('mouseover', e => {
    const go = e.target.closest('[data-go]');
    if (!go) { status.style.display = 'none'; return; }
    let u = go.dataset.go;
    if (u.startsWith('/')) u = parseUrl(curTab().history[curTab().idx]).host + u;
    const site = SITES[parseUrl(u).host];
    status.textContent = (site && site.insecure ? 'http://' : 'https://') + u.split('?')[0];
    status.style.display = 'block';
  });
  vp.addEventListener('mouseleave', () => status.style.display = 'none');

  $('#phone').addEventListener('click', e => { const k = e.target.closest('[data-k]'); if (k) { phoneKey(k.dataset.k); return; } const c = e.target.closest('[data-pk]'); if (c) phoneChoice(c.dataset.pk); });
  $('#btnpapiers').onclick = openTrieur;
  $('#btncarte').onclick = () => openModal('Ma carte', carteHtml(false), 'carte');
  // Fonctions professeur
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); if (confirm('Réinitialisation complète du simulateur ?')) resetAll(); }
    if (e.ctrlKey && e.altKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); openFicheProf(); }
  });
  $('#simlabel').addEventListener('dblclick', e => { if (e.shiftKey) openFicheProf(); });
}

window.addEventListener('DOMContentLoaded', () => { buildShell(); resetAll(); });
