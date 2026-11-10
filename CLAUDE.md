# Simulateur « Identité numérique » (1ère SAPAT, TIM)

Simulateur pédagogique : création de compte, double authentification, mot de passe oublié, faux mail, connexion unique (IdentiPass ≈ FranceConnect), identité numérique vérifiée confirmée sur le téléphone (NumérID ≈ L'Identité Numérique La Poste) et connexion renforcée (IdentiPass+ ≈ FranceConnect+). Tous les sites et données sont fictifs.

- Cahier des charges : `cahier-des-charges-simulateur-identite-numerique.md`
- Cours élève : `cours/cours-identite-numerique.docx` et `.odt`, générés par `node cours/build-cours.js` (schémas : `node cours/build-images.js`). Le cours montre les vrais sites en captures (`cours/captures/`) ; il ne donne ni codes de passage, ni bons numéros, ni chemin gagnant.
- Livrable : `simulateur-identite-numerique.html`, un seul fichier autonome, sans ressource externe. **Il est généré** : ne pas le modifier à la main.
- Sources dans `src/`, assemblées par `node build.js` (à relancer après chaque modification) :
  - `config.js` : `PERSONNAGES` et `CONFIG` (codes de passage, durées, missions, mails, documents du trieur). Tout réglage du professeur va ici.
  - `core.js` : état, horloge fictive, navigateur fictif (onglets, barre d'adresse, routage `SITES[hôte].render/after/action/submit`), étapes et codes de passage.
  - `mail.js` (MaBoîte, clé d'accès), `docs.js` (trieur de papiers, carte personnage), `teacher.js` (récapitulatif, code de fin, fiche professeur Ctrl+Alt+P).
  - `site-fiscalis.js`, `site-sante-identite.js` (Santéa, IdentiPass et IdentiPass+, NumérID, CartID, Agrimut, IdNomade), `site-formacompte.js` (FormaCompte ≈ Mon Compte Formation), `site-trouvo.js` (moteur de recherche et sites annexes).
  - CSS : `app.css`, `fiscalis.css`, `sites2.css`.
- Test local : `python -m http.server 8765`, puis ouvrir `http://localhost:8765/simulateur-identite-numerique.html` (ou ouvrir le fichier directement).

## Fins d'étape
1. Lien d'activation Fiscalis cliqué + choix « Enregistrer / Jamais » du mot de passe.
2. Après le saut dans le temps : ouverture de l'avis d'impôt 2026 dans l'espace Fiscalis.
3. Ouverture de l'attestation de droits dans l'espace Santéa (via IdentiPass › NumérID, confirmé sur le téléphone avec le code secret).
4. Demande d'inscription à la formation cible envoyée sur FormaCompte (via IdentiPass+ › NumérID). Étape courte ; le code du récapitulatif peut se donner dès la fin de l'étape 3.

Codes de passage : 318, 574, 926 (→ étape 4), 451 (→ récapitulatif). Code de fin : 5 caractères, décodés dans la fiche professeur.

## Correspondances fictif → réel
Fiscalis = impots.gouv.fr · Santéa = ameli · IdentiPass = FranceConnect · IdentiPass+ = FranceConnect+ · NumérID = L'Identité Numérique La Poste · CartID = France Identité · FormaCompte = Mon Compte Formation · Aidants Relais = Aidants Connect.

## Style attendu
Sites réalistes : accueils denses, petit bouton de connexion en haut à droite, messages d'erreur vagues, aucune aide intégrée qui donne la solution. Noms, logos et couleurs inventés (pas de bleu-blanc-rouge).
