/* =====================================================================
   TROUVO — moteur de recherche fictif (page de nouvel onglet)
   + sites annexes : info-pratique.sim, aide-demarches-express.sim
   ===================================================================== */
const K_FISC = ['IMPOT', 'FISCALIS', 'FISC', 'TAXE', 'AVIS', 'DECLAR', 'PRELEVEMENT', 'FINANCESPUBLIQUES'];
const K_SANTE = ['SANTE', 'SANTEA', 'ASSURANCEMALADIE', 'AMELI', 'CARTEVITALE', 'ATTESTATION', 'REMBOURSEMENT', 'SECU', 'MEDECIN', 'CPAM'];
const K_FORM = ['FORMATION', 'FORMACOMPTE', 'FORMER', 'CPF', 'COMPTEFORMATION', 'GERONTOLOGIE', 'ASSISTANTEDESOINS', 'STAGE'];
const TV_INDEX = [
  { k: K_FORM, url: 'formacompte.gouv.sim', nm: 'FormaCompte', f: ['#8a4b08', '▲'], title: 'FormaCompte — Mes droits à la formation',
    desc: 'Consultez vos droits à la formation, recherchez une formation et inscrivez-vous en ligne. Site officiel (fictif) du service public de la formation.',
    links: [['Mon espace', 'formacompte.gouv.sim/connexion'], ['Comprendre mes droits', 'formacompte.gouv.sim/page?t=Comprendre mes droits'], ['Reconnaître une arnaque', 'formacompte.gouv.sim/page?t=Reconnaître une arnaque']] },
  { k: K_FORM.concat(['METIER', 'SOIN']), url: 'info-pratique.sim/article?t=' + encodeURIComponent('Droits à la formation : attention aux démarcheurs'), nm: 'Info Pratique', f: ['#e8590c', 'iP'],
    title: 'Droits à la formation : attention aux démarcheurs', desc: 'Appels, SMS, faux conseillers : les escrocs veulent vos identifiants pour vider votre compte formation. Les bons réflexes.' },
  { k: ['CARTID', 'CARTEDIDENTITE', 'CARTEIDENTITE', 'FRANCEIDENTITE'], url: 'cartid.gouv.sim', nm: 'CartID', f: ['#7d5a1c', 'C'], title: 'CartID — Votre carte d\'identité dans votre téléphone',
    desc: 'L\'application de l\'État (fictive) pour prouver votre identité en ligne avec votre carte d\'identité à puce.' },
  { k: K_FISC, url: 'fiscalis.gouv.sim', nm: 'Fiscalis', f: ['#1f4d3a', 'F'], title: 'Fiscalis | Le site officiel des impôts',
    desc: 'Déclarer, payer, gérer votre prélèvement à la source, consulter vos avis : accédez à votre espace particulier et à tous les services en ligne des finances publiques.',
    links: [['Votre espace particulier', 'fiscalis.gouv.sim/connexion'], ['Payer en ligne', 'fiscalis.gouv.sim/page?t=Payer'], ['Questions fréquentes', 'fiscalis.gouv.sim/page?t=Questions fréquentes']] },
  { k: K_FISC.concat(['ESPACE', 'CONNEXION', 'COMPTE', 'CREER', 'MOTDEPASSE']), url: 'fiscalis.gouv.sim/connexion', nm: 'Fiscalis', f: ['#1f4d3a', 'F'], title: 'Connexion ou création de votre espace particulier - Fiscalis',
    desc: 'Connectez-vous à votre espace particulier avec votre numéro fiscal et votre mot de passe. Première visite ? Créez votre espace.' },
  { k: K_SANTE, url: 'santea.gouv.sim', nm: 'Santéa', f: ['#5b2a6e', 'S'], title: 'Santéa — L\'assurance maladie',
    desc: 'Remboursements, attestation de droits, carte d\'assurance maladie, médecin traitant : toutes vos démarches avec l\'assurance maladie (site fictif).',
    links: [['Mon compte', 'santea.gouv.sim/connexion'], ['Attestation de droits', 'santea.gouv.sim/page?t=Obtenir une attestation de droits'], ['Nous contacter', 'santea.gouv.sim/page?t=Nous contacter']] },
  { k: K_SANTE.concat(['COMPTE', 'CONNEXION', 'CONNECTER']), url: 'santea.gouv.sim/connexion', nm: 'Santéa', f: ['#5b2a6e', 'S'], title: 'Se connecter à mon compte Santéa',
    desc: 'Accédez à votre compte Santéa pour suivre vos remboursements, télécharger vos attestations et échanger avec un conseiller.' },
  { k: ['IDENTIPASS', 'IDENTIPASS+', 'FRANCECONNECT', 'CONNEXIONUNIQUE', 'IDENTIFIANTUNIQUE'], url: 'identipass.sim', nm: 'IdentiPass', f: ['#2b3440', '🔑'], title: 'IdentiPass — La connexion unique aux services publics',
    desc: 'Connectez-vous à plus de 1 400 services en ligne avec un compte que vous possédez déjà. Simple, sécurisé, gratuit.' },
  { k: ['NUMERID', 'IDENTITENUMERIQUE', 'LAPOSTE', 'IDENTITE'], url: 'numerid.sim', nm: 'NumérID', f: ['#00787a', 'ID'], title: 'NumérID — Votre identité numérique, simple et sécurisée',
    desc: 'Créez gratuitement votre identité numérique et connectez-vous à de nombreux services via IdentiPass et IdentiPass+, sans mot de passe.' },
  { k: K_FISC.concat(['ESPACE', 'NUMERO', 'CREER']), url: 'info-pratique.sim/article?t=' + encodeURIComponent('Impôts en ligne : 7 questions que tout le monde se pose'), nm: 'Info Pratique', f: ['#e8590c', 'iP'],
    title: 'Impôts en ligne : 7 questions que tout le monde se pose', desc: 'Numéro fiscal, numéro d\'accès en ligne, code par mail… Le point sur les démarches qui posent le plus de problèmes. Publié le 2 nov. 2026.' },
  { k: ['MOTDEPASSE', 'OUBLIE', 'BLOQUE', 'CODE', 'MAIL', 'ARNAQUE', 'PIRATE', 'HAMECON'], url: 'info-pratique.sim/article?t=' + encodeURIComponent('Arnaques par mail : les nouvelles techniques des escrocs'), nm: 'Info Pratique', f: ['#e8590c', 'iP'],
    title: 'Arnaques par mail : les nouvelles techniques des escrocs', desc: 'Faux remboursement, compte suspendu, colis bloqué : les messages frauduleux se perfectionnent. Comment les repérer ?' },
  { k: K_SANTE.concat(['COMPTE']), url: 'info-pratique.sim/article?t=' + encodeURIComponent('Assurance maladie : les démarches à faire en ligne avant l\'hiver'), nm: 'Info Pratique', f: ['#e8590c', 'iP'],
    title: 'Assurance maladie : les démarches à faire en ligne avant l\'hiver', desc: 'Médecin traitant, carte, complémentaire santé : les rappels utiles pour ne pas être pris de court.' }
];
const TV_ADS = [
  { k: K_FISC, url: 'aide-demarches-express.sim', nm: 'Aide Démarches Express', title: 'Créez votre compte impôts en 5 min - Assistance démarches officielles',
    desc: 'Évitez les erreurs ! Nos experts créent votre espace pour vous. Service rapide, satisfait ou remboursé. Plus de 50 000 clients.' },
  { k: K_SANTE, url: 'aide-demarches-express.sim/?d=sante', nm: 'Aide Démarches Express', title: 'Compte assurance maladie - Démarche simplifiée en ligne',
    desc: 'Attestation, carte, compte : nous nous occupons de tout. Réponse en 24 h.' },
  { k: K_FORM, url: 'aide-demarches-express.sim/?d=formation', nm: 'Aide Démarches Express', title: 'Vos droits formation expirent bientôt ! Inscription rapide par nos conseillers',
    desc: 'Ne perdez pas vos droits : un conseiller vous inscrit à votre formation par téléphone. Tablette offerte.' }
];
const tvLogo = '<div class="tv-logo"><span>T</span><span>r</span><span>o</span><span>u</span><span>v</span><span>o</span></div>';

