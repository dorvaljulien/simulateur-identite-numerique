/* =====================================================================
   FISCALIS — fiscalis.gouv.sim (rôle réel : impots.gouv.fr)
   ===================================================================== */

/* ---------- Règles de mot de passe (révélées une par une) ---------- */
const isPassphrase = p => p.length >= 20;
const containsName = p => { const n = norm(p); return ['MARTINE', 'LEGALL', 'KERJEAN'].some(x => n.includes(x)); };
const PWD_RULES = [
  { id: 'len', txt: 'Au moins 12 caractères', test: p => p.length >= 12 },
  { id: 'maj', txt: 'Au moins une lettre majuscule', test: p => isPassphrase(p) || /[A-ZÀ-Ý]/.test(p) },
  { id: 'chif', txt: 'Au moins un chiffre', test: p => isPassphrase(p) || /\d/.test(p) },
  { id: 'spec', txt: 'Au moins un caractère spécial ( ! ? @ # $ % & * - _ . + )', test: p => isPassphrase(p) || /[^A-Za-zÀ-ÿ0-9\s]/.test(p) },
  { id: 'nom', txt: 'Ne doit pas contenir votre nom ou votre prénom', test: p => !containsName(p) }
];
function pwdStrength(p) {
  if (!p) return { pct: 0, lbl: '', col: '#ccc' };
  let s = 0;
  if (p.length >= 8) s++; if (p.length >= 12) s++; if (p.length >= 16) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
  if (isPassphrase(p)) s = Math.max(s, 6);
  if (containsName(p)) s = Math.min(s, 2);
  const lv = [['Très faible', '#b3261e', 12], ['Très faible', '#b3261e', 15], ['Faible', '#e06c00', 32], ['Faible', '#e06c00', 45], ['Moyen', '#c99a2e', 62], ['Fort', '#3f8f5e', 82], ['Très fort', '#1f6b40', 100]][s];
  return { lbl: 'Robustesse : ' + lv[0], col: lv[1], pct: lv[2] };
}
function rulesHtml(p) {
  const rev = S.fiscalis.revealed;
  if (!rev.length) return '';
  return `<ul class="fx-rules">${PWD_RULES.filter(r => rev.includes(r.id)).map(r => {
    const ok = r.test(p || ''); return `<li class="${ok ? 'ok' : 'ko'}">${ok ? '✔' : '✖'} ${r.txt}</li>`;
  }).join('')}</ul>`;
}
/* Renvoie true si le mot de passe est accepté ; sinon révèle la règle suivante */
function checkPwdRules(p) {
  const failing = PWD_RULES.filter(r => !r.test(p));
  if (!failing.length) return true;
  const next = failing.find(r => !S.fiscalis.revealed.includes(r.id));
  if (next) S.fiscalis.revealed.push(next.id);
  return false;
}
function bindPwdLive(root) {
  const inp = $('input[name=pwd]', root);
  if (!inp || !$('.fx-gauge', root)) return;
  const upd = () => {
    const st = pwdStrength(inp.value);
    $('.fx-gauge i', root).style.cssText = `width:${st.pct}%;background:${st.col}`;
    $('.fx-gaugelbl', root).textContent = st.lbl;
    $('#fx-rules', root).innerHTML = rulesHtml(inp.value);
  };
  inp.addEventListener('input', upd); upd();
}

/* ---------- Mails envoyés par Fiscalis ---------- */
const FX_FROM = { fromName: 'Fiscalis', fromAddr: 'ne-pas-repondre@fiscalis.gouv.sim' };
const fxMailHead = `<div style="border-bottom:3px solid #1f4d3a;padding-bottom:6px;margin-bottom:10px;display:flex;align-items:center;gap:8px"><span style="width:26px;height:26px;border-radius:50%;background:#1f4d3a;color:#e8c46a;display:inline-flex;align-items:center;justify-content:center;font-family:Georgia;font-weight:700">F</span><b style="color:#1f4d3a;font-family:Georgia;font-size:17px">Fiscalis</b></div>`;
const fxMailFoot = `<p style="font-size:11px;color:#777;border-top:1px solid #ddd;padding-top:8px;margin-top:16px">Ce message est envoyé automatiquement, merci de ne pas y répondre. Fiscalis ne vous demandera jamais vos mots de passe ou vos coordonnées bancaires par mail.</p>`;
function mailActivationFiscalis(tok) {
  const spam = CONFIG.confirmationDansIndesirables === 'toujours' || (CONFIG.confirmationDansIndesirables === 'aleatoire' && Math.random() < .5);
  return Object.assign({}, FX_FROM, {
    subject: 'Activez votre espace particulier', tag: 'activation', folder: spam ? 'spam' : 'inbox',
    html: `${fxMailHead}<p>Madame, Monsieur,</p><p>Vous avez demandé la création de votre espace particulier sur fiscalis.gouv.sim.</p>
      <p>Pour finaliser cette création, cliquez sur le lien ci-dessous. <b>Ce lien est valable 24 heures.</b></p>
      <p><span class="mlink" data-url="fiscalis.gouv.sim/activation?t=${tok}">https://fiscalis.gouv.sim/activation?t=${tok}</span></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p><p>L'équipe Fiscalis</p>${fxMailFoot}`
  });
}
function sendFiscalisCode() {
  const F = S.fiscalis;
  if (F.code) (F.oldCodes = F.oldCodes || []).push(F.code.value);
  F.code = { value: rand6(), expires: Date.now() + CONFIG.durees.expirationCodeMail * 1000 };
  const min = Math.round(CONFIG.durees.expirationCodeMail / 60);
  deliverMail(Object.assign({}, FX_FROM, {
    subject: 'Votre code de connexion', tag: 'code',
    html: `${fxMailHead}<p>Bonjour,</p><p>Voici votre code de sécurité pour vous connecter à votre espace particulier :</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#1f4d3a;margin:14px 0">${F.code.value}</p>
      <p>Ce code est valable <b>${min} minutes</b>. Ne le communiquez à personne, même à un agent de Fiscalis.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, nous vous conseillons de modifier votre mot de passe.</p>${fxMailFoot}`
  }));
}
function sendResetMails() {
  const F = S.fiscalis;
  const tok = token();
  F.resetTokens[tok] = { expires: Date.now() + CONFIG.durees.validiteLienReinit * 1000, used: false };
  const min = Math.round(CONFIG.durees.validiteLienReinit / 60);
  const d1 = (CONFIG.durees.delaiMailMin + Math.random() * (CONFIG.durees.delaiMailMax - CONFIG.durees.delaiMailMin)) * 1000;
  deliverMail(Object.assign({}, FX_FROM, {
    subject: 'Réinitialisation de votre mot de passe', tag: 'reset',
    html: `${fxMailHead}<p>Madame, Monsieur,</p><p>Vous avez demandé la réinitialisation du mot de passe de votre espace particulier.</p>
      <p>Pour choisir un nouveau mot de passe, cliquez sur le lien suivant. <b>Ce lien est valable ${min} minutes</b> et ne peut être utilisé qu'une seule fois.</p>
      <p><span class="mlink" data-url="fiscalis.gouv.sim/reinitialisation?t=${tok}">https://fiscalis.gouv.sim/reinitialisation?t=${tok}</span></p>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe actuel reste valable.</p>${fxMailFoot}`
  }), { delay: d1 });
  if (!F.phishSent) {
    F.phishSent = true;
    deliverMail({
      fromName: 'Service Sécurité Fiscalis', fromAddr: 'securite@fiscalis-gouv-sim.com', tag: 'phish',
      subject: '⚠ Votre compte sera suspendu sous 24 h',
      onOpen: () => { S.incidents.fauxLu = true; },
      html: `<div style="background:#1f4d3a;color:#fff;padding:8px 12px;font-family:Georgia;font-size:18px;font-weight:700">FISCALIS <span style="font-size:11px;font-family:Arial;font-weight:400">Service de sécurité</span></div>
        <p><b>Madame, Monsieur,</b></p>
        <p>Suite à votre demande de réinitialisation de mot de passe, une <b>activité inhabituelle</b> a été détectée sur votre espace particulier.</p>
        <p>Pour éviter la <b style="color:#b3261e">suspension de votre compte sous 24 heures</b>, vous devez confirmer immédiatement vos identifiants en cliquant sur le bouton ci-dessous.</p>
        <p style="text-align:center;margin:18px 0"><span data-url="fiscalis-gouv-sim.com/securite/confirmation?id=${token()}" style="background:#1f4d3a;color:#fff;padding:10px 22px;font-weight:700;cursor:pointer;display:inline-block">Confirmer mes identifiants</span></p>
        <p>Sans action de votre part, l'accès à vos services en ligne et vos remboursements seront bloqués.</p>
        <p>Cordialement,<br>Le service sécurité Fiscalis</p>
        <p style="font-size:10px;color:#888">© Fiscalis 2026 – Tous droits réservés – Ne pas répondre à ce message</p>`
    }, { delay: d1 + CONFIG.durees.delaiFauxMail * 1000 });
  }
}

