/* =====================================================================
   CONFIG — tout ce qui est réglable par le professeur est ici.
   Ajouter un personnage : dupliquer l'objet PERSONNAGES.martine et
   changer CONFIG.personnage. La logique n'a pas à être modifiée.
   ===================================================================== */
const PERSONNAGES = {
  martine: {
    id: 'martine',
    prenom: 'Martine',
    nomUsage: 'Le Gall',
    nomNaissance: 'Kerjean',
    sexe: 'F',
    age: 58,
    naissance: { jour: 14, mois: 3, annee: 1968, lieu: 'Quimperlé (29)' },
    conjoint: { prenom: 'Jean-Yves', nom: 'Le Gall', naissance: '02/09/1965' },
    enfants: 'Gwenaëlle (31 ans, vit à Rennes)',
    adresse: ['12 rue des Hortensias', 'Lieu-dit Kerhuel', '29999 PENHOAT-SUR-ELLÉ'],
    telephone: '06 99 41 27 83',
    mail: 'martine.legall@maboite.fr',
    mailMasque: 'm•••••@maboite.fr',
    metier: 'Aide-soignante en EHPAD',
    // Identifiants fiscaux (13 chiffres commençant par 99 : visiblement inventés)
    numeroFiscal: '9917058342216',
    numeroFiscalConjoint: '9923614087552',
    // Numéros d'accès en ligne (un par avis)
    accesCetteAnnee: '4826153',
    accesAnDernier: '3917428',
    accesConjoint: '6150937',
    numeroSecu: '9 68 03 29 103 058 47', // commence par 9 : format invalide exprès
    // Comptes possédés au départ
    maboite: { identifiant: 'martine.legall@maboite.fr', motDePasse: 'Hortensia.29' },
    numerid: { identifiant: 'martine.legall@maboite.fr', motDePasse: 'Gwen-Penhoat-2024', creePar: 'sa fille Gwenaëlle, en mars 2024' },
    pinTelephone: '4831',
    santea: null,   // pas de compte Santéa
    fiscalis: null, // à créer pendant la séance

    // Papiers du trieur. pochette : 'banque' | 'sante' | 'impots' | 'divers'
    documents: [
      { id: 'avisAnDernier', pochette: 'impots', type: 'avis', titre: 'Avis d\'impôt 2025',
        piege: 'anDernier',
        d: { annee: 2025, revenus: 2024, destinataire: ['MME LE GALL MARTINE', 'NÉE KERJEAN'], declarant: 'LE GALL Martine',
             numeroFiscal: '9917058342216', reference: '25 29A 412 908 77', foyer: '2 91 470 286 315', acces: '3917428',
             etabli: '28/07/2025', revenu: '23 640', rfr: '21 276', parts: '1', impot: '1 042', prelevePAS: '1 210', solde: '168', sens: 'rembourse' } },
      { id: 'avisJY', pochette: 'impots', type: 'avis', titre: 'Avis d\'impôt 2026 (Jean-Yves)',
        piege: 'conjoint',
        d: { annee: 2026, revenus: 2025, destinataire: ['M. LE GALL JEAN-YVES'], declarant: 'LE GALL Jean-Yves',
             numeroFiscal: '9923614087552', reference: '26 29A 733 015 42', foyer: '2 91 470 286 316', acces: '6150937',
             etabli: '29/07/2026', revenu: '27 905', rfr: '25 115', parts: '1', impot: '1 688', prelevePAS: '1 560', solde: '128', sens: 'reste' } },
      { id: 'echeancier', pochette: 'impots', type: 'echeancier', titre: 'Échéancier prélèvement à la source' },
      { id: 'courrierSantea', pochette: 'sante', type: 'courrierSante', titre: 'Courrier Santéa' },
      { id: 'mutuelle', pochette: 'sante', type: 'mutuelle', titre: 'Carte mutuelle' },
      { id: 'releve', pochette: 'banque', type: 'releve', titre: 'Relevé de compte octobre' },
      { id: 'avisCetteAnnee', pochette: 'divers', type: 'avis', titre: 'Avis d\'impôt 2026',
        d: { annee: 2026, revenus: 2025, destinataire: ['MME LE GALL MARTINE', 'NÉE KERJEAN'], declarant: 'LE GALL Martine',
             numeroFiscal: '9917058342216', reference: '26 29A 581 734 06', foyer: '2 91 470 286 315', acces: '4826153',
             etabli: '31/07/2026', revenu: '24 318', rfr: '21 886', parts: '1', impot: '1 127', prelevePAS: '1 080', solde: '47', sens: 'reste' } },
      { id: 'facture', pochette: 'divers', type: 'facture', titre: 'Facture Élec\'Armor' }
    ]
  }
};

