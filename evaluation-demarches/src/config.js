/* =====================================================================
   ÉVALUATION « DÉMARCHES EN LIGNE ET IDENTITÉ NUMÉRIQUE » — 1ère SAPAT
   Tous les réglages du professeur sont ici.
   Ce fichier ne contient AUCUNE bonne réponse (voir le corrigé à part).
   ===================================================================== */
const CONFIG = {
  evaluation: 'demarches-identite-1SAPAT',
  version: '1.1',

  // Code de séance donné au tableau → variante
  codesSeance: { '4172': 'A', '8395': 'B' },
  // Saisi dans le champ « Code de séance » : efface tout (copie en cours comprise)
  codeRemiseAZero: '0000',
  cleStockage: 'eval-demarches-1sapat',

  // Temps conseillés, en minutes (indicatifs, aucun blocage)
  tempsConseilles: { '1A': 10, '1B': 12, '2A': 4, '2B': 3, '2C': 5, '2D': 20, fin: 2 },

  // Réglages du simulateur (durées en secondes). Noms des services : voir services.js
  // Dans les textes ci-dessous, {fiscalis}, {numerid}… sont remplacés par le nom du service.
  simulateur: {
    delaiNotificationNumerid: 2,   // après le choix de l'identité numérique
    essaisCodeAvantBlocage: 3,
    dureeBlocageNumerid: 120,      // appli d'identité bloquée après 3 codes faux
    delaiDemandePirate: 8,         // après l'arrivée sur l'écran de consentement
    delaiPremierIncident: 5,       // après l'enregistrement de la demande
    delaiEntreIncidents: 6,        // après la fin du premier incident
    delaiSmsApresAppel: 2,         // SMS du code, une fois le « conseiller » au téléphone
    delaiRappelSiRefus: 8,         // si l'appel est refusé, le « conseiller » rappelle une fois
    heureDepart: '10:12',          // heure affichée sur le téléphone au début
    dateTelephone: 'mardi 17 novembre'
  },

  /* ---------- Personnage du simulateur (identique dans les deux variantes) ---------- */
  personnage: {
    civilite: 'Mme', prenom: 'Anne', nom: 'Prigent', age: 74, naissance: '14 mars 1952 à Morlaix',
    adresse: '4 impasse des Camélias', cp: '29999', ville: 'Plouzévet',
    telephone: '06 39 98 41 27',
    numeroFiscal: '99 38 471 205 316',
    fiscalis: { identifiant: '99 38 471 205 316 (numéro fiscal)', motDePasse: 'Hortensia-1952' },
    santea: { identifiant: '2 52 03 29 151 044 27', motDePasse: 'Kerlaz.mamie29' },
    numerid: { installe: 'sur son téléphone', verifiee: 'identité vérifiée en avril 2025', codeSecret: '582914' },
    carteIdentite: 'ancien modèle (cartonnée), délivrée en 2012',
    proches: [
      'Sa fille, Sophie, habite à Rennes.',
      'Une aide à domicile, Laura, passe trois fois par semaine.'
    ]
  },

  /* ---------- 2A : façons de gérer ses mots de passe (identiques A et B) ----------
     Version 1.1 : cinq propositions (m4 « fichier mdp.txt » retirée).
     Les identifiants restent ceux de la version 1.0. Chaque proposition reçoit une lettre
     (A, B, C, D, E) et une couleur selon l'ordre de départ, tiré au hasard pour chaque copie. */
  motsDePasse: [
    { id: 'm1', texte: 'Des mots de passe différents, notés dans un carnet rangé à la maison' },
    { id: 'm2', texte: 'Le prénom de son enfant suivi de son année de naissance, sur tous les sites' },
    { id: 'm3', texte: 'Une recette : une racine + des lettres tirées du nom du site' },
    { id: 'm5', texte: 'Un gestionnaire de mots de passe, protégé par un compte Google ou Apple avec une phrase de passe et la double authentification' },
    { id: 'm6', texte: 'Le même mot de passe, long et compliqué, sur tous les sites' }
  ],
  couleursLettres2A: ['#2f6fd0', '#d9731a', '#23935f', '#9c45bd', '#c23a5b'],

  /* ---------- 2D, question 3 : noms réels (menu déroulant) ----------
     Services demandés (clés de services.js) et choix proposés dans chaque menu, dans cet ordre. */
  question3: {
    services: ['numerid', 'cartid'],
    choix: ['Aidants Connect', 'Ameli', 'France Identité', 'France Travail', 'FranceConnect', 'FranceConnect+', 'L\'Identité Numérique La Poste', 'Mon espace santé', 'Service-public.gouv.fr']
  },

  /* ---------- Contenus des deux variantes ---------- */
  variantes: {
    A: {
      cartes1A: [
        { id: 'A1', type: 'recherche', nomSite: 'MSA', favicon: 'M', couleur: '#5d7f2a', adresse: 'www.msa.fr', requete: 'msa espace privé',
          titre: 'MSA — Mon espace privé', texte: 'Connectez-vous à votre espace privé pour suivre vos remboursements, vos prestations familiales et votre retraite agricole.' },
        { id: 'A2', type: 'sms', expediteur: '06 39 98 22 61', heure: '09:41',
          texte: 'Votre permis de conduire expire. Renouvelez-le sous 72 h pour éviter une amende de 135 € : permis-renouvellement.info' },
        { id: 'A3', type: 'recherche', sponsorise: true, nomSite: 'Actes Naissance Express', favicon: 'A', couleur: '#888', adresse: 'actes-naissance-express.fr', requete: 'acte de naissance',
          titre: 'Acte de naissance en ligne — reçu en 24 h', texte: 'Commandez votre acte de naissance sans vous déplacer. Traitement prioritaire, suivi par mail : 29,90 €.' },
        { id: 'A4', type: 'ia', question: 'Je veux demander l\'aide au logement. C\'est sur quel site ?',
          texte: 'Pour demander l\'aide au logement, le site officiel est celui de la CAF : www.caf.fr' },
        { id: 'A5', type: 'reseau', groupe: 'Entraide retraités du Finistère', auteur: 'Josiane L.', quand: 'il y a 3 h',
          texte: 'Prime chauffage 2026 : vérifiez si vous y avez droit 👉 prime-chauffage-gouv.fr', reactions: '48 · 23 commentaires · 61 partages' },
        { id: 'A6', type: 'recherche', nomSite: 'Permis de conduire', favicon: 'P', couleur: '#3b5b8c', adresse: 'permisdeconduire.ants.gouv.fr', requete: 'permis de conduire perdu',
          titre: 'Permis de conduire perdu : demande de duplicata — timbre fiscal de 25 €', texte: 'Déclarez la perte et demandez un nouveau permis en ligne. Le timbre fiscal de 25 € se règle pendant la démarche.' },
        { id: 'A7', type: 'sms', expediteur: '06 39 98 57 03', heure: '18:02',
          texte: 'Votre dossier retraite est incomplet. Complétez-le ici : bit.ly/3kR9xQ' }
      ],
      situations1B: {
        s1: 'J\'ai acheté une voiture d\'occasion, je dois refaire la carte grise. Le site me demande de payer : c\'est forcément une arnaque, non ?',
        flash: 'Je m\'y perds. Il existe une liste des vrais sites ?',
        s3: 'J\'ai refait mon passeport, j\'ai payé 159 € en ligne. Je crois que je me suis fait avoir. Qu\'est-ce que je peux faire ?'
      },
      situations2C: [
        { id: 'c1', texte: 'Un site demande deux mots de passe différents', etoile: true },
        { id: 'c2', texte: 'Mot de passe + question secrète (« nom de votre premier animal »)' },
        { id: 'c3', texte: 'Mot de passe + case « Je ne suis pas un robot »' },
        { id: 'c4', texte: 'Mot de passe + code à 6 chiffres reçu par SMS' },
        { id: 'c5', texte: 'Payer en magasin avec sa carte bancaire, en tapant le code de la carte (4 chiffres) sur le terminal de paiement', etoile: true },
        { id: 'c6', texte: 'Payer en magasin sans contact : on approche la carte du terminal, sans taper de code' },
        { id: 'c7', texte: 'Déverrouiller son téléphone avec son empreinte' },
        { id: 'c8', texte: 'Identité numérique : confirmer dans l\'appli du téléphone avec un code secret' }
      ],
      sim: {
        servicePirate: 'fiscalis',     // clé de services.js
        ordreIncidents: ['appel', 'sms'],
        smsFrais: { montant: '12,90 €', domaine: 'habitat-adapt-frais.com', expediteur: '06 39 98 70 05' },
        q1: 'Son voisin, M. Le Bris, n\'a qu\'un compte {fiscalis}. Il veut faire la même demande. Que lui dites-vous ?',
        q2: 'Laura, l\'aide à domicile, propose : « Donnez-moi votre code secret {numerid}, je ferai vos démarches quand vous n\'êtes pas là. » Que répondez-vous ?'
      }
    },
    B: {
      cartes1A: [
        { id: 'B1', type: 'recherche', nomSite: 'L\'Assurance retraite', favicon: 'R', couleur: '#2e6b8a', adresse: 'www.lassuranceretraite.fr', requete: 'retraite espace personnel',
          titre: 'L\'Assurance retraite — Mon espace personnel', texte: 'Consultez vos paiements, téléchargez vos attestations et faites vos démarches retraite en ligne.' },
        { id: 'B2', type: 'sms', expediteur: '06 39 98 22 61', heure: '09:41',
          texte: 'Amende non réglée : majoration sous 48 h. Réglez ici : amendes-paiement.net' },
        { id: 'B3', type: 'recherche', sponsorise: true, nomSite: 'Casier Express France', favicon: 'C', couleur: '#888', adresse: 'casier-express-france.com', requete: 'extrait casier judiciaire',
          titre: 'Extrait de casier judiciaire en 48 h', texte: 'Obtenez votre extrait de casier judiciaire sans attendre. Dossier traité par nos experts : 24,90 €.' },
        { id: 'B4', type: 'ia', question: 'Je dois m\'inscrire comme demandeur d\'emploi. C\'est sur quel site ?',
          texte: 'Pour vous inscrire comme demandeur d\'emploi, le site officiel est www.francetravail.fr' },
        { id: 'B5', type: 'story', compte: 'bons.plans.bretagne', quand: '5 h',
          texte: 'Chèque énergie non réclamé ? Récupérez-le ici 👉 cheque-energie-gouv-aide.com' },
        { id: 'B6', type: 'recherche', nomSite: 'Timbres fiscaux', favicon: 'T', couleur: '#3b5b8c', adresse: 'timbres.impots.gouv.fr', requete: 'carte d\'identité perdue timbre',
          titre: 'Carte d\'identité perdue ou volée : achetez votre timbre fiscal de 25 €', texte: 'Achat en ligne du timbre fiscal électronique pour le renouvellement d\'une carte d\'identité perdue ou volée.' },
        { id: 'B7', type: 'flyer', titre: 'AIDE SENIOR 2026',
          texte: 'Vous avez plus de 60 ans ? Vous avez peut-être droit à une aide. Flashez ou tapez :', lien: 'tinyurl.com/aide-senior26' }
      ],
      situations1B: {
        s1: 'Je dois refaire mon passeport. Le site me demande de payer : c\'est forcément une arnaque, non ?',
        flash: 'Comment savoir si un site est vraiment celui de l\'administration ? Il y a un endroit où chercher ?',
        s3: 'J\'ai changé l\'adresse sur ma carte grise après mon déménagement, j\'ai payé 44,90 €. Je crois que je me suis fait avoir. Qu\'est-ce que je peux faire ?'
      },
      situations2C: [
        { id: 'c1', texte: 'Un site demande un mot de passe puis un code à 4 chiffres que vous avez choisi', etoile: true },
        { id: 'c2', texte: 'Mot de passe + date de naissance' },
        { id: 'c3', texte: 'Mot de passe + case « Je ne suis pas un robot »' },
        { id: 'c4', texte: 'Mot de passe + validation dans l\'appli de la banque sur le téléphone' },
        { id: 'c5', texte: 'Retirer de l\'argent au distributeur : on insère sa carte bancaire et on tape le code de la carte (4 chiffres)', etoile: true },
        { id: 'c6', texte: 'Payer en magasin sans contact : on approche la carte du terminal, sans taper de code' },
        { id: 'c7', texte: 'Déverrouiller son téléphone avec son visage' },
        { id: 'c8', texte: 'Identité numérique : confirmer dans l\'appli du téléphone avec son empreinte' }
      ],
      sim: {
        servicePirate: 'santea',       // clé de services.js
        ordreIncidents: ['sms', 'appel'],
        smsFrais: { montant: '14,50 €', domaine: 'habitatadapt-validation.net', expediteur: '06 39 98 70 05' },
        q1: 'Sa sœur, Mme Tanguy, n\'a qu\'un compte {santea}. Elle veut faire la même demande. Que lui dites-vous ?',
        q2: 'Sophie, sa fille, propose : « Installe ton identité {numerid} sur mon téléphone, comme ça je ferai tes démarches. » Que répondez-vous ?'
      }
    }
  }
};