/* ---------- Mise en page commune ---------- */
function fxHeader() {
  const F = S.fiscalis;
  return `<div class="fx-util"><div class="in"><span>Fiscalis — Administration des finances publiques (fictive)</span><span class="sp"></span>
      <span data-go="/page?t=Accessibilité">Accessibilité : partiellement conforme</span><span data-go="/page?t=Plan du site">Plan du site</span>
      <span data-go="/page?t=Contact et rendez-vous">Contact</span><span data-go="/page?t=English version">English</span></div></div>
    <div class="fx-head"><div class="in">
      <div class="fx-logo" data-go="/"><div class="em">F</div><div class="t"><b>Fiscalis</b><small>Le site officiel des impôts et des finances publiques — simulation</small></div></div>
      <form class="fx-search" data-form="search"><input name="q" placeholder="Rechercher (ex. : taux de prélèvement, taxe foncière…)"><button>🔍</button></form>
      <div class="fx-espaces"><span data-go="${F.loggedIn ? '/espace' : '/connexion'}" title="Votre espace particulier">👤 ${F.loggedIn ? 'Mon espace' : 'Votre espace particulier'}</span><span class="pro" data-go="/page?t=Espace professionnel">Espace professionnel</span></div>
    </div></div>
    <div class="fx-nav"><div class="in">${['Particulier', 'Professionnel', 'Partenaire', 'International', 'Simulateurs', 'Documentation', 'Questions fréquentes', 'Contact et RDV']
      .map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x}${['Particulier', 'Professionnel', 'Partenaire'].includes(x) ? ' ▾' : ''}</span>`).join('')}</div></div>`;
}
function fxFooter() {
  const cols = {
    'Particulier': ['Déclarer mes revenus', 'Payer mes impôts', 'Gérer mon prélèvement à la source', 'Taxe foncière', 'Taxe d\'habitation', 'Signaler un changement de situation'],
    'Professionnel': ['Créer mon espace professionnel', 'TVA', 'Impôt sur les sociétés', 'Cotisation foncière', 'Factures électroniques'],
    'Aide et contact': ['Questions fréquentes', 'Messagerie sécurisée', 'Prendre rendez-vous', 'Trouver mon centre Fiscalis', 'Signaler une tentative d\'escroquerie'],
    'À propos': ['Qui sommes-nous ?', 'Recrutement', 'Presse', 'Données publiques', 'Statistiques']
  };
  return `<div class="fx-foot"><div class="in">${Object.entries(cols).map(([k, v]) => `<div><h4>${k}</h4>${v.map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x}</span>`).join('')}</div>`).join('')}</div>
    <div class="legal"><span>© 2026 Fiscalis — site fictif</span><span>Mentions légales</span><span>Données personnelles</span><span>Gestion des cookies</span><span>Accessibilité</span><span>Plan du site</span></div></div>`;
}
const fxPage = inner => fxHeader() + inner + fxFooter();
function showErr(root, html, kind = 'err') {
  const z = $('#fx-msg', root);
  z.innerHTML = html ? `<div class="fx-${kind}">${html}</div>` : '';
  if (html) z.scrollIntoView({ block: 'nearest' });
}

