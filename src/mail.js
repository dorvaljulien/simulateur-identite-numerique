/* =====================================================================
   MaBoîte : webmail fictif (panneau de droite)
   ===================================================================== */
function initialMails() {
  (CONFIG.mailsInitiaux || []).slice().reverse().forEach(m => {
    deliverMail({ fromName: m.de, fromAddr: m.adresse, subject: m.objet, html: m.corps, dayLabel: m.jour, folder: m.dossier || 'inbox', etape: 0, keep: true }, { delay: 0, silent: true });
    S.mails[0].read = !!m.lu;
  });
}
const avColor = s => { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) % 360; return `hsl(${x},45%,45%)`; };
const FOLDERS = [['inbox', 'Réception'], ['spam', 'Indésirables'], ['sent', 'Envoyés'], ['trash', 'Corbeille']];

function renderMail() {
  const M = S.maboite;
  const el = $('#mail');
  if (!el) return;
  const head = `<div class="mhead"><span class="logo">${logo('maboite', deuxTons('MaBoîte'), 30)}</span><span class="sp"></span>
    ${M.loggedIn ? `<span class="who" title="${h(P.mail)}">${h(P.mail)}</span><span class="mi" data-m="settings" title="Paramètres">⚙</span>` : ''}
    <span class="mi" data-m="wide" title="Agrandir / réduire">⤢</span></div>`;
  if (!M.loggedIn) { el.innerHTML = head + mailLoginView(); return; }
  if (M.view === 'settings') { el.innerHTML = head + `<div class="mbody">${mailSettingsView()}</div>`; return; }
  const cnt = f => S.mails.filter(m => m.folder === f && !m.read).length;
  const folders = `<div class="mfolders">${FOLDERS.map(([k, n]) => {
    const c = cnt(k);
    return `<span class="${M.folder === k ? 'on' : ''}" data-folder="${k}">${n}${c && (k === 'inbox' || k === 'spam') ? `<span class="cnt ${k === 'spam' ? 'spam' : ''}">${c}</span>` : ''}</span>`;
  }).join('')}</div>`;
  let body;
  if (M.view === 'read') {
    const m = S.mails.find(x => x.id === M.openId);
    body = m ? mailReadView(m) : '';
  } else {
    const q = norm(M.search);
    const list = S.mails.filter(m => m.folder === M.folder && (!q || norm(m.subject + m.fromName + m.fromAddr).includes(q)));
    const note = M.folder === 'spam' ? '<div class="mspamnote">Les messages de ce dossier sont supprimés automatiquement après 30 jours.</div>' : '';
    body = note + (list.length ? list.map(m => `<div class="mrow ${m.read ? '' : 'unread'} ${m.fresh ? 'new' : ''}" data-open="${m.id}">
        <span class="from">${h(m.fromName)}</span><span class="time">${mailTime(m)}</span><span class="subj">${h(m.subject)}</span></div>`).join('')
      : `<div class="mempty">${q ? 'Aucun message ne correspond à votre recherche.' : 'Aucun message dans ce dossier.'}</div>`);
  }
  const search = M.view === 'read' ? '' : `<div class="msearch"><input id="msearch" placeholder="Rechercher dans les messages" value="${h(M.search)}"></div>`;
  el.innerHTML = head + folders + search + `<div class="mbody">${body}</div><div id="mstatus" style="display:none;font-size:11px;padding:2px 8px;background:#f1f3f4;border-top:1px solid #dadce0;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>`;
  const si = $('#msearch');
  if (si) si.addEventListener('input', e => { M.search = e.target.value; const pos = e.target.selectionStart; renderMail(); const n = $('#msearch'); n.focus(); n.setSelectionRange(pos, pos); });
}

function mailReadView(m) {
  const spam = m.folder === 'spam';
  return `<div class="mread"><div class="mrtools"><span data-m="back">← Retour</span>
      ${spam ? '<span data-m="notspam">Ce n\'est pas un spam</span>' : (m.folder === 'inbox' ? '<span data-m="spam">Signaler comme spam</span>' : '')}
      <span data-m="delete" title="Supprimer">🗑 Supprimer</span></div>
    <h3>${h(m.subject)}</h3>
    <div class="mmeta"><span class="av" style="background:${avColor(m.fromName)}">${h(m.fromName.replace(/[^A-Za-zÀ-ÿ]/g, '').charAt(0).toUpperCase() || '?')}</span>
      <span><b>${h(m.fromName)}</b> &lt;${h(m.fromAddr)}&gt;</span><span>À : moi · ${mailTime(m)}</span></div>
    ${spam ? '<div class="spamwarn">⚠ Ce message a été classé dans les indésirables. Soyez prudent avec les liens et les pièces jointes.</div>' : ''}
    <div class="mcontent">${m.html}</div></div>`;
}

