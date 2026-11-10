/* =====================================================================
   Trieur de papiers + carte personnage
   ===================================================================== */
const POCHETTES = [['banque', 'Banque'], ['sante', 'Santé'], ['impots', 'Impôts'], ['divers', 'Divers']];
let trieurState = { open: null, zoom: 1, closed: {} };

function openTrieur() {
  const ov = openModal('Mes papiers', `<div class="pochettes" id="pochettes"></div>
    <div class="lecteur"><div class="ltools"><span id="ldoctitle">Aucun document ouvert</span><span style="flex:1"></span>
      <button data-z="-">－</button><span id="lzoom">100 %</span><button data-z="+">＋</button><button data-z="0">Taille réelle</button></div>
      <div class="lzone" id="lzone"><div class="vide">Cliquez sur un document dans une pochette pour l'ouvrir.</div></div></div>`, 'trieur');
  const draw = () => {
    $('#pochettes', ov).innerHTML = POCHETTES.map(([k, n]) => {
      const docs = P.documents.filter(d => d.pochette === k);
      return `<div class="pochette p-${k} ${trieurState.closed[k] ? 'closed' : ''}"><span class="ong" data-poch="${k}">${n}</span><div class="contenu">
        ${docs.map(d => `<div class="doc ${trieurState.open === d.id ? 'on' : ''}" data-doc="${d.id}"><span class="pg">📄</span>${h(d.titre)}</div>`).join('') || '<i style="font-size:11px">vide</i>'}</div></div>`;
    }).join('') + '<p style="font-size:11px;color:#6b5a3a;margin:16px 4px">Cliquez sur l\'onglet d\'une pochette pour l\'ouvrir ou la fermer.</p>';
    const d = P.documents.find(x => x.id === trieurState.open);
    if (d) {
      $('#ldoctitle', ov).textContent = d.titre;
      $('#lzone', ov).innerHTML = `<div class="paper" style="zoom:${trieurState.zoom}">${renderDoc(d)}</div>`;
    }
    $('#lzoom', ov).textContent = Math.round(trieurState.zoom * 100) + ' %';
  };
  ov.addEventListener('click', e => {
    const p = e.target.closest('[data-poch]');
    if (p) { trieurState.closed[p.dataset.poch] = !trieurState.closed[p.dataset.poch]; draw(); return; }
    const d = e.target.closest('[data-doc]');
    if (d) { trieurState.open = d.dataset.doc; draw(); $('#lzone', ov).scrollTop = 0; return; }
    const z = e.target.closest('[data-z]');
    if (z) { const v = z.dataset.z; trieurState.zoom = v === '0' ? 1 : Math.min(2.6, Math.max(.6, trieurState.zoom + (v === '+' ? .2 : -.2))); draw(); }
  });
  draw();
}

function renderDoc(d) {
  switch (d.type) {
    case 'avis': return docAvis(d.d);
    case 'echeancier': return docEcheancier();
    case 'courrierSante': return docSantea();
    case 'mutuelle': return docMutuelle();
    case 'releve': return docReleve();
    case 'facture': return docFacture();
  }
  return '';
}

const ministere = `<div style="display:flex;gap:6px;align-items:center"><div style="width:30px;height:30px;border-radius:50%;background:#1f4d3a;color:#e8c46a;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;font-family:Georgia">F</div>
  <div style="font-size:7px;line-height:1.2"><b style="font-size:9px">FISCALIS</b><br>ADMINISTRATION DES FINANCES<br>PUBLIQUES FICTIVES</div></div>`;