/* ---------- Pages ---------- */
function fxHome() {
  const news = [
    ['#2f6b52', '📄', '04 novembre 2026', 'Avis de taxe foncière : la date limite de paiement en ligne est dépassée', 'Si vous n\'avez pas encore payé, une majoration de 10 % peut s\'appliquer. Rendez-vous dans votre espace particulier, rubrique « Paiements ».'],
    ['#8a6d1f', '🏠', '29 octobre 2026', 'Biens immobiliers : déclarez l\'occupation de vos logements', 'Propriétaires, vous devez indiquer qui occupe chacun de vos logements au 1er janvier. Le service est accessible depuis votre espace.'],
    ['#4f5f8a', '💳', '21 octobre 2026', 'Prélèvement à la source : pensez à actualiser votre taux', 'Mariage, naissance, baisse de revenus : en cas de changement, modifiez votre taux pour éviter un rappel l\'an prochain.'],
    ['#8a3f3f', '⚠️', '15 octobre 2026', 'Faux mails et faux SMS : la vigilance reste de mise', 'De nombreux messages frauduleux imitent Fiscalis. Ils promettent un remboursement ou menacent d\'une sanction. Ne cliquez pas.'],
    ['#3f7a8a', '🧮', '08 octobre 2026', 'Nouveau simulateur : estimez votre impôt 2027', 'Le simulateur a été mis à jour avec le barème prévu par le projet de loi de finances. Il ne remplace pas votre avis d\'impôt.'],
    ['#6b4f8a', '👵', '01 octobre 2026', 'Emploi à domicile : le crédit d\'impôt immédiat s\'étend', 'Les services d\'aide à la personne déclarés peuvent désormais bénéficier de l\'avance immédiate, sans attendre l\'année suivante.']
  ];
  return {
    title: 'Fiscalis | Le site officiel des impôts',
    html: fxPage(`<div class="fx-alert"><div class="in">⚠️ <span><b>Attention aux escroqueries :</b> Fiscalis ne vous demande jamais vos coordonnées bancaires ni votre mot de passe par mail ou par SMS. <u data-go="/page?t=Signaler une tentative d'escroquerie">En savoir plus</u></span></div></div>
    <div class="fx-wrap">
      <div class="fx-hero"><div class="main"><span class="tag">Actualité</span><h1>Impôt 2027 : préparez dès maintenant vos démarches en ligne</h1>
        <p>Créez votre espace particulier pour consulter vos avis d'impôt, gérer votre prélèvement à la source, payer en ligne et échanger avec votre centre Fiscalis par messagerie sécurisée. Votre numéro fiscal et votre numéro d'accès en ligne figurent sur votre avis d'impôt.</p>
        <span class="btn" data-go="/page?t=Créer son espace particulier, mode d'emploi">Lire l'article</span></div>
        <div class="side"><h3>📅 Agenda fiscal</h3><ul class="fx-cal">
          <li data-go="/page?t=Mensualisation"><span class="d"><b>15</b>nov.</span><span>Dernier prélèvement mensuel de la taxe foncière</span></li>
          <li data-go="/page?t=Paiement de la taxe d'habitation"><span class="d"><b>15</b>déc.</span><span>Date limite de paiement de la taxe d'habitation sur les résidences secondaires</span></li>
          <li data-go="/page?t=Option pour le prélèvement"><span class="d"><b>31</b>déc.</span><span>Date limite pour adhérer au prélèvement mensuel 2027</span></li>
          <li data-go="/page?t=Déclaration des revenus"><span class="d"><b>10</b>avr.</span><span>Ouverture prévue du service de déclaration en ligne</span></li></ul></div></div>
      <h2 class="fx-h2">Accès rapides</h2>
      <div class="fx-quick">${[['💶', 'Payer', 'Impôt sur le revenu, taxes, amendes'], ['📝', 'Déclarer', 'Revenus, biens immobiliers'], ['⚙️', 'Gérer mon prélèvement à la source', 'Taux, acomptes, avances'], ['🧮', 'Simuler mon impôt', 'Barème et simulateurs'],
        ['🏠', 'Taxe foncière', 'Avis, paiement, réclamation'], ['🔄', 'Signaler un changement', 'Adresse, situation de famille'], ['✏️', 'Corriger ma déclaration', 'Service de correction en ligne'], ['📞', 'Prendre rendez-vous', 'Au téléphone ou au guichet']]
        .map(q => `<div data-go="/page?t=${encodeURIComponent(q[1])}"><span class="ic">${q[0]}</span><span>${q[1]}<small>${q[2]}</small></span></div>`).join('')}</div>
      <div class="fx-cols"><div><h2 class="fx-h2">Actualités</h2><div class="fx-news">${news.map(n => `<div class="n" data-go="/page?t=${encodeURIComponent(n[3])}"><div class="img" style="background:linear-gradient(135deg,${n[0]},#ddd);display:flex;align-items:center;justify-content:center;font-size:38px">${n[1]}</div>
          <div class="c"><div class="date">${n[2]}</div><h4>${n[3]}</h4><p>${n[4]}</p></div></div>`).join('')}</div>
          <p style="text-align:right"><span class="fx-link" data-go="/page?t=Toutes les actualités">Toutes les actualités →</span></p></div>
        <div><h2 class="fx-h2">Questions fréquentes</h2>
          <div class="fx-box"><h3>Mon espace</h3><ul>${['Comment créer mon espace particulier ?', 'Je n\'ai pas reçu le mail d\'activation', 'J\'ai oublié mon mot de passe', 'Pourquoi un code m\'est-il demandé à chaque connexion ?', 'Mon compte est bloqué'].map(x => `<li data-go="/page?t=${encodeURIComponent(x)}">${x}</li>`).join('')}</ul></div>
          <div class="fx-box"><h3>Prélèvement à la source</h3><ul>${['Comment est calculé mon taux ?', 'Je change de situation', 'J\'ai des revenus sans employeur'].map(x => `<li data-go="/page?t=${encodeURIComponent(x)}">${x}</li>`).join('')}</ul></div>
          <div class="fx-box" style="background:#1f4d3a;color:#fff;border:0"><h3 style="color:#e8c46a">Une question ?</h3><p style="font-size:13px;line-height:1.5;margin:0 0 8px">Nos conseillers vous répondent au 08 99 00 00 00 (numéro fictif) du lundi au vendredi de 8h30 à 19h.</p><span class="fx-link" style="color:#fff" data-go="/page?t=Contact et rendez-vous">Toutes les façons de nous contacter</span></div></div></div>
      <h2 class="fx-h2">Votre situation change ?</h2>
      <div class="fx-life">${[['💍', 'Je me marie ou je me pacse'], ['👶', 'J\'attends un enfant'], ['🚚', 'Je déménage'], ['🎓', 'Mon enfant devient étudiant'], ['🌅', 'Je pars à la retraite'], ['🕯️', 'Un proche est décédé']]
        .map(x => `<div data-go="/page?t=${encodeURIComponent(x[1])}"><span class="ic">${x[0]}</span>${x[1]}</div>`).join('')}</div>
      <div class="fx-fraud"><div class="ic">🎣</div><div><h3>Tentatives d'hameçonnage : comment les reconnaître ?</h3>
        <p>Des fraudeurs envoient des mails ou des SMS qui imitent Fiscalis : faux remboursement, menace de suspension, demande de « confirmer vos informations ». Vérifiez toujours l'adresse de l'expéditeur et l'adresse du site.</p>
        <p>Fiscalis n'envoie <b>jamais</b> de lien demandant votre mot de passe ou votre numéro de carte bancaire. En cas de doute, ne cliquez pas : connectez-vous directement en tapant <b>fiscalis.gouv.sim</b>.</p></div></div>
    </div>`)
  };
}

function fxGeneric(t) {
  const pool = [
    'Les informations présentées sur cette page sont données à titre indicatif. Elles ne se substituent pas aux textes officiels et ne tiennent pas compte de votre situation particulière. Pour toute question précise, utilisez la messagerie sécurisée de votre espace particulier.',
    'La plupart des démarches peuvent être effectuées en ligne, à tout moment, depuis votre espace particulier. Vous aurez besoin de votre numéro fiscal et de votre mot de passe. Lors de la première connexion, un numéro d\'accès en ligne vous sera également demandé.',
    'Si vous rencontrez des difficultés avec internet, vous pouvez être accompagné gratuitement dans un espace d\'accueil de proximité, ou prendre rendez-vous avec un agent de votre centre Fiscalis, par téléphone ou au guichet.',
    'Les délais de traitement varient selon les périodes de l\'année. En période de déclaration, ils peuvent être plus longs. Nous vous remercions de votre compréhension et vous invitons à ne pas renouveler votre demande.',
    'Pour votre sécurité, ne communiquez jamais vos identifiants. Fiscalis ne vous les demandera jamais par mail, par SMS ou par téléphone. En cas de doute sur un message, ne cliquez sur aucun lien et rendez-vous directement sur le site.',
    'Les documents disponibles dans votre espace (avis, déclarations, courriers) peuvent être téléchargés au format PDF et ont la même valeur que les documents papier. Ils peuvent vous être demandés par votre banque, votre bailleur ou un organisme social.'
  ];
  let x = 0; for (const c of t) x = (x + c.charCodeAt(0)) % pool.length;
  const ps = [pool[x], pool[(x + 2) % pool.length], pool[(x + 4) % pool.length]];
  return {
    title: t + ' | Fiscalis',
    html: fxPage(`<div class="fx-wrap"><div class="fx-crumb"><span data-go="/">Accueil</span> › <span data-go="/page?t=Particulier">Particulier</span> › ${h(t)}</div>
      <div class="fx-article"><div class="body"><h1>${h(t)}</h1><p class="chapo">Mis à jour le 3 novembre 2026</p>${ps.map(p => `<p>${p}</p>`).join('')}
        <div class="fx-info">Cette rubrique est en cours de refonte. Certaines informations pourront être complétées prochainement.</div></div>
      <div><div class="fx-box"><h3>Dans cette rubrique</h3><ul>${['Déclarer mes revenus', 'Payer mes impôts', 'Gérer mon prélèvement à la source', 'Mes avis d\'impôt'].map(x => `<li data-go="/page?t=${encodeURIComponent(x)}">${x}</li>`).join('')}</ul></div>
        <div class="fx-box"><h3>Votre espace particulier</h3><p style="font-size:13px;margin:0 0 10px;line-height:1.5">Retrouvez tous vos documents et services.</p><span class="fx-link" data-go="/connexion">Accéder à mon espace</span></div></div></div></div>`)
  };
}

