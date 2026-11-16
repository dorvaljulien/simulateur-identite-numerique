/* =====================================================================
   SANTÉA — santea.gouv.sim (rôle réel : ameli.fr)
   ===================================================================== */
const ipButton = (go, sub = 'S\'identifier avec', plus = false) => `<button type="button" class="ip-button ${plus ? 'plus' : ''}" data-go="${go}"><span class="k">${iconeContenu('identipass', '🔑')}</span><span class="l"><small>${sub}</small><b>IdentiPass</b></span>${plus ? '<span class="p">+</span>' : ''}</button>`;

function saHeader() {
  return `<div class="sa-pub"><div class="in"><span class="on">Assuré</span><span>Professionnel de santé</span><span>Employeur</span><span class="sp"></span><span>Accessibilité</span><span>Aide</span></div></div>
    <div class="sa-head"><div class="in"><div class="sa-logo" data-go="/">${logo('santea', `<div class="m">${initiale('Santéa')}</div><div><b>Santéa</b><small>L'assurance maladie — site fictif</small></div>`, 44)}</div>
      <form class="search" data-form="search"><input name="q" placeholder="Une question ? Ex : attestation, carte, remboursement"><button>🔍</button></form>
      <div class="sa-acc"><span class="other" data-go="/page?t=Trouver un professionnel de santé">📍 Adresses et tarifs</span><span class="mon" data-go="${S.santea.loggedIn ? '/espace' : '/connexion'}">👤 Mon compte</span></div></div></div>
    <div class="sa-nav"><div class="in">${['Droits et démarches', 'Remboursements', 'Santé et prévention', 'Adresses et tarifs', 'Nous contacter'].map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x} ▾</span>`).join('')}</div></div>`;
}
function saFooter() {
  const c = { 'Démarches': ['Attestation de droits', 'Carte d\'assurance maladie', 'Médecin traitant', 'Arrêt de travail', 'Maternité'], 'Remboursements': ['Ce qui est remboursé', 'Délais de remboursement', 'Complémentaire santé solidaire', 'Frais de transport'],
    'Prévention': ['Vaccination', 'Dépistages', 'Examen de prévention santé', 'Arrêter de fumer'], 'Nous contacter': ['Par téléphone : 36 99 (fictif)', 'Par messagerie', 'Prendre rendez-vous', 'Trouver un point d\'accueil'] };
  return `<div class="sa-foot"><div class="in">${Object.entries(c).map(([k, v]) => `<div><h4>${k}</h4>${v.map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x}</span>`).join('')}</div>`).join('')}</div>
    <div class="legal">© Santéa 2026 — site fictif à usage pédagogique · Mentions légales · Données personnelles · Cookies · Plan du site</div></div>`;
}
const saPage = inner => saHeader() + inner + saFooter();
function saErr(root, html, kind = 'err') { const z = $('#sa-msg', root); z.innerHTML = html ? `<div class="sa-${kind}">${html}</div>` : ''; }

SITES['santea.gouv.sim'] = {
  name: 'Santéa', cls: 'sa', fav: favIco('santea', '#5b2a6e', initiale('Santéa')),
  envrai: ctx => ctx.path.startsWith('/connexion') ? null : 'le compte ameli de l\'Assurance Maladie',
  cookie: () => cookieBar('santea.gouv.sim', 'background:#3d1a4b;color:#fff', 'Santéa'),
  render(ctx) {
    const p = ctx.path.replace(/\/$/, '') || '/';
    if (p === '/') return {
      title: 'Santéa — L\'assurance maladie',
      html: saPage(`<div class="sa-wrap">
        <div class="sa-hero"><div class="txt"><span class="lbl">Prévention</span><h1>Grippe et virus de l'hiver : la vaccination, c'est maintenant</h1>
          <p>La campagne de vaccination est ouverte jusqu'au 31 janvier. Elle est prise en charge à 100 % pour les personnes de 65 ans et plus, les personnes atteintes de certaines maladies chroniques et les professionnels de santé. Pharmaciens, infirmiers et médecins peuvent vous vacciner.</p>
          <span class="sa-btn" data-go="/page?t=Vaccination contre la grippe">Je m'informe</span></div><div class="img">💉</div></div>
        <h2 class="sa-h2">Les démarches les plus consultées</h2>
        <div class="sa-tiles">${[['📄', 'Obtenir une attestation de droits', 'Téléchargez-la en quelques clics depuis votre compte.'], ['💳', 'Commander une carte d\'assurance maladie', 'En cas de perte, de vol ou de première demande.'], ['🩺', 'Déclarer mon médecin traitant', 'Pour être mieux remboursé et mieux suivi.'],
          ['💶', 'Suivre mes remboursements', 'Consultez le détail de vos paiements en temps réel.'], ['🛌', 'Arrêt de travail', 'Démarches, indemnités journalières, reprise.'], ['🤝', 'Complémentaire santé solidaire', 'Une aide pour payer vos dépenses de santé.']]
          .map(t => `<div data-go="/page?t=${encodeURIComponent(t[1])}"><span class="ic">${t[0]}</span><span><b>${t[1]}</b><small>${t[2]}</small></span></div>`).join('')}</div>
        <div class="sa-two"><div><h2 class="sa-h2">Santé et prévention</h2>${[['#f5eef8', '🦷', 'Examens bucco-dentaires gratuits de 3 à 24 ans', 'Un rendez-vous chez le dentiste pris en charge tous les trois ans, sans avance de frais.'],
          ['#fdeee8', '🚭', 'Novembre sans tabac : 30 jours pour arrêter', 'Les substituts nicotiniques sont remboursés sur prescription. Un accompagnement gratuit est proposé.'],
          ['#eaf3ee', '🩻', 'Dépistage du cancer du sein : l\'invitation arrive par courrier', 'Entre 50 et 74 ans, une mammographie est prise en charge à 100 % tous les deux ans.'],
          ['#eef2f8', '🧠', 'Mon soutien psy : jusqu\'à 12 séances remboursées', 'Sur orientation de votre médecin, ou directement auprès d\'un psychologue partenaire.']]
          .map(a => `<div class="sa-art" data-go="/page?t=${encodeURIComponent(a[2])}"><div class="th" style="background:${a[0]}">${a[1]}</div><div><h4>${a[2]}</h4><p>${a[3]}</p></div></div>`).join('')}</div>
          <div><div class="sa-side"><h3>📢 Informations importantes</h3><ul style="padding-left:18px;margin:0">
            <li><b>Attention aux faux SMS</b> vous demandant de renouveler votre carte : Santéa ne vous demande jamais vos coordonnées bancaires.</li>
            <li>Le 36 99 (fictif) sera fermé le 11 novembre.</li><li>Nouveau : la carte d'assurance maladie sur votre téléphone, déjà dans 40 départements.</li></ul></div>
            <div class="sa-side" style="margin-top:14px;background:#5b2a6e;color:#fff"><h3 style="color:#fff">Mon compte Santéa</h3><p style="font-size:13px;line-height:1.5">Remboursements, attestations, messagerie avec un conseiller : votre compte est disponible 7j/7.</p><span class="sa-btn" style="background:#e8613c" data-go="/connexion">Accéder à mon compte</span></div></div></div>
        <h2 class="sa-h2">Votre situation</h2>
        <div class="sa-life">${['J\'attends un enfant', 'Je suis malade', 'Je suis en situation de handicap', 'Je vais à l\'étranger', 'Je change de situation professionnelle', 'Je déménage', 'Je perds un proche', 'J\'ai plus de 60 ans'].map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x}</span>`).join('')}</div></div>`)
    };
    if (p === '/page') {
      const t = ctx.params.t || 'Information';
      return { title: t + ' | Santéa', html: saPage(`<div class="sa-wrap" style="max-width:860px"><p style="font-size:12px;color:#777"><span data-go="/" style="text-decoration:underline">Accueil</span> › ${h(t)}</p><h1 style="color:#3d1a4b">${h(t)}</h1>
        <p style="line-height:1.7">Les informations de cette page concernent les assurés du régime général. Votre situation peut nécessiter des démarches particulières : en cas de doute, contactez votre caisse par la messagerie de votre compte Santéa ou par téléphone.</p>
        <p style="line-height:1.7">La plupart des démarches peuvent être réalisées en ligne depuis votre compte, sans vous déplacer. Pensez à garder à portée de main votre carte d'assurance maladie et, le cas échéant, les justificatifs demandés.</p>
        <div class="sa-ok" style="background:#f5eef8;color:#3d1a4b">Cette page est en cours de mise à jour. Merci de votre compréhension.</div></div>`) };
    }
    if (p === '/connexion') return {
      title: 'Connexion à mon compte | Santéa',
      html: saPage(`<div class="sa-wrap"><h1 style="text-align:center;color:#3d1a4b;font-size:24px;margin:6px 0 20px">Se connecter à mon compte Santéa</h1>
        <div class="sa-login"><div class="sa-card"><h2>Avec IdentiPass</h2><p class="sub">Utilisez un compte que vous possédez déjà sur un autre service public pour vous connecter, sans créer de nouveau mot de passe.</p>
          <div style="text-align:center;margin:18px 0">${ipButton('identipass.sim/choix?service=santea')}</div>
          <p style="text-align:center;font-size:12px"><span data-go="identipass.sim" data-newtab style="text-decoration:underline;color:#5b2a6e">Qu'est-ce que IdentiPass ?</span></p>
          <div class="envrai" style="margin-top:16px">Ce bouton s'appelle FranceConnect.</div></div>
        <div class="sa-card"><h2>Avec mes identifiants Santéa</h2><div id="sa-msg"></div>
          <form data-form="login" autocomplete="off"><div class="sa-field"><label>Numéro de sécurité sociale</label><input name="num" placeholder="13 chiffres"></div>
            <div class="sa-field"><label>Mot de passe</label><input name="pwd" type="password"></div>
            <button class="sa-btn" style="width:100%">Je me connecte</button></form>
          <p style="font-size:12.5px;margin-top:12px"><span data-act="forgot" style="text-decoration:underline">Mot de passe oublié ?</span></p>
          <div class="or">— Pas encore de compte ? —</div><span class="sa-btn ghost" style="display:block;text-align:center" data-go="/creation">Créer mon compte Santéa</span></div></div>
        <div class="envrai" style="max-width:900px;margin:18px auto 0">Le site Santéa joue le rôle du compte ameli de l'Assurance Maladie.</div></div>`)
    };
    if (p === '/creation') return {
      title: 'Créer mon compte | Santéa',
      html: saPage(`<div class="sa-wrap" style="max-width:620px"><div class="sa-card"><h2>Créer mon compte Santéa</h2><p class="sub">Pour créer votre compte, munissez-vous de votre carte d'assurance maladie.</p><div id="sa-msg"></div>
        <form data-form="crea" autocomplete="off"><div class="sa-field"><label>Numéro de sécurité sociale</label><input name="num"></div>
          <div class="sa-field"><label>Date de naissance (JJ/MM/AAAA)</label><input name="dn"></div><div class="sa-field"><label>Code postal</label><input name="cp" maxlength="5"></div>
          <button class="sa-btn">Continuer</button> <span data-go="/connexion" style="margin-left:12px;text-decoration:underline;font-size:12.5px">Annuler</span></form></div></div>`)
    };
    if (p === '/creation/courrier') return {
      title: 'Demande enregistrée | Santéa',
      html: saPage(`<div class="sa-wrap" style="max-width:620px"><div class="sa-card"><h2>Demande enregistrée</h2>
        <div class="sa-ok">Votre demande de création de compte a bien été prise en compte.<br><br><b>Un courrier avec votre code provisoire vous sera envoyé sous 5 jours</b> à votre adresse postale. Vous pourrez ensuite activer votre compte.</div>
        <span class="sa-btn ghost" data-go="/connexion">Retour à la connexion</span></div></div>`)
    };
    if (p.startsWith('/espace')) {
      if (!S.santea.loggedIn) return SITES['santea.gouv.sim'].render(Object.assign({}, ctx, { path: '/connexion' }));
      const head = `<div class="sa-head" style="border-bottom:3px solid #5b2a6e"><div class="in"><div class="sa-logo" data-go="/espace">${logo('santea', `<div class="m">${initiale('Santéa')}</div><div><b>Santéa</b><small>Mon compte</small></div>`, 44)}</div><span style="flex:1"></span>
          <span style="font-size:12.5px">${P.prenom} ${P.nomUsage.toUpperCase()} — connectée via <b>IdentiPass</b></span><span class="sa-btn ghost" data-act="logout" style="padding:6px 14px;font-size:12px">Me déconnecter</span></div></div>`;
      const crumb = t => `<p style="font-size:12px;color:#777;margin:0 0 12px"><span data-go="/espace" style="text-decoration:underline">Mon compte</span> › ${t}</p>`;
      if (p === '/espace/attestations') return {
        title: 'Mes attestations | Santéa',
        html: head + `<div class="sa-wrap">${crumb('Mes attestations')}<div id="sa-msg"></div><h1 style="color:#3d1a4b;font-size:22px;margin:0 0 6px">Mes attestations</h1>
          <p style="color:#6b5d73;font-size:13px;margin:0 0 16px">Choisissez l'attestation dont vous avez besoin. Elle est disponible immédiatement et a la même valeur qu'un document papier.</p>
          <div class="sa-tiles" style="grid-template-columns:1fr 1fr">${[
            ['droits', '🛡️', 'Attestation de droits', 'Prouve que vous êtes bien couverte par l\'assurance maladie. Demandée par les professionnels de santé, les hôpitaux…'],
            ['ij', '🛌', 'Attestation de paiement des indemnités journalières', 'Pour justifier des sommes perçues pendant un arrêt de travail.'],
            ['paiements', '💶', 'Relevé de mes remboursements', 'Détail des remboursements de soins sur une période donnée.'],
            ['css', '🤝', 'Attestation de complémentaire santé solidaire', 'Si vous bénéficiez de cette aide pour payer vos dépenses de santé.']]
            .map(a => `<div data-go="/espace/attestation?type=${a[0]}"><span class="ic">${a[1]}</span><span><b>${a[2]}</b><small>${a[3]}</small></span></div>`).join('')}</div></div>${saFooter()}`
      };
      if (p === '/espace/attestation') {
        const t = ctx.params.type;
        if (t !== 'droits') {
          const msg = { ij: 'Vous n\'avez perçu aucune indemnité journalière sur les 12 derniers mois.', paiements: 'Ce service est temporairement indisponible. Veuillez réessayer ultérieurement.', css: 'Vous ne bénéficiez pas de la complémentaire santé solidaire.' }[t] || 'Document introuvable.';
          return { title: 'Mes attestations | Santéa', html: head + `<div class="sa-wrap">${crumb('<span data-go="/espace/attestations" style="text-decoration:underline">Mes attestations</span>')}<div class="sa-err">${msg}</div><span class="sa-btn ghost" data-go="/espace/attestations">← Retour à mes attestations</span></div>${saFooter()}` };
        }
        const d = now(), n = P.naissance;
        const ed = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
        return {
          title: 'attestation_droits.pdf',
          html: head + `<div class="sa-wrap">${crumb('<span data-go="/espace/attestations" style="text-decoration:underline">Mes attestations</span> › Attestation de droits')}
            <div class="fx-pdf"><div class="bar"><span>📄 attestation_droits_${P.nomUsage.replace(/\s/g, '').toLowerCase()}.pdf</span><span style="flex:1"></span><span>1 / 1</span><span>－ 125 % ＋</span><span data-act="nope">⤓</span><span data-act="nope">🖶</span></div>
            <div class="pages"><div class="paper" style="zoom:1.25">
              <div style="display:flex;gap:6px;align-items:center"><div style="width:30px;height:30px;border-radius:7px;background:#5b2a6e;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px">S</div>
                <div style="font-size:8px;line-height:1.2"><b style="font-size:11px;color:#5b2a6e">Santéa</b><br>Caisse d'assurance maladie du Finistère (fictive)</div></div>
              <div style="text-align:center;margin:18px 0 12px"><b style="font-size:14px">ATTESTATION DE DROITS À L'ASSURANCE MALADIE</b><br><span style="font-size:9px">Document édité le ${ed} depuis votre compte Santéa</span></div>
              <table style="font-size:9px;border:1px solid #5b2a6e;margin:8px 0">
                <tr style="background:#f3ebf6"><td style="width:45%">Assurée</td><td><b>${P.nomUsage.toUpperCase()} ${P.prenom}</b> (nom de naissance : ${P.nomNaissance.toUpperCase()})</td></tr>
                <tr><td>Née le</td><td>${String(n.jour).padStart(2, '0')}/${String(n.mois).padStart(2, '0')}/${n.annee} à ${n.lieu}</td></tr>
                <tr style="background:#f3ebf6"><td>Numéro de sécurité sociale</td><td><b>${P.numeroSecu}</b></td></tr>
                <tr><td>Organisme de rattachement</td><td>Santéa Finistère — 29 941</td></tr>
                <tr style="background:#f3ebf6"><td>Droits à l'assurance maladie</td><td><b>ouverts du 01/01/2026 au 31/12/2027</b></td></tr>
                <tr><td>Exonération du ticket modérateur</td><td>non</td></tr>
                <tr style="background:#f3ebf6"><td>Médecin traitant déclaré</td><td>Dr Y. MORVAN — Penhoat-sur-Ellé</td></tr></table>
              <p style="font-size:8.5px">La présente attestation est valable sous réserve de l'ouverture effective des droits à la date des soins. Elle ne remplace pas la carte d'assurance maladie.</p>
              <p style="font-size:8.5px;text-align:right;margin-top:20px">Le directeur de la caisse</p></div></div></div>
            <span class="sa-btn ghost" data-go="/espace/attestations">← Retour à mes attestations</span></div>${saFooter()}`
        };
      }
      return {
        title: 'Mon compte | Santéa',
        html: head + `<div class="sa-wrap"><div id="sa-msg"></div><div style="background:linear-gradient(110deg,#5b2a6e,#8a3f9e);color:#fff;border-radius:14px;padding:22px 26px;margin-bottom:20px">
            <div style="font-size:24px;font-weight:700">Bienvenue ${P.prenom} ${P.nomUsage}</div><div style="opacity:.85;margin-top:4px">Dernière connexion : première connexion à votre compte.</div></div>
          <div class="sa-tiles">${[['📄', 'Mes attestations', 'Attestation de droits, d\'indemnités journalières…', '/espace/attestations'], ['💶', 'Mes paiements', 'Dernier remboursement : 17,50 € le 24/10'], ['✉️', 'Ma messagerie', 'Aucun nouveau message'],
            ['🩺', 'Mon médecin traitant', 'Dr Y. Morvan'], ['💳', 'Ma carte d\'assurance maladie', 'Commander, déclarer une perte'], ['👤', 'Mes informations', 'Adresse, téléphone, coordonnées bancaires']]
            .map(t => `<div ${t[3] ? `data-go="${t[3]}"` : 'data-act="nope"'}><span class="ic">${t[0]}</span><span><b>${t[1]}</b><small>${t[2]}</small></span></div>`).join('')}</div></div>${saFooter()}`
      };
    }
    return SITES['santea.gouv.sim'].render(Object.assign({}, ctx, { path: '/page', params: { t: 'Page introuvable' } }));
  },
  after(root, ctx) {
    // Fin de l'étape 3 : l'attestation de droits est ouverte
    if (ctx.path === '/espace/attestation' && ctx.params.type === 'droits' && S.santea.loggedIn && S.step === 3 && !S.waitingCode) later(() => completeStep(3), 4000);
  },
  action(name, el, ctx, root) {
    if (name === 'forgot') saErr(root, 'Pour réinitialiser votre mot de passe, saisissez d\'abord votre numéro de sécurité sociale.');
    if (name === 'nope') saErr(root, 'Ce service est temporairement indisponible. Veuillez nous excuser pour la gêne occasionnée.');
    if (name === 'logout') { S.santea.loggedIn = false; navigate('/'); }
  },
  submit(name, f, ctx, root) {
    if (name === 'search') { navigate('/page?t=' + encodeURIComponent('Résultats : ' + f.q.value)); return; }
    if (name === 'login') {
      const n = digits(f.num.value);
      if (n.length !== 13 && n.length !== 15) return saErr(root, 'Le numéro de sécurité sociale doit comporter 13 chiffres.');
      return saErr(root, 'Numéro de sécurité sociale ou mot de passe incorrect.');
    }
    if (name === 'crea') {
      const n = digits(f.num.value);
      if (n.length !== 13 && n.length !== 15) return saErr(root, 'Le numéro de sécurité sociale doit comporter 13 chiffres.');
      if (digits(f.dn.value).length !== 8) return saErr(root, 'La date de naissance doit être au format JJ/MM/AAAA.');
      if (digits(f.cp.value).length !== 5) return saErr(root, 'Le code postal doit comporter 5 chiffres.');
      navigate('/creation/courrier');
    }
  }
};