function mailLoginView() {
  const M = S.maboite;
  return `<div class="mbody"><div class="mlogin"><h3>Connexion à MaBoîte</h3><p>Votre messagerie gratuite, simple et sécurisée.</p>
    <form id="mloginform"><label>Adresse mail</label><input name="u" value="${h(M.lastUser || '')}" autocomplete="off">
    <label>Mot de passe</label><input name="p" type="password" autocomplete="off">
    <div style="font-size:11px;margin-top:6px;color:#3b5b8c;text-decoration:underline;cursor:pointer" data-m="forgot">Mot de passe oublié ?</div>
    <div class="err" id="mloginerr"></div>
    <div style="margin-top:14px"><button class="mbtn" style="width:100%">Se connecter</button></div></form>
    <div class="or">— ou —</div>
    <button class="mbtn ghost" style="width:100%" data-m="passkeylogin">🔑 Se connecter avec une clé d'accès</button>
    <div id="mpasskeymsg" style="font-size:12px;color:#555;margin-top:10px"></div>
    ${M.passkey ? `<div class="envrai" style="margin-top:18px">Google, Apple, Microsoft proposent les clés d'accès. Les sites publics (impôts, ameli) utilisent plutôt mot de passe + code par mail. Ne créez pas de clé d'accès sur un appareil partagé.</div>` : ''}
  </div></div>`;
}

function mailSettingsView() {
  const M = S.maboite;
  const crumbs = ['Paramètres'].concat(M.settings === 'securite' ? ['Sécurité'] : M.settings === 'general' ? ['Général'] : []);
  let body = '';
  if (!M.settings) {
    body = `<div class="menu"><div data-m="set-general">Général <span>›</span></div><div data-m="set-securite">Sécurité <span>›</span></div>
      <div data-m="set-filtres">Filtres et indésirables <span>›</span></div><div data-m="set-signature">Signature <span>›</span></div>
      <div data-m="logout" style="color:#b3261e">Se déconnecter <span>⏻</span></div></div>`;
  } else if (M.settings === 'securite') {
    body = `<div class="sec"><h4>Mot de passe</h4><p>Dernière modification : il y a 2 ans.</p></div>
      <div class="sec"><h4>Validation en deux étapes</h4><p>Désactivée. Recevez un code par SMS lors des connexions depuis un nouvel appareil.</p></div>
      <div class="sec"><h4>Clés d'accès</h4>
        ${M.passkey ? '<p>✅ <b>1 clé d\'accès</b> : « Téléphone de Martine », créée aujourd\'hui.</p><p>Vous pouvez maintenant vous connecter sans mot de passe.</p>'
          : '<p>Une clé d\'accès permet de vous connecter avec le code de déverrouillage de votre téléphone, sans saisir de mot de passe.</p><p>Aucune clé d\'accès.</p>'}
        <div id="passkeyzone" style="margin-top:8px">${M.passkey ? '' : '<button class="mbtn" data-m="passkey">Créer une clé d\'accès</button>'}</div></div>
      ${M.passkey ? '<div class="envrai">Google, Apple, Microsoft proposent les clés d\'accès. Les sites publics (impôts, ameli) utilisent plutôt mot de passe + code par mail. Ne créez pas de clé d\'accès sur un appareil partagé.</div>' : ''}
      <div class="sec"><h4>Appareils connectés</h4><p>Ordinateur — Penhoat-sur-Ellé — actuellement<br>Téléphone — Penhoat-sur-Ellé — il y a 3 jours</p></div>`;
  } else {
    body = `<div class="sec"><h4>${M.settings === 'general' ? 'Langue et affichage' : 'Réglages'}</h4><p>Ces réglages ne sont pas utiles pour aujourd'hui.</p></div>`;
  }
  return `<div class="mset"><div class="crumbs">${crumbs.join(' › ')}</div>
    <div style="margin-bottom:8px"><span data-m="${M.settings ? 'set-root' : 'close-settings'}" style="cursor:pointer;color:#3b5b8c">← Retour</span></div>
    <h3>${crumbs[crumbs.length - 1]}</h3>${body}</div>`;
}