function fxLogin(ctx, info) {
  const sv = savedCreds('fiscalis.gouv.sim');
  return {
    title: 'Connexion — Espace particulier | Fiscalis',
    html: fxPage(`<div class="fx-wrap"><div class="fx-crumb"><span data-go="/">Accueil</span> › Votre espace particulier</div>
      <h1 style="font-family:Georgia;color:#1f4d3a;font-size:26px;margin:4px 0 18px;text-align:center">Connexion ou création de votre espace particulier</h1>
      <div class="fx-login"><div class="fx-card">
        <div id="fx-msg">${info ? `<div class="fx-info">${info}</div>` : ''}</div>
        <form data-form="login" autocomplete="off">
          <div class="fx-field"><label>Numéro fiscal <span class="qm" data-act="qm-num" title="Aide">?</span></label>
            <input type="text" name="num" maxlength="20" value="${sv ? h(sv.user) : ''}" placeholder="13 chiffres">
            <div class="help hidden" id="qm-num">Votre numéro fiscal (13 chiffres) figure en haut de la première page de votre déclaration de revenus et de vos avis d'impôt, dans le cadre « Vos références ».</div></div>
          <div id="fx-pwdblock" class="hidden"><div class="fx-field"><label>Mot de passe</label><input type="password" name="pwd">
            <div class="help"><span class="fx-link" data-go="/mot-de-passe-oublie">Mot de passe oublié ?</span></div></div></div>
          <button class="fx-btn" id="fx-loginbtn">Continuer</button>
        </form></div>
        <div class="fx-card" style="background:#f8f7f2"><h2>Première visite ?</h2>
          <p class="sub">Vous n'avez pas encore d'espace particulier ? Créez-le en quelques minutes. Munissez-vous de votre dernier avis d'impôt sur le revenu.</p>
          <span class="fx-btn sec" data-go="/creation" style="display:inline-block">Créer mon espace</span>
          <h3 style="font-size:14px;margin:22px 0 6px;color:#1f4d3a">Besoin d'aide ?</h3>
          <ul style="font-size:13px;line-height:1.7;padding-left:18px;margin:0"><li class="fx-link" data-go="/page?t=Je n'ai pas reçu le mail d'activation">Je n'ai pas reçu le mail d'activation</li><li class="fx-link" data-go="/page?t=Mon compte est bloqué">Mon compte est bloqué</li><li class="fx-link" data-go="/page?t=Où trouver mon numéro fiscal ?">Où trouver mon numéro fiscal ?</li></ul></div></div></div>`)
  };
}

function fxCreation(ctx) {
  return {
    title: 'Créer mon espace particulier | Fiscalis',
    html: fxPage(`<div class="fx-wrap" style="max-width:820px"><div class="fx-crumb"><span data-go="/">Accueil</span> › <span data-go="/connexion">Votre espace particulier</span> › Création</div>
      <div class="fx-card"><h2>Créer mon espace particulier</h2>
      <div class="fx-steps"><div class="on" id="st1">1. Identification</div><div id="st2">2. Coordonnées et mot de passe</div><div id="st3">3. Activation</div></div>
      <div id="fx-msg"></div>
      <form data-form="crea1" id="crea1" autocomplete="off"><p class="sub">Tous les champs sont obligatoires.</p>
        <div class="fx-field"><label>Numéro fiscal <small>(13 chiffres)</small></label><input type="text" name="num" maxlength="20" value="${h(ctx.params.n || '')}"></div>
        <div class="fx-field"><label>Numéro d'accès en ligne <small>(7 chiffres)</small> <span class="qm" data-act="qm-acc">?</span></label><input type="text" name="acc" maxlength="10">
          <div class="help hidden" id="qm-acc">Ce numéro figure sur votre dernier avis d'impôt sur le revenu, dans le cadre « Vos références ».</div></div>
        <div class="fx-field"><label>Nom de naissance</label><input type="text" name="nom"></div>
        <div class="fx-field"><label>Date de naissance <small>(JJ/MM/AAAA)</small></label><input type="text" name="naiss" maxlength="10" placeholder="JJ/MM/AAAA"></div>
        <button class="fx-btn">Continuer</button> <span class="fx-link" style="margin-left:14px" data-go="/connexion">Annuler</span>
      </form>
      <form data-form="crea2" id="crea2" class="hidden" autocomplete="off"><p class="sub">Votre adresse mail servira à activer votre espace et à recevoir vos codes de connexion.</p>
        <div class="fx-field"><label>Adresse mail</label><input type="email" name="mail"></div>
        <div class="fx-field"><label>Mot de passe</label><input type="password" name="pwd"><div class="fx-gauge"><i></i></div><div class="fx-gaugelbl"></div><div id="fx-rules"></div></div>
        <div class="fx-field"><label>Confirmation du mot de passe</label><input type="password" name="pwd2"></div>
        <div class="fx-field" style="font-size:13px"><label style="font-weight:400;display:flex;gap:8px;align-items:flex-start"><input type="checkbox" name="cgu" style="margin-top:3px"> J'ai pris connaissance des conditions générales d'utilisation de l'espace particulier et je les accepte.</label></div>
        <button class="fx-btn">Valider</button>
      </form></div></div>`)
  };
}

/* Documents consultables dans l'espace (les avis reprennent les données des papiers du trieur) */
const FX_DOCS = [
  { id: 'avisCetteAnnee', titre: 'Avis d\'impôt 2026 sur les revenus 2025', date: '31/07/2026', fichier: 'avis_impot_2026.pdf', type: 'Avis' },
  { id: 'declaration2026', titre: 'Déclaration en ligne des revenus 2025', date: '22/05/2026', fichier: 'declaration_2026.pdf', type: 'Déclaration' },
  { id: 'echeancier', titre: 'Échéancier de prélèvement à la source 2026', date: '12/01/2026', fichier: 'echeancier_2026.pdf', type: 'Échéancier' },
  { id: 'avisAnDernier', titre: 'Avis d\'impôt 2025 sur les revenus 2024', date: '28/07/2025', fichier: 'avis_impot_2025.pdf', type: 'Avis' },
  { id: 'declaration2025', titre: 'Déclaration en ligne des revenus 2024', date: '19/05/2025', fichier: 'declaration_2025.pdf', type: 'Déclaration' },
  { id: 'avis2024', titre: 'Avis d\'impôt 2024 sur les revenus 2023', date: '30/07/2024', fichier: 'avis_impot_2024.pdf', type: 'Avis' }
];
const fxDocRow = d => `<div data-go="/espace/document?id=${d.id}"><span>📄 ${d.titre}</span><span>${d.date}</span></div>`;