function docAvis(a) {
  const jy = a.declarant.includes('Jean');
  const nn = jy ? 'LE GALL' : 'KERJEAN';
  const ne = jy ? P.conjoint.naissance : '14/03/1968';
  const sexe = jy ? 'M' : 'F';
  return `<table><tr><td style="width:55%">${ministere}
      <div style="margin-top:8px;font-size:7.5px">CENTRE FISCALIS DE QUIMPERLÉ (FICTIF)<br>3 PLACE DES ANCIENS-HALLES<br>29999 QUIMPERLÉ-SIM<br>Tél : 02 99 00 00 00<br>du lundi au vendredi de 8h30 à 12h</div></td>
    <td><div style="border:1px solid #111;padding:5px 7px"><b style="font-size:9px">VOS RÉFÉRENCES</b><table style="margin-top:3px;font-size:8px">
      <tr><td>Numéro fiscal</td><td style="text-align:right"><b>${fmtNF(a.numeroFiscal)}</b></td></tr>
      <tr><td>N° de foyer fiscal</td><td style="text-align:right">${a.foyer}</td></tr>
      <tr><td>Référence de l'avis</td><td style="text-align:right">${a.reference}</td></tr>
      <tr><td>N° d'accès en ligne</td><td style="text-align:right"><b>${a.acces}</b></td></tr>
      <tr><td>Date d'établissement</td><td style="text-align:right">${a.etabli}</td></tr>
      <tr><td>Date de mise en recouvrement</td><td style="text-align:right">${a.etabli.replace(/^\d\d/, '31')}</td></tr></table></div>
      <div style="margin:14px 0 0 24px;font-size:9.5px;line-height:1.35">${a.destinataire.join('<br>')}<br>${P.adresse.join('<br>')}</div></td></tr></table>
    <div style="background:#e9e9e9;border-left:5px solid #1f4d3a;padding:6px 8px;margin:14px 0 8px"><b style="font-size:13px">AVIS D'IMPÔT ${a.annee}</b><br><span style="font-size:9.5px">SUR LES REVENUS DE L'ANNÉE ${a.revenus}</span></div>
    <table style="font-size:8px;margin-bottom:6px"><tr><td style="width:50%;border:1px solid #bbb;padding:4px"><b>Déclarant 1 :</b> ${h(a.declarant)}<br>Nom de naissance : ${nn}<br>Né(e) le : ${ne} — Sexe : ${sexe}<br>Situation de famille : M (marié)</td>
      <td style="border:1px solid #bbb;padding:4px"><b>Vos démarches en ligne :</b> fiscalis.gouv.sim<br>Espace particulier — Messagerie sécurisée<br>Pour accéder à votre espace la première fois, munissez-vous de votre numéro fiscal et de votre numéro d'accès en ligne.</td></tr></table>
    <b style="font-size:9px">DÉTAIL DES REVENUS</b>
    <table style="font-size:8px;border:1px solid #bbb;margin:3px 0 8px"><tr style="background:#f1f1f1"><th style="text-align:left">Revenus</th><th>Montant déclaré</th><th>Abattement</th><th>Revenu net</th></tr>
      <tr><td>Salaires, pensions et rentes</td><td style="text-align:right">${a.revenu} €</td><td style="text-align:right">10 %</td><td style="text-align:right">${a.rfr} €</td></tr>
      <tr><td>Revenus de capitaux mobiliers</td><td style="text-align:right">0 €</td><td></td><td style="text-align:right">0 €</td></tr>
      <tr><td><b>Revenu brut global</b></td><td></td><td></td><td style="text-align:right"><b>${a.rfr} €</b></td></tr>
      <tr><td>Revenu fiscal de référence</td><td></td><td></td><td style="text-align:right">${a.rfr} €</td></tr>
      <tr><td>Nombre de parts</td><td></td><td></td><td style="text-align:right">${a.parts}</td></tr></table>
    <table><tr><td style="width:60%;font-size:7.5px;padding-right:10px">
      <b style="font-size:9px">CALCUL DE VOTRE IMPÔT</b><br>
      Impôt sur le revenu net avant corrections : ${a.impot} €<br>Décote : 0 €<br>Réductions et crédits d'impôt : 0 €<br>Impôt sur le revenu net : <b>${a.impot} €</b><br>Prélèvements sociaux : 0 €<br><br>
      <b>Prélèvement à la source déjà versé en ${a.revenus} :</b> ${a.prelevePAS} €<br><br>
      Le taux de prélèvement à la source calculé à partir de cette déclaration sera appliqué à partir de septembre ${a.annee}. Vous pouvez le modifier ou l'individualiser dans votre espace particulier, rubrique « Gérer mon prélèvement à la source ».<br><br>
      En cas de désaccord, vous pouvez déposer une réclamation dans votre espace particulier ou auprès de votre centre Fiscalis. Le dépôt d'une réclamation ne vous dispense pas de payer.</td>
      <td><div style="border:2px solid #111;padding:8px;text-align:center"><div style="font-size:8px">${a.sens === 'rembourse' ? 'MONTANT QUI VOUS SERA REMBOURSÉ' : 'RESTE À PAYER'}</div><div style="font-size:18px;font-weight:700;margin-top:4px">${a.solde} €</div>
      <div style="font-size:7px;margin-top:4px">${a.sens === 'rembourse' ? 'Virement sur votre compte bancaire fin juillet' : 'Prélevé en 4 fois maximum de septembre à décembre'}</div></div></td></tr></table>
    <div style="border-top:1px dashed #999;margin-top:14px;padding-top:6px;font-size:6.5px;color:#444">Document fictif à usage pédagogique. Le numéro fiscal est un identifiant personnel et permanent : il figure sur toutes vos déclarations. Le numéro d'accès en ligne change sur chaque avis. Conservez cet avis : il peut vous être demandé (banque, logement, aides sociales). Réf. imprimé ${a.annee}-IR-AV-01 — page 1/2</div>`;
}

