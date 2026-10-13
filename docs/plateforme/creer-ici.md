# « Créer ici » — l'atelier de création à plusieurs

Spécification fonctionnelle · version 2 · 12 oct. 2026

## L'idée en une phrase

Un membre propose un outil à construire. Il en devient le **porteur de projet (CDP)**, réunit une équipe, mène le projet jusqu'à la mise en ligne, et le projet reçoit le label **« Créé ici »**.

## Les règles de base

- Seul un membre connecté avec GitHub peut proposer un projet ou y participer.
- Le **porteur** gère l'équipe, valide les contributions et décide de la mise en ligne.
- Un **co-porteur est obligatoire** pour passer le projet en « En cours ». Il est prévenu de son rôle et doit l'accepter explicitement.
- À la création du projet, le porteur lit et accepte les **règles de continuité** (voir § 9 bis) et télécharge ses **codes de récupération**.
- Un projet mis en ligne reçoit le label **« Créé ici »**.
- Chaque participant peut l'afficher comme **5ᵉ projet bonus** sur sa fiche du showroom. Seuls les projets « Créé ici » peuvent occuper cette place.
- Pour l'afficher en bonus, il faut **avoir été membre de l'équipe au moment de la mise en ligne**, avec au moins une mission terminée.

## Le parcours d'un projet

```
Proposition → Recrutement → Cadrage → Réalisation → Recette → Mise en ligne → Rétrospective
```

| Étape | Ce qui se passe | Qui décide | Sortie attendue |
|---|---|---|---|
| 1. Proposition | Le porteur remplit la fiche projet | Porteur, puis validation par l'admin (anti-spam) | Fiche publiée, statut « Recrute » |
| 2. Recrutement | Les membres candidatent sur un rôle et le porteur accepte | Porteur | Équipe constituée |
| 3. Cadrage | Réunion de lancement, découpage en missions, calendrier | Porteur avec l'équipe | Charte d'équipe signée, missions et jalons créés |
| 4. Réalisation | Travail par cycles de 1 à 2 semaines | Chaque responsable de mission | Missions terminées, PR fusionnées |
| 5. Recette | Tests, revue de sécurité, relecture | Porteur et un relecteur | Checklist de mise en ligne cochée |
| 6. Mise en ligne | Le porteur publie sur le site | Porteur, puis vérification par l'admin | Label « Créé ici », fiche dans le showroom |
| 7. Rétrospective | Bilan, remerciements, suite éventuelle | Toute l'équipe | Fiche de rétrospective, crédits figés |

États possibles d'un projet : `Brouillon`, `Recrute`, `En cours`, `En pause`, `En recette`, `En ligne`, `Archivé`.

## Les éléments indispensables

### 1. La fiche projet (proposition)

| Champ | Pourquoi |
|---|---|
| Nom et pitch (1 phrase) | Donner envie en 5 secondes |
| Problème résolu, pour qui | Garder le cap |
| **Objectif mesurable** (ex. « 50 utilisateurs en 1 mois ») | Savoir quand c'est réussi |
| Périmètre : ce qu'on fait / **ce qu'on ne fait pas** | Éviter que le projet gonfle sans fin |
| Rôles recherchés (front, back, design, test, contenu…) et nombre de places | Recruter les bons profils |
| Engagement attendu (heures/semaine) et durée estimée | Éviter les malentendus |
| Niveau (débutant bienvenu / intermédiaire / avancé) | Inclure sans décevoir |
| Outils prévus (liés au catalogue) | Cohérence technique |
| **Licence** choisie dès le départ (MIT conseillée) | Éviter tout conflit sur la propriété du code |
| Canal de discussion (lien Telegram, Signal ou Discord du groupe) | Échanger hors de la plateforme |

### 2. L'équipe et les rôles

- **Porteur (CDP)** : anime l'équipe, priorise, accepte les membres, publie. Il est le seul à pouvoir mettre en ligne.
- **Co-porteur** (obligatoire) : assure l'intérim si le porteur est injoignable, selon la procédure du § 9 bis. Il ne peut **jamais** prendre le rôle de porteur seul.
- **Contributeurs** : prennent des missions.
- **Relecteur** : au moins une personne différente de l'auteur relit chaque PR.
- Les **candidatures** passent par un court message (« pourquoi moi, ce que je sais faire, mon temps dispo »). Le porteur répond sous 7 jours.

### 3. La charte d'équipe (signée au cadrage)

Elle complète la charte de la plateforme et se signe en un clic par chaque membre :
- le temps que chacun s'engage à donner ;
- le canal principal et le délai de réponse attendu (ex. 48 h) ;
- les règles de code : branches, PR, relecture obligatoire, pas de secrets dans le dépôt ;
- la **transparence sur l'IA** : on indique quand un code est généré et on le relit avant de le fusionner ;
- la manière de prendre les décisions (consensus, sinon le porteur tranche) ;
- la manière de quitter le projet (prévenir et transmettre ses missions).

### 4. Les missions