function fxEspaceHead(tab) {
  const F = S.fiscalis;
  const tabs = [['Accueil', '/espace'], ['Documents', '/espace/documents'], ['Paiements'], ['Prélèvement à la source'], ['Messagerie sécurisée'], ['Mon profil']];
  return `<div class="fx-espace-head"><div class="in"><div class="fx-logo" data-go="/"><div class="em" style="width:40px;height:40px;font-size:21px">F</div><div class="t"><b style="font-size:20px">Fiscalis</b><small>Espace particulier</small></div></div>
        <span style="flex:1"></span><span style="font-size:13px">👤 <b>${P.prenom} ${P.nomUsage.toUpperCase()}</b> — n° fiscal ${fmtNF(F.account.numero)}</span>
        <button class="fx-btn sec" data-act="logout" style="padding:6px 14px;font-size:12.5px">Se déconnecter</button></div></div>
      <div class="fx-tabs"><div class="in">${tabs.map(([x, go]) => `<span class="${x === tab ? 'on' : ''}" ${go ? `data-go="${go}"` : 'data-act="nope"'}>${x}</span>`).join('')}</div></div>`;
}

function fxDocuments() {
  return {
    title: 'Mes documents | Fiscalis',
    html: fxEspaceHead('Documents') + `<div class="fx-wrap"><div id="fx-msg"></div>
      <h2 style="font-family:Georgia;color:#1f4d3a;margin:4px 0 6px">Mes documents</h2>
      <p style="font-size:13px;color:#555;margin:0 0 14px">Retrouvez vos avis d'impôt, vos déclarations et vos courriers. Les documents sont conservés pendant 10 ans.</p>
      <div class="fx-box"><div style="display:flex;gap:10px;margin-bottom:10px;font-size:13px"><span>Filtrer :</span><b>Tous</b><span class="fx-link" data-act="nope">Avis</span><span class="fx-link" data-act="nope">Déclarations</span><span class="fx-link" data-act="nope">Courriers</span></div>
        <table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="background:#eef2ee;text-align:left"><th style="padding:7px">Document</th><th>Type</th><th>Date</th><th></th></tr>
        ${FX_DOCS.map(d => `<tr style="border-bottom:1px dotted #ccc"><td style="padding:8px 7px">📄 ${d.titre}</td><td>${d.type}</td><td>${d.date}</td><td><span class="fx-link" data-go="/espace/document?id=${d.id}">Consulter</span></td></tr>`).join('')}</table></div></div>${fxFooter()}`
  };
}

function fxDocument(id) {
  const d = FX_DOCS.find(x => x.id === id) || FX_DOCS[0];
  const paper = P.documents.find(x => x.id === d.id);
  const body = paper ? renderDoc(paper)
    : `<div style="font-size:11px;padding:40px 0;text-align:center;color:#555">Aperçu indisponible pour ce document.<br>Téléchargez-le pour le consulter.</div>`;
  return {
    title: d.fichier,
    html: fxEspaceHead('Documents') + `<div class="fx-wrap"><div class="fx-crumb"><span data-go="/espace">Mon espace</span> › <span data-go="/espace/documents">Mes documents</span> › ${d.titre}</div>
      <div class="fx-pdf"><div class="bar"><span>📄 ${d.fichier}</span><span style="flex:1"></span><span>1 / 2</span><span>－ 125 % ＋</span><span data-act="nope" title="Télécharger">⤓</span><span data-act="nope" title="Imprimer">🖶</span></div>
        <div class="pages"><div class="paper" style="zoom:1.25">${body}</div></div></div>
      <p><span class="fx-link" data-go="/espace/documents">← Retour à mes documents</span></p></div>`
  };
}

function fxEspace() {
  const F = S.fiscalis;
  return {
    title: 'Mon espace particulier | Fiscalis',
    html: fxEspaceHead('Accueil') + `<div class="fx-wrap"><div id="fx-msg"></div>
        <h2 style="font-family:Georgia;color:#1f4d3a;margin:4px 0 16px">Bonjour ${P.prenom} ${P.nomUsage}</h2>
        <div class="fx-dash">
          <div class="fx-box"><h3>Mes derniers documents</h3><div class="fx-doclist">${FX_DOCS.slice(0, 3).map(fxDocRow).join('')}</div>
            <p style="margin:8px 0 0"><span class="fx-link" data-go="/espace/documents">Tous mes documents</span></p></div>
          <div class="fx-box"><h3>Mon prélèvement à la source</h3><div class="big">4,5 %</div><p style="font-size:13px;color:#555">Taux personnalisé appliqué depuis septembre 2026.</p><span class="fx-link" data-act="nope">Gérer mon prélèvement</span></div>
          <div class="fx-box"><h3>Mes paiements</h3><p style="font-size:13px;margin:0 0 6px">Reste à payer sur l'impôt 2026 : <b>47 €</b></p><p style="font-size:13px;color:#555;margin:0 0 8px">Prélevé le 25/11/2026.</p><span class="fx-link" data-act="nope">Voir le détail</span></div>
          <div class="fx-box"><h3>Messagerie sécurisée</h3><p style="font-size:13px;color:#555">Aucun nouveau message.</p><span class="fx-link" data-act="nope">Écrire un message</span></div>
          <div class="fx-box"><h3>Mes biens immobiliers</h3><p style="font-size:13px;color:#555">1 bien déclaré : maison, Penhoat-sur-Ellé.</p><span class="fx-link" data-act="nope">Consulter</span></div>
          <div class="fx-box"><h3>Mon profil</h3><p style="font-size:13px;color:#555">Adresse mail : ${h(F.account.mail)}<br>Mot de passe : ••••••••</p><span class="fx-link" data-act="nope">Modifier</span></div>
        </div></div>${fxFooter()}`
  };
}

