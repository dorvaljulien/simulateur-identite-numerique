# Corrigé et grille — Évaluation « Démarches en ligne et identité numérique »

*1ère SAPAT, informatique (TIM). Fichier élève : `evaluation-demarches.html` (version 1.0, 15/11/2026). Ce document sert à corriger les copies exportées (`.json`). Il ne doit jamais être donné aux élèves.*

## 0. Mode d'emploi pour la correction

- Chaque copie est un fichier JSON. Champs utiles : `variante` (A ou B), `idCopie`, `reponses` (parties 1A à 2D), `simulateur.resultats` (réflexes du 2D, déjà calculés), `simulateur.evenements` (frise des clics), `simulateur.compteurs`.
- Les items sont repérés par un identifiant stable (`A1`…`A7`, `B1`…`B7`, `m1`…`m6`, `c1`…`c8`). L'ordre d'affichage (`ordreAffiche`) change d'une copie à l'autre et ne compte pas.
- Réponse vide = 0. On ne pénalise pas l'orthographe. Une justification juste mais maladroite compte, à condition qu'elle s'appuie sur un indice ou une idée du cours.
- Barème sur 20 : 1A 3,5 · 1B 4,5 · 2A 1,5 · 2B 1,5 · 2C 2 · 2D 7.

## 1. Écarts avec le cahier des charges (décidés le 15/11/2026)

- **1A, carte « officiel mais payant »** : remplacée dans les deux variantes, pour ne plus donner d'indice sur le 1B. A3 du cahier (carte grise, taxe régionale) devient A6 « Permis de conduire perdu : duplicata — timbre fiscal de 25 € » (permisdeconduire.ants.gouv.fr). Le timbre fiscal du passeport à 86 € devient B6 « Carte d'identité perdue ou volée : timbre fiscal de 25 € » (timbres.impots.gouv.fr). Les deux montants ont été vérifiés : 25 € dans les deux cas.
- **2C, variante A** : « code à 6 chiffres reçu par mail » devient « code à 6 chiffres reçu par **SMS** ».
- **1B** : la « situation 3 » du cahier des charges s'affiche **« Situation 2 »** pour les élèves. Dans l'export, la clé est `situation2`.

## 2. Partie 1A — Site officiel ou site à éviter ? (3,5 pts)

Par carte : choix juste 0,25 + justification valable 0,25. Une justification n'est valable que si elle s'appuie sur un **indice** : l'extension, un organisme public connu, « Sponsorisé » + frais, l'urgence ou la menace, une adresse illisible. « L'IA dit que c'est officiel » ne suffit pas. Une justification fausse ou sans indice vaut 0, même si le choix est juste. Si le choix est faux, la justification ne rapporte rien.

| Compétence | Variante A | Variante B | Réponse | Indices valables |
|---|---|---|---|---|
| Organisme public en .fr | **A1** MSA, www.msa.fr | **B1** L'Assurance retraite, www.lassuranceretraite.fr | officiel | organisme public connu (MSA / Assurance retraite) ; « certains organismes publics sont en .fr » |
| SMS pressant | **A2** SMS permis, permis-renouvellement.info | **B2** SMS amende, amendes-paiement.net | à éviter | urgence/menace (72 h, amende, majoration) ; extension .info/.net ; on ne clique pas sur un SMS pressant |
| Intermédiaire sponsorisé | **A3** Sponsorisé, actes-naissance-express.fr, 29,90 € | **B3** Sponsorisé, casier-express-france.com, 24,90 € | à éviter | « Sponsorisé » ; frais ; pas en .gouv.fr ; la démarche officielle est gratuite (acte de naissance, extrait de casier) |
| IA qui donne le bon lien | **A4** IA → www.caf.fr | **B4** IA → www.francetravail.fr | officiel | la CAF / France Travail sont des organismes publics connus, ce qu'on peut vérifier (adresse, service-public.gouv.fr). **« L'IA le dit » seul = 0** |
| « gouv » dans le nom, mauvaise extension | **A5** groupe Facebook, prime-chauffage-gouv.fr | **B5** story Instagram, cheque-energie-gouv-aide.com | à éviter | « gouv » dans le nom ne suffit pas : l'extension (juste avant le premier « / ») est .fr/.com, pas .gouv.fr ; lien vu sur un réseau social |
| Officiel mais payant (timbre) | **A6** permisdeconduire.ants.gouv.fr, timbre 25 € | **B6** timbres.impots.gouv.fr, timbre 25 € | officiel | extension .gouv.fr ; il s'agit d'un timbre fiscal (taxe prévue par la loi), pas de « frais de dossier » |
| Adresse illisible | **A7** SMS, bit.ly/3kR9xQ | **B7** flyer, tinyurl.com/aide-senior26 | à éviter | lien raccourci : on ne voit pas la vraie adresse ; (A7 : SMS sur un dossier) ; (B7 : papier non officiel) |

