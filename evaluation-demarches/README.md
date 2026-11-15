# Évaluation « Démarches en ligne et identité numérique » (1ère SAPAT, TIM)

Évaluation de 60 min sur poste : parties 1A à 2C (sites officiels, conseils, mots de passe, double authentification) puis simulateur IdentiPass+ (2D). Tous les sites et données sont fictifs.

- Cahier des charges et corrigé : dans le projet claude.ai « Cours informatique SAPAT ». Une copie du corrigé est ici : `Corrigé et grille – Évaluation démarches en ligne.md` (à ne jamais donner aux élèves).
- Livrable : `evaluation-demarches.html`, un seul fichier autonome. **Il est généré** : ne pas le modifier à la main.
- Sources dans `src/`, assemblées par `node build.js` (à relancer après chaque modification) :
  - `config.js` : `CONFIG` (codes de séance, code de remise à zéro, temps conseillés, réglages du simulateur, personnage, contenus des variantes A et B). Aucune bonne réponse ici.
  - `core.js` : état, sauvegarde `localStorage`, en-tête et chronomètres, navigation entre parties, export JSON, remise à zéro, accueil.
  - `parties.js` : parties 1A, 1B, 2A, 2B, 2C et écran de fin.
  - `simulateur.js` : partie 2D (prédiction, navigateur fictif, téléphone, journal des clics, questions de fin).
  - CSS : `eval.css`, `simulateur.css` (style repris du simulateur Identité numérique).

Codes par défaut : `4172` → variante A, `8395` → variante B, `0000` ou Ctrl+Alt+R → tout effacer.