/* =====================================================================
   IdentiPass — identipass.sim (rôle réel : FranceConnect)
   IdentiPass+ (rôle réel : FranceConnect+) : même site, pour les services
   marqués « plus ». Seules les identités numériques vérifiées passent.
   ===================================================================== */
const SERVICES = {
  santea: { nom: 'Santéa', host: 'santea.gouv.sim', couleur: '#5b2a6e', login: () => { S.santea.loggedIn = true; } },
  forma: { nom: 'FormaCompte', host: 'formacompte.gouv.sim', couleur: '#8a4b08', plus: true, login: () => { S.forma.loggedIn = true; } }
};
// verifie : identité numérique vérifiée (pièce d'identité contrôlée, liée au téléphone) → acceptée par IdentiPass+
const IP_ACCOUNTS = [
  { id: 'fiscalis', nom: 'Fiscalis', sous: 'impôts', bg: '#1f4d3a', t: initiale('Fiscalis'), refuse: ['santea'] },
  { id: 'santea', nom: 'Santéa', sous: 'assurance maladie', bg: '#5b2a6e', t: initiale('Santéa') },
  { id: 'numerid', nom: 'NumérID', sous: 'identité numérique', bg: '#00787a', t: 'ID', verifie: true },
  { id: 'agrimut', nom: 'Agrimut', sous: 'mutualité agricole', bg: '#6a8a1f', t: initiale('Agrimut'), host: 'agrimut.sim' },
  { id: 'cartid', nom: 'CartID', sous: 'carte d\'identité sur mobile', bg: '#7d5a1c', t: initiale('CartID'), verifie: true, host: 'cartid.gouv.sim' },
  { id: 'idnomade', nom: 'IdNomade', sous: 'identité sur mobile', bg: '#3c5aa6', t: initiale('IdNomade'), host: 'idnomade.sim' }
];
const svcOf = ctx => SERVICES[ctx.params.service] || SERVICES.santea;
const svcId = ctx => SERVICES[ctx.params.service] ? ctx.params.service : 'santea';
function ipTop(plus) {
  return `<div class="ip-top"><div class="in"><div class="ip-logo" data-go="identipass.sim">${logo('identipass', '<span class="k">🔑</span>IdentiPass', 30)}${plus ? '<span class="plus">+</span>' : ''}</div><span style="font-size:12px;opacity:.75">${plus ? 'La connexion renforcée aux démarches sensibles (fictive)' : 'La connexion unique aux services publics (fictive)'}</span><span class="sp"></span><span class="lnk" data-go="identipass.sim/historique">Mon historique de connexions</span></div></div>`;
}
SITES['identipass.sim'] = {
  name: 'IdentiPass', cls: 'ip', fav: favIco('identipass', '#2b3440', '🔑'),
  envrai: ctx => ctx.path.startsWith('/consentement') ? null
    : ctx.path.startsWith('/aidants') ? 'ce service s\'appelle Aidants Connect. Il est réservé aux aidants professionnels habilités.'
    : (SERVICES[ctx.params.service] || {}).plus ? 'ce service s\'appelle FranceConnect+ : la version renforcée de FranceConnect, pour les démarches sensibles.'
    : 'ce service s\'appelle FranceConnect.',
  render(ctx) {
    const svc = svcOf(ctx), sid = svcId(ctx), plus = !!svc.plus;
    const p = ctx.path.replace(/\/$/, '') || '/';
    if (p === '/choix') {
      const tile = (a, off, why) => `<div class="ip-acc ${off ? 'off' : ''}" data-act="${off ? 'refus' : 'acc'}" data-id="${a.id}"><span class="lg" style="background:${iconeFond(a.id, a.bg)}">${iconeContenu(a.id, a.t)}</span><b>${a.nom}</b><small>${a.sous}</small>${why ? `<span class="why">${why}</span>` : ''}</div>`;
      const ok = IP_ACCOUNTS.filter(a => plus ? a.verifie : true);
      const ko = plus ? IP_ACCOUNTS.filter(a => !a.verifie) : [];
      return {
        title: (plus ? 'IdentiPass+' : 'IdentiPass') + ' — Choix du compte',
        html: ipTop(plus) + `<div class="ip-main"><h1>${plus ? 'Je choisis une identité numérique pour me connecter' : 'Je choisis un compte pour me connecter'}</h1><div class="svc">Vous souhaitez accéder à : <b style="color:${svc.couleur}">${svc.nom}</b></div><div id="ip-msg"></div>
        <div class="ip-grid">${ok.map(a => { const off = (a.refuse || []).includes(sid); return tile(a, off, off ? 'Ce compte ne peut pas être utilisé pour se connecter à ce service.' : ''); }).join('')}</div>
        ${plus ? `<h2 class="ip-sub">Comptes qui ne sont pas acceptés pour cette démarche</h2><div class="ip-grid small">${ko.map(a => tile(a, true, '')).join('')}</div>` : ''}
        <p style="margin-top:22px;font-size:12.5px;color:#555">${plus ? 'Vous n\'avez aucune de ces identités numériques ?' : 'Vous n\'avez aucun de ces comptes ?'} <span style="text-decoration:underline;cursor:pointer" data-go="identipass.sim">En savoir plus sur IdentiPass</span></p>
        <p style="font-size:12.5px"><span style="text-decoration:underline;cursor:pointer" data-go="${svc.host}/connexion">← Revenir sur ${svc.nom}</span></p>
        <div class="ip-aidant">Vous êtes un aidant professionnel ? <span data-go="identipass.sim/aidants">Utiliser Aidants Relais</span></div></div>`
      };
    }
    if (p === '/consentement') {
      if (S.numerid.authOk !== sid) return SITES['identipass.sim'].render(Object.assign({}, ctx, { path: '/choix' }));
      const n = P.naissance;
      return {
        title: (plus ? 'IdentiPass+' : 'IdentiPass') + ' — Autorisation',
        html: ipTop(plus) + `<div class="ip-main"><h1>Transmission de vos informations</h1><div class="svc">Vous êtes connectée avec <b style="color:#00787a">NumérID</b>.</div>
          <p><b>${svc.nom}</b> va recevoir les informations suivantes :</p>
          <ul class="ip-consent"><li><span>Nom de naissance</span><b>${P.nomNaissance}</b></li><li><span>Nom d'usage</span><b>${P.nomUsage}</b></li><li><span>Prénom</span><b>${P.prenom}</b></li>
            <li><span>Date de naissance</span><b>${String(n.jour).padStart(2, '0')}/${String(n.mois).padStart(2, '0')}/${n.annee}</b></li><li><span>Lieu de naissance</span><b>${n.lieu}</b></li><li><span>Sexe</span><b>${P.sexe === 'F' ? 'Féminin' : 'Masculin'}</b></li></ul>
          <p style="font-size:12.5px;color:#555">Ces informations proviennent de votre identité NumérID. Elles servent uniquement à vous identifier auprès de ${svc.nom}.</p>
          <div style="display:flex;gap:12px;margin-top:18px"><button class="ip-btn" data-act="consent">Continuer sur ${svc.nom}</button><button class="ip-btn ghost" data-act="cancel">Annuler</button></div></div>
          <div class="envrai" style="max-width:860px;margin:0 auto 30px">Cet écran existe aussi sur FranceConnect : il montre les informations que le site va recevoir. Vérifiez que ce sont bien les vôtres avant de continuer.</div>`
      };
    }
    if (p === '/historique') return { title: 'IdentiPass — Historique', html: ipTop() + `<div class="ip-main"><h1>Mon historique de connexions</h1><p>Pour consulter votre historique, connectez-vous d'abord à un service avec IdentiPass.</p></div>` };
    if (p === '/aidants') return { title: 'Aidants Relais — IdentiPass', html: ipTop() + `<div class="ip-main ip-home"><h1>Aidants Relais</h1>
        <p>Aidants Relais est <b>réservé aux aidants professionnels habilités</b> : agents des maisons de services au public, travailleurs sociaux, médiateurs numériques, secrétaires de mairie…</p>
        <p>Il leur permet de faire une démarche en ligne <b>pour une personne qui le demande</b>, avec son accord écrit (un mandat, limité dans le temps), <b>sans jamais utiliser ses identifiants ni ses mots de passe</b>. Chaque action est enregistrée.</p>
        <div id="ip-msg"></div><button class="ip-btn" data-act="aidant">Me connecter en tant qu'aidant habilité</button>
        <p style="font-size:12.5px;margin-top:18px"><span style="text-decoration:underline;cursor:pointer" data-act="back">← Retour</span></p></div>` };
    return {
      title: 'IdentiPass — La connexion unique aux services publics',
      html: ipTop() + `<div class="ip-main ip-home"><h1 style="font-size:26px">Un seul identifiant pour plus de 1 400 services en ligne</h1>
        <p>IdentiPass vous permet de vous connecter à de nombreux services publics <b>avec un compte que vous possédez déjà</b> : celui des impôts, de l'assurance maladie, ou une identité numérique. Pas besoin de créer un nouveau mot de passe pour chaque site.</p>
        <div style="margin:18px 0">${ipButton('identipass.sim', 'Exemple du bouton :')}</div>
        <h2>Comment ça marche ?</h2><ol><li>Sur le site où vous voulez aller, cliquez sur le bouton IdentiPass.</li><li>Choisissez un compte que vous possédez déjà.</li><li>Connectez-vous avec ce compte.</li><li>Vérifiez les informations transmises, puis continuez.</li></ol>
        <h2>Avec quels comptes ?</h2><div class="ip-logos">${IP_ACCOUNTS.map(a => `<span>${a.nom}</span>`).join('')}</div>
        <p style="font-size:12.5px;color:#555">Certains comptes ne permettent pas d'accéder à tous les services, pour des raisons de sécurité.</p>
        <h2>IdentiPass+ : pour les démarches sensibles</h2>
        <div style="margin:10px 0 14px">${ipButton('identipass.sim', 'Exemple du bouton :', true)}</div>
        <p>Certaines démarches engagent votre argent, votre santé ou votre vote. Elles demandent une garantie plus forte sur votre identité : c'est <b>IdentiPass+</b>.</p>
        <p>Avec IdentiPass+, seules les <b>identités numériques vérifiées</b> sont acceptées : celles pour lesquelles votre pièce d'identité a été contrôlée, et qui se confirment sur votre téléphone. Les comptes protégés par un simple mot de passe ne suffisent pas.</p>
        <div class="ip-logos">${IP_ACCOUNTS.filter(a => a.verifie).map(a => `<span>${a.nom}</span>`).join('')}</div>
        <h2>Quelques services accessibles</h2><div class="ip-logos">${['Santéa', 'FormaCompte', 'Retraite en ligne', 'Allocations familiales', 'Permis de conduire', 'Carte grise', 'Pôle Travail', 'Procuration de vote', 'Mairies partenaires', 'Chèque énergie'].map(x => `<span>${x}</span>`).join('')}</div>
        <h2>Sécurité</h2><p>IdentiPass ne stocke pas vos mots de passe : ils restent chez le compte que vous choisissez. IdentiPass ne vous demandera jamais d'informations bancaires.</p></div>`
    };
  },
  action(name, el, ctx, root) {
    const svc = svcOf(ctx), sid = svcId(ctx);
    const msg = t => { $('#ip-msg', root).innerHTML = `<div class="ip-alert">${t}</div>`; $('#viewport').scrollTop = 0; };
    if (name === 'refus') {
      const a = IP_ACCOUNTS.find(x => x.id === el.dataset.id);
      if (!svc.plus) return msg(`<b>Le compte ${a.nom} ne peut pas être utilisé pour se connecter à ${svc.nom}.</b> Choisissez un autre compte.`);
      S.incidents.refusPlus = true;
      return msg(`<b>Niveau de garantie insuffisant.</b> Le compte ${a.nom} ne permet pas de se connecter avec IdentiPass+ : cette démarche demande une identité numérique vérifiée.`);
    }
    if (name === 'acc') {
      const id = el.dataset.id;
      if (id === 'santea') return msg('<b>Vous n\'avez pas de compte Santéa.</b> Choisissez un autre compte.');
      if (id === 'numerid') { navigate('numerid.sim/connexion?service=' + sid); return; }
      navigate(IP_ACCOUNTS.find(a => a.id === id).host + '/?service=' + sid);
    }
    if (name === 'consent') { svc.login(); S.numerid.authOk = null; navigate(svc.host + '/espace'); }
    if (name === 'cancel') { S.numerid.authOk = null; navigate(svc.host + '/connexion'); }
    if (name === 'aidant') msg('<b>Aucune habilitation trouvée.</b> Aidants Relais est réservé aux professionnels dont la structure est habilitée.');
    if (name === 'back') goBack();
  }
};

