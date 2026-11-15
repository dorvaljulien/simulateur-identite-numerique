# Évaluation « Démarches en ligne et identité numérique » (1ère SAPAT, TIM)

Évaluation de 60 min sur poste : parties 1A à 2C (sites officiels, conseils, mots de passe, double authentification) puis simulateur de connexion renforcée (2D). Tous les sites et données sont fictifs.

- Cahier des charges et corrigé : dans le projet claude.ai « Cours informatique SAPAT ». Une copie du corrigé est ici : `Corrigé et grille – Évaluation démarches en ligne.md` (à ne jamais donner aux élèves).
- Livrable : `evaluation-demarches.html`, un seul fichier autonome. **Il est généré** : ne pas le modifier à la main.
- Sources dans `src/`, assemblées par `node build.js` (à relancer après chaque modification) :
  - `config.js` : `CONFIG` (codes de séance, code de remise à zéro, temps conseillés, réglages du simulateur, personnage, contenus des variantes A et B, choix du menu de la question 3). Aucune bonne réponse ici.
  - `services.js` : couleurs, icônes et logos des services inventés (les noms et adresses : `noms-services.js` à la racine, voir plus bas).
  - `core.js` : état, sauvegarde `localStorage`, en-tête (progression, compte à rebours), navigation entre parties, export JSON, remise à zéro, accueil.
  - `parties.js` : parties 1A, 1B, 2A (glisser-déposer), 2B, 2C et écran de fin.
  - `simulateur.js` : partie 2D (prédiction, navigateur fictif, téléphone, journal des clics, questions de fin).
  - CSS : `eval.css`, `simulateur.css` (style repris du simulateur Identité numérique).
- `logos/` : images facultatives des services, intégrées au fichier par `build.js` (mode d'emploi : `logos/LISEZMOI.md`).

Codes par défaut : `4172` → variante A, `8395` → variante B, `0000` ou Ctrl+Alt+R → tout effacer.

## Remplacer les noms et logos des services inventés

1. **Noms et adresses** : `noms-services.js`, **à la racine du dépôt** (commun avec le simulateur). On ne change que le texte de droite.
2. **Couleurs, lettres des icônes, slogans** : `src/services.js`.
3. **Logos (images)** : déposer `logos/<clé>.png` (ou `.svg`) et, pour les petites icônes carrées, `logos/<clé>-icone.png` (voir `logos/LISEZMOI.md`).

Puis `node build.js`. Dans les sources, les noms d'origine restent écrits tels quels : `build.js` les remplace au moment de générer le fichier. Si un nom change, penser à mettre à jour le tableau des correspondances du corrigé.

Le vrai nom d'IdentiPass+ (FranceConnect+) est affiché aux élèves (champ `enVrai` dans `src/services.js`). Les autres correspondances sont des réponses de la question 3 : elles ne sont que dans le corrigé.