function mailClick(e) {
  const M = S.maboite;
  const link = e.target.closest('[data-url]');
  if (link) { e.preventDefault(); openTab(link.dataset.url); return; }
  const f = e.target.closest('[data-folder]');
  if (f) { M.folder = f.dataset.folder; M.view = 'list'; renderMail(); return; }
  const o = e.target.closest('[data-open]');
  if (o) {
    const m = S.mails.find(x => x.id === +o.dataset.open);
    m.read = true; m.fresh = false; M.view = 'read'; M.openId = m.id;
    if (m.onOpen) m.onOpen(m);
    renderMail(); renderPhone(); return;
  }
  const b = e.target.closest('[data-m]');
  if (!b) return;
  const cur = S.mails.find(x => x.id === M.openId);
  switch (b.dataset.m) {
    case 'wide': $('#main').classList.toggle('mailwide'); break;
    case 'back': M.view = 'list'; break;
    case 'delete': if (cur) cur.folder = 'trash'; M.view = 'list'; break;
    case 'notspam': if (cur) cur.folder = 'inbox'; toast('Message déplacé dans la boîte de réception.'); M.view = 'list'; break;
    case 'spam': if (cur) cur.folder = 'spam'; toast('Message déplacé dans les indésirables.'); M.view = 'list'; break;
    case 'settings': M.view = 'settings'; M.settings = null; break;
    case 'close-settings': M.view = 'list'; break;
    case 'set-root': M.settings = null; break;
    case 'set-general': M.settings = 'general'; break;
    case 'set-securite': M.settings = 'securite'; break;
    case 'set-filtres': M.settings = 'filtres'; break;
    case 'set-signature': M.settings = 'signature'; break;
    case 'logout': M.loggedIn = false; M.view = 'list'; M.lastUser = P.mail; break;
    case 'forgot': $('#mpasskeymsg').textContent = 'Un code de récupération a été envoyé par SMS au 06 •• •• •• 83.'; return;
    case 'passkey':
      $('#passkeyzone').innerHTML = '<p style="font-size:12.5px"><b>Utilisez le code de déverrouillage de votre téléphone.</b><br>Regardez l\'écran de votre téléphone.</p>';
      phoneAskPin('MaBoîte : créer une clé d\'accès. Saisissez le code de votre téléphone.', () => { M.passkey = true; renderMail(); toast('Clé d\'accès créée.'); });
      return;
    case 'passkeylogin':
      if (!M.passkey) { $('#mpasskeymsg').textContent = 'Aucune clé d\'accès n\'est disponible sur cet appareil pour MaBoîte.'; return; }
      $('#mpasskeymsg').textContent = 'Confirmez sur votre téléphone…';
      phoneAskPin('Se connecter à MaBoîte avec votre clé d\'accès ? Saisissez le code de votre téléphone.', () => { M.loggedIn = true; M.view = 'list'; renderMail(); });
      return;
  }
  renderMail();
}
function mailSubmit(e) {
  if (e.target.id !== 'mloginform') return;
  e.preventDefault();
  const u = e.target.u.value.trim().toLowerCase(), p = e.target.p.value;
  if (u === P.maboite.identifiant && p === P.maboite.motDePasse) { S.maboite.loggedIn = true; S.maboite.view = 'list'; renderMail(); }
  else $('#mloginerr').textContent = 'Adresse mail ou mot de passe incorrect.';
}
window.addEventListener('DOMContentLoaded', () => {
  const el = $('#mail');
  el.addEventListener('click', mailClick);
  el.addEventListener('submit', mailSubmit);
  el.addEventListener('mouseover', e => {
    const st = $('#mstatus'); if (!st) return;
    const l = e.target.closest('[data-url]');
    if (l) { const u = l.dataset.url; const site = SITES[parseUrl(u).host]; st.textContent = (site && site.insecure ? 'http://' : 'https://') + u; st.style.display = 'block'; }
    else st.style.display = 'none';
  });
});
