# Logos des services fictifs

Déposer ici une image par service, nommée avec la **clé** du service (voir `src/services.js`), puis lancer `node build.js` dans le dossier `evaluation-demarches`. L'image est intégrée au fichier `evaluation-demarches.html` (qui reste un seul fichier autonome).

Formats acceptés : `.png`, `.svg`, `.jpg`, `.webp`, `.gif`.

| Fichier | Service | Où le logo apparaît |
|---|---|---|
| `trouvo.png` | moteur de recherche | accueil et page de résultats, carte « recherche » de la partie 1A (le nom seul) |
| `habitatAdapt.png` | site de l'aide (officiel) | en-tête du site |
| `identipassPlus.png` | service de connexion renforcée | en-tête du site de connexion |
| `adaptSenior.png` | intermédiaire payant | en-tête du site |
| `numerid-icone.png` | identité numérique (appli) | icône de l'appli sur le téléphone, choix d'identité |
| `cartid-icone.png` | identité numérique (carte) | choix d'identité |

Petites icônes carrées (onglet du navigateur, appli du téléphone, pastilles) : `<clé>-icone.png`. Sans elle, l'icône reprend `<clé>.png` ; sans aucune image, c'est la lettre et la couleur de `services.js`.

Conseils : logo horizontal sur fond transparent (hauteur affichée 30 à 70 px) ; icône carrée d'au moins 64 × 64 px.

Sans image ici, les logos dessinés d'origine sont utilisés. Pour changer un **nom**, une **adresse** ou une **couleur** : `src/services.js`.