Dans l'export, `choix` vaut `"officiel"` ou `"a-eviter"`.

**Cas limites (décidés le 15/11/2026, après la copie test) :**

- « L'adresse est bizarre » (A7/B7) : accepté (0,25), l'élève pointe bien l'adresse illisible.
- « Une emoji » / « il y a des emojis » (A5/B5 ; la carte A5 contient un 👉) : **0**. Un emoji seul n'est pas un indice de la liste. Accepter seulement si l'élève le relie à la forme du message (« post de réseau social, pas un site officiel », « ton publicitaire / urgent »).
- « Ça ne finit pas par gouv.fr » sur A1/B1 : choix faux, donc 0 ; c'est l'erreur visée par la carte (règle « .gouv.fr ou rien » appliquée à la lettre).

## 3. Partie 1B — Que dire à la personne ? (4,5 pts)

Clés d'export : `situation1` {dire, questions, ensuite}, `questionFlash`, `situation2` {dire, questions, ensuite}.

### Situation 1 (2 pts) — « payant, donc arnaque ? »

- A : carte grise après l'achat d'une voiture d'occasion (changement de titulaire).
- B : refaire son passeport.

| Élément attendu | Pts |
|---|---|
| **Tout de suite** : ne tranche pas sans informations (« pas forcément », « on va vérifier ensemble ») | 0,5 |
| **Questions** (au moins deux pertinentes) : l'adresse du site ; le montant ; l'intitulé du paiement (taxe / timbre fiscal, ou « frais de dossier / de service ») ; comment le site a été trouvé (pub, résultat « Sponsorisé », SMS) | 0,5 (0,25 si une seule) |
| **Ensuite, selon les réponses** : site en .gouv.fr + taxe ou timbre = normal, on peut payer ; « frais de service » sur un autre site = site à éviter, on va sur le site officiel (par service-public.gouv.fr) | 1 (0,5 si un seul des deux cas) |

**Cas limite** : « C'est normal de payer » / « il faut payer la carte grise » dans « Tout de suite » vaut **0**, même si le fait est vrai : l'élève tranche avant de savoir sur quel site la personne a payé. C'est précisément le réflexe évalué.

Faits utiles : le changement de titulaire d'une carte grise est soumis à une taxe (régionale, selon la puissance) ; le timbre fiscal d'un passeport adulte coûte 86 €. Un élève qui cite ces faits montre une bonne maîtrise, mais ils ne sont pas exigés.

### Question flash (0,5 pt)

- A : « Il existe une liste des vrais sites ? » ; B : « Il y a un endroit où chercher ? »
- Attendu : **service-public.gouv.fr** (partir de là pour trouver le bon site). Accepter « service-public.fr » ou « le site Service public ». « Un site du gouvernement » ou « les .gouv » sans nommer le site : 0,25. « Sur Google » : 0.

### Situation 2 (2 pts) — « déjà payé, trop cher »

