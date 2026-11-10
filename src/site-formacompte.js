/* =====================================================================
   FORMACOMPTE — formacompte.gouv.sim (rôle réel : Mon Compte Formation)
   Étape 4 : la connexion n'est possible qu'avec IdentiPass+.
   ===================================================================== */
const FORMATIONS = [
  { id: 'asg-distance', titre: 'Assistant(e) de soins en gérontologie', org: 'FormaSanté Online (fictif)', lieu: 'À distance', duree: '140 h', prix: 2990, session: 'Entrée permanente', note: '4,1' },
  { id: 'asg-quimper', titre: 'Assistant(e) de soins en gérontologie', org: 'Institut de formation du Finistère (fictif)', lieu: 'Quimper (29)', duree: '140 h', prix: 1680, session: 'Du 8 février au 26 mars 2027', note: '4,7' },
  { id: 'asg-rennes', titre: 'Assistant(e) de soins en gérontologie', org: 'Campus Santé Bretagne (fictif)', lieu: 'Rennes (35)', duree: '140 h', prix: 1750, session: 'Du 11 janvier au 26 février 2027', note: '4,5', complet: true },
  { id: 'fin-de-vie', titre: 'Accompagner la fin de vie en établissement', org: 'Institut de formation du Finistère (fictif)', lieu: 'Quimper (29)', duree: '21 h', prix: 540, session: 'Du 15 au 17 mars 2027', note: '4,6' },
  { id: 'gestes', titre: 'Gestes et postures : manutention des personnes', org: 'Prévention Ouest (fictif)', lieu: 'Lorient (56)', duree: '14 h', prix: 390, session: 'Les 4 et 5 février 2027', note: '4,3' },
  { id: 'anglais', titre: 'Anglais : remise à niveau', org: 'Langues Express (fictif)', lieu: 'À distance', duree: '30 h', prix: 1200, session: 'Entrée permanente', note: '3,9' }
];
const FO_DROITS = 2840;
const foEur = n => n.toLocaleString('fr-FR') + ',00 €';
function foHeader() {
  const L = S.forma.loggedIn;
  return `<div class="fo-band">Un site du service public de la formation (fictif)<span class="sp"></span><span>Organismes de formation</span><span>Employeurs</span><span>Aide</span></div>
    <div class="fo-head"><div class="in"><div class="fo-logo" data-go="/"><span class="m">▲</span><div><b>FormaCompte</b><small>Mes droits à la formation</small></div></div>
      <nav>${['Trouver une formation', 'Comprendre mes droits', 'Financer mon projet', 'Bilan de compétences', 'Actualités'].map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x}</span>`).join('')}</nav>
      <span class="acc" data-go="${L ? '/espace' : '/connexion'}">👤 ${L ? P.prenom + ' ' + P.nomUsage : 'Mon espace'}</span></div></div>`;
}
function foFooter() {
  return `<div class="fo-foot"><div class="in">${[['Mes droits', ['Consulter mes droits', 'Comment sont-ils calculés ?', 'Abondements de l\'employeur', 'Mes droits à la retraite']], ['Me former', ['Rechercher une formation', 'Validation des acquis', 'Bilan de compétences', 'Permis de conduire']],
    ['Sécurité', ['Reconnaître une arnaque', 'Signaler un démarchage', 'Protéger mon espace', 'IdentiPass+']], ['Nous contacter', ['Foire aux questions', '09 99 00 29 29 (fictif)', 'Trouver un conseiller', 'Accessibilité']]]
    .map(c => `<div><h4>${c[0]}</h4>${c[1].map(x => `<span data-go="/page?t=${encodeURIComponent(x)}">${x}</span>`).join('')}</div>`).join('')}</div>
    <div class="legal">© FormaCompte 2026 — site fictif à usage pédagogique · Mentions légales · Données personnelles · Cookies</div></div>`;
}
const foPage = inner => foHeader() + inner + foFooter();
const foCard = f => `<div class="fo-res" data-go="/espace/formation?id=${f.id}"><div><b>${f.titre}</b><small>${f.org}</small><span class="tags"><i>📍 ${f.lieu}</i><i>⏱ ${f.duree}</i><i>📅 ${f.session}</i><i>★ ${f.note}/5</i></span></div><div class="px">${foEur(f.prix)}<small>${f.complet ? 'Session complète' : 'Places disponibles'}</small></div></div>`;

SITES['formacompte.gouv.sim'] = {
  name: 'FormaCompte', cls: 'fo', fav: { bg: '#8a4b08', t: '▲' },
  envrai: ctx => ctx.path.startsWith('/connexion') ? 'Mon Compte Formation (le CPF). Depuis 2022, il faut FranceConnect+ pour s\'y inscrire à une formation : c\'est une protection contre les arnaques.' : 'Mon Compte Formation (moncompteformation.gouv.fr), le site du compte personnel de formation (CPF)',
  cookie: () => cookieBar('formacompte.gouv.sim', 'background:#4a2a06;color:#fff', 'FormaCompte'),
  render(ctx) {
    const p = ctx.path.replace(/\/$/, '') || '/';
    const self = SITES['formacompte.gouv.sim'];
    if (p === '/') return {
      title: 'FormaCompte — Mes droits à la formation',
      html: foPage(`<div class="fo-hero"><div class="in"><div><h1>Vos droits à la formation vous suivent toute votre vie professionnelle</h1>
          <p>Chaque année travaillée vous donne des droits, en euros, pour financer une formation. Consultez-les, choisissez votre formation et inscrivez-vous en ligne, sans intermédiaire.</p>
          <form class="fo-search" data-form="search"><input name="q" placeholder="Métier, compétence, diplôme… Ex : aide-soignant, anglais, permis"><button>Rechercher</button></form></div><div class="img">🎓</div></div></div>
        <div class="fo-wrap">
          <div class="fo-alert"><b>⚠ Démarchage interdit.</b> Personne n'a le droit de vous appeler ou de vous écrire pour vous vendre une formation avec vos droits. FormaCompte ne vous demandera jamais vos identifiants par téléphone, SMS ou mail. Vos droits ne « s'expirent » pas à la fin de l'année.</div>
          <h2>Les formations les plus recherchées</h2>
          <div class="fo-tiles">${[['🚗', 'Permis de conduire', '12 480 formations'], ['💬', 'Langues étrangères', '9 215 formations'], ['🩺', 'Santé et aide à la personne', '4 630 formations'], ['💻', 'Bureautique et numérique', '7 902 formations'], ['🧾', 'Création d\'entreprise', '2 114 formations'], ['🧭', 'Bilan de compétences', '3 350 prestataires']]
            .map(t => `<div data-go="/page?t=${encodeURIComponent(t[1])}"><span class="ic">${t[0]}</span><span><b>${t[1]}</b><small>${t[2]}</small></span></div>`).join('')}</div>
          <div class="fo-two"><div><h2>Actualités</h2>${[['Reste à charge : ce qui change au 1er janvier', 'Une participation forfaitaire est demandée pour chaque formation, sauf si votre employeur complète le financement.'], ['Aides-soignants, auxiliaires de vie : des formations financées en priorité', 'Les métiers du soin et de l\'aide à la personne bénéficient d\'abondements de la région.'], ['Arnaques : 3 signes qui doivent vous alerter', 'Un appel pressant, une promesse de cadeau, une demande de codes : raccrochez.']]
            .map(a => `<div class="fo-news" data-go="/page?t=${encodeURIComponent(a[0])}"><b>${a[0]}</b><p>${a[1]}</p></div>`).join('')}</div>
            <div class="fo-side"><h3>Mon espace</h3><p>Consultez le montant de vos droits, suivez vos dossiers et inscrivez-vous à une formation.</p><span class="fo-btn" data-go="/connexion">Accéder à mon espace</span>
              <p style="font-size:12px;margin-top:14px;opacity:.85">La connexion se fait avec IdentiPass+.</p></div></div></div>`)
    };
    if (p === '/page') {
      const t = ctx.params.t || 'Information';
      return { title: t + ' | FormaCompte', html: foPage(`<div class="fo-wrap" style="max-width:860px"><p style="font-size:12px;color:#777"><span data-go="/" style="text-decoration:underline">Accueil</span> › ${h(t)}</p><h1>${h(t)}</h1>
        <p style="line-height:1.7">Vos droits à la formation sont exprimés en euros. Ils sont alimentés chaque année en fonction de votre activité, et restent acquis même si vous changez d'employeur ou si vous êtes en recherche d'emploi.</p>
        <p style="line-height:1.7">Pour consulter vos droits, rechercher une formation parmi les offres de votre région et vous inscrire, connectez-vous à votre espace. L'inscription se fait toujours par vous-même : personne ne peut la faire à votre place.</p>
        <span class="fo-btn" data-go="/connexion">Accéder à mon espace</span></div>`) };
    }
    if (p === '/connexion') return {
      title: 'Connexion à mon espace | FormaCompte',
      html: foPage(`<div class="fo-wrap" style="max-width:760px"><h1 style="text-align:center">Me connecter à mon espace FormaCompte</h1>
        <div class="fo-card" style="text-align:center"><p class="sub">Vos droits à la formation représentent de l'argent. Pour les protéger, la connexion à votre espace se fait <b>uniquement avec IdentiPass+</b>.</p>
          <div style="margin:20px 0">${ipButton('identipass.sim/choix?service=forma', 'S\'identifier avec', true)}</div>
          <p style="font-size:12.5px"><span data-go="identipass.sim" data-newtab style="text-decoration:underline">Qu'est-ce que IdentiPass+ ?</span></p></div>
        <div class="fo-card" style="margin-top:16px"><h2>Vous n'arrivez pas à vous connecter ?</h2>
          <details><summary>J'avais un identifiant et un mot de passe FormaCompte</summary><p>La connexion par identifiant et mot de passe n'existe plus. Utilisez le bouton IdentiPass+.</p></details>
          <details><summary>Je n'ai pas d'identité numérique</summary><p>Vous devez d'abord en créer une auprès d'un service partenaire. C'est gratuit. Il faut être majeur et avoir une pièce d'identité en cours de validité et un smartphone.</p></details>
          <details><summary>Quelqu'un peut-il se connecter pour moi ?</summary><p>Non. Votre espace est personnel : ni un proche, ni votre employeur, ni un organisme de formation ne doit s'y connecter à votre place.</p></details></div></div>`)
    };
    if (p.startsWith('/espace')) {
      if (!S.forma.loggedIn) return self.render(Object.assign({}, ctx, { path: '/connexion' }));
      const crumb = t => `<p style="font-size:12px;color:#777;margin:0 0 12px"><span data-go="/espace" style="text-decoration:underline">Mon espace</span> › ${t}</p>`;
      const f = FORMATIONS.find(x => x.id === ctx.params.id);
      if (p === '/espace/recherche') {
        const q = norm(ctx.params.q || '');
        const words = (ctx.params.q || '').split(/\s+/).map(norm).filter(w => w.length > 2);
        const res = FORMATIONS.filter(x => !q || words.some(w => norm(x.titre + x.lieu + x.org).includes(w)));
        return { title: 'Rechercher une formation | FormaCompte', html: foPage(`<div class="fo-wrap">${crumb('Rechercher une formation')}<h1>Rechercher une formation</h1>
          <form class="fo-search" data-form="search2" style="margin-bottom:18px"><input name="q" value="${h(ctx.params.q || '')}" placeholder="Métier, compétence, diplôme…"><button>Rechercher</button></form>
          <p style="font-size:12.5px;color:#666">${res.length} formation${res.length > 1 ? 's' : ''} — triées par pertinence · Vos droits : <b>${foEur(FO_DROITS)}</b></p>
          ${res.map(foCard).join('') || '<div class="fo-card">Aucune formation ne correspond à votre recherche. Essayez d\'autres mots.</div>'}</div>`) };
      }
      if (p === '/espace/formation' && f) {
        const reste = Math.max(0, f.prix - FO_DROITS);
        return { title: f.titre + ' | FormaCompte', html: foPage(`<div class="fo-wrap" style="max-width:900px">${crumb('<span data-go="/espace/recherche" style="text-decoration:underline">Rechercher une formation</span> › ' + f.titre)}<div id="fo-msg"></div>
          <div class="fo-fiche"><div><h1 style="margin-top:0">${f.titre}</h1><p class="org">${f.org} · ★ ${f.note}/5</p>
            <table><tr><td>Lieu</td><td><b>${f.lieu}</b></td></tr><tr><td>Durée</td><td>${f.duree}</td></tr><tr><td>Session</td><td>${f.session}</td></tr><tr><td>Certification</td><td>Attestation de formation reconnue par la branche</td></tr><tr><td>Public</td><td>Aides-soignants, aides médico-psychologiques, accompagnants éducatifs et sociaux en poste</td></tr></table>
            <p style="line-height:1.6;font-size:13px">Objectifs : accompagner les personnes âgées atteintes de troubles cognitifs, adapter les soins quotidiens, travailler avec les familles et l'équipe. Alternance de cours et de mises en situation.</p></div>
            <div class="fo-prix"><div class="big">${foEur(f.prix)}</div><table><tr><td>Vos droits</td><td>${foEur(FO_DROITS)}</td></tr><tr><td>Droits utilisés</td><td>− ${foEur(Math.min(f.prix, FO_DROITS))}</td></tr><tr><td><b>Reste à payer</b></td><td><b>${foEur(reste)}</b></td></tr></table>
              <span class="fo-btn" style="display:block;text-align:center" data-act="inscrire" data-id="${f.id}">M'inscrire à cette formation</span></div></div></div>`) };
      }
      if (p === '/espace/inscription' && f) {
        return { title: 'Mon inscription | FormaCompte', html: foPage(`<div class="fo-wrap" style="max-width:680px">${crumb('Mon inscription')}<div class="fo-card"><h2>Vérifiez votre demande d'inscription</h2><div id="fo-msg"></div>
          <table class="fo-recap"><tr><td>Formation</td><td><b>${f.titre}</b></td></tr><tr><td>Organisme</td><td>${f.org}</td></tr><tr><td>Lieu</td><td>${f.lieu}</td></tr><tr><td>Session</td><td>${f.session}</td></tr>
            <tr><td>Prix</td><td>${foEur(f.prix)}</td></tr><tr><td>Payé avec vos droits</td><td>${foEur(Math.min(f.prix, FO_DROITS))}</td></tr><tr><td>Stagiaire</td><td>${P.prenom} ${P.nomUsage.toUpperCase()}, née ${P.nomNaissance.toUpperCase()}</td></tr></table>
          <form data-form="valider" autocomplete="off"><input type="hidden" name="id" value="${f.id}"><label class="fo-check"><input type="checkbox" name="ok"> Je confirme ma demande : le montant sera réservé sur mes droits à la formation.</label>
            <button class="fo-btn">Valider ma demande d'inscription</button> <span data-go="/espace/formation?id=${f.id}" style="margin-left:12px;text-decoration:underline;font-size:12.5px">Annuler</span></form></div></div>`) };
      }
      if (p === '/espace/confirmation' && f && S.forma.inscrit === f.id) {
        return { title: 'Demande envoyée | FormaCompte', html: foPage(`<div class="fo-wrap" style="max-width:680px"><div class="fo-card"><h2>✔ Votre demande d'inscription est envoyée</h2>
          <div class="fo-ok">Votre demande pour la formation <b>${f.titre}</b> (${f.lieu}) a bien été transmise à l'organisme. Il a 2 jours ouvrés pour vous répondre.<br><br>Dossier n° FC-2026-1204-${f.prix}7 — ${foEur(Math.min(f.prix, FO_DROITS))} réservés sur vos droits.</div>
          <span class="fo-btn ghost" data-go="/espace">Retour à mon espace</span></div></div>`) };
      }
      const dossier = FORMATIONS.find(x => x.id === S.forma.inscrit);
      return { title: 'Mon espace | FormaCompte', html: foPage(`<div class="fo-wrap"><div id="fo-msg"></div>
        <div class="fo-welcome"><div><div class="hi">Bonjour ${P.prenom} ${P.nomUsage}</div><div style="opacity:.85">Connectée avec IdentiPass+ · <span data-act="logout" style="text-decoration:underline">Me déconnecter</span></div></div>
          <div class="droits"><small>Mes droits à la formation</small><b>${foEur(FO_DROITS)}</b></div></div>
        <div class="fo-tiles">${[['🔎', 'Rechercher une formation', 'Parmi les offres de votre région ou à distance', '/espace/recherche'], ['📁', 'Mes dossiers', dossier ? '1 demande en attente de réponse' : 'Aucun dossier en cours'], ['💶', 'Le détail de mes droits', 'Droits acquis année par année'],
          ['🧭', 'Mon projet professionnel', 'Faire le point avec un conseiller'], ['✉️', 'Ma messagerie', 'Aucun nouveau message'], ['👤', 'Mes informations', 'Coordonnées, situation professionnelle']]
          .map(t => `<div ${t[3] ? `data-go="${t[3]}"` : 'data-act="nope"'}><span class="ic">${t[0]}</span><span><b>${t[1]}</b><small>${t[2]}</small></span></div>`).join('')}</div>
        <h2>Suggestions pour vous</h2>${FORMATIONS.filter(x => ['fin-de-vie', 'gestes', 'anglais'].includes(x.id)).map(foCard).join('')}</div>`) };
    }
    return self.render(Object.assign({}, ctx, { path: '/page', params: { t: 'Page introuvable' } }));
  },
  after(root, ctx) {
    // Fin de l'étape 4 : la demande d'inscription à la bonne formation est envoyée
    if (ctx.path === '/espace/confirmation' && S.forma.inscrit === CONFIG.formationCible && S.step === 4 && !S.waitingCode) { S.incidents.etape4 = true; later(() => completeStep(4), 3500); }
  },
  action(name, el, ctx, root) {
    const msg = t => { $('#fo-msg', root).innerHTML = `<div class="fo-err">${t}</div>`; $('#viewport').scrollTop = 0; };
    if (name === 'nope') msg('Ce service est momentanément indisponible. Veuillez réessayer plus tard.');
    if (name === 'logout') { S.forma.loggedIn = false; navigate('/'); }
    if (name === 'inscrire') {
      const f = FORMATIONS.find(x => x.id === el.dataset.id);
      if (f.complet) return msg('Cette session est complète. Aucune autre date n\'est proposée pour le moment.');
      if (f.prix > FO_DROITS) return msg('Vos droits ne couvrent pas le prix de cette formation. Le paiement du reste à payer par carte bancaire est momentanément indisponible.');
      navigate('/espace/inscription?id=' + f.id);
    }
  },
  submit(name, f, ctx, root) {
    if (name === 'search') { navigate(S.forma.loggedIn ? '/espace/recherche?q=' + encodeURIComponent(f.q.value) : '/connexion'); return; }
    if (name === 'search2') { navigate('/espace/recherche?q=' + encodeURIComponent(f.q.value)); return; }
    if (name === 'valider') {
      if (!f.ok.checked) { $('#fo-msg', root).innerHTML = '<div class="fo-err">Vous devez confirmer votre demande en cochant la case.</div>'; return; }
      const id = f.id.value, fo = FORMATIONS.find(x => x.id === id);
      S.forma.inscrit = id;
      deliverMail({ fromName: 'FormaCompte', fromAddr: 'ne-pas-repondre@formacompte.gouv.sim', subject: 'Votre demande d\'inscription a bien été envoyée', tag: 'forma',
        html: `<div style="color:#8a4b08;font-weight:700;font-size:17px;border-bottom:3px solid #f0b429;padding-bottom:5px;margin-bottom:10px">▲ FormaCompte</div><p>Bonjour ${P.prenom} ${P.nomUsage},</p><p>Votre demande d'inscription à la formation <b>${fo.titre}</b> (${fo.lieu}) a bien été transmise à l'organisme ${fo.org}.</p><p>Vous serez prévenue de sa réponse par mail. FormaCompte ne vous demandera jamais vos codes par mail ou par téléphone.</p>` });
      navigate('/espace/confirmation?id=' + id);
    }
  }
};