SITES['trouvo.sim'] = {
  name: 'Trouvo', cls: 'tv', fav: { bg: '#e8590c', t: 'T' },
  render(ctx) {
    if (ctx.path.startsWith('/recherche')) {
      const q = ctx.params.q || '';
      const nq = norm(q);
      const words = q.split(/\s+/).map(norm).filter(w => w.length > 2);
      const score = e => e.k.reduce((s, k) => s + (nq.includes(k) || words.some(w => k.includes(w)) ? 1 : 0), 0);
      const res = TV_INDEX.map(e => [score(e), e]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]).map(x => x[1]);
      const ads = TV_ADS.filter(a => score(a) > 0).slice(0, 1);
      const site = SITES;
      const item = (e, ad) => {
        const host = parseUrl(e.url).host;
        const disp = 'https://' + e.url.split('?')[0].replace(/\/$/, '').replace(/\//g, ' › ');
        return `<div class="tv-r">${ad ? '<div class="spons">Sponsorisé</div>' : ''}<div class="site"><span class="f" style="background:${ad ? '#999' : e.f[0]}">${ad ? '⓪' : e.f[1]}</span><span><span class="nm">${e.nm}</span><br><span class="u">${disp}</span></span></div>
          <h3 data-go="${e.url}">${h(e.title)}</h3><p>${h(e.desc)}</p>${e.links ? `<div class="links">${e.links.map(l => `<span data-go="${l[1]}">${l[0]}</span>`).join('')}</div>` : ''}</div>`;
      };
      return {
        title: q + ' - Recherche Trouvo',
        html: `<div class="tv-rhead"><span data-go="trouvo.sim">${tvLogo}</span><form class="tv-box" data-form="q"><input name="q" value="${h(q)}"><span>🔍</span></form></div>
          <div class="tv-rtabs"><span class="on">Tous</span><span>Images</span><span>Actualités</span><span>Vidéos</span><span>Cartes</span></div>
          <div class="tv-results"><div class="stat">Environ ${(res.length * 1374211 + 88213).toLocaleString('fr-FR')} résultats (0,${30 + res.length} secondes)</div>
          ${ads.map(a => item(a, true)).join('')}${res.length ? res.map(e => item(e)).join('') : `<p>Aucun document ne correspond aux termes de recherche spécifiés (<b>${h(q)}</b>).</p><p>Suggestions :</p><ul><li>Vérifiez l'orthographe des termes de recherche.</li><li>Essayez d'autres mots.</li><li>Utilisez des mots clés plus généraux.</li></ul>`}</div>`
      };
    }
    return {
      title: 'Nouvel onglet',
      html: `<div class="tv-home">${tvLogo}<form class="tv-box" data-form="q"><span>🔍</span><input name="q" placeholder="Rechercher sur Trouvo"></form>
        <div class="tv-btns"><button data-act="search">Recherche Trouvo</button><button data-act="lucky">J'ai de la chance</button></div>
        <div class="tv-feed">${[['#dbe4ff', '🌧️', 'Météo : des averses attendues sur le Finistère toute la semaine', 'Ouest Météo · il y a 2 h'], ['#ffe8cc', '🎄', 'Marché de Noël de Penhoat : le programme dévoilé', 'La Gazette de l\'Ellé · il y a 5 h'], ['#d3f9d8', '🚜', 'Travaux route de Kerhuel : circulation alternée jusqu\'au 18 décembre', 'Info Trafic 29 · hier'],
          ['#f3d9fa', '📺', 'Les programmes télé de la semaine', 'Télé Loisirs Plus · il y a 1 h'], ['#fff3bf', '🥞', 'La recette des crêpes de froment de Mamig', 'Cuisine Bretonne · il y a 3 j'], ['#e3fafc', '⚓', 'Pêche : la saison de la coquille Saint-Jacques est ouverte', 'Le Marin Breton · il y a 4 j']]
          .map(n => `<div><div class="im" style="background:${n[0]}">${n[1]}</div><p>${n[2]}</p><small>${n[3]}</small></div>`).join('')}</div></div>`
    };
  },
  after(root, ctx) { const i = $('input[name=q]', root); if (i && !ctx.path.startsWith('/recherche')) i.focus(); },
  action(name, el, ctx, root) { const i = $('input[name=q]', root); if (i && i.value.trim()) navigate('trouvo.sim/recherche?q=' + encodeURIComponent(i.value.trim())); },
  submit(name, f) { if (f.q.value.trim()) navigate('trouvo.sim/recherche?q=' + encodeURIComponent(f.q.value.trim())); }
};