function docEcheancier() {
  const rows = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    .map((m, i) => `<tr><td>15 ${m.toLowerCase()} 2026</td><td style="text-align:right">${i < 8 ? '90,00' : '93,00'} €</td><td>Prélèvement mensuel</td></tr>`).join('');
  return `${ministere}<div style="text-align:right;font-size:9.5px;margin-top:-24px">MME LE GALL MARTINE<br>${P.adresse.join('<br>')}</div>
    <div style="background:#e9e9e9;border-left:5px solid #1f4d3a;padding:6px 8px;margin:16px 0 8px"><b style="font-size:12px">ÉCHÉANCIER 2026</b><br><span style="font-size:9px">Prélèvement à la source — acomptes sur revenus fonciers et indépendants</span></div>
    <table style="font-size:8px;margin-bottom:8px"><tr><td>Référence de l'échéancier</td><td><b>PAS-26-0029-7716204</b></td><td>Identifiant créancier SEPA</td><td>FR44ZZZ000FIC</td></tr>
      <tr><td>N° de contrat de prélèvement</td><td>2026 29 004 118 75</td><td>Référence unique de mandat</td><td>RUM-FIC-26-88412</td></tr>
      <tr><td>Compte débité</td><td>FR76 •••• •••• •••• •••• 4471 230</td><td>Date d'édition</td><td>12/01/2026</td></tr></table>
    <table style="font-size:8px;border:1px solid #bbb"><tr style="background:#f1f1f1"><th style="text-align:left">Date</th><th>Montant</th><th style="text-align:left">Nature</th></tr>${rows}</table>
    <p style="font-size:7.5px;margin-top:10px">Ce document récapitule les prélèvements prévus pour l'année. Il ne constitue pas un avis d'impôt. Pour toute question, connectez-vous à votre espace particulier sur fiscalis.gouv.sim, rubrique « Gérer mon prélèvement à la source ».</p>`;
}

function docSantea() {
  return `<div style="display:flex;justify-content:space-between"><div style="display:flex;gap:6px;align-items:center"><div style="width:30px;height:30px;border-radius:7px;background:#5b2a6e;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px">S</div>
      <div style="font-size:8px;line-height:1.2"><b style="font-size:11px;color:#5b2a6e">Santéa</b><br>Caisse d'assurance maladie<br>du Finistère (fictive)</div></div>
      <div style="font-size:9.5px;margin-top:30px">MADAME LE GALL MARTINE<br>${P.adresse.join('<br>')}</div></div>
    <p style="font-size:8.5px;margin-top:18px">Quimper, le 14 février 2024</p>
    <p style="font-size:10px"><b>Objet : votre attestation de droits à l'assurance maladie</b></p>
    <table style="font-size:8.5px;border:1px solid #5b2a6e;margin:8px 0"><tr style="background:#f3ebf6"><td>Assurée</td><td><b>LE GALL Martine</b></td></tr>
      <tr><td>Numéro de sécurité sociale</td><td><b>${P.numeroSecu}</b></td></tr>
      <tr><td>Organisme de rattachement</td><td>Santéa Finistère — 29 941</td></tr>
      <tr><td>Droits ouverts</td><td>du 01/01/2024 au 31/12/2026</td></tr>
      <tr><td>Médecin traitant déclaré</td><td>Dr Y. MORVAN — Penhoat-sur-Ellé</td></tr></table>
    <p style="font-size:8.5px">Madame,</p><p style="font-size:8.5px">Vous trouverez ci-dessus les informations relatives à vos droits. Votre carte d'assurance maladie reste valable. En cas de changement de situation (adresse, situation familiale, coordonnées bancaires), pensez à nous en informer.</p>
    <p style="font-size:8.5px">Vous pouvez aussi effectuer la plupart de vos démarches sur <b>santea.gouv.sim</b> : télécharger une attestation, suivre vos remboursements, contacter un conseiller.</p>
    <p style="font-size:8.5px">Nous vous prions d'agréer, Madame, l'expression de nos salutations distinguées.</p><p style="font-size:8.5px;text-align:right">Le directeur de la caisse</p>`;
}