/* =====================================================================
   NumérID — numerid.sim (rôle réel : L'Identité Numérique La Poste)
   Identité numérique vérifiée : pas de mot de passe. Chaque connexion se
   confirme dans l'application, sur le téléphone, avec le code secret.
   ===================================================================== */
function niTop() {
  return `<div class="ni-top"><div class="in"><div class="ni-logo" data-go="numerid.sim">${logo('numerid', `<span class="d"></span><b>NumérID</b>`, 32)}</div>
    <nav><span data-go="numerid.sim/page?t=Découvrir">Découvrir</span><span data-go="numerid.sim/page?t=Créer mon identité">Créer mon identité</span><span data-go="numerid.sim/page?t=Services partenaires">Services partenaires</span><span data-go="numerid.sim/page?t=Aide">Aide</span></nav>
    <span class="sp"></span><span class="conn" data-go="numerid.sim/connexion">Se connecter</span></div></div>`;
}
const telMasque = () => P.telephone.replace(/^(\d\d) \d\d \d\d \d\d (\d\d)$/, '$1 •• •• •• $2');
function niErr(root, html, kind = 'err') { const z = $('#ni-msg', root); z.innerHTML = html ? `<div class="ni-${kind}">${html}</div>` : ''; }
/* Envoie la demande de confirmation sur le téléphone */
function numeridAsk(ctx) {
  const N = S.numerid, sid = SERVICES[ctx.params.service] ? ctx.params.service : null, svc = sid && SERVICES[sid];
  const tab = ctx.tab, url = tab.history[tab.idx];
  const still = () => S.tabs.includes(tab) && tab.history[tab.idx] === url;
  const end = st => { N.status = st; if (still() && tab.id === S.activeTab) renderBrowser(); };
  N.status = 'wait'; N.reqId = token();
  pushNotif('NumérID', 'Demande de connexion', svc ? svc.nom : 'Espace NumérID');
  phoneAskConfirm({
    id: N.reqId, app: 'NumérID', expect: P.numerid.codeSecret, maxTries: 3,
    html: `Demande de connexion à <b>${svc ? svc.nom : 'votre espace NumérID'}</b>${svc ? ' via IdentiPass' + (svc.plus ? '+' : '') : ''}.<br>Est-ce bien vous ?`,
    text: 'Saisissez votre code secret NumérID.',
    onWrong: () => { S.incidents.codeSecretFaux = true; },
    onBlocked: () => end('blocked'),
    onRefuse: () => end('refused'),
    onOk: () => {
      N.status = null;
      if (!still()) { toast('NumérID : la demande de connexion a expiré.'); return; }
      if (sid) { N.authOk = sid; navigate('identipass.sim/consentement?service=' + sid, tab); }
      else { N.session = true; navigate('numerid.sim/espace', tab); }
    }
  });
}
SITES['numerid.sim'] = {
  name: 'NumérID', cls: 'ni', fav: favIco('numerid', '#00787a', 'ID'),
  envrai: 'L\'Identité Numérique La Poste. Pas de mot de passe : chaque connexion se confirme dans l\'application, sur le téléphone de la personne.',
  cookie: () => cookieBar('numerid.sim', 'background:#00585a;color:#fff', 'NumérID'),
  render(ctx) {
    const p = ctx.path.replace(/\/$/, '') || '/';
    const svc = SERVICES[ctx.params.service];
    const from = svc ? `<div class="ni-from">🔑 Connexion demandée par <b>IdentiPass${svc.plus ? '+' : ''}</b> pour accéder à <b>${svc.nom}</b></div>` : '';
    const back = svc ? `<p style="font-size:12.5px;text-align:center;margin-top:14px"><span data-go="identipass.sim/choix?service=${ctx.params.service}" style="text-decoration:underline;cursor:pointer;color:#00585a">← Choisir un autre compte</span></p>` : '';
    if (p === '/connexion') return {
      title: 'Connexion | NumérID',
      html: niTop() + `<div class="ni-card">${from}<h2>Connexion avec NumérID</h2><p class="sub">Saisissez l'identifiant de votre identité numérique : votre adresse mail ou votre numéro de mobile.</p><div id="ni-msg"></div>
        <form data-form="login" autocomplete="off"><div class="ni-field"><label>Identifiant</label><input name="u"></div><button class="ni-btn">Continuer</button></form>
        <p style="font-size:12.5px;text-align:center;margin-top:16px">Pas encore d'identité NumérID ? <span data-go="numerid.sim/page?t=Créer mon identité" style="text-decoration:underline;color:#00585a">Créer mon identité</span></p>${back}</div>`
    };
    if (p === '/confirmation') {
      const st = S.numerid.status;
      if (!S.numerid.user) return SITES['numerid.sim'].render(Object.assign({}, ctx, { path: '/connexion' }));
      const again = '<span data-act="resend" style="text-decoration:underline;cursor:pointer">Envoyer une nouvelle demande</span>';
      const body = st === 'refused' ? `<div class="ni-err">La connexion a été refusée depuis votre téléphone. ${again}</div>`
        : st === 'blocked' ? `<div class="ni-err">Trop de codes incorrects : la demande a été annulée. ${again}</div>`
        : `<div class="ni-wait"><span class="spin"></span><div><b>En attente de votre confirmation…</b><br>Une demande vient d'être envoyée à l'application NumérID de votre téléphone (${telMasque()}).</div></div>
           <ol class="ni-steps"><li>Prenez votre téléphone.</li><li>Vérifiez la demande affichée par l'application NumérID.</li><li>Confirmez avec votre code secret.</li></ol>
           <p style="font-size:12.5px;text-align:center"><span data-act="resend" style="text-decoration:underline;cursor:pointer;color:#00585a">Je n'ai rien reçu : envoyer une nouvelle demande</span></p>`;
      return { title: 'Confirmation | NumérID', html: niTop() + `<div class="ni-card">${from}<h2>Confirmez sur votre téléphone</h2><p class="sub">NumérID ne vous demande pas de mot de passe sur ce site.</p>${body}${back}</div>` };
    }
    if (p === '/espace') {
      if (!S.numerid.session) return SITES['numerid.sim'].render(Object.assign({}, ctx, { path: '/connexion' }));
      return { title: 'Mon espace | NumérID', html: niTop() + `<div class="ni-wrap"><h1 style="color:#00585a">Bonjour ${P.prenom}</h1><div class="ni-3"><div><h3>Mon identité</h3><p>${P.prenom} ${P.nomUsage.toUpperCase()}, née ${P.nomNaissance.toUpperCase()}<br>Pièce d'identité vérifiée en ${P.numerid.creeLe}. Valable 5 ans.</p></div><div><h3>Mon téléphone</h3><p>Application NumérID installée sur le ${telMasque()}.<br>Un seul téléphone par identité.</p></div><div><h3>Sécurité</h3><p>Chaque connexion est confirmée dans l'application, avec votre code secret.</p></div></div></div>` };
    }
    if (p === '/page') return { title: (ctx.params.t || 'NumérID') + ' | NumérID', html: niTop() + `<div class="ni-wrap" style="max-width:800px"><h1 style="color:#00585a">${h(ctx.params.t || '')}</h1>
      <p style="line-height:1.7">Créer son identité NumérID est gratuit. Il faut être <b>majeur</b>, avoir une pièce d'identité en cours de validité, un smartphone et un numéro de mobile. La vérification de votre pièce d'identité se fait en ligne, ou face à un agent dans un point d'accueil partenaire. Vous choisissez ensuite votre code secret.</p>
      <p style="line-height:1.7">Votre identité NumérID est <b>liée à votre téléphone</b> : elle ne peut pas être utilisée depuis un autre appareil. À chaque connexion, vous recevez une demande dans l'application et vous la confirmez avec votre code secret. Si vous recevez une demande alors que vous n'êtes pas en train de vous connecter, refusez-la.</p>
      <p style="line-height:1.7">Une fois créée, votre identité NumérID vous permet de vous connecter à de nombreux services via IdentiPass et IdentiPass+.</p></div>` };
    return {
      title: 'NumérID — Votre identité numérique',
      html: niTop() + `<div class="ni-hero"><div class="in"><div><h1>Votre identité numérique, simple et sécurisée</h1><p>Avec NumérID, prouvez votre identité en ligne en quelques secondes. Connectez-vous à plus de 1 400 services publics et privés grâce à IdentiPass et IdentiPass+, sans mot de passe.</p>
        <span class="sa-btn" style="background:#ff7a59;border-radius:6px" data-go="numerid.sim/page?t=Créer mon identité">Créer mon identité gratuitement</span></div><div class="phone">📱</div></div></div>
        <div class="ni-wrap"><div class="ni-3"><div>🛡️<h3>Vérifiée</h3><p>Votre pièce d'identité est contrôlée une fois, à la création. Ensuite, chaque connexion se confirme sur votre téléphone, avec votre code secret.</p></div>
          <div>⚡<h3>Sans mot de passe</h3><p>Plus besoin de retenir un mot de passe pour chaque site : votre téléphone et votre code secret suffisent.</p></div>
          <div>🤝<h3>Accompagnée</h3><p>Un conseiller peut vous aider à créer votre identité dans l'un de nos 7 000 points d'accueil (fictifs).</p></div></div>
          <h2 style="color:#00585a">Questions fréquentes</h2><ul style="line-height:1.9">${['Comment créer mon identité NumérID ?', 'J\'ai oublié mon code secret', 'Je n\'ai pas reçu la demande sur mon téléphone', 'J\'ai changé de téléphone', 'Quelqu\'un peut-il utiliser mon identité à ma place ?', 'Mes données sont-elles protégées ?'].map(x => `<li data-go="numerid.sim/page?t=${encodeURIComponent(x)}" style="text-decoration:underline;color:#00585a">${x}</li>`).join('')}</ul></div>`
    };
  },
  after(root, ctx) {
    // Arrivée sur l'écran d'attente : la demande part sur le téléphone (une seule fois)
    if (ctx.path.replace(/\/$/, '') === '/confirmation' && S.numerid.user && !S.numerid.status) numeridAsk(ctx);
  },
  action(name, el, ctx, root) {
    if (name === 'resend') { phoneCancel(S.numerid.reqId); S.numerid.status = null; renderBrowser(); }
  },
  submit(name, f, ctx, root) {
    const N = S.numerid;
    const q = ctx.params.service ? '?service=' + ctx.params.service : '';
    if (name === 'login') {
      const v = f.u.value.trim().toLowerCase();
      if (v === P.numerid.identifiant || (digits(v).length === 10 && digits(v) === digits(P.telephone))) {
        phoneCancel(N.reqId); N.user = true; N.status = null; navigate('numerid.sim/confirmation' + q); return;
      }
      return niErr(root, 'Aucune identité numérique ne correspond à cet identifiant.');
    }
  }
};