SITES['info-pratique.sim'] = {
  name: 'Info Pratique', cls: 'tv', fav: { bg: '#e8590c', t: 'iP' },
  render(ctx) {
    const t = ctx.params.t || 'Article';
    return {
      title: t + ' - Info Pratique',
      html: `<div style="background:#212529;color:#fff;padding:12px 30px;font-weight:700;font-size:20px">Info<span style="color:#e8590c">Pratique</span> <span style="font-size:12px;font-weight:400;opacity:.7;margin-left:14px">Conso · Argent · Démarches · Santé · Maison</span></div>
        <div style="max-width:1000px;margin:0 auto;padding:20px;display:grid;grid-template-columns:1fr 280px;gap:26px;font-family:Georgia,serif">
        <div><div class="ad-banner">PUBLICITÉ — Assurance auto : jusqu'à -40 % ! Comparez maintenant</div>
          <h1 style="font-size:30px;line-height:1.2">${h(t)}</h1><p style="color:#777;font-size:13px">Par la rédaction · Mis à jour le 2 novembre 2026 · Lecture 6 min</p>
          <p style="line-height:1.75;font-size:16px">Les démarches administratives en ligne se sont généralisées ces dernières années. Si elles font gagner du temps, elles posent aussi des difficultés à de nombreux usagers : identifiants perdus, codes qui n'arrivent pas, messages d'erreur peu clairs…</p>
          <div class="ad-banner" style="margin:18px 0">PUBLICITÉ — Mutuelle seniors : devis gratuit en 2 minutes</div>
          <p style="line-height:1.75;font-size:16px">Premier conseil des spécialistes : toujours passer par le site officiel, en tapant soi-même son adresse, plutôt que de cliquer sur un lien reçu par mail. Les escrocs imitent de mieux en mieux les logos et les couleurs des administrations.</p>
          <p style="line-height:1.75;font-size:16px">Autre piège fréquent : les sites privés qui proposent, contre paiement, d'effectuer à votre place des démarches pourtant gratuites. Ils apparaissent souvent en tête des moteurs de recherche, avec la mention « Sponsorisé ».</p>
          <p style="line-height:1.75;font-size:16px">Enfin, en cas de blocage, la plupart des services publics disposent d'une rubrique d'aide, d'un numéro de téléphone et de points d'accueil où un agent peut vous accompagner.</p></div>
        <div><div class="ad-banner" style="height:250px;display:flex;align-items:center;justify-content:center">PUBLICITÉ<br>Votre maison vaut peut-être plus que vous ne le pensez !</div>
          <h4 style="margin-top:20px;font-family:Arial">Les plus lus</h4><ol style="font-family:Arial;font-size:13px;line-height:1.7"><li>Retraite : ce qui change au 1er janvier</li><li>Chèque énergie : les dates d'envoi</li><li>Prix des carburants en Bretagne</li><li>Taxe foncière : pourquoi elle augmente</li></ol></div></div>`
    };
  }
};