- A : passeport, 159 € payés en ligne. Le timbre officiel coûte 86 €, donc elle est passée par un site non officiel.
- B : changement d'adresse sur la carte grise, 44,90 € payés. C'est gratuit (jusqu'au 3e changement), donc elle est passée par un site non officiel.

| Élément attendu | Pts |
|---|---|
| Rassurer sans juger (« ça arrive souvent », « on va voir ensemble ») | 0,25 |
| Questions : sur quel site ; ce qui a été payé (intitulé) ; si la démarche a avancé ; si la carte bancaire a été donnée (au moins deux) | 0,5 (0,25 si une seule) |
| Garder les preuves (mails, factures, captures) | 0,25 |
| Signaler sur SignalConso | 0,25 |
| Si la carte bancaire a été donnée à un site douteux : appeler la banque (opposition) ; accepter le 33700 pour signaler un SMS | 0,25 |
| Vérifier la démarche et, si besoin, la refaire sur le site officiel | 0,25 |
| Identifie que le montant ne correspond pas au prix officiel (86 € ; gratuit) | 0,25 |

**Cas limites** : « Le passeport, c'est gratuit » (variante A) est faux : 0 sur la ligne « montant », et pas de point « rassurer » si c'est la seule chose dite. « Signaler le problème » sans dire où : 0 sur la ligne SignalConso.

## 4. Partie 2A — Mots de passe (1,5 pt)

Identifiants : `m5` gestionnaire de mots de passe · `m3` recette · `m1` carnet à la maison · `m6` même mot de passe long partout · `m4` fichier mdp.txt sur le bureau · `m2` prénom de l'enfant + année partout.

Seules les paires solides sont notées (1 pt, 0,25 chacune) :

- `m5` (gestionnaire) classé **1er** ;
- `m2` (prénom + année) classé **dernier** ;
- `m6` (même mot de passe partout) classé **sous** `m3` (recette) ;
- `m6` classé **sous** `m1` (carnet).

Le reste de l'ordre est libre (le fichier mdp.txt peut se discuter). Le champ `classementModifie: false` signale un élève qui n'a pas touché à l'ordre de départ (aléatoire).

Justification (0,5) : si un site est piraté ou si le mot de passe fuite, **tous les comptes** sont ouverts d'un coup (un seul mot de passe à trouver). 0,25 si l'idée est floue (« c'est moins sécurisé »).

**Cas limite** : la consigne est « Pourquoi utiliser le même mot de passe partout est-il dangereux ? ». « C'est facile à deviner » vaut **0** : l'élève confond avec `m2` (le mot de passe `m6` est long et compliqué, le risque n'est pas qu'on le devine).

## 5. Partie 2B — Définir la double authentification (1,5 pt)

| Élément | Pts |
|---|---|
| Il faut **deux preuves** pour se connecter | 0,5 |
| De **types différents** (ce que je sais / ce que j'ai / ce que je suis) | 0,5 |
| Exemple correct : mot de passe + code reçu par SMS sur son téléphone ; carte + code ; mot de passe + validation dans une appli | 0,5 |

« Deux mots de passe » comme exemple = exemple faux (0 sur la ligne exemple, et la ligne « types différents » n'est pas acquise si rien d'autre ne la montre).

**Réponses implicites** : « Il faut vérifier sur son téléphone » sans parler d'une première preuve n'acquiert **pas** la ligne « deux preuves ». Un exemple du type « je me connecte à Insta et je reçois un code par SMS » est accepté (0,5) : la connexion suppose le mot de passe.

## 6. Partie 2C — Est-ce de la double authentification ? (2 pts)

8 × 0,25. Pour les situations ★ (`c1` et `c5`), le point n'est donné que si la réponse **et** la justification sont justes (types de preuves).

| Id | Variante A | Variante B | Réponse | Raison |
|---|---|---|---|---|
| c1 ★ | Deux mots de passe différents | Mot de passe + code à 4 chiffres choisi | **Non** | deux choses que je **sais** : un seul type de preuve |
| c2 | Mot de passe + question secrète | Mot de passe + date de naissance | **Non** | deux choses que je sais (la date de naissance est en plus connue de beaucoup) |
| c3 | Mot de passe + « Je ne suis pas un robot » | idem | **Non** | la case vérifie qu'on est humain, elle ne prouve pas qui on est |
| c4 | Mot de passe + code à 6 chiffres reçu par SMS | Mot de passe + validation dans l'appli de la banque | **Oui** | ce que je sais + ce que j'ai (le téléphone) |
| c5 ★ | Payer en magasin avec carte + code | Retirer au distributeur avec carte + code | **Oui** | ce que j'ai (la carte) + ce que je sais (le code) |
| c6 | Paiement sans contact, sans code | idem | **Non** | une seule preuve (la carte) |
| c7 | Déverrouiller le téléphone avec l'empreinte | … avec le visage | **Non** | une seule preuve (ce que je suis) |
| c8 | Identité numérique : appli du téléphone + code secret | … appli du téléphone + empreinte | **Oui** | ce que j'ai (le téléphone) + ce que je sais (A) / ce que je suis (B) |

Dans l'export, `reponse` vaut `"oui"` ou `"non"`.

**Cas limite** : pour c1, « c'est pareil qu'un seul mot de passe » est accepté (l'idée « un seul type de preuve » est là).

## 7. Partie 2D — Simulateur IdentiPass+ (7 pts)

### Correspondances (non affichées aux élèves)

| Fictif | Rôle réel |
|---|---|
| Trouvo | moteur de recherche |
| HabitatAdapt (habitat-adapt.gouv.sim) | France Rénov' / MaPrimeAdapt' |
| IdentiPass / IdentiPass+ | FranceConnect / FranceConnect+ |
| NumérID | L'Identité Numérique La Poste |
| CartID | France Identité |
| Fiscalis, Santéa | impots.gouv.fr, ameli.fr |
| Adapt'Senior Dossier (adapt-senior-dossier.fr) | intermédiaire payant (49 €) |

Données de Mme Prigent : numéro fiscal **99 38 471 205 316** ; code secret NumérID **582914** ; carte d'identité ancien modèle (pas de CartID possible). Demande pirate : **Fiscalis** (A), **Santéa** (B). Ordre des incidents après le dépôt : A appel puis SMS ; B SMS puis appel. SMS de frais : A 12,90 €, habitat-adapt-frais.com ; B 14,50 €, habitatadapt-validation.net.

### Prédiction (1 pt) — `reponses.2D.prediction`

| Élément | Pts |
|---|---|
| **NumérID** va fonctionner : c'est une identité numérique vérifiée, sur son téléphone | 0,4 |
| Fiscalis et Santéa ne marchent pas : ce sont des comptes à **mot de passe**, refusés par IdentiPass+ (« porte blindée ») | 0,3 |
| CartID impossible : sa carte d'identité est l'**ancien modèle** cartonné | 0,3 |

### Réflexes (3,5 pts) — lire `simulateur.resultats`

| Réflexe | Pts | Où lire |
|---|---|---|
| Site officiel atteint sans payer l'intermédiaire | 0,5 | `siteOfficielAtteintSansPayer: true`. Cliquer sur la pub sans payer n'est pas pénalisé (voir `resultatSponsoriseClique`). |
| NumérID choisi, au plus un essai raté avant | 0,5 | `numeridChoisi: true` et `essaisRatesAvantNumerid` ≤ 1 (essais ratés = « ancien identifiant » + CartID). 0,25 si 2 essais ratés ou plus. |
| Numéro fiscal correct | 0,25 | `numeroFiscalCorrect: true` (espaces ignorés) |
| Demande pirate refusée | 0,75 | `demandePirate.reponse` : `"refusee"` 0,75 ; `"ignoree"` 0,25 (aucun dommage, mais pas de réaction) ; `"refusee"` avec `confirmeeAuMoinsUneFois: true` et sans code saisi : 0,5 ; `"confirmee"` 0 ; `"non-envoyee"` : voir plus bas. |
| Code non lu au faux conseiller | 0,75 | `appelFauxConseiller` : `"raccroche"`, `"rappel-plus-tard"`, `"refuse"`, `"sans-reponse"` → 0,75 ; `"code-lu"` → 0 |
| Frais du SMS non payés | 0,5 | `smsFrais.paye: false`. Cliquer sur le lien sans payer (`lienClique: true`) n'enlève pas de points, mais mérite une remarque. |
| Déconnexion | 0,25 | `deconnexion: true` (idéalement `deconnexionApresDepot: true`) |

**Démarche inachevée.** Si `demandeDeposee: false`, les incidents n'ont pas eu lieu (`"non-survenu"`). Les lignes numéro fiscal, code non lu et frais non payés valent alors 0 : ces réflexes n'ont pas été démontrés. La demande pirate n'arrive qu'une fois l'écran de consentement atteint. Si `"non-envoyee"`, la ligne vaut 0.

Le temps passé dans le simulateur est dans `dureeSimulateur` (secondes).

### Questions de fin (2,5 pts) — `reponses.2D.questionsFin`

**Q1 (1,25)** — A : M. Le Bris, compte Fiscalis seulement ; B : Mme Tanguy, compte Santéa seulement.

| Élément | Pts |
|---|---|
| Son compte à mot de passe n'est **pas accepté** par IdentiPass+ pour cette démarche | 0,5 |
| Il lui faut une **identité numérique vérifiée** : NumérID (appli + pièce d'identité + smartphone) ou CartID (carte d'identité nouveau format + certification en mairie) | 0,5 |
| Sinon : faire la demande **par courrier** (ou se faire accompagner) | 0,25 |

**Q2 (1)** — A : Laura (aide à domicile) demande le code secret ; B : Sophie (sa fille) veut installer l'identité de sa mère sur son téléphone.

| Élément | Pts |
|---|---|
| Refus clair (« non ») | 0,25 |
| L'identité numérique est **personnelle**, liée à la personne et à **son** téléphone ; on ne donne jamais son code secret | 0,25 |
| **Faire avec, pas à la place** : l'aider à faire la démarche à côté d'elle | 0,25 |
| A : pour une professionnelle, **Aidants Connect** avec un mandat. B : toute solution légale citée (accompagner en sa présence, Aidants Connect par un professionnel, demande par courrier) | 0,25 |

**Cas limite** : « On ne doit pas faire à la place des gens » seul : 0,25 (ligne « faire avec ») + 0,25 (refus, implicite mais sans ambiguïté) = 0,5.

**Q3 (0,25)** — IdentiPass+ = **FranceConnect+** ; NumérID = **L'Identité Numérique La Poste** ; CartID = **France Identité**. Accepter les orthographes approchantes (« France connect + », « identité numérique de La Poste »). 0,25 si les trois sont justes, 0,1 si deux. *Question de mémorisation, peu discriminante : ne pas en tirer de conclusion sur le niveau de l'élève.*

### Journal du simulateur (analyse, non noté)

Chaque clic sur un élément cliquable est enregistré dans `simulateur.evenements` : `t` (temps depuis l'ouverture du simulateur), `zone` (`navigateur`, `telephone`, `barre`), `cible`, `categorie`. Les touches du clavier du code secret et les clics dans les champs du formulaire ne sont pas enregistrés un par un : seuls les codes faux et le dépôt le sont. Les compteurs sont dans `simulateur.compteurs`.

- **utile** : étape du parcours attendu. `lancer-recherche`, `resultat-officiel` (et ses liens), `deposer-une-demande`, `ha-mon-espace`, `bouton-identipass-plus`, `identipass-numerid`, `numerid-confirmer`, `consentement-continuer`, `envoyer-demande`, `demande-pirate-refuser`, `appel-raccrocher`, `appel-demander-nom-rappeler`, `se-deconnecter`.
- **piege** : `resultat-sponsorise`, `paiement-intermediaire`, `ancien-identifiant`, `identipass-cartid`, `code-numerid-faux` (un par code faux), `demande-pirate-confirmer`, `appel-lire-le-code`, `lien-sms-frais`, `paiement-frais-sms`.
- **sans-objet** : menus et liens décoratifs (onglets Trouvo, actualités, blog, forum, menus et pied de page HabitatAdapt, avis de l'intermédiaire, applis Météo / Photos / Agenda / Radio / Réglages, anciens messages et appels, boutons du navigateur ☆ ⤓ 👤 ⋮). Un nombre élevé repère l'élève qui clique un peu partout. Non noté.
- **neutre** (ajouté au cahier des charges) : navigation sans enjeu. Précédent / suivant / actualiser, « Ma carte », ouverture des applis Messages / NumérID / Téléphone et des notifications, décrocher ou refuser l'appel, « J'ai terminé la démarche ».
- **evenement** (pas un clic) : faits marquants, avec parfois un `detail`. `paiement-intermediaire-49`, `demande-numerid-habitatadapt` (notification reçue), `numerid-habitatadapt-confirmee/refusee`, `numerid-bloquee`, `demande-pirate-fiscalis` / `demande-pirate-santea` (reçue), `demande-pirate-confirmee/refusee/code-saisi/ignoree`, `connexion-habitatadapt`, `formulaire-incomplet`, `demande-deposee` (avec l'exactitude du numéro fiscal), `sms-frais-recu`, `paiement-frais-sms`, `appel-entrant`, `appel-sans-reponse`, `appel-code-lu` / `appel-raccroche` / `appel-rappel-plus-tard`, `deconnexion`, `fin-demarche`.

## 8. Note pour le professeur

**Codes** (modifiables dans l'objet `CONFIG`, en tête du fichier) :

- `4172` → variante A ; `8395` → variante B.
- `0000` saisi dans le champ « Code de séance » → tout effacer (avec confirmation).
- **Ctrl+Alt+R** à tout moment → tout effacer (avec confirmation).

**Postes partagés.** Une copie commencée est sauvegardée dans le navigateur. Si l'onglet est fermé, l'élève ressaisit le code et clique sur « Reprendre la copie en cours ». Si un élève de l'autre groupe arrive sur un poste où une copie non exportée existe, le message « Appelez le professeur » s'affiche : exporter la copie si besoin, puis `0000`. Une copie déjà exportée est remplacée automatiquement. Le bouton « Terminer », après l'export, efface la copie du poste.

**Reprise dans le simulateur.** Après un rechargement, l'élève revient à la dernière page du navigateur. Les choix déjà faits et le journal sont conservés. Un appel en cours recommence à sonner.

**Réglages du simulateur** (`CONFIG.simulateur`) : notification NumérID 2 s ; demande pirate 8 s après l'écran de consentement (ou juste après le dépôt si l'élève a été plus rapide) ; blocage de NumérID 2 min après 3 codes faux ; premier incident 5 s après le dépôt, le second 6 s après la fin du premier ; si l'élève ne répond pas ou refuse l'appel, le faux conseiller rappelle une fois. Si l'élève clique sur « J'ai terminé la démarche » avant les incidents, ceux-ci se déclenchent tout de suite (« Votre téléphone vibre »).

**À tester avant le jour J :**

1. Ouvrir le fichier en local (double-clic) dans Chrome **et** Edge sur un poste du lycée, en plein écran, en 1366×768.
2. Taper `4172` puis `8395` : vérifier la variante (lettre affichée sur l'écran de fin, et identifiant de copie en haut à droite).
3. « Exporter ma copie » : vérifier que la fenêtre d'enregistrement s'ouvre et qu'on peut choisir le dossier commun. Si elle ne s'ouvre pas, le fichier part dans « Téléchargements » : prévoir de le déplacer. Vérifier que l'outil d'anonymisation accepte le `.json`.
4. Fermer l'onglet en cours de route, rouvrir, ressaisir le code : « Reprendre la copie en cours ».
5. Faire `0000` (ou Ctrl+Alt+R) entre les deux groupes.
6. Faire un parcours complet du simulateur (compter 10 à 15 min pour un élève).
7. 2A : le classement se fait avec les flèches ↑ ↓. Sur la copie test, la partie 2A a duré 20 min contre 2 min pour la 1A (pause du professeur ou difficulté réelle ?) : vérifier en séance que les élèves comprennent le principe des flèches.
8. Prévoir le temps : la copie test (professeur qui connaît le parcours) a pris 32 min, dont 3 min de simulateur. Un élève fragile à l'écrit mettra nettement plus longtemps sur 1A, 1B et 2B.

## 9. Copie test (15/11/2026)

Copie `N7EP7HPC`, variante A, passée par le professeur en simulant un élève de niveau moyen bas. Note obtenue avec cette grille : **≈ 8,3 / 20** (1A 2,5 · 1B 1,5 · 2A 0,5 · 2B 0,5 · 2C 1 · 2D 2,3). Profil cohérent : règle « .gouv.fr ou rien » (A1 faux), « double authentification = code SMS » (2B, c2, c3, c5, c7), réflexes techniques acquis dans le simulateur mais pas les réflexes de méfiance (demande pirate confirmée, code lu, frais payés, pas de déconnexion). Compteurs du journal vérifiés : 8 utiles, 5 pièges, 12 neutres, 25 au total.