/* Demande de connexion que Martine n'a pas faite (étape 4) */
function fakeRequest() {
  if (S.step !== 4 || S.waitingCode || S.incidents.fausseDemande) return;
  if (pinRequest) { later(fakeRequest, 8000); return; }
  const nom = CONFIG.fausseDemande.service;
  S.incidents.fausseDemande = 'ignoree';
  pushNotif('NumérID', 'Demande de connexion', nom);
  phoneAskConfirm({
    id: 'fake', fake: true, app: 'NumérID', expect: P.numerid.codeSecret, maxTries: 3,
    html: `Demande de connexion à <b>${h(nom)}</b> via IdentiPass.<br>Est-ce bien vous ?`,
    text: 'Saisissez votre code secret NumérID.',
    onWrong: () => { S.incidents.codeSecretFaux = true; },
    onRefuse: () => { S.incidents.fausseDemande = 'refusee'; pushNotif('NumérID', 'Connexion refusée', 'Personne ne s\'est connecté.'); },
    onOk: () => { S.incidents.fausseDemande = 'acceptee'; showFakeRequestLesson(nom); }
  });
}
function showFakeRequestLesson(nom) {
  const el = document.createElement('div');
  el.className = 'phishlesson';
  el.innerHTML = `<div class="pl"><h2>📱 Stop ! Vous n'aviez rien demandé.</h2>
    <p style="font-size:15px;line-height:1.55">Vous venez de confirmer une connexion à <b>${h(nom)}</b>. Pourtant, vous n'étiez pas en train de vous connecter à ce site. Ce n'est pas grave : c'est une simulation. En vrai, vous auriez ouvert la porte à quelqu'un d'autre.</p>
    <div class="clue"><span class="n">1</span><div><b>Qui a demandé ?</b> Une demande de connexion arrive sur le téléphone seulement quand <b>vous</b> êtes en train de vous connecter. Si elle arrive toute seule, c'est que quelqu'un d'autre essaie.</div></div>
    <div class="clue"><span class="n">2</span><div><b>Pour quel site ?</b> La demande donne toujours le nom du site. Ici : « ${h(nom)} ». Ce n'était pas le site de votre démarche.</div></div>
    <div class="clue"><span class="n">3</span><div><b>Le bon réflexe :</b> lire la demande avant de répondre. Si je n'ai rien demandé : « Non, refuser ». Mon code secret ne sert que pour mes propres connexions.</div></div>
    <div class="envrai" style="margin:16px 0">les identités numériques (L'Identité Numérique La Poste, France Identité) et les applications des banques fonctionnent ainsi. Des fraudeurs envoient des demandes en espérant qu'on valide sans lire.</div>
    <button class="ip-btn" id="plclose">Reprendre là où j'en étais</button></div>`;
  $('#browser').appendChild(el);
  $('#plclose', el).onclick = () => el.remove();
}