Une mission correspond à une **issue GitHub** du dépôt du projet, synchronisée avec la plateforme. On ne réinvente pas un outil de tickets.
- Titre, description, critères de fin (« c'est fini quand… »)
- Responsable (un seul), estimation (S/M/L), échéance
- Statut : `À faire`, `En cours`, `En revue`, `Terminée`
- Lien vers la PR qui la termine

### 5. Le calendrier

- **Jalons** : cadrage, version testable (MVP), recette, mise en ligne.
- **Cycles** de 1 ou 2 semaines, chacun avec un objectif.
- **Réunions** planifiées, avec export `.ics` vers l'agenda de chacun.
- Une vue frise montre l'avancement par rapport au plan.

### 6. Les fiches de réunion

Le modèle est prérempli, et le porteur ou un volontaire le complète :
- date, participants (pseudos), **météo de chacun** (☀️ ⛅ 🌧️) ;
- ordre du jour ;
- **décisions prises** ;
- **actions** : quoi, qui, pour quand. Chaque action devient une mission en un clic.

Les décisions importantes sont aussi reportées dans un **journal des décisions** du projet : date, décision, raison.

### 7. Le dépôt et le Git de chacun

- **Un dépôt par projet**, créé dans l'organisation GitHub de la plateforme, ou chez le porteur puis transféré à la mise en ligne.
- **Chaque membre** travaille sur sa propre branche ou son fork. La fiche projet affiche le lien vers le fork ou la branche de chacun, et ses PR.
- Règles de dépôt proposées automatiquement : branche `main` protégée, PR obligatoire, une relecture minimum, modèle de PR, fichier `CONTRIBUTING.md`.
- Les **contributions** sont calculées à partir de GitHub (PR fusionnées, relectures) et affichées par pseudo.

### 8. La checklist de mise en ligne

- [ ] L'objectif du projet est atteint ou explicitement revu.
- [ ] Le README explique quoi, pour qui et comment l'utiliser.
- [ ] La licence est présente et les crédits de l'équipe sont listés (pseudos).
- [ ] Aucun secret dans le dépôt, et un scan de sécurité est passé (ex. Prbl, Semgrep).
- [ ] Si l'outil collecte des données : une page confidentialité, le minimum de données, aucune donnée personnelle exposée.
- [ ] Le lien de démo fonctionne et une capture ou vignette est disponible.
- [ ] Une relecture a été faite par quelqu'un qui n'a pas codé la fonctionnalité.

### 9. La bonne ambiance (anti-abandon)

- **Réunion de lancement** obligatoire : chacun se présente, et on fixe ensemble la charte d'équipe.
- **Météo hebdo** en 30 secondes, pour repérer tôt la fatigue ou le blocage.
- **Reconnaissance** : remerciements publics dans la fiche, badge « Créé ici » sur le profil, crédits définitifs.
- **Pas de silence (missions)** : une mission sans activité depuis 14 jours déclenche une relance amicale. Sans réponse 7 jours plus tard, le porteur peut la réattribuer.
- **Droit de partir** : on peut quitter un projet à tout moment, en prévenant et en transmettant ses missions. Les contributions faites restent créditées.
- **Conflits** : on en parle d'abord en équipe. Sinon, on fait appel à la **médiation de l'admin**, qui reste neutre et confidentielle.
- **Porteur absent** : voir la procédure sécurisée ci-dessous.

### 9 bis. Continuité et protection du porteur

Objectif : qu'un projet ne meure pas si son porteur disparaît, **sans jamais permettre de lui voler son projet**.

**Prévenu dès le départ.** À la création du projet, le porteur accepte ces règles, et le co-porteur les accepte en rejoignant son rôle. Les deux voient le calendrier des relances.

**Codes de récupération.** À la création, le porteur reçoit **8 codes à usage unique**, à garder hors ligne (comme les codes de secours d'une double authentification). Ils servent à :
- **reprendre son rôle depuis un autre compte GitHub** s'il a perdu l'accès au sien ;
- **déclencher une alerte « je suis indisponible »** depuis une page publique, sans être connecté. Le projet est alors **gelé** : aucun transfert possible, et l'équipe et l'admin sont prévenus.

**Relances (si le porteur n'a aucune activité sur la plateforme ni sur le dépôt) :**

| Jour | Ce qui se passe |
|---|---|
| J+14 | **Relance 1** au porteur (notification sur le site, et sur Telegram s'il a activé l'alerte) |
| J+21 | **Relance 2** au porteur et information du co-porteur |
| J+28 | **Relance 3** au porteur et **alerte à l'équipe**, qui peut tenter de le joindre par ses propres moyens |
| J+35 | Le co-porteur peut **demander l'intérim** |

**Intérim, et non transfert.** Pour que l'intérim démarre, il faut à la fois :
1. les 3 relances restées sans réponse ;
2. la demande du co-porteur ;
3. l'accord de la **majorité de l'équipe** ;
4. la **validation de l'admin** ;
5. un **délai d'opposition de 7 jours**, pendant lequel le porteur peut tout annuler en un clic, ou avec un code de récupération.

Pendant l'intérim, le co-porteur gère les missions et l'équipe. Il **ne peut pas** :
- changer la licence ;
- supprimer le projet ou le dépôt ;
- retirer le porteur de l'équipe ou des crédits.

Le porteur reprend son rôle **à tout moment** en se reconnectant.

**Transfert définitif** : seulement après **90 jours d'intérim** sans retour du porteur, avec un nouveau vote de l'équipe et une nouvelle validation de l'admin. Le porteur d'origine reste **crédité à vie** comme fondateur.

**Garde-fous :**
- Les dépôts appartiennent à l'**organisation GitHub de la plateforme**, pas à un individu. Personne ne peut partir avec.
- **Aucune éjection** du porteur par un vote seul. L'admin ne peut retirer un porteur que pour une violation grave de la charte, avec une décision motivée et contestable.
- Chaque changement de rôle est inscrit dans un **journal public du projet** et notifié à tous les membres.

### 10. La rétrospective et la clôture

- Trois questions : qu'est-ce qui a marché, qu'est-ce qu'on change, qu'est-ce qu'on a appris.
- Choix de la suite : maintenance (qui s'en occupe), nouvelle version, ou archivage.
- Les crédits et le label sont figés.

## Données affichées (rappel de la règle de confidentialité)

Partout sur la plateforme, on n'affiche **que des pseudos** et un **identifiant membre** (ex. `VD-4F7K2`). Aucun nom, aucun email, aucun numéro de téléphone. Voir la [politique de pseudonymat](/cgu).

## Mise en œuvre (PR D)

**Ce qui est en place**

| Élément | Où |
|---|---|
| Liste des projets, « Mon atelier », notifications, file de l'admin | `/atelier` |
| Fiche projet, équipe, missions, calendrier, réunions, décisions, journal, mise en ligne, continuité | `/projet?id=…` (onglets) |
| Gel « je suis indisponible » (sans connexion) et reprise du rôle depuis un autre compte | `/indispo` |
| Projet bonus « Créé ici » sur la fiche du showroom | `/showroom` |
| API | `src/api/atelier.js` |

- **Parcours** : brouillon → validation de l'admin → « Recrute » → « En cours » (co-porteur obligatoire, qui accepte les règles) → « En recette » (checklist) → vérification de l'admin → « En ligne », avec le label et les crédits figés → rétrospective. Pause, réouverture du recrutement et archivage (par le porteur seul) sont aussi possibles.
- **Candidatures** : un message de 20 caractères minimum et un rôle ; le porteur accepte ou refuse.
- **Charte d'équipe** : rédigée par le porteur (modèle prérempli) et signée en un clic. Une nouvelle version demande une nouvelle signature.
- **Missions** :
  - champs : titre, description, « c'est fini quand… », taille, échéance, lien de l'issue et de la PR GitHub ;
  - statuts : À faire, En cours, En revue, Terminée ;
  - « Je prends » et « Libérer » ;
  - relance amicale automatique après 14 jours sans activité ; le porteur ne peut réattribuer qu'après 7 jours de plus sans réponse.
- **Calendrier** : jalons, cycles et réunions, frise des jalons, export `.ics` (un événement ou tout le calendrier). Le public ne voit que les jalons.
- **Réunions** : participants et météo de chacun, ordre du jour, décisions (reportées au journal des décisions sans doublon), actions transformables en mission en un clic.
- **Météo hebdo** : ☀️ ⛅ 🌧️ par membre et par semaine.
- **Continuité (§ 9 bis)** :
  - 8 codes de récupération par projet (seule l'empreinte est stockée), régénérables par le porteur ;
  - relances à J+14, J+21 et J+28 ;
  - intérim : demande du co-porteur à J+35, majorité de l'équipe, validation de l'admin, 7 jours d'opposition, puis intérim actif ;
  - le porteur reprend son rôle dès sa prochaine visite sur le site ;
  - pendant l'intérim, interdit de changer la licence, d'archiver ou de retirer le porteur ;
  - gel du projet avec un code ; reprise du rôle depuis un nouveau compte avec un code ;
  - transmission volontaire du rôle au co-porteur.
- **Crédits figés à la mise en ligne** : le porteur, le fondateur, et les membres présents avec au moins une mission terminée.
- **Notifications sur le site** : pastille sur « Créer ici » dans la navigation.
- **Sécurité et vie privée** :
  - pseudos et identifiants `VD-…` uniquement ;
  - numéros et emails refusés dans tous les textes ;
  - canal d'équipe limité à un lien de groupe (Telegram, Signal, WhatsApp, Discord) et visible par l'équipe seule ;
  - limites de fréquence sur la création de projets, les candidatures et les codes de récupération ;
  - suppression de compte impossible tant que le membre porte un projet en cours.

**Pas encore automatisé (étapes suivantes)**

- Synchronisation des issues et du calcul des contributions avec GitHub (nécessite une application GitHub).
- Création du dépôt dans une organisation GitHub de la plateforme et règles de branche automatiques.
- Activité sur le dépôt prise en compte dans les relances (aujourd'hui : activité sur le site seulement).
- Alerte Telegram en option.
- Transfert définitif après 90 jours d'intérim, et retrait d'un porteur par l'admin pour violation grave : ils se font avec l'admin, à la main, pour l'instant.