/* ---------- Déclaration du site ---------- */
SITES['fiscalis.gouv.sim'] = {
  name: 'Fiscalis', cls: 'fx', fav: { bg: '#1f4d3a', t: 'F' },
  envrai: 'impots.gouv.fr, votre espace Particulier',
  cookie: () => cookieBar('fiscalis.gouv.sim', 'background:#183d2e;color:#fff', 'Fiscalis'),
  render(ctx) {
    const F = S.fiscalis, p = ctx.path.replace(/\/$/, '') || '/';
    switch (p) {
      case '/': return fxHome();
      case '/page': return fxGeneric(ctx.params.t || 'Information');
      case '/connexion': return fxLogin(ctx);
      case '/creation': return fxCreation(ctx);
      case '/creation/envoye': {
        const m = F.pending ? F.pending.mail : '';
        return { title: 'Création de votre espace | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:820px"><div class="fx-card"><h2>Créer mon espace particulier</h2>
          <div class="fx-steps"><div class="done">1. Identification</div><div class="done">2. Coordonnées et mot de passe</div><div class="on">3. Activation</div></div>
          <div id="fx-msg"></div>
          <div class="fx-ok"><b>Un mail vous a été envoyé</b> à l'adresse <b>${h(m)}</b>.<br>Cliquez sur le lien qu'il contient pour activer votre espace. Ce lien est valable 24 heures.</div>
          <p style="font-size:12.5px;color:#555">Le mail peut mettre quelques minutes à arriver. Pensez à vérifier vos courriers indésirables.</p>
          <p style="font-size:13px">Vous n'avez rien reçu ? <span class="fx-link" data-act="resend">Renvoyer le mail</span> — <span class="fx-link" data-go="/creation">Recommencer la création</span></p></div></div>`) };
      }
      case '/activation': {
        const t = ctx.params.t;
        if (F.pending && t && t === F.activationToken) {
          F.account = Object.assign({}, F.pending, { active: true, initialPassword: F.pending.password });
          F.pending = null; F.usedActivation = t; F.justActivated = true;
        }
        if (t && t === F.usedActivation) return { title: 'Espace activé | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:820px"><div class="fx-card"><h2>Votre espace particulier est activé</h2>
          <div class="fx-steps"><div class="done">1. Identification</div><div class="done">2. Coordonnées et mot de passe</div><div class="done">3. Activation</div></div>
          <div class="fx-ok"><b>Compte activé.</b> Vous pouvez dès maintenant vous connecter avec votre numéro fiscal et votre mot de passe.</div>
          <span class="fx-btn" data-go="/connexion" style="display:inline-block">Me connecter</span></div></div>`) };
        return { title: 'Lien invalide | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:820px"><div class="fx-card"><h2>Lien invalide</h2><div class="fx-err">Ce lien n'est plus valide. Il a peut-être déjà été utilisé ou remplacé par une demande plus récente.</div><span class="fx-link" data-go="/connexion">Retour à la connexion</span></div></div>`) };
      }
      case '/connexion/code': {
        if (!F.loginStage) return fxLogin(ctx);
        const min = Math.round(CONFIG.durees.expirationCodeMail / 60);
        return { title: 'Code de sécurité | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:700px"><div class="fx-card"><h2>Sécurisation de votre connexion</h2>
          <p class="sub">Saisissez le code à 6 chiffres envoyé à <b>${P.mailMasque}</b>.<br>Ce code est valable ${min} minutes.</p>
          <div id="fx-msg"></div>
          <form data-form="code" autocomplete="off"><div class="fx-code">${[0, 1, 2, 3, 4, 5].map(i => `<input maxlength="1" inputmode="numeric" data-ci="${i}">`).join('')}</div>
            <p style="font-size:13px">Vous n'avez pas reçu de code ? <span class="fx-link" data-act="newcode">Demander un nouveau code</span></p>
            <button class="fx-btn">Valider</button> <span class="fx-link" style="margin-left:14px" data-act="cancelcode">Annuler</span></form></div></div>`) };
      }
      case '/espace':
        if (!F.loggedIn) return fxLogin(ctx, 'Votre session a expiré ou vous n\'êtes pas connecté. Veuillez vous identifier.');
        return fxEspace();
      case '/espace/documents':
        if (!F.loggedIn) return fxLogin(ctx, 'Votre session a expiré ou vous n\'êtes pas connecté. Veuillez vous identifier.');
        return fxDocuments();
      case '/espace/document':
        if (!F.loggedIn) return fxLogin(ctx, 'Votre session a expiré ou vous n\'êtes pas connecté. Veuillez vous identifier.');
        return fxDocument(ctx.params.id);
      case '/deconnexion':
        return { title: 'Déconnexion | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:700px"><div class="fx-card"><h2>Vous êtes déconnecté</h2><p class="sub">Pour votre sécurité, fermez votre navigateur si vous utilisez un ordinateur partagé.</p><span class="fx-btn" data-go="/" style="display:inline-block">Retour à l'accueil</span></div></div>`) };
      case '/mot-de-passe-oublie':
        return { title: 'Mot de passe oublié | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:760px"><div class="fx-crumb"><span data-go="/">Accueil</span> › <span data-go="/connexion">Votre espace particulier</span> › Mot de passe oublié</div>
          <div class="fx-card"><h2>Mot de passe oublié</h2><p class="sub">Saisissez votre numéro fiscal et l'adresse mail de votre espace. Vous recevrez un lien pour choisir un nouveau mot de passe.</p>
          <div id="fx-msg"></div>
          <form data-form="forgot" autocomplete="off"><div class="fx-field"><label>Numéro fiscal</label><input type="text" name="num" maxlength="20"></div>
            <div class="fx-field"><label>Adresse mail</label><input type="email" name="mail"></div>
            <button class="fx-btn">Envoyer</button> <span class="fx-link" style="margin-left:14px" data-go="/connexion">Retour</span></form></div></div>`) };
      case '/reinitialisation': {
        const r = F.resetTokens[ctx.params.t];
        if (!r || r.used || Date.now() > r.expires) return { title: 'Lien expiré | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:760px"><div class="fx-card"><h2>Réinitialisation du mot de passe</h2>
          <div class="fx-err">Ce lien n'est plus valide. Il a expiré ou a déjà été utilisé.</div><span class="fx-btn" data-go="/mot-de-passe-oublie" style="display:inline-block">Faire une nouvelle demande</span></div></div>`) };
        return { title: 'Nouveau mot de passe | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:760px"><div class="fx-card"><h2>Choisissez un nouveau mot de passe</h2>
          <div id="fx-msg"></div>
          <form data-form="reset" autocomplete="off"><div class="fx-field"><label>Nouveau mot de passe</label><input type="password" name="pwd"><div class="fx-gauge"><i></i></div><div class="fx-gaugelbl"></div><div id="fx-rules"></div></div>
            <div class="fx-field"><label>Confirmation</label><input type="password" name="pwd2"></div><button class="fx-btn">Valider</button></form></div></div>`) };
      }
      case '/reinitialisation/ok':
        return { title: 'Mot de passe modifié | Fiscalis', html: fxPage(`<div class="fx-wrap" style="max-width:760px"><div class="fx-card"><h2>Mot de passe modifié</h2><div class="fx-ok">Votre mot de passe a bien été modifié. Vous pouvez maintenant vous connecter.</div><span class="fx-btn" data-go="/connexion" style="display:inline-block">Me connecter</span></div></div>`) };
    }
    return fxGeneric('Page introuvable');
  },
  after(root, ctx) {
    const F = S.fiscalis;
    bindPwdLive(root);
    // Saisie du code : passage automatique à la case suivante
    const boxes = $$('[data-ci]', root);
    boxes.forEach((b, i) => {
      b.addEventListener('input', () => { b.value = digits(b.value).slice(-1); if (b.value && boxes[i + 1]) boxes[i + 1].focus(); });
      b.addEventListener('keydown', e => { if (e.key === 'Backspace' && !b.value && boxes[i - 1]) boxes[i - 1].focus(); });
      b.addEventListener('paste', e => { const d = digits(e.clipboardData.getData('text')).slice(0, 6); if (d.length > 1) { e.preventDefault(); d.split('').forEach((c, k) => boxes[k] && (boxes[k].value = c)); (boxes[d.length] || boxes[5]).focus(); } });
    });
    if (boxes[0]) boxes[0].focus();
    // Fin de l'étape 2 : l'avis d'impôt le plus récent est ouvert après le saut dans le temps
    if (ctx.path === '/espace/document' && ctx.params.id === 'avisCetteAnnee' && F.loggedIn
        && S.step === 2 && S.phase2 === 'apres' && !S.waitingCode) later(() => completeStep(2), 4000);
    if (F.justActivated) {
      F.justActivated = false;
      later(() => askSavePassword('fiscalis.gouv.sim', F.account.numero, F.account.password, res => {
        S.incidents.enregistre = res === true;
        if (S.step === 1) later(() => completeStep(1), 900);
      }), 700);
    }
  },
  action(name, el, ctx, root) {
    const F = S.fiscalis;
    switch (name) {
      case 'qm-num': case 'qm-acc': $('#' + name, root).classList.toggle('hidden'); break;
      case 'resend':
        if (F.pending && F.pending.mail === P.mail) deliverMail(mailActivationFiscalis(F.activationToken));
        showErr(root, 'Le mail a été renvoyé.', 'ok'); break;
      case 'newcode':
        sendFiscalisCode();
        showErr(root, `Un nouveau code vous a été envoyé à ${P.mailMasque}. Le code précédent n'est plus valable.`, 'ok'); break;
      case 'cancelcode': F.loginStage = null; F.code = null; navigate('/connexion'); break;
      case 'nope': showErr(root, 'Ce service est momentanément indisponible. Veuillez réessayer ultérieurement.', 'info'); break;
      case 'logout':
        F.loggedIn = false;
        if (S.step === 2 && S.phase2 === 'avant' && !S.waitingCode) { navigate('/'); timeJump(); }
        else navigate('/deconnexion');
        break;
    }
  },
  submit(name, f, ctx, root) {
    const F = S.fiscalis;
    if (name === 'search') { navigate('/page?t=' + encodeURIComponent('Résultats de recherche : ' + (f.q.value || ''))); return; }

    if (name === 'login') {
      const num = digits(f.num.value);
      const pwdBlock = $('#fx-pwdblock', root);
      if (pwdBlock.classList.contains('hidden')) {
        if (num.length !== 13) return showErr(root, 'Le numéro fiscal doit comporter 13 chiffres.');
        if (!(F.account && F.account.active && F.account.numero === num)) {
          if (F.pending && F.pending.numero === num) return showErr(root, 'Votre espace est en cours de création. Pour l\'activer, cliquez sur le lien reçu par mail. <span class="fx-link" data-go="/creation">Recommencer la création</span>');
          return showErr(root, `Ce numéro fiscal ne correspond à aucun espace particulier. S'il s'agit de votre première visite, <span class="fx-link" data-go="/creation?n=${num}">créez votre espace</span>.`, 'info');
        }
        showErr(root, '');
        pwdBlock.classList.remove('hidden');
        f.num.readOnly = true; f.num.style.background = '#eee';
        const sv = savedCreds('fiscalis.gouv.sim');
        if (sv && digits(sv.user) === num) { f.pwd.value = sv.pass; f.pwd.style.background = '#e8f0fe'; }
        $('#fx-loginbtn', root).textContent = 'Connexion';
        f.pwd.focus();
        return;
      }
      if (F.lockedUntil && Date.now() >= F.lockedUntil) { F.lockedUntil = 0; F.failures = 0; }
      if (F.lockedUntil) return showErr(root, '<b>Compte temporairement bloqué.</b> Réessayez dans 15 minutes.');
      if (f.pwd.value !== F.account.password) {
        F.failures++;
        if (F.failures >= 3) {
          F.failures = 0; F.lockedUntil = Date.now() + CONFIG.durees.blocageCompte * 1000; S.incidents.bloque = true;
          return showErr(root, '<b>Compte temporairement bloqué.</b> Réessayez dans 15 minutes.');
        }
        f.pwd.value = ''; f.pwd.style.background = '';
        return showErr(root, F.failures === 2 ? 'Identifiant ou mot de passe incorrect. <b>Il vous reste 1 essai.</b>' : 'Identifiant ou mot de passe incorrect.');
      }
      F.failures = 0; F.lastPwdUsed = f.pwd.value; F.loginStage = num; F.oldCodes = []; F.code = null;
      sendFiscalisCode();
      navigate('/connexion/code');
      return;
    }

    if (name === 'code') {
      const v = $$('[data-ci]', root).map(b => b.value).join('');
      const expired = () => { S.incidents.codeExpire = true; showErr(root, 'Ce code n\'est plus valide. <span class="fx-link" data-act="newcode">Demander un nouveau code</span>'); };
      if (v.length !== 6) return showErr(root, 'Veuillez saisir les 6 chiffres du code.');
      if (F.code && v === F.code.value) {
        if (Date.now() > F.code.expires) return expired();
        F.code = null; F.loginStage = null; F.loggedIn = true;
        navigate('/espace');
        const sv = savedCreds('fiscalis.gouv.sim');
        if (sv && sv.pass !== F.lastPwdUsed) later(() => askSavePassword('fiscalis.gouv.sim', sv.user, F.lastPwdUsed, null, true), 900);
        return;
      }
      if ((F.oldCodes || []).includes(v)) return expired();
      $$('[data-ci]', root).forEach(b => b.value = ''); $('[data-ci]', root).focus();
      return showErr(root, 'Code incorrect.');
    }

    if (name === 'crea1') {
      const num = digits(f.num.value), acc = digits(f.acc.value), nom = f.nom.value, dn = digits(f.naiss.value);
      if (num.length !== 13) return showErr(root, 'Le numéro fiscal doit comporter 13 chiffres.');
      if (acc.length !== 7) return showErr(root, 'Le numéro d\'accès en ligne doit comporter 7 chiffres.');
      if (!nom.trim()) return showErr(root, 'Veuillez saisir votre nom de naissance.');
      if (dn.length !== 8) return showErr(root, 'La date de naissance doit être au format JJ/MM/AAAA.');
      if (num === P.numeroFiscalConjoint || acc === P.accesConjoint) S.incidents.avisConjoint = true;
      if (acc === P.accesAnDernier) S.incidents.avisAnDernier = true;
      const n = P.naissance;
      const dOk = dn === String(n.jour).padStart(2, '0') + String(n.mois).padStart(2, '0') + n.annee;
      if (!(num === P.numeroFiscal && acc === P.accesCetteAnnee && norm(nom) === norm(P.nomNaissance) && dOk))
        return showErr(root, 'Les informations saisies ne permettent pas de vous identifier.');
      if (F.account && F.account.active && F.account.numero === num)
        return showErr(root, 'Vous disposez déjà d\'un espace particulier. <span class="fx-link" data-go="/connexion">Connectez-vous</span>.');
      F.creaNum = num;
      showErr(root, '');
      $('#crea1', root).classList.add('hidden'); $('#crea2', root).classList.remove('hidden');
      $('#st1', root).className = 'done'; $('#st2', root).className = 'on';
      return;
    }

    if (name === 'crea2') {
      const mail = f.mail.value.trim().toLowerCase(), pwd = f.pwd.value;
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(mail)) return showErr(root, 'L\'adresse mail saisie n\'est pas valide.');
      if (!checkPwdRules(pwd)) {
        S.incidents.refus++;
        $('#fx-rules', root).innerHTML = rulesHtml(pwd);
        return showErr(root, 'Votre mot de passe ne respecte pas les règles de sécurité.');
      }
      if (pwd !== f.pwd2.value) return showErr(root, 'Les deux mots de passe saisis ne sont pas identiques.');
      if (!f.cgu.checked) return showErr(root, 'Vous devez accepter les conditions générales d\'utilisation.');
      F.pending = { numero: F.creaNum, mail, password: pwd };
      F.activationToken = token();
      if (mail === P.mail) deliverMail(mailActivationFiscalis(F.activationToken));
      navigate('/creation/envoye');
      return;
    }

    if (name === 'forgot') {
      const num = digits(f.num.value), mail = f.mail.value.trim().toLowerCase();
      if (num.length !== 13) return showErr(root, 'Le numéro fiscal doit comporter 13 chiffres.');
      if (F.account && F.account.active && F.account.numero === num && F.account.mail === mail) sendResetMails();
      f.querySelector('button').disabled = true;
      return showErr(root, 'Si les informations saisies correspondent à un espace particulier, vous allez recevoir un mail contenant un lien pour réinitialiser votre mot de passe.', 'ok');
    }

    if (name === 'reset') {
      const r = F.resetTokens[ctx.params.t];
      if (!r || r.used || Date.now() > r.expires) return showErr(root, 'Ce lien n\'est plus valide. <span class="fx-link" data-go="/mot-de-passe-oublie">Faire une nouvelle demande</span>');
      const pwd = f.pwd.value;
      if (!checkPwdRules(pwd)) { $('#fx-rules', root).innerHTML = rulesHtml(pwd); return showErr(root, 'Votre mot de passe ne respecte pas les règles de sécurité.'); }
      if (pwd !== f.pwd2.value) return showErr(root, 'Les deux mots de passe saisis ne sont pas identiques.');
      if (pwd === F.account.password || F.oldPasswords.includes(pwd) || pwd === F.account.initialPassword)
        return showErr(root, 'Le nouveau mot de passe doit être différent de vos anciens mots de passe.');
      F.oldPasswords.push(F.account.password);
      F.account.password = pwd; r.used = true; F.lockedUntil = 0; F.failures = 0;
      navigate('/reinitialisation/ok', curTab(), { replace: true });
    }
  }
};

