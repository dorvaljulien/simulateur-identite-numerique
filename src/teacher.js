/* =====================================================================
   Récapitulatif (étape 4), code de fin, fiche professeur
   ===================================================================== */
const ALPH = 'ABCDEFGHJKLMNPQR'; // 16 lettres, sans I ni O

function finalCode(I = S.incidents) {
  const c1 = Math.min(I.refus, 9);
  const v2 = (I.enregistre ? 1 : 0) + (I.codeExpire ? 2 : 0) + (I.bloque ? 4 : 0);
  const v3 = (I.fauxLu ? 1 : 0) + (I.fauxOuvert ? 2 : 0) + (I.fauxIdentifiants ? 4 : 0) + (I.avisAnDernier ? 8 : 0);
  const c4 = (I.avisConjoint ? 5 : 0) + (c1 + v2 + v3) % 5;
  return String(c1) + ALPH[v2] + ALPH[v3] + String(c4);
}

function showRecap() {
  const I = S.incidents;
  const yn = b => b ? 'oui' : 'non';
  const rows = [
    ['Mots de passe refusés à la création du compte Fiscalis', I.refus],
    ['Mot de passe enregistré dans le navigateur', I.enregistre === null ? 'pas de choix' : yn(I.enregistre)],
    ['Code reçu par mail utilisé trop tard (expiré)', yn(I.codeExpire)],
    ['Compte Fiscalis bloqué après 3 erreurs', yn(I.bloque)],
    ['Faux mail ouvert', yn(I.fauxLu)],
    ['Lien du faux mail cliqué', yn(I.fauxOuvert)],
    ['Identifiants saisis sur le faux site', yn(I.fauxIdentifiants)],
    ['Avis d\'impôt de l\'an dernier utilisé', yn(I.avisAnDernier)],
    ['Avis d\'impôt du conjoint utilisé', yn(I.avisConjoint)]
  ];
  const el = document.createElement('div');
  el.className = 'fullscreen recap';
  el.innerHTML = `<div class="rbox"><h1>Séance terminée — bravo !</h1><p style="color:#555;margin:0">Voici ce qui s'est passé pendant vos démarches. Ce n'est pas une note : ce sont les situations que vous avez rencontrées.</p>
    <table>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table>
    <p style="margin:0">Recopiez ce <b>code de fin</b> sur votre fiche :</p><div class="code">${finalCode()}</div>
    <p style="text-align:right;margin:10px 0 0"><button id="recapclose" style="background:#fff;border:1px solid #999;padding:6px 14px;border-radius:4px;cursor:pointer">Revenir au simulateur</button></p></div>`;
  document.body.appendChild(el);
  $('#recapclose', el).onclick = () => el.remove();
}