function docMutuelle() {
  return `<div style="width:340px;margin:20px auto;border-radius:12px;background:linear-gradient(135deg,#0f6e74,#2aa198);color:#fff;padding:14px 16px;font-size:9px">
      <b style="font-size:13px">Mutuelle Armorique Santé</b><div style="opacity:.85">Carte de tiers payant 2026</div>
      <div style="margin-top:12px">Adhérente : <b>LE GALL MARTINE</b><br>N° adhérent : 0047 1182 663<br>N° AMC : 77441902<br>Bénéficiaires : LE GALL Martine, LE GALL Jean-Yves</div>
      <div style="margin-top:10px;display:flex;justify-content:space-between"><span>Validité : 01/01/2026 - 31/12/2026</span><span>PHAR LABO RADL OPTI DENT</span></div></div>
    <p style="font-size:8px;text-align:center">À présenter à votre pharmacien et à tout professionnel de santé. En cas de perte, contactez le 02 99 11 22 33 (fictif).</p>`;
}

function docReleve() {
  const ops = [['01/10', 'VIR EHPAD LES GLYCINES SALAIRE OCT', '', '1 742,18'], ['03/10', 'CB SUPER U PENHOAT', '86,34', ''], ['05/10', 'PRLV ELEC ARMOR', '87,42', ''],
    ['06/10', 'CB PHARMACIE DE L ELLE', '12,60', ''], ['10/10', 'PRLV MUTUELLE ARMORIQUE', '58,90', ''], ['12/10', 'CB STATION TOTALE KERHUEL', '64,00', ''],
    ['15/10', 'PRLV FISCALIS PAS 2026', '90,00', ''], ['18/10', 'RETRAIT DAB QUIMPERLE', '60,00', ''], ['21/10', 'CB BOULANGERIE AR VARA', '9,80', ''],
    ['24/10', 'VIR SANTEA REMBT SOINS', '', '17,50'], ['28/10', 'PRLV ASSURANCE AUTO BREIZH', '41,27', ''], ['30/10', 'CB LEROY BRICOLE QUIMPER', '33,95', '']];
  return `<div style="display:flex;justify-content:space-between"><div><b style="font-size:14px;color:#0b4f8a">Crédit Breizh</b><div style="font-size:7px">Banque fictive — Agence de Quimperlé</div></div>
      <div style="font-size:9.5px">MME LE GALL MARTINE<br>${P.adresse.join('<br>')}</div></div>
    <div style="background:#0b4f8a;color:#fff;padding:5px 8px;margin:14px 0 6px;font-size:10px"><b>RELEVÉ DE COMPTE</b> — du 01/10/2026 au 31/10/2026 — Compte courant n° 00047 112 3360</div>
    <table style="font-size:8px;margin-bottom:6px"><tr><td>IBAN : FR76 1999 9000 4700 4711 2336 012</td><td>BIC : CBRZFRSIM</td><td>Titulaire : MME LE GALL MARTINE</td></tr></table>
    <table style="font-size:8px;border:1px solid #bbb"><tr style="background:#eef3f8"><th>Date</th><th style="text-align:left">Libellé</th><th>Débit</th><th>Crédit</th></tr>
      <tr><td></td><td><i>Ancien solde au 30/09/2026</i></td><td></td><td style="text-align:right">412,63</td></tr>
      ${ops.map(o => `<tr><td>${o[0]}</td><td>${o[1]}</td><td style="text-align:right">${o[2]}</td><td style="text-align:right">${o[3]}</td></tr>`).join('')}
      <tr><td></td><td><b>Nouveau solde au 31/10/2026</b></td><td></td><td style="text-align:right"><b>1 525,43</b></td></tr></table>
    <p style="font-size:7px;margin-top:10px">Votre conseillère : Mme Nolwenn TANGUY — 02 99 44 55 66. Pour votre sécurité, Crédit Breizh ne vous demandera jamais vos codes confidentiels par mail, SMS ou téléphone.</p>`;
}