/* =====================================================================
   FAUX SITE — fiscalis-gouv-sim.com (hameçonnage)
   ===================================================================== */
SITES['fiscalis-gouv-sim.com'] = {
  name: 'Fiscalis', cls: 'fx', insecure: true, fav: { bg: '#1f4d3a', t: 'F' },
  render(ctx) {
    S.incidents.fauxOuvert = true;
    return {
      title: 'Fiscalis - Vérification de sécurité',
      html: `<div style="background:#1f4d3a;color:#fff;padding:14px 30px;display:flex;align-items:center;gap:12px"><div class="fx-logo"><div class="em" style="width:44px;height:44px;font-size:22px">F</div></div>
        <div><b style="font-family:Georgia;font-size:24px">Fiscalis</b><div style="font-size:11px;opacity:.8">Espace sécurisé - Vérification d'identité</div></div></div>
        <div style="background:#b3261e;color:#fff;padding:8px 30px;font-size:13px">⚠ Votre compte fait l'objet d'une procédure de suspension. Confirmez vos identifiants pour la stopper.</div>
        <div class="fx-wrap" style="max-width:560px"><div class="fx-card" style="margin-top:20px"><h2>Confirmation de vos identifiants</h2>
          <p class="sub">Pour des raisons de sécurité, veuillez confirmer les informations de connexion de votre espace particulier. Cette opération prend moins d'une minute.</p>
          <form data-form="phish" autocomplete="off"><div class="fx-field"><label>Numéro fiscal</label><input type="text" name="num"></div>
            <div class="fx-field"><label>Mot de passe actuel</label><input type="password" name="pwd"></div>
            <div id="fx-msg"></div><button class="fx-btn" style="width:100%">Confirmer mes identifiants</button></form>
          <p style="font-size:11px;color:#777;margin-top:16px">© 2026 Fiscalis.gouv - Service securité. Tout droits reservés.</p></div></div>`
    };
  },
  submit(name, f, ctx, root) {
    if (!f.num.value.trim() && !f.pwd.value.trim()) return showErr(root, 'Veuillez remplir tous les champs.');
    S.incidents.fauxIdentifiants = true;
    showPhishLesson();
  }
};