const CONFIG = {
  personnage: 'martine',

  // Codes de passage (3 chiffres) — donnés par le professeur à la fin de chaque étape
  codes: {
    reinitialisation: '000', // remet tout à zéro (aussi Ctrl+Alt+R)
    etape2: '318',           // code n°1 : fin de l'étape 1 → début de l'étape 2
    etape3: '574',           // code n°2 : fin de l'étape 2 → début de l'étape 3
    recap:  '926'            // code n°3 : fin de l'étape 3 → récapitulatif
  },

  // Durées, en secondes réelles
  durees: {
    expirationCodeMail: 180,     // code à 6 chiffres (Fiscalis, NumérID)
    blocageCompte: 120,          // affiché « 15 minutes » à l'écran
    validiteLienReinit: 600,     // lien « mot de passe oublié »
    delaiMailMin: 2,             // délai d'arrivée des mails (aléatoire entre min et max)
    delaiMailMax: 8,
    delaiFauxMail: 7             // le faux mail arrive après le vrai mail de réinitialisation
  },

  // Où arrive le mail de confirmation de création Fiscalis : 'toujours' | 'jamais' | 'aleatoire'
  confirmationDansIndesirables: 'toujours',

  // Horloge fictive
  horloge: {
    depart: { annee: 2026, mois: 11, jour: 10, heure: 13, minute: 20 },
    apresSaut: { annee: 2026, mois: 12, jour: 1, heure: 18, minute: 4 }
  },

  // Mot de passe utilisé quand on reprend à l'étape 2 sans avoir créé le compte
  reprise: {
    motDePasseFiscalis: 'Crepes-Kerhuel-2026'
  },

  // Mot de passe que « Martine a mis depuis son téléphone » (inconnu de l'élève)
  motDePasseChangeTelephone: 'Xq7!pLm2-Tr9vB',

  // Objectif affiché pour chaque étape (ce n'est pas une aide : juste la mission)
  missions: {
    1: 'Vous voulez consulter vos impôts en ligne. Créez votre espace sur le site Fiscalis.',
    2: 'Connectez-vous à votre espace Fiscalis pour vérifier que tout fonctionne, puis déconnectez-vous.',
    '2b': 'Votre banque vous demande votre avis d\'impôt le plus récent. Connectez-vous à Fiscalis et ouvrez-le.',
    3: 'Le médecin vous demande une attestation de droits. Connectez-vous au site de Santéa (assurance maladie) et ouvrez-la.',
    4: 'Séance terminée.'
  },

  // Mails déjà présents dans MaBoîte au début de la séance
  mailsInitiaux: [
    { de: 'Gwenaëlle', adresse: 'gwen.legall@maboite.fr', objet: 'Re: les impôts en ligne', jour: '09:47', lu: false,
      corps: '<p>Maman,</p><p>Oui tu peux tout faire en ligne maintenant, c\'est bien plus simple. Il faut juste créer ton espace sur Fiscalis. Ils vont te demander des numéros qui sont sur tes papiers des impôts.</p><p>Je t\'appelle dimanche.</p><p>Bisous<br>Gwen</p>' },
    { de: 'Pharmacie de l\'Ellé', adresse: 'contact@pharmacie-elle.sim', objet: 'Votre commande est prête', jour: '08:15', lu: true,
      corps: '<p>Bonjour,</p><p>Votre commande n° 4471 est disponible au comptoir. Pensez à apporter votre carte vitale.</p><p>Pharmacie de l\'Ellé — ouverte du lundi au samedi, 9h-12h30 / 14h-19h15.</p>' },
    { de: 'Crédit Breizh (fictif)', adresse: 'information@creditbreizh.sim', objet: 'Votre relevé de compte d\'octobre est disponible', jour: 'hier', lu: true,
      corps: '<p>Madame Le Gall,</p><p>Votre relevé de compte du mois d\'octobre est disponible dans votre espace client.</p><p>Pour votre sécurité, nous ne vous demanderons jamais vos codes par mail ou par téléphone.</p>' },
    { de: 'Le Bon Coin Coin', adresse: 'noreply@leboncoincoin.sim', objet: 'Nouveau message concernant « Buffet breton chêne massif »', jour: '8 nov.', lu: true,
      corps: '<p>Vous avez reçu un nouveau message : « Bonjour, le buffet est-il toujours disponible ? Je peux passer samedi. »</p>' },
    { de: 'Mutuelle Armorique Santé', adresse: 'newsletter@mutarmorique.sim', objet: 'Votre lettre d\'information de novembre', jour: '7 nov.', lu: true,
      corps: '<p><b>Novembre : le mois de la prévention</b></p><p>Vaccination contre la grippe, dépistage, bien-être au travail : retrouvez tous nos conseils dans votre espace adhérent.</p>' },
    { de: 'Annick Le Bihan', adresse: 'annick.lebihan@maboite.fr', objet: 'Covoiturage jeudi ?', jour: '6 nov.', lu: true,
      corps: '<p>Salut Martine, tu travailles jeudi ? Si oui je peux t\'emmener, ma voiture est revenue du garage. Annick</p>' },
    { de: 'Service Clients Livraison', adresse: 'colis-info@livr4ison-suivi.sim', objet: 'Votre colis est en attente : frais de 1,99 €', jour: '5 nov.', lu: false, dossier: 'spam',
      corps: '<p>Votre colis n\'a pas pu être livré car des frais de 1,99 € sont en attente. Réglez-les sous 48 h, sinon votre colis sera retourné.</p><p><span style="background:#e53;color:#fff;padding:4px 10px">Payer les frais</span></p>' },
    { de: 'Félicitations !!', adresse: 'gagnant@super-tirage-2026.sim', objet: 'Martine, vous avez été sélectionnée pour gagner un smartphone', jour: '3 nov.', lu: false, dossier: 'spam',
      corps: '<p>Répondez à 3 questions et recevez votre smartphone dernier modèle ! Offre limitée aux 100 premiers participants.</p>' },
    { de: 'Pharma-Discount', adresse: 'promo@pharma-dsc0unt.sim', objet: '-70 % sur vos médicaments sans ordonnance', jour: '1 nov.', lu: true, dossier: 'spam',
      corps: '<p>Livraison discrète et rapide. Sans ordonnance.</p>' }
  ],

  // Mails « intermédiaires » reçus pendant les trois semaines du saut dans le temps
  mailsIntermediaires: [
    { de: 'Gwenaëlle', adresse: 'gwen.legall@maboite.fr', objet: 'Photos de dimanche', jour: '23 nov.',
      corps: '<p>Coucou maman,</p><p>Voici les photos du repas de dimanche chez Mamig. Tu peux les montrer à papa ? Il n\'arrive pas à ouvrir les pièces jointes sur sa tablette.</p><p>Et n\'oublie pas de me dire pour Noël, on vient le 24 ou le 25 ?</p><p>Bises,<br>Gwen</p><p style="color:#777">📎 IMG_2041.jpg — IMG_2042.jpg — IMG_2047.jpg</p>' },
    { de: 'Super U Penhoat', adresse: 'promo@news.superu-penhoat.sim', objet: '🎄 -30 % sur les jouets jusqu\'à dimanche !', jour: '20 nov.',
      corps: '<p><b>Préparez Noël en avance !</b></p><p>Profitez de -30 % sur une sélection de jouets, et de la livraison gratuite dès 50 € d\'achat. Offre valable jusqu\'au 29 novembre dans la limite des stocks disponibles.</p><p style="font-size:11px;color:#777">Pour vous désinscrire, cliquez ici.</p>' },
    { de: 'Facebouc', adresse: 'notification@facebouc.sim', objet: 'Annick Le Bihan a commenté votre photo', jour: '27 nov.',
      corps: '<p>Annick Le Bihan a commenté votre photo : « Superbe le jardin !! Tes hortensias sont magnifiques cette année 😍 »</p><p><span style="background:#4a5;color:#fff;padding:4px 10px;border-radius:4px">Voir le commentaire</span></p>' },
    { de: 'EHPAD Les Glycines', adresse: 'planning@ehpad-glycines.sim', objet: 'Planning de décembre', jour: '26 nov.',
      corps: '<p>Bonjour à toutes et à tous,</p><p>Vous trouverez ci-joint le planning du mois de décembre. Merci de signaler tout échange de poste à Mme Riou avant le 5 décembre.</p><p>La direction</p><p style="color:#777">📎 planning_decembre.pdf</p>' },
    { de: 'Élec\'Armor', adresse: 'ne-pas-repondre@elecarmor.sim', objet: 'Votre facture de novembre est disponible', jour: '18 nov.',
      corps: '<p>Madame Le Gall,</p><p>Votre facture de novembre d\'un montant de <b>87,42 €</b> est disponible dans votre espace client. Elle sera prélevée le 5 décembre.</p><p>Élec\'Armor, votre fournisseur d\'énergie (fictif).</p>' },
    { de: 'La Gazette du Pays de l\'Ellé', adresse: 'lettre@gazette-elle.sim', objet: 'Votre lettre du week-end : le marché de Noël revient', jour: '28 nov.',
      corps: '<p><b>Le marché de Noël de Penhoat revient les 12 et 13 décembre</b></p><p>Quarante exposants, des crêpes, un vin chaud solidaire et la chorale du collège. Lire la suite…</p><p><b>Travaux route de Kerhuel :</b> circulation alternée jusqu\'au 18 décembre.</p>' },
    { de: 'Jean-Yves', adresse: 'jy.legall29@maboite.fr', objet: 'Re: rendez-vous garage', jour: '30 nov.',
      corps: '<p>Le garage peut prendre la voiture jeudi à 8h30. Je la dépose en allant au travail, tu pourras la récupérer le soir ?</p><p>JY</p>' },
    { de: 'Colis Express', adresse: 'suivi@colisexpress.sim', objet: 'Votre colis a été livré', jour: '25 nov.',
      corps: '<p>Votre colis n° CX 7741 2290 FR a été livré dans votre boîte aux lettres le 25/11 à 11h42.</p>' }
  ]
};
