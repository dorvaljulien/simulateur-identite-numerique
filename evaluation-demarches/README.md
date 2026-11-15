# Évaluation « Démarches en ligne et identité numérique » (1ère SAPAT, TIM)

Évaluation de 60 min sur poste : parties 1A à 2C (sites officiels, conseils, mots de passe, double authentification) puis simulateur de connexion renforcée (2D). Tous les sites et données sont fictifs.

- Cahier des charges et corrigé : dans le projet claude.ai « Cours informatique SAPAT ». Une copie du corrigé est ici : `Corrigé et grille – Évaluation démarches en ligne.md` (à ne jamais donner aux élèves).
- Livrable : `evaluation-demarches.html`, un seul fichier autonome. **Il est généré** : ne pas le modifier à la main.
- Sources dans `src/`, assemblées par `node build.js` (à relancer après chaque modification) :
  - `config.js` : `CONFIG` (codes de séance, code de remise à zéro, temps conseillés, réglages du simulateur, personnage, contenus des variantes A et B, choix du menu de la question 3). Aucune bonne réponse ici.
  - `services.js` : **noms, adresses, couleurs et logos des services inventés** (voir plus bas).
  - `core.js` : état, sauvegarde `localStorage`, en-tête (progression, compte à rebours), navigation entre parties, export JSON, remise à zéro, accueil.
  - `parties.js` : parties 1A, 1B, 2A (glisser-déposer), 2B, 2C et écran de fin.
  - `simulateur.js` : partie 2D (prédiction, navigateur fictif, téléphone, journal des clics, questions de fin).
  - CSS : `eval.css`, `simulateur.css` (style repris du simulateur Identité numérique).
- `logos/` : images facultatives des services, intégrées au fichier par `build.js` (mode d'emploi : `logos/LISEZMOI.md`).

Codes par défaut : `4172` → variante A, `8395` → variante B, `0000` ou Ctrl+Alt+R → tout effacer.

## Remplacer les noms et logos des services inventés

Tout est regroupé à deux endroits, aucun autre fichier n'est à toucher :

1. **Noms, adresses, couleurs, lettres des icônes** : `src/services.js`. Chaque service a une clé fixe (`trouvo`, `habitatAdapt`, `identipassPlus`, `identipass`, `numerid`, `cartid`, `fiscalis`, `santea`, `adaptSenior`, `maisonConfort`, `forumSeniors`) et des champs `nom`, `nomHtml` (facultatif), `domaine`, `lettre`, `couleur`, `slogan`… Les textes de `config.js` qui citent un service l'écrivent entre accolades (`un compte {fiscalis}`) : ils suivent donc le nouveau nom.
2. **Logos (images)** : déposer `logos/<clé>.png` (ou `.svg`) et, pour les petites icônes carrées, `logos/<clé>-icone.png`.

Puis `node build.js`. Ne pas changer les clés : le journal des clics, l'export des copies et le corrigé s'en servent. Si un nom change, penser à mettre à jour le tableau des correspondances du corrigé.

Le vrai nom d'IdentiPass+ (FranceConnect+) est affiché aux élèves (champ `enVrai` dans `services.js`). Les autres correspondances sont des réponses de la question 3 : elles ne sont que dans le corrigé.
