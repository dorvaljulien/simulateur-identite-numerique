# Logos des services inventés — simulateur

Déposer ici une image par service, nommée avec sa **clé**, puis lancer `node build.js` à la racine du dépôt. L'image est intégrée à `simulateur-identite-numerique.html` (qui reste un seul fichier autonome). Sans image, les logos dessinés d'origine sont utilisés.

Formats acceptés : `.png`, `.svg`, `.jpg`, `.webp`, `.gif`.

| Clé | Service |
|---|---|
| `fiscalis` | impôts |
| `santea` | assurance maladie |
| `identipass` | connexion unique |
| `numerid` | identité numérique |
| `agrimut` | mutualité agricole |
| `idnomade` | identité sur mobile |
| `trouvo` | moteur de recherche |
| `maboite` | messagerie |
| `aideDemarches` | intermédiaire payant |
| `infoPratique` | site d'articles (petite icône seulement) |

- `<clé>.png` : logo de l'en-tête du site (horizontal, fond transparent, affiché sur 30 à 74 px de haut).
- `<clé>-icone.png` : petite icône carrée (onglet du navigateur, résultats de recherche, choix du compte). Sans elle, on reprend `<clé>.png`.

Les **noms** et les **adresses** se changent dans `noms-services.js`, à la racine du dépôt.