SITES['aide-demarches-express.sim'] = {
  name: 'Aide Démarches Express', cls: 'tv', fav: { bg: '#d6336c', t: 'A' },
  envrai: 'des sites privés font payer des démarches qui sont gratuites sur les sites officiels. Les vrais sites de l\'administration finissent par « .gouv.fr ».',
  render(ctx) {
    return {
      title: 'Aide Démarches Express - Vos démarches sans stress',
      html: `<div style="background:#fff;border-bottom:1px solid #eee;padding:14px 30px;display:flex;align-items:center;gap:10px"><span style="background:#d6336c;color:#fff;font-weight:900;padding:6px 10px;border-radius:6px">ADE</span><b style="font-size:20px">Aide Démarches Express</b><span style="flex:1"></span><span style="font-size:13px">⭐⭐⭐⭐⭐ 4,9/5 (12 482 avis)</span></div>
        <div style="background:linear-gradient(120deg,#d6336c,#f76707);color:#fff;padding:40px 30px;text-align:center"><h1 style="font-size:32px;margin:0 0 10px">Vos démarches administratives, sans stress</h1>
          <p style="font-size:17px">Compte impôts, assurance maladie, formation, carte grise… Nos experts s'occupent de tout pour vous.</p>
          <p style="font-size:44px;font-weight:900;margin:14px 0">39,90 €<span style="font-size:14px;font-weight:400"> seulement</span></p>
          <span data-act="go" style="display:inline-block;background:#fff;color:#d6336c;font-weight:700;padding:14px 34px;border-radius:30px;font-size:17px;cursor:pointer">Commencer ma démarche</span></div>
        <div style="max-width:900px;margin:30px auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:0 20px">${['✅ Traitement en 24 h', '✅ Experts certifiés', '✅ Satisfait ou remboursé'].map(x => `<div style="border:1px solid #eee;border-radius:10px;padding:18px;text-align:center;font-weight:700">${x}</div>`).join('')}</div>
        <div id="ade-msg" style="max-width:700px;margin:0 auto 20px"></div>
        <p style="font-size:10px;color:#999;text-align:center;padding:30px">Aide Démarches Express est un service privé, indépendant de l'administration. Les démarches peuvent être réalisées gratuitement sur les sites officiels. Abonnement de 39,90 € renouvelable chaque mois, résiliable à tout moment.</p>`
    };
  },
  action(name, el, ctx, root) { $('#ade-msg', root).innerHTML = '<div style="background:#fff4e6;border:1px solid #ffc078;padding:14px;border-radius:8px">Pour commencer, merci de saisir vos coordonnées bancaires… <b>(Simulation : ce site ne va pas plus loin.)</b></div>'; }
};