function showPhishLesson() {
  const el = document.createElement('div');
  el.className = 'phishlesson';
  el.innerHTML = `<div class="pl"><h2>🎣 Stop ! Ce site était un faux.</h2>
    <p style="font-size:15px;line-height:1.55">Vous venez de donner votre numéro fiscal et votre mot de passe à un <b>faux site</b>. Ce n'est pas grave : c'est une simulation, et cela arrive à beaucoup de monde. Ce qui compte, c'est de reconnaître les indices la prochaine fois.</p>
    <div class="clue"><span class="n">1</span><div><b>L'adresse de l'expéditeur.</b> Le mail venait de <code>securite@fiscalis-gouv-sim.com</code>. Le vrai site est <b>fiscalis.gouv.sim</b>. Un tiret et un « .com » à la place des points : ce n'est pas la même adresse.</div></div>
    <div class="clue"><span class="n">2</span><div><b>L'adresse de la page.</b> La barre d'adresse affichait <code>http://fiscalis-gouv-sim.com</code> et « ⚠ Non sécurisé ». Le logo et les couleurs, eux, sont faciles à copier.</div></div>
    <div class="clue"><span class="n">3</span><div><b>L'urgence.</b> « Suspension sous 24 heures » : les fraudeurs pressent pour qu'on n'ait pas le temps de réfléchir.</div></div>
    <div class="clue"><span class="n">4</span><div><b>La demande elle-même.</b> Un site officiel ne demande <b>jamais</b> votre mot de passe par mail. Le vrai mail de Fiscalis le disait d'ailleurs en bas de page.</div></div>
    <div class="clue"><span class="n">5</span><div><b>Le bon réflexe :</b> ne pas cliquer, et aller sur le site en tapant soi-même son adresse. Si on a déjà saisi son mot de passe : le changer tout de suite.</div></div>
    <div class="envrai" style="margin:16px 0">On peut signaler ces messages sur signal-spam.fr, et les SMS frauduleux au 33700.</div>
    <button class="fx-btn" id="plclose">Reprendre là où j'en étais</button></div>`;
  $('#browser').appendChild(el);
  $('#plclose', el).onclick = () => { el.remove(); closeTab(S.activeTab); };
}