function docFacture() {
  return `<div style="display:flex;justify-content:space-between"><div><b style="font-size:15px;color:#d35400">Élec'Armor</b><div style="font-size:7px">Fournisseur d'énergie fictif</div></div>
    <div style="font-size:9.5px">MME LE GALL MARTINE<br>${P.adresse.join('<br>')}</div></div>
    <div style="border:1px solid #d35400;padding:6px 8px;margin:14px 0 8px;font-size:8px"><b style="font-size:11px">FACTURE n° 2026-10-558821</b> du 18/10/2026<br>
      Référence client : 7 001 448 216 — N° de contrat : EA-29-55410-B — Point de livraison : 1902 2214 5503 77</div>
    <table style="font-size:8px;border:1px solid #bbb"><tr style="background:#fdf0e6"><th style="text-align:left">Désignation</th><th>Quantité</th><th>Prix unitaire</th><th>Montant HT</th></tr>
      <tr><td>Abonnement option base 6 kVA (1 mois)</td><td>1</td><td>13,77 €</td><td style="text-align:right">13,77 €</td></tr>
      <tr><td>Consommation du 15/09 au 15/10</td><td>298 kWh</td><td>0,2016 €</td><td style="text-align:right">60,08 €</td></tr>
      <tr><td>Taxes et contributions</td><td></td><td></td><td style="text-align:right">13,57 €</td></tr>
      <tr><td><b>Total TTC</b></td><td></td><td></td><td style="text-align:right"><b>87,42 €</b></td></tr></table>
    <p style="font-size:8px;margin-top:8px">Montant prélevé le 05/11/2026 sur le compte FR76 •••• 6012. Espace client : elecarmor.sim — Service client : 09 99 88 77 66 (appel non surtaxé, numéro fictif).</p>
    <p style="font-size:7px;color:#555">En cas de difficulté de paiement, contactez-nous : des solutions existent (échéancier, chèque énergie).</p>`;
}

/* ---------- Carte personnage ---------- */
function carteHtml(compact) {
  const n = P.naissance;
  const rows = [
    ['Nom d\'usage', P.nomUsage.toUpperCase()], ['Nom de naissance', P.nomNaissance.toUpperCase()], ['Prénom', P.prenom],
    ['Née le', `${String(n.jour).padStart(2, '0')}/${String(n.mois).padStart(2, '0')}/${n.annee} à ${n.lieu}`],
    ['Adresse', P.adresse.join(', ')], ['Téléphone', P.telephone], ['Adresse mail', P.mail],
    ['Situation', `Mariée à ${P.conjoint.prenom} ${P.conjoint.nom}`], ['Enfant', P.enfants], ['Métier', P.metier], ['Carte d\'identité', P.carteIdentite]
  ];
  const postit = `<div class="postit">📌 Mes codes (à ne pas laisser traîner !)<br>
    • MaBoîte : mot de passe <b>${h(P.maboite.motDePasse)}</b><br>
    • Code du téléphone : <b>${h(P.pinTelephone)}</b><br>
    • NumérID (mon identité numérique, appli sur mon téléphone) :<br>&nbsp;&nbsp;créée en ${h(P.numerid.creeLe)} avec Gwenaëlle, au point d'accueil.<br>&nbsp;&nbsp;Identifiant = mon adresse mail. Code secret <b>${h(P.numerid.codeSecret)}</b><br>
    • Fiscalis : pas encore de compte.</div>`;
  return `<div class="idcard"><div class="photo"><svg width="96" height="118" viewBox="0 0 96 118"><circle cx="48" cy="42" r="24" fill="#f1d3b8"/><path d="M22 40c0-20 14-30 27-30s25 9 25 28c-6-8-14-12-26-12s-20 6-26 14z" fill="#b9b2ad"/><path d="M8 118c3-30 20-42 40-42s37 12 40 42z" fill="#7b4a8a"/></svg></div>
    <div><h3>${P.prenom} ${P.nomUsage}</h3><div class="sub">née ${P.nomNaissance} — ${P.age} ans</div>
    <table>${rows.slice(0, compact ? 7 : rows.length).map(r => `<tr><td>${r[0]}</td><td>${h(r[1])}</td></tr>`).join('')}</table></div></div>${postit}`;
}
