# Simulateur « Identité numérique » (1ère SAPAT, TIM)

Simulateur pédagogique : création de compte, double authentification, mot de passe oublié, faux mail, connexion unique (IdentiPass ≈ FranceConnect). Tous les sites et données sont fictifs.

- Cahier des charges : `cahier-des-charges-simulateur-identite-numerique.md`
- Livrable : `simulateur-identite-numerique.html`, un seul fichier autonome, sans ressource externe. **Il est généré** : ne pas le modifier à la main.
- Sources dans `src/`, assemblées par `node build.js` (à relancer après chaque modification) :
  - `config.js` : `PERSONNAGES` et `CONFIG` (codes de passage, durées, missions, mails, documents du trieur). Tout réglage du professeur va ici.
  - `core.js` : état, horloge fictive, navigateur fictif (onglets, barre d'adresse, routage `SITES[hôte].render/after/action/submit`), étapes et codes de passage.
  - `mail.js` (MaBoîte, clé d'accès), `docs.js` (trieur de papiers, carte personnage), `teacher.js` (récapitulatif, code de fin, fiche professeur Ctrl+Alt+P).
  - `site-fiscalis.js`, `site-sante-identite.js` (Santéa, IdentiPass, NumérID, Agrimut, IdNomade), `site-trouvo.js` (moteur de recherche et sites annexes).
  - CSS : `app.css`, `fiscalis.css`, `sites2.css`.
- Test local : `python -m http.server 8765`, puis ouvrir `http://localhost:8765/simulateur-identite-numerique.html` (ou ouvrir le fichier directement).

## Fins d'étape
1. Lien d'activation Fiscalis cliqué + choix « Enregistrer / Jamais » du mot de passe.
2. Après le saut dans le temps : ouverture de l'avis d'impôt 2026 dans l'espace Fiscalis.
3. Ouverture de l'attestation de droits dans l'espace Santéa (via IdentiPass › NumérID).

## Style attendu
Sites réalistes : accueils denses, petit bouton de connexion en haut à droite, messages d'erreur vagues, aucune aide intégrée qui donne la solution. Noms, logos et couleurs inventés (pas de bleu-blanc-rouge).