function openFicheProf() {
  const c = CONFIG.codes, d = CONFIG.durees, a = P.documents.find(x => x.id === 'avisAnDernier');
  const t2 = [...Array(8)].map((_, v) => `<tr><td><b>${ALPH[v]}</b></td><td>${v & 1 ? 'oui' : '–'}</td><td>${v & 2 ? 'oui' : '–'}</td><td>${v & 4 ? 'oui' : '–'}</td></tr>`).join('');
  const t3 = [...Array(16)].map((_, v) => `<tr><td><b>${ALPH[v]}</b></td><td>${v & 1 ? 'oui' : '–'}</td><td>${v & 2 ? 'oui' : '–'}</td><td>${v & 4 ? 'oui' : '–'}</td><td>${v & 8 ? 'oui' : '–'}</td></tr>`).join('');
  const html = `<div style="font-size:13.5px;line-height:1.5">
    <p><button onclick="window.print()">🖨 Imprimer</button> — Raccourcis : <b>Ctrl+Alt+P</b> (cette fiche), <b>Ctrl+Alt+R</b> (réinitialiser). Personnage : ${P.prenom} ${P.nomUsage}.</p>
    <h3>Codes de passage</h3><table><tr><th>Code</th><th>Effet</th></tr>
      <tr><td><b>${c.etape2}</b></td><td>Code n°1 — fin de l'étape 1 → début de l'étape 2 (compte Fiscalis créé et activé)</td></tr>
      <tr><td><b>${c.etape3}</b></td><td>Code n°2 — fin de l'étape 2 (avis 2026 ouvert) → début de l'étape 3 (Santéa / IdentiPass)</td></tr>
      <tr><td><b>${c.recap}</b></td><td>Code n°3 — fin de l'étape 3 → récapitulatif et code de fin</td></tr>
      <tr><td><b>${c.reinitialisation}</b></td><td>Réinitialisation complète (demande confirmation)</td></tr></table>
    <p>Reprise à l'étape 2 sans compte : mot de passe Fiscalis attribué <b>${h(CONFIG.reprise.motDePasseFiscalis)}</b> (affiché à l'élève).</p>
    <h3>Bonnes réponses</h3><table>
      <tr><td>Numéro fiscal de Martine</td><td><b>${fmtNF(P.numeroFiscal)}</b></td></tr>
      <tr><td>Numéro d'accès en ligne (avis 2026, rangé dans « Divers »)</td><td><b>${P.accesCetteAnnee}</b></td></tr>
      <tr><td>Nom de naissance / date de naissance</td><td><b>${P.nomNaissance.toUpperCase()}</b> — 14/03/1968</td></tr>
      <tr><td>Adresse mail</td><td>${P.mail}</td></tr>
      <tr><td>Piège : avis 2025 (rangé dans « Impôts »)</td><td>bon numéro fiscal, mais accès ${a.d.acces} → refus</td></tr>
      <tr><td>Piège : avis de Jean-Yves</td><td>n° fiscal ${fmtNF(P.numeroFiscalConjoint)}, accès ${P.accesConjoint} → refus</td></tr>
      <tr><td>Étape 3 : compte à utiliser dans IdentiPass</td><td><b>NumérID</b> — ${P.numerid.identifiant} / ${h(P.numerid.motDePasse)} (sur la carte)</td></tr>
      <tr><td>MaBoîte / code du téléphone (bonus)</td><td>${h(P.maboite.motDePasse)} / ${P.pinTelephone}</td></tr>
      <tr><td>Mot de passe « changé sur le téléphone »</td><td>${h(CONFIG.motDePasseChangeTelephone)} (ne pas le donner : il faut passer par « Mot de passe oublié »)</td></tr></table>
    <h3>Fins d'étape (le masque « code de passage » apparaît)</h3><table>
      <tr><td>Étape 1</td><td>Clic sur le lien d'activation (mail dans les Indésirables), puis choix Enregistrer / Jamais dans la proposition du navigateur.</td></tr>
      <tr><td>Étape 2</td><td>1) Connexion (numéro fiscal + mot de passe + code mail), puis <b>Se déconnecter</b> → saut de trois semaines.
        2) Le mot de passe ne marche plus → « Mot de passe oublié » → lien du mail → nouveau mot de passe → connexion + code.
        3) Fin quand l'élève <b>ouvre l'avis d'impôt 2026</b> (Mes derniers documents, ou onglet Documents). Ouvrir l'avis 2025 ne termine pas l'étape.</td></tr>
      <tr><td>Étape 3</td><td>Connexion à Santéa via IdentiPass + NumérID, puis <b>Mes attestations › Attestation de droits</b>. Les autres attestations (indemnités journalières, remboursements, complémentaire santé solidaire) ne terminent pas l'étape.</td></tr></table>
    <h3>Étape 3 : tous les chemins</h3>
    <p><b>Pour trouver Santéa :</b> taper santea.gouv.sim dans la barre d'adresse, ou chercher « santé », « assurance maladie », « ameli », « carte vitale »… dans Trouvo. Le premier résultat « Sponsorisé » (Aide Démarches Express, 39,90 €) est un piège : impasse.</p>
    <table><tr><th>Chemin</th><th>Ce qui se passe</th><th>Issue</th></tr>
      <tr><td>Santéa › Mon compte › « Avec mes identifiants Santéa »</td><td>« Numéro de sécurité sociale ou mot de passe incorrect » (Martine n'a pas de compte)</td><td>Impasse</td></tr>
      <tr><td>Santéa › Mon compte › « Créer mon compte Santéa »</td><td>« Un courrier avec votre code provisoire vous sera envoyé sous 5 jours »</td><td>Impasse (trop long : il faut trouver autre chose)</td></tr>
      <tr><td>Santéa › Mot de passe oublié</td><td>Message générique</td><td>Impasse</td></tr>
      <tr><td>Santéa › S'identifier avec IdentiPass › <b>Fiscalis</b></td><td>Grisé : « Ce compte ne peut pas être utilisé pour se connecter à ce service »</td><td>Impasse (ameli n'accepte pas impots.gouv via FranceConnect)</td></tr>
      <tr><td>IdentiPass › <b>Santéa</b></td><td>« Vous n'avez pas de compte Santéa »</td><td>Impasse</td></tr>
      <tr><td>IdentiPass › <b>Agrimut</b> ou <b>IdNomade</b></td><td>Page de connexion : « Identifiant inconnu » quoi qu'on tape</td><td>Impasse (lien « Choisir un autre compte »)</td></tr>
      <tr><td>« Qu'est-ce que IdentiPass ? » ou numerid.sim tapé directement</td><td>Pages d'information ; une connexion à NumérID depuis numerid.sim mène à l'espace NumérID, pas à Santéa</td><td>Impasse partielle : il faut repasser par le bouton IdentiPass de Santéa</td></tr>
      <tr><td><b>IdentiPass › NumérID</b> (relire la carte : compte créé par Gwenaëlle)</td><td>Identifiant ${P.numerid.identifiant} + mot de passe ${h(P.numerid.motDePasse)} → code à 6 chiffres reçu par mail (expire en ${Math.round(d.expirationCodeMail / 60)} min) → écran « Santéa va recevoir… » → <b>Continuer</b></td><td><b>Seul chemin gagnant</b> → « Bienvenue Martine Le Gall » → Mes attestations → Attestation de droits</td></tr>
      <tr><td>Espace Santéa › autres attestations</td><td>« Aucune indemnité journalière », « service indisponible » ou « vous ne bénéficiez pas… »</td><td>Impasse (revenir à Mes attestations)</td></tr>
      <tr><td>Écran de consentement › Annuler</td><td>Retour à la page de connexion Santéa</td><td>Retour en arrière (recommencer IdentiPass)</td></tr></table>
    <h3>Règles de mot de passe (révélées une par une)</h3><p>12 caractères, une majuscule, un chiffre, un caractère spécial, sans nom ni prénom. Une phrase de passe de 20 caractères ou plus est acceptée sans majuscule/chiffre/caractère spécial.</p>
    <h3>Durées réglées</h3><p>Code mail : ${d.expirationCodeMail} s — blocage : ${d.blocageCompte} s (affiché « 15 minutes ») — lien de réinitialisation : ${d.validiteLienReinit} s — délai des mails : ${d.delaiMailMin} à ${d.delaiMailMax} s — mail de confirmation dans les indésirables : ${CONFIG.confirmationDansIndesirables}.</p>
    <h3>Décodage du code de fin (4 caractères, ex. 2DB3)</h3>
    <p><b>1er caractère</b> (chiffre) : nombre de mots de passe refusés à la création (9 = 9 ou plus).</p>
    <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:16px"><div><b>2e caractère</b><table><tr><th></th><th>Mot de passe enregistré</th><th>Code expiré</th><th>Compte bloqué</th></tr>${t2}</table></div>
    <div><b>3e caractère</b><table><tr><th></th><th>Faux mail ouvert</th><th>Lien cliqué</th><th>Identifiants saisis</th><th>Avis de l'an dernier</th></tr>${t3}</table></div></div>
    <p><b>4e caractère</b> (chiffre) : 5 à 9 = l'avis du conjoint a été utilisé, 0 à 4 = non. Contrôle : (1er chiffre + rang de la 2e lettre + rang de la 3e lettre) modulo 5 doit être égal au 4e chiffre modulo 5 (rang : A = 0, B = 1, C = 2…). Sinon, le code a été mal recopié.</p>
    <h3>État actuel de ce poste</h3><p>Étape ${S.step}${S.step === 2 ? ' (' + S.phase2 + ' le saut)' : ''} — code de fin actuel : <b>${finalCode()}</b></p></div>`;
  openModal('Fiche professeur', html, 'fiche');
}
