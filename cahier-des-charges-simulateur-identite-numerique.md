# Cahier des charges — Simulateur « Identité numérique »
1ère SAPAT, TIM, séance du mardi 10 novembre 2026 (salle 205, 1h25 à 1h40)

## 1. Contexte

Séance 2 du bloc « démarches en ligne ». Les élèves sont **usagers**, pas aidantes : chacune joue un personnage adulte fictif et fait ses propres démarches. On ne saisit jamais de vraies données.

Objectifs de la séance :
- créer un compte sur un site officiel en retrouvant les bonnes informations dans ses papiers ;
- choisir un mot de passe, décider de l'enregistrer ou non dans le navigateur ;
- se connecter avec une double authentification (code à 6 chiffres reçu par mail) ;
- récupérer son compte après un oubli de mot de passe sans tomber dans un faux mail ;
- se connecter à un autre service avec un bouton de connexion unique (IdentiPass, équivalent fictif de FranceConnect).

Principe général : le simulateur reproduit la **complexité** des vrais sites (messages d'erreur vagues, règles cachées, codes qui expirent), pas leur **apparence**. Tous les noms, logos et documents sont inventés. Aucune aide intégrée ne donne la solution : l'aide, c'est le professeur.

**Si un simulateur existant (site fiscal fictif + mail + téléphone) est fourni, l'étendre plutôt que repartir de zéro.**

## 2. Contraintes techniques

- Un seul fichier HTML autonome (HTML + CSS + JS inline), aucune ressource externe, aucune connexion réseau.
- Fonctionne dans Chrome et Edge récents sur les postes du lycée (écran ~1366×768 minimum, à vérifier).
- État en mémoire uniquement (variables JS). Pas de dépendance à localStorage.
- Aucune donnée saisie n'est envoyée nulle part.
- **Données séparées du code** : personnage, documents, comptes, codes de passage et réglages de durée dans un objet `CONFIG` en tête de fichier, pour pouvoir ajouter d'autres personnages plus tard sans toucher à la logique.
- Les documents du trieur sont rendus en HTML/CSS à partir des données (pas d'images), avec un filigrane « SPÉCIMEN ».
- Bandeau discret permanent en haut : « Simulation pédagogique — aucun site réel ».

## 3. Disposition de l'écran

Quatre zones, toujours accessibles :

| Zone | Rôle |
| --- | --- |
| **Navigateur fictif** (zone principale) | Barre d'adresse avec adresses fictives, onglets si besoin. Affiche les sites. Propose « Enregistrer le mot de passe ? » comme un vrai navigateur. |
| **Boîte mail** « MaBoîte » | Liste de mails (expéditeur, objet, heure), lecture d'un mail, dossier « Indésirables ». Les liens dans les mails ouvrent la page correspondante dans le navigateur fictif. |
| **Téléphone** | Petit écran latéral : horloge fictive, notifications. Sert au bonus clé d'accès. |
| **Trieur de papiers** | Bouton « Mes papiers » ouvrant une vue avec pochettes à onglets. |

Plus un **champ « Code de passage »** (3 chiffres) toujours visible, discret.

## 4. Le personnage (CONFIG, un seul pour l'instant)

- **Martine Le Gall, née Kerjean**, 58 ans, mariée à Jean-Yves Le Gall.
- Date de naissance, adresse postale fictive (Bretagne), adresse mail `martine.legall@maboite.fr` (fictif).
- Numéro fiscal fictif à 13 chiffres commençant par 99 (visiblement inventé). Jean-Yves a **son propre** numéro fiscal, différent.
- Numéro de sécurité sociale fictif commençant par 9 (format invalide exprès).
- Comptes possédés au départ :
  - compte **NumérID** (fournisseur d'identité fictif, rôle de L'Identité Numérique La Poste), créé par sa fille. Identifiant = son adresse mail, mot de passe indiqué sur la carte personnage ;
  - **pas** de compte Santéa (assurance maladie fictive) ;
  - compte Fiscalis : **à créer pendant la séance**.

La carte personnage est imprimée (fiche élève) et peut aussi s'afficher dans le simulateur (bouton « Ma carte »).

## 5. Les sites fictifs

| Nom fictif | Rôle réel | Encadré « En vrai » |
| --- | --- | --- |
| **Fiscalis** (`fiscalis.gouv.sim`) | impots.gouv.fr | « En vrai : impots.gouv.fr, votre espace Particulier » |
| **Santéa** (`santea.gouv.sim`) | ameli.fr | « En vrai : le compte ameli de l'Assurance Maladie » |
| **IdentiPass** | FranceConnect | « En vrai : ce bouton s'appelle FranceConnect. Regardez sa forme sur votre fiche. » |
| **NumérID** | L'Identité Numérique La Poste | « En vrai : L'Identité Numérique La Poste » |
| **MaBoîte** | webmail type Gmail / Outlook | — |

Chaque encadré « En vrai » est un petit cartouche visible, de couleur différente du site, pour qu'on ne le confonde pas avec le contenu du site.

## 6. Parcours et comportements attendus

Les codes de passage débloquent l'étape suivante **et** servent de points de reprise : saisir le code d'une étape remet le simulateur dans l'état attendu au début de cette étape (compte créé, mails présents, etc.), au cas où le navigateur a été fermé ou qu'une élève est trop bloquée.

### Étape 0 — Démarrage
Écran d'accueil : consignes courtes, carte personnage, horloge fictive au « mardi 10 novembre, 13:20 ». Bouton « Commencer ».

### Étape 1 — Trouver ses papiers et créer son compte Fiscalis
**Trieur** : 4 pochettes (« Banque », « Santé », « Impôts », « Divers »), 6 à 7 documents. On clique pour ouvrir un document, zoom possible (texte volontairement petit).
- Avis d'imposition **de l'an dernier**, bien rangé dans « Impôts » (piège : mauvaise année, ancien numéro d'accès en ligne).
- Avis d'imposition **de cette année**, mal rangé dans « Divers ».
- Avis d'imposition **de Jean-Yves** (piège : numéro fiscal du conjoint).
- Échéancier de prélèvement fiscal (ressemble, ne contient pas ce qu'il faut).
- Courrier Santéa avec numéro de sécurité sociale (servira à l'étape 3).
- Un relevé bancaire et une facture quelconque (bruit).

Sur l'avis, plusieurs numéros coexistent (numéro fiscal, référence de l'avis, numéro de foyer, numéro d'accès en ligne). Il faut prendre les bons.

**Création du compte Fiscalis** : formulaire numéro fiscal + numéro d'accès en ligne + **nom de naissance** + date de naissance + adresse mail + mot de passe ×2.
- Mauvais numéro ou mauvaise année → « Les informations saisies ne permettent pas de vous identifier. » (vague, comme en vrai).
- Nom d'usage « Le Gall » saisi au lieu de « Kerjean » → même message vague.
- **Règles de mot de passe révélées une par une** après chaque refus (longueur, puis majuscule, puis chiffre, puis caractère spécial, puis « ne doit pas contenir votre nom »). Jauge de robustesse sous le champ. Une phrase de passe longue doit être acceptée.
- Confirmation différente du mot de passe → refus.
- Adresse mail différente de celle de la carte → le site affiche « Un mail vous a été envoyé » mais **rien n'arrive** dans MaBoîte.
- Le mail de confirmation arrive **dans « Indésirables »** (comportement réglable dans CONFIG : toujours / jamais / aléatoire).
- Clic sur le lien du mail → « Compte activé ».
- Juste après : le navigateur affiche « Enregistrer le mot de passe pour fiscalis.gouv.sim ? » [Enregistrer] [Jamais]. Le choix est mémorisé pour la suite.

→ **Code de passage n°1** donné par le professeur.

### Étape 2 — Se connecter, puis avoir oublié
**Connexion normale** : numéro fiscal + mot de passe (prérempli si enregistré), puis écran « Saisissez le code à 6 chiffres envoyé à m•••••@maboite.fr ». Le mail arrive dans MaBoîte.
- Le code **expire** au bout de 3 minutes (réglable) : « Ce code n'est plus valide. Demander un nouveau code ». L'ancien code ne marche plus après une nouvelle demande.
- Code faux → « Code incorrect ».
- Connexion réussie → espace personnel minimal (quelques rubriques, bouton « Se déconnecter »).

**Saut dans le temps** : après déconnexion, écran de transition plein écran :
> Trois semaines plus tard… Vous avez changé votre mot de passe Fiscalis depuis votre téléphone la semaine dernière, et vous ne l'avez noté nulle part.

- Le simulateur remplace réellement le mot de passe stocké.
- L'horloge passe au « mardi 1er décembre ».
- MaBoîte reçoit 6 à 8 mails « intermédiaires » (lettre d'information, promotion, notification de réseau social, mail d'un proche…) pour encombrer la boîte.
- Si le mot de passe avait été enregistré, le navigateur préremplit **l'ancien** : il ne marche plus.

**Tentatives** :
- « Identifiant ou mot de passe incorrect. » (sans dire lequel), puis « Il vous reste 1 essai. »
- Au 3e échec : « Compte temporairement bloqué. Réessayez dans 15 minutes. » (2 minutes réelles, réglable). Le lien « Mot de passe oublié » reste utilisable pendant le blocage.

**Mot de passe oublié** : saisie du numéro fiscal + adresse mail → mail de réinitialisation avec lien valable 10 minutes (réglable). Nouveau mot de passe : mêmes règles, et refus s'il est identique à l'ancien.

**Faux mail** (P2) : arrive quelques secondes après la demande de réinitialisation. Expéditeur à l'allure trompeuse (ex. `securite@fiscalis-gouv-sim.com`), objet urgent (« Votre compte sera suspendu sous 24 h »), bouton « Confirmer mes identifiants ». Le lien ouvre une page à l'adresse douteuse qui demande numéro fiscal + mot de passe. Si l'élève valide → **écran pédagogique** sans culpabiliser : ce qui vient de se passer, les indices qu'il fallait voir (adresse de l'expéditeur, adresse de la page, urgence, on ne demande jamais son mot de passe par mail). L'incident est noté pour le récapitulatif. L'élève peut reprendre là où elle en était.

→ **Code de passage n°2**.

### Étape 3 — Se connecter à Santéa avec IdentiPass
Santéa (assurance maladie fictive) : page de connexion avec deux options, « Créer un compte Santéa » (on ne la suit pas : la création renvoie « Un courrier avec votre code provisoire vous sera envoyé sous 5 jours », ce qui pousse à trouver autre chose) et le bouton **« S'identifier avec IdentiPass »**.

IdentiPass : choix du compte parmi Fiscalis, Santéa, NumérID et deux autres fournisseurs fictifs.
- **Fiscalis est grisé** pour ce service, avec la mention « Ce compte ne peut pas être utilisé pour se connecter à ce service. » (reproduit un vrai blocage : ameli n'accepte pas les identifiants impôts via FranceConnect).
- Santéa : « Vous n'avez pas de compte » si choisi.
- **NumérID** : il faut relire la carte personnage pour savoir qu'on en a un. Connexion avec identifiant + mot de passe de la carte, puis code à 6 chiffres par mail.
- **Écran de consentement** : « Santéa va recevoir : nom de naissance (Kerjean), nom d'usage (Le Gall), prénom, date et lieu de naissance, sexe. » [Continuer] [Annuler]. Encadré « En vrai » sous l'écran.
- Retour sur Santéa connectée : espace personnel minimal avec un message « Bienvenue Martine Le Gall ».

→ **Code de passage n°3**.

### Étape 4 — Récapitulatif (P2)
Écran de fin : liste des incidents rencontrés, sans note :
- nombre de mots de passe refusés à la création ;
- choix d'enregistrer ou non le mot de passe ;
- code expiré : oui/non ;
- compte bloqué : oui/non ;
- faux mail ouvert / identifiants saisis : oui/non ;
- mauvais document utilisé (avis de l'an dernier, avis du conjoint) : oui/non.

Plus un **code de fin** à 4 caractères qui encode ces incidents, que l'élève recopie sur sa fiche (permet au professeur une trace sans serveur ; table de décodage dans la fiche professeur).

### Bonus (P3) — Clé d'accès sur MaBoîte (groupe 1)
Dans MaBoîte : « Paramètres > Sécurité > Créer une clé d'accès ».
- Message : « Utilisez le code de déverrouillage de votre téléphone. » Le téléphone fictif affiche un écran de déverrouillage (code PIN donné sur la carte personnage).
- Ensuite, déconnexion puis connexion : « Se connecter avec une clé d'accès » → validation sur le téléphone, **aucun mot de passe saisi**.
- Encadré « En vrai » : « Google, Apple, Microsoft proposent les clés d'accès. Les sites publics (impôts, ameli) utilisent plutôt mot de passe + code par mail. Ne créez pas de clé d'accès sur un appareil partagé. »

## 7. Fonctions professeur

- Codes de passage et code de réinitialisation définis dans `CONFIG`.
- Réinitialisation complète : code `000` dans le champ, ou Ctrl+Alt+R.
- Durées réglables dans `CONFIG` : expiration du code mail (3 min), blocage du compte (2 min), validité du lien de réinitialisation (10 min), délai d'arrivée des mails (2 à 8 s, aléatoire, pour faire réaliste).
- Option « mail de confirmation dans Indésirables » : toujours / jamais / aléatoire.
- Fiche professeur générable (bouton caché ou section commentée) : les codes, les bonnes réponses (numéro fiscal, nom de naissance, compte à utiliser), la table de décodage du code de fin.

## 8. Ce qu'il ne faut pas faire

- Pas de logo, couleur ou nom proche d'un vrai service (pas de bleu-blanc-rouge façon FranceConnect, pas de Marianne).
- Pas de bouton d'aide qui donne la solution. Les messages d'erreur restent vagues, comme sur les vrais sites.
- Pas de son, pas d'animation inutile.
- Pas de sauvegarde entre deux séances.

## 9. Priorités pour ce soir

| Priorité | Contenu |
| --- | --- |
| **P1 indispensable** | Structure 4 zones, CONFIG, personnage, trieur avec ses documents, création du compte Fiscalis avec règles révélées et mail de confirmation, connexion avec code mail qui expire, saut dans le temps avec mot de passe changé, blocage au 3e essai, mot de passe oublié, codes de passage et reprise, réinitialisation professeur |
| **P2 souhaitable** | Étape IdentiPass complète, proposition d'enregistrement du mot de passe et préremplissage de l'ancien, faux mail avec écran pédagogique, mails intermédiaires, encadrés « En vrai », récapitulatif et code de fin |
| **P3 bonus** | Clé d'accès sur MaBoîte, plusieurs personnages sélectionnables |

Si le temps manque, la séance reste jouable avec P1 seul : l'étape IdentiPass peut être remplacée demain par une démonstration collective au vidéoprojecteur.

## 10. Tests à faire avant la séance

- Parcours complet « élève appliquée » en moins de 50 minutes.
- Parcours « élève qui fait tout de travers » : mauvais avis, mauvaise adresse mail, mot de passe insistant, faux mail cliqué. Rien ne doit bloquer définitivement : chaque impasse a une sortie (ou un code de reprise).
- Chaque code de passage remet bien dans l'état attendu.
- Ouverture sur un poste du lycée sans connexion, dans Chrome et Edge.


---

## Évolution du 10/11/2026 : identité numérique vérifiée et IdentiPass+

Objectif : faire vivre dans le simulateur ce que le cours explique sur FranceConnect+ et les identités numériques vérifiées.

**Idée directrice.** IdentiPass est une porte, les comptes sont des clés. Un compte Fiscalis ou Santéa prouve qu'on a reçu un courrier. Une identité numérique vérifiée (NumérID, CartID) prouve que la pièce d'identité a été contrôlée, et elle est liée au téléphone de la personne. IdentiPass+ n'accepte que ces identités.

**Ce qui change.**

1. **NumérID devient une identité numérique vérifiée.** Plus de mot de passe ni de code par mail. On saisit son identifiant (adresse mail ou numéro de mobile), puis on confirme **sur le téléphone** : « Est-ce bien vous ? », puis code secret à 4 chiffres (sur le post-it, différent du code du téléphone). Trois codes faux annulent la demande ; on peut en renvoyer une.
2. **Le téléphone devient un outil central.** Il s'agrandit quand une application attend une réponse.
3. **Carte du personnage.** Le post-it ne dit plus que le compte a été créé par Gwenaëlle avec un mot de passe : Martine a créé son identité elle-même, avec l'aide de sa fille, au point d'accueil. Le code secret reste sur le post-it (mauvais réflexe à commenter). La carte précise que sa carte d'identité est l'ancien modèle.
4. **IdentiPass propose 6 comptes** : Fiscalis, Santéa, NumérID, Agrimut, CartID (nouveau, équivalent de France Identité), IdNomade. CartID est une impasse : il faut scanner un code avec une application que Martine n'a pas.
5. **Lien « Utiliser Aidants Relais »** sous les tuiles (équivalent d'Aidants Connect) : page d'information, pour annoncer la séance « Accompagner un tiers ».
6. **Nouvelle étape 4, courte : FormaCompte** (équivalent de Mon Compte Formation). La connexion se fait uniquement avec **IdentiPass+**. Seuls NumérID et CartID sont proposés ; Fiscalis, Santéa, Agrimut et IdNomade sont affichés comme « non acceptés » et répondent « Niveau de garantie insuffisant ». Fin de l'étape : demande d'inscription envoyée pour la formation de Quimper.
7. **Demande de connexion inattendue** (étape 4, réglable dans `CONFIG.fausseDemande`) : le téléphone affiche une demande pour un site que Martine n'a pas ouvert. Bonne réponse : refuser. Si elle confirme, un écran explique l'erreur, sans reproche.
8. **Lien sponsorisé « Vos droits formation expirent bientôt ! »** dans Trouvo : même piège payant que pour les impôts et la santé.

**Codes de passage.** 318 et 574 ne changent pas. **926** mène maintenant à l'étape 4 (au lieu du récapitulatif). **451** (nouveau) mène au récapitulatif ; on peut le donner dès la fin de l'étape 3 si le temps manque.

**Récapitulatif et code de fin.** Quatre lignes ajoutées : code secret NumérID faux, compte refusé essayé sur IdentiPass+, demande inattendue (acceptée, refusée, sans réponse, pas reçue), étape 4 terminée. Le code de fin passe de 4 à **5 caractères** : la 4e position est une lettre qui code ces quatre informations ; le chiffre de contrôle passe en 5e position. La table de décodage est dans la fiche professeur (Ctrl+Alt+P).

**Textes retirés.** Les cartouches ne renvoient plus à « votre fiche » : il n'y a plus de fiche à remplir pendant la séance.

### Complément : bouton « Recommencer l'étape » et droits à la formation

- **Bandeau du haut : bouton « ↺ Recommencer l'étape »** (étapes 1 à 4). Après confirmation, le poste revient au début de l'étape en cours. Ce qui a déjà été relevé pour le récapitulatif est conservé. À l'étape 2, on repart avant le saut dans le temps.
- **FormaCompte : les droits baissent à chaque demande d'inscription.** Une demande pour une autre formation peut donc empêcher de s'inscrire à la bonne. Deux sorties : **Mon espace › Mes dossiers › Annuler ma demande** (les droits reviennent), ou le bouton « Recommencer l'étape ».
- **La mission** s'affiche sur deux lignes quand le bandeau est trop étroit.