/* =====================================================================
   CartID — cartid.gouv.sim (rôle réel : France Identité)
   Martine a une carte d'identité ancien modèle : elle ne peut pas s'en servir.
   ===================================================================== */
function fakeQr() {
  let s = 7, cells = '';
  for (let i = 0; i < 21 * 21; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const x = i % 21, y = Math.floor(i / 21);
    const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    const ring = corner && (() => { const cx = x > 13 ? x - 14 : x, cy = y > 13 ? y - 14 : y; return cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx > 1 && cx < 5 && cy > 1 && cy < 5); })();
    cells += `<i class="${corner ? (ring ? 'b' : '') : ((s >> 8) % 2 ? 'b' : '')}"></i>`;
  }
  return `<div class="ci-qr">${cells}</div>`;
}
SITES['cartid.gouv.sim'] = {
  name: 'CartID', cls: 'ci', fav: favIco('cartid', '#7d5a1c', initiale('CartID')),
  envrai: 'France Identité, l\'application de l\'État. Elle fonctionne avec la nouvelle carte d\'identité (format carte bancaire, avec une puce).',
  render(ctx) {
    const svc = SERVICES[ctx.params.service];
    return { title: 'Connexion — CartID', html: `<div class="ci-top">${logo('cartid', `<span class="lg">${initiale('CartID')}</span><b>CartID</b>`, 30)}<small>Votre carte d'identité dans votre téléphone (service fictif)</small></div>
      <div class="ci-box">${svc ? `<div class="ni-from">🔑 Connexion demandée par <b>IdentiPass${svc.plus ? '+' : ''}</b> pour accéder à <b>${svc.nom}</b></div>` : ''}
        <h2>Scannez ce code avec l'application CartID</h2>
        <div class="ci-flex">${fakeQr()}<ol><li>Ouvrez l'application <b>CartID</b> sur votre téléphone.</li><li>Touchez « Scanner un code ».</li><li>Visez le code affiché ici.</li><li>Confirmez avec votre code personnel ou votre empreinte.</li></ol></div>
        <div id="ci-msg"></div>
        <p style="font-size:12.5px"><span data-act="noapp" style="text-decoration:underline;cursor:pointer">Je n'ai pas l'application CartID</span></p>
        ${svc ? `<p style="font-size:12.5px"><span data-go="identipass.sim/choix?service=${ctx.params.service}" style="text-decoration:underline;cursor:pointer">← Choisir un autre compte</span></p>` : ''}</div>` };
  },
  action(name, el, ctx, root) {
    if (name === 'noapp') $('#ci-msg', root).innerHTML = `<div class="ci-info"><b>Pour utiliser CartID, il faut :</b><ul><li>être majeur ;</li><li>avoir la carte d'identité au <b>format carte bancaire</b>, avec une puce ;</li><li>un téléphone capable de lire cette puce sans contact ;</li><li>installer l'application et y enregistrer sa carte.</li></ul>Pour les démarches IdentiPass+, l'identité CartID doit en plus être <b>certifiée en mairie</b>.</div>`;
  }
};

