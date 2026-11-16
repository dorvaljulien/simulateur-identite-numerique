/* =====================================================================
   NOMS ET ADRESSES DES SERVICES INVENTÉS
   Simulateur « Identité numérique »
   ---------------------------------------------------------------------
   MODE D'EMPLOI
   1. Changer UNIQUEMENT le texte de DROITE (le nouveau nom).
      Le texte de gauche est le nom d'origine, tel qu'il est écrit dans le code : ne pas le toucher.
   2. Lancer, dans le dossier du dépôt :  node build.js
   3. Ouvrir simulateur-identite-numerique.html et vérifier.

   Le remplacement est fait partout : pages des sites, mails, documents,
   fiche professeur, mots-clés du moteur de recherche. Les versions en
   MAJUSCULES (FISCALIS, SANTEA…) suivent automatiquement.

   Interdit dans un nouveau nom : " ` \ $ < > (une apostrophe ' est
   acceptée, elle devient ’). Pour une adresse : lettres minuscules sans
   accent, chiffres, points et tirets seulement.

   Logos (images) : dossier logos/, voir logos/LISEZMOI.md.
   ===================================================================== */
module.exports = {

  /* ---------- NOMS ---------- */
  noms: {
    // Sites officiels (fictifs)
    'Fiscalis': 'Fiscalis',                 // impôts (rôle réel : impots.gouv.fr)
    'Santéa': 'Santéa',                     // assurance maladie (ameli.fr)
    'IdentiPass': 'IdentiPass',             // connexion unique (FranceConnect) ; « IdentiPass+ » suit tout seul
    'NumérID': 'NumérID',                   // identité numérique (L'Identité Numérique La Poste)
    'CartID': 'CartID',                     // identité avec la carte d'identité (France Identité)
    'FormaCompte': 'FormaCompte',           // droits à la formation (Mon Compte Formation)
    'Aidants Relais': 'Aidants Relais',     // aidants professionnels (Aidants Connect)
    'Agrimut': 'Agrimut',                   // mutualité agricole (MSA)
    'IdNomade': 'IdNomade',                 // identité sur mobile

    // Outils du quotidien
    'Trouvo': 'Trouvo',                     // moteur de recherche
    'MaBoîte': 'MaBoîte',                   // messagerie (webmail)

    // Sites à éviter / intermédiaires
    'Aide Démarches Express': 'Aide Démarches Express',   // intermédiaire payant

    // Expéditeurs des mails de la boîte de réception
    'Crédit Breizh': 'Crédit Breizh',
    'Le Bon Coin Coin': 'Le Bon Coin Coin',
    'Mutuelle Armorique Santé': 'Mutuelle Armorique Santé',
    'Facebouc': 'Facebouc',
    'Élec\'Armor': 'Élec\'Armor',
    'Colis Express': 'Colis Express',
    'Pharma-Discount': 'Pharma-Discount',

    // Sites annexes des résultats de recherche
    'Info Pratique': 'Info Pratique'
  },

  /* ---------- ADRESSES (barre d'adresse, liens, adresses mail) ---------- */
  adresses: {
    'fiscalis.gouv.sim': 'fiscalis.gouv.sim',
    'fiscalis-gouv-sim.com': 'fiscalis-gouv-sim.com',     // FAUX site (hameçonnage) : garder une adresse qui imite la vraie
    'santea.gouv.sim': 'santea.gouv.sim',
    'identipass.sim': 'identipass.sim',
    'numerid.sim': 'numerid.sim',
    'agrimut.sim': 'agrimut.sim',
    'idnomade.sim': 'idnomade.sim',
    'cartid.gouv.sim': 'cartid.gouv.sim',
    'formacompte.gouv.sim': 'formacompte.gouv.sim',
    'trouvo.sim': 'trouvo.sim',
    'maboite.fr': 'maboite.fr',                           // adresses mail : martine.legall@maboite.fr…
    'aide-demarches-express.sim': 'aide-demarches-express.sim',
    'info-pratique.sim': 'info-pratique.sim',
    'creditbreizh.sim': 'creditbreizh.sim',
    'leboncoincoin.sim': 'leboncoincoin.sim',
    'mutarmorique.sim': 'mutarmorique.sim',
    'facebouc.sim': 'facebouc.sim',
    'elecarmor.sim': 'elecarmor.sim',
    'colisexpress.sim': 'colisexpress.sim',
    'pharma-dsc0unt.sim': 'pharma-dsc0unt.sim'
  }
};
