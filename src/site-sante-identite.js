/* =====================================================================
   SANTÉA — santea.gouv.sim (rôle réel : ameli.fr)
   ===================================================================== */
const ipButton = (go, sub = 'S\'identifier avec') => `<button type="button" class="ip-button" data-go="${go}"><span class="k">🔑</span><span class="l"><small>${sub}</small><b>IdentiPass</b></span></button>`;

function saHeader() {
  return `<div class="sa-pub"><div class="in"><span class="on">Assuré</span><span>Professionnel de santé</span><span>Employeur</span><span class="sp"></span><span>Accessibilité</span><span>Aide</span></div></div>
    <div class="sa-head"><div class="in"><div class="sa-logo" data-go="/"><div class="m">S</div><div><b>Santéa</b><small>L'assurance maladie — site fictif</small></div></div>
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
  name: 'Santéa', cls: 'sa', fav: { bg: '#5b2a6e', t: 'S' },
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
          <div class="envrai" style="margin-top:16px">Ce bouton s'appelle FranceConnect. Regardez sa forme sur votre fiche.</div></div>
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
      const head = `<div class="sa-head" style="border-bottom:3px solid #5b2a6e"><div class="in"><div class="sa-logo" data-go="/espace"><div class="m">S</div><div><b>Santéa</b><small>Mon compte</small></div></div><span style="flex:1"></span>
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
   ===================================================================== */
const SERVICES = { santea: { nom: 'Santéa', host: 'santea.gouv.sim' } };
const IP_ACCOUNTS = [
  { id: 'fiscalis', nom: 'Fiscalis', sous: 'impôts', bg: '#1f4d3a', t: 'F', off: true },
  { id: 'santea', nom: 'Santéa', sous: 'assurance maladie', bg: '#5b2a6e', t: 'S' },
  { id: 'numerid', nom: 'NumérID', sous: 'identité numérique', bg: '#00787a', t: 'ID' },
  { id: 'agrimut', nom: 'Agrimut', sous: 'mutualité agricole', bg: '#6a8a1f', t: 'A' },
  { id: 'idnomade', nom: 'IdNomade', sous: 'identité sur mobile', bg: '#3c5aa6', t: 'N' }
];
function ipTop() {
  return `<div class="ip-top"><div class="in"><div class="ip-logo" data-go="identipass.sim"><span class="k">🔑</span>IdentiPass</div><span style="font-size:12px;opacity:.75">La connexion unique aux services publics (fictive)</span><span class="sp"></span><span class="lnk" data-go="identipass.sim/historique">Mon historique de connexions</span></div></div>`;
}
SITES['identipass.sim'] = {
  name: 'IdentiPass', cls: 'ip', fav: { bg: '#2b3440', t: '🔑' },
  envrai: ctx => ctx.path.startsWith('/consentement') ? null : 'ce bouton s\'appelle FranceConnect. Regardez sa forme sur votre fiche.',
  render(ctx) {
    const svc = SERVICES[ctx.params.service] || SERVICES.santea;
    const p = ctx.path.replace(/\/$/, '') || '/';
    if (p === '/choix') return {
      title: 'IdentiPass — Choix du compte',
      html: ipTop() + `<div class="ip-main"><h1>Je choisis un compte pour me connecter</h1><div class="svc">Vous souhaitez accéder à : <b>${svc.nom}</b></div><div id="ip-msg"></div>
        <div class="ip-grid">${IP_ACCOUNTS.map(a => `<div class="ip-acc ${a.off ? 'off' : ''}" ${a.off ? '' : `data-act="acc" data-id="${a.id}"`}><span class="lg" style="background:${a.bg}">${a.t}</span><b>${a.nom}</b><small>${a.sous}</small>
          ${a.off ? '<span class="why">Ce compte ne peut pas être utilisé pour se connecter à ce service.</span>' : ''}</div>`).join('')}</div>
        <p style="margin-top:22px;font-size:12.5px;color:#555">Vous n'avez aucun de ces comptes ? <span style="text-decoration:underline;cursor:pointer" data-go="identipass.sim">En savoir plus sur IdentiPass</span></p>
        <p style="font-size:12.5px"><span style="text-decoration:underline;cursor:pointer" data-go="${svc.host}/connexion">← Revenir sur ${svc.nom}</span></p></div>`
    };
    if (p === '/consentement') {
      if (!S.numerid.authOk) return SITES['identipass.sim'].render(Object.assign({}, ctx, { path: '/choix' }));
      const n = P.naissance;
      return {
        title: 'IdentiPass — Autorisation',
        html: ipTop() + `<div class="ip-main"><h1>Transmission de vos informations</h1><div class="svc">Vous êtes connectée avec <b style="color:#00787a">NumérID</b>.</div>
          <p><b>${svc.nom}</b> va recevoir les informations suivantes :</p>
          <ul class="ip-consent"><li><span>Nom de naissance</span><b>${P.nomNaissance}</b></li><li><span>Nom d'usage</span><b>${P.nomUsage}</b></li><li><span>Prénom</span><b>${P.prenom}</b></li>
            <li><span>Date de naissance</span><b>${String(n.jour).padStart(2, '0')}/${String(n.mois).padStart(2, '0')}/${n.annee}</b></li><li><span>Lieu de naissance</span><b>${n.lieu}</b></li><li><span>Sexe</span><b>${P.sexe === 'F' ? 'Féminin' : 'Masculin'}</b></li></ul>
          <p style="font-size:12.5px;color:#555">Ces informations proviennent de votre compte NumérID. Elles servent uniquement à vous identifier auprès de ${svc.nom}.</p>
          <div style="display:flex;gap:12px;margin-top:18px"><button class="ip-btn" data-act="consent">Continuer sur ${svc.nom}</button><button class="ip-btn ghost" data-act="cancel">Annuler</button></div></div>
          <div class="envrai" style="max-width:860px;margin:0 auto 30px">Cet écran existe aussi sur FranceConnect : il montre les informations que le site va recevoir. Vérifiez que ce sont bien les vôtres avant de continuer.</div>`
      };
    }
    if (p === '/historique') return { title: 'IdentiPass — Historique', html: ipTop() + `<div class="ip-main"><h1>Mon historique de connexions</h1><p>Pour consulter votre historique, connectez-vous d'abord à un service avec IdentiPass.</p></div>` };
    return {
      title: 'IdentiPass — La connexion unique aux services publics',
      html: ipTop() + `<div class="ip-main ip-home"><h1 style="font-size:26px">Un seul identifiant pour plus de 1 400 services en ligne</h1>
        <p>IdentiPass vous permet de vous connecter à de nombreux services publics <b>avec un compte que vous possédez déjà</b> : celui des impôts, de l'assurance maladie, ou une identité numérique. Pas besoin de créer un nouveau mot de passe pour chaque site.</p>
        <div style="margin:18px 0">${ipButton('identipass.sim', 'Exemple du bouton :')}</div>
        <h2>Comment ça marche ?</h2><ol><li>Sur le site où vous voulez aller, cliquez sur le bouton IdentiPass.</li><li>Choisissez un compte que vous possédez déjà.</li><li>Connectez-vous avec les identifiants de ce compte.</li><li>Vérifiez les informations transmises, puis continuez.</li></ol>
        <h2>Avec quels comptes ?</h2><div class="ip-logos">${IP_ACCOUNTS.map(a => `<span>${a.nom}</span>`).join('')}</div>
        <p style="font-size:12.5px;color:#555">Certains comptes ne permettent pas d'accéder à tous les services, pour des raisons de sécurité.</p>
        <h2>Quelques services accessibles</h2><div class="ip-logos">${['Santéa', 'Retraite en ligne', 'Allocations familiales', 'Permis de conduire', 'Carte grise', 'Pôle Travail', 'Mutuelle étudiante', 'Mairies partenaires', 'Chèque énergie'].map(x => `<span>${x}</span>`).join('')}</div>
        <h2>Sécurité</h2><p>IdentiPass ne stocke pas vos mots de passe : ils restent chez le compte que vous choisissez. IdentiPass ne vous demandera jamais d'informations bancaires.</p></div>`
    };
  },
  action(name, el, ctx, root) {
    const svc = SERVICES[ctx.params.service] || SERVICES.santea;
    if (name === 'acc') {
      const id = el.dataset.id;
      if (id === 'santea') { $('#ip-msg', root).innerHTML = '<div class="ip-alert"><b>Vous n\'avez pas de compte Santéa.</b> Choisissez un autre compte.</div>'; return; }
      if (id === 'numerid') { navigate('numerid.sim/connexion?service=' + (ctx.params.service || 'santea')); return; }
      navigate(id + '.sim/?service=' + (ctx.params.service || 'santea'));
    }
    if (name === 'consent') { S.santea.loggedIn = true; S.numerid.authOk = false; navigate(svc.host + '/espace'); }
    if (name === 'cancel') { S.numerid.authOk = false; navigate(svc.host + '/connexion'); }
  }
};

/* =====================================================================
   NumérID — numerid.sim (rôle réel : L'Identité Numérique La Poste)
   ===================================================================== */
function niTop() {
  return `<div class="ni-top"><div class="in"><div class="ni-logo" data-go="numerid.sim"><span class="d"></span><b>NumérID</b></div>
    <nav><span data-go="numerid.sim/page?t=Découvrir">Découvrir</span><span data-go="numerid.sim/page?t=Créer mon identité">Créer mon identité</span><span data-go="numerid.sim/page?t=Services partenaires">Services partenaires</span><span data-go="numerid.sim/page?t=Aide">Aide</span></nav>
    <span class="sp"></span><span class="conn" data-go="numerid.sim/connexion">Se connecter</span></div></div>`;
}
function sendNumeridCode() {
  const N = S.numerid;
  if (N.code) (N.oldCodes = N.oldCodes || []).push(N.code.value);
  N.code = { value: rand6(), expires: Date.now() + CONFIG.durees.expirationCodeMail * 1000 };
  deliverMail({ fromName: 'NumérID', fromAddr: 'securite@numerid.sim', subject: 'Votre code de vérification NumérID', tag: 'code',
    html: `<div style="color:#00585a;font-weight:700;font-size:17px;border-bottom:3px solid #00787a;padding-bottom:5px;margin-bottom:10px">NumérID</div>
      <p>Bonjour ${P.prenom},</p><p>Pour terminer votre connexion, saisissez ce code de vérification :</p><p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#00585a">${N.code.value}</p>
      <p>Ce code expire dans ${Math.round(CONFIG.durees.expirationCodeMail / 60)} minutes. Ne le communiquez jamais à personne.</p><p style="font-size:11px;color:#777">NumérID — identité numérique (service fictif)</p>` });
}
function niErr(root, html, kind = 'err') { const z = $('#ni-msg', root); z.innerHTML = html ? `<div class="ni-${kind}">${html}</div>` : ''; }
SITES['numerid.sim'] = {
  name: 'NumérID', cls: 'ni', fav: { bg: '#00787a', t: 'ID' },
  envrai: 'L\'Identité Numérique La Poste',
  cookie: () => cookieBar('numerid.sim', 'background:#00585a;color:#fff', 'NumérID'),
  render(ctx) {
    const p = ctx.path.replace(/\/$/, '') || '/';
    const svc = SERVICES[ctx.params.service];
    const from = svc ? `<div class="ni-from">🔑 Connexion demandée par <b>IdentiPass</b> pour accéder à <b>${svc.nom}</b></div>` : '';
    const q = svc ? '?service=' + ctx.params.service : '';
    if (p === '/connexion') return {
      title: 'Connexion | NumérID',
      html: niTop() + `<div class="ni-card">${from}<h2>Connexion à NumérID</h2><p class="sub">Saisissez l'adresse mail et le mot de passe de votre identité numérique.</p><div id="ni-msg"></div>
        <form data-form="login" autocomplete="off"><div class="ni-field"><label>Adresse mail</label><input name="u"></div><div class="ni-field"><label>Mot de passe</label><input name="p" type="password"></div>
        <p style="font-size:12.5px;margin:-4px 0 14px"><span data-act="forgot" style="text-decoration:underline;cursor:pointer;color:#00585a">Mot de passe oublié ?</span></p><button class="ni-btn">Se connecter</button></form>
        <p style="font-size:12.5px;text-align:center;margin-top:16px">Pas encore d'identité NumérID ? <span data-go="numerid.sim/page?t=Créer mon identité" style="text-decoration:underline;color:#00585a">Créer mon identité</span></p></div>`
    };
    if (p === '/code') {
      if (!S.numerid.stageUser) return SITES['numerid.sim'].render(Object.assign({}, ctx, { path: '/connexion' }));
      return {
        title: 'Vérification | NumérID',
        html: niTop() + `<div class="ni-card">${from}<h2>Vérification en deux étapes</h2><p class="sub">Un code à 6 chiffres vient d'être envoyé à <b>${P.mailMasque}</b>. Saisissez-le pour continuer.</p><div id="ni-msg"></div>
          <form data-form="code" autocomplete="off"><div class="ni-field"><label>Code reçu par mail</label><input name="c" maxlength="6" inputmode="numeric" style="letter-spacing:8px;font-size:22px;text-align:center"></div><button class="ni-btn">Valider</button></form>
          <p style="font-size:12.5px;text-align:center;margin-top:14px"><span data-act="newcode" style="text-decoration:underline;cursor:pointer;color:#00585a">Recevoir un nouveau code</span></p></div>`
      };
    }
    if (p === '/espace') {
      if (!S.numerid.session) return SITES['numerid.sim'].render(Object.assign({}, ctx, { path: '/connexion' }));
      return { title: 'Mon espace | NumérID', html: niTop() + `<div class="ni-wrap"><h1 style="color:#00585a">Bonjour ${P.prenom}</h1><div class="ni-3"><div><h3>Mon identité</h3><p>${P.prenom} ${P.nomUsage.toUpperCase()}, née ${P.nomNaissance.toUpperCase()}<br>Identité vérifiée en mars 2024.</p></div><div><h3>Mes connexions</h3><p>Aucune connexion récente à un service partenaire.</p></div><div><h3>Sécurité</h3><p>Mot de passe et code par mail activés.</p></div></div></div>` };
    }
    if (p === '/page') return { title: (ctx.params.t || 'NumérID') + ' | NumérID', html: niTop() + `<div class="ni-wrap" style="max-width:800px"><h1 style="color:#00585a">${h(ctx.params.t || '')}</h1><p style="line-height:1.7">Créer son identité NumérID est gratuit. La vérification de votre identité se fait en ligne avec une pièce d'identité et un selfie, ou au guichet d'un point d'accueil partenaire. Comptez quelques jours pour l'activation.</p><p style="line-height:1.7">Une fois créée, votre identité NumérID vous permet de vous connecter à de nombreux services via IdentiPass.</p></div>` };
    return {
      title: 'NumérID — Votre identité numérique',
      html: niTop() + `<div class="ni-hero"><div class="in"><div><h1>Votre identité numérique, simple et sécurisée</h1><p>Avec NumérID, prouvez votre identité en ligne en quelques secondes. Connectez-vous à plus de 1 400 services publics et privés grâce à IdentiPass, sans multiplier les mots de passe.</p>
        <span class="sa-btn" style="background:#ff7a59;border-radius:6px" data-go="numerid.sim/page?t=Créer mon identité">Créer mon identité gratuitement</span></div><div class="phone">📱</div></div></div>
        <div class="ni-wrap"><div class="ni-3"><div>🛡️<h3>Sécurisée</h3><p>Votre identité est vérifiée une fois pour toutes. Chaque connexion est confirmée par un code envoyé par mail.</p></div>
          <div>⚡<h3>Rapide</h3><p>Plus besoin de chercher vos identifiants pour chaque site : un seul compte suffit pour de nombreux services.</p></div>
          <div>🤝<h3>Accompagnée</h3><p>Un conseiller peut vous aider à créer votre identité dans l'un de nos 7 000 points d'accueil (fictifs).</p></div></div>
          <h2 style="color:#00585a">Questions fréquentes</h2><ul style="line-height:1.9">${['Comment créer mon identité NumérID ?', 'J\'ai oublié mon mot de passe', 'Je n\'ai pas reçu le code de vérification', 'Quels services puis-je utiliser ?', 'Mes données sont-elles protégées ?'].map(x => `<li data-go="numerid.sim/page?t=${encodeURIComponent(x)}" style="text-decoration:underline;color:#00585a">${x}</li>`).join('')}</ul></div>`
    };
  },
  action(name, el, ctx, root) {
    if (name === 'forgot') niErr(root, 'Si un compte existe pour cette adresse, un lien de réinitialisation vous sera envoyé.', 'ok');
    if (name === 'newcode') { sendNumeridCode(); niErr(root, 'Un nouveau code vous a été envoyé. Le code précédent n\'est plus valable.', 'ok'); }
  },
  submit(name, f, ctx, root) {
    const N = S.numerid;
    const q = ctx.params.service ? '?service=' + ctx.params.service : '';
    if (name === 'login') {
      if (f.u.value.trim().toLowerCase() === P.numerid.identifiant && f.p.value === P.numerid.motDePasse) {
        N.stageUser = true; N.oldCodes = []; N.code = null; sendNumeridCode(); navigate('numerid.sim/code' + q); return;
      }
      f.p.value = '';
      return niErr(root, 'Identifiant ou mot de passe incorrect.');
    }
    if (name === 'code') {
      const v = digits(f.c.value);
      if (v.length !== 6) return niErr(root, 'Le code doit comporter 6 chiffres.');
      if (N.code && v === N.code.value) {
        if (Date.now() > N.code.expires) { S.incidents.codeExpire = true; return niErr(root, 'Ce code a expiré. <span data-act="newcode" style="text-decoration:underline;cursor:pointer">Recevoir un nouveau code</span>'); }
        N.code = null; N.stageUser = false;
        if (ctx.params.service) { N.authOk = true; navigate('identipass.sim/consentement' + q); }
        else { N.session = true; navigate('numerid.sim/espace'); }
        return;
      }
      if ((N.oldCodes || []).includes(v)) { S.incidents.codeExpire = true; return niErr(root, 'Ce code n\'est plus valide. <span data-act="newcode" style="text-decoration:underline;cursor:pointer">Recevoir un nouveau code</span>'); }
      niErr(root, 'Code incorrect.');
    }
  }
};

/* Deux autres fournisseurs fictifs, où Martine n'a pas de compte */
function otherIdp(nom, color, label) {
  return {
    name: nom, cls: 'ox', fav: { bg: color, t: nom[0] },
    render(ctx) {
      return { title: 'Connexion — ' + nom, html: `<div class="bar" style="background:${color}">${nom} <span style="font-size:12px;font-weight:400;opacity:.85">${label}</span></div>
        <div class="box"><h3 style="margin-top:0">Identification</h3><div id="ox-msg"></div><form data-form="l" autocomplete="off"><label>Identifiant</label><input name="u"><label>Mot de passe</label><input name="p" type="password">
        <button style="background:${color}">Valider</button></form><p style="font-size:12px;margin-top:16px"><span data-go="identipass.sim/choix?service=${ctx.params.service || 'santea'}" style="text-decoration:underline;cursor:pointer">← Choisir un autre compte</span></p></div>` };
    },
    submit(name, f, ctx, root) { $('#ox-msg', root).innerHTML = '<p style="color:#b3261e;font-size:13px">Identifiant inconnu.</p>'; }
  };
}
SITES['agrimut.sim'] = otherIdp('Agrimut', '#6a8a1f', 'Mutualité agricole (fictive)');
SITES['idnomade.sim'] = otherIdp('IdNomade', '#3c5aa6', 'Identité sur mobile (fictive)');