/* Deux autres fournisseurs fictifs, où Martine n'a pas de compte */
function otherIdp(cle, nom, color, label) {
  return {
    name: nom, cls: 'ox', fav: favIco(cle, color, initiale(nom)),
    render(ctx) {
      return { title: 'Connexion — ' + nom, html: `<div class="bar" style="background:${color}">${logo(cle, nom, 28)} <span style="font-size:12px;font-weight:400;opacity:.85">${label}</span></div>
        <div class="box"><h3 style="margin-top:0">Identification</h3><div id="ox-msg"></div><form data-form="l" autocomplete="off"><label>Identifiant</label><input name="u"><label>Mot de passe</label><input name="p" type="password">
        <button style="background:${color}">Valider</button></form><p style="font-size:12px;margin-top:16px"><span data-go="identipass.sim/choix?service=${ctx.params.service || 'santea'}" style="text-decoration:underline;cursor:pointer">← Choisir un autre compte</span></p></div>` };
    },
    submit(name, f, ctx, root) { $('#ox-msg', root).innerHTML = '<p style="color:#b3261e;font-size:13px">Identifiant inconnu.</p>'; }
  };
}
SITES['agrimut.sim'] = otherIdp('agrimut', 'Agrimut', '#6a8a1f', 'Mutualité agricole (fictive)');
SITES['idnomade.sim'] = otherIdp('idnomade', 'IdNomade', '#3c5aa6', 'Identité sur mobile (fictive)');
