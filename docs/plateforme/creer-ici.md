# « Créer ici » — l'atelier de création à plusieurs

Spécification fonctionnelle · version 1 · 12 oct. 2026

## L'idée en une phrase

Un membre propose un outil à construire. Il en devient le **porteur de projet (CDP)**, réunit une équipe, mène le projet jusqu'à la mise en ligne, et le projet reçoit le label **« Créé ici »**.

## Les règles de base

- Seul un membre connecté avec GitHub peut proposer un projet ou y participer.
- Le **porteur** gère l'équipe, valide les contributions et décide de la mise en ligne. Il peut nommer un **co-porteur** qui le remplace en cas d'absence.
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
- **Co-porteur** (conseillé) : remplace le porteur et reprend le projet si celui-ci part.
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
- **Pas de silence** : une mission sans activité depuis 14 jours déclenche une relance amicale. Sans réponse 7 jours plus tard, le porteur peut la réattribuer.
- **Droit de partir** : on peut quitter un projet à tout moment, en prévenant et en transmettant ses missions. Les contributions faites restent créditées.
- **Conflits** : on en parle d'abord en équipe. Sinon, on fait appel à la **médiation de l'admin**, qui reste neutre et confidentielle.
- **Porteur absent** depuis plus de 21 jours : le co-porteur prend le relais. Sans co-porteur, l'admin propose une reprise à l'équipe.

### 10. La rétrospective et la clôture

- Trois questions : qu'est-ce qui a marché, qu'est-ce qu'on change, qu'est-ce qu'on a appris.
- Choix de la suite : maintenance (qui s'en occupe), nouvelle version, ou archivage.
- Les crédits et le label sont figés.

## Données affichées (rappel de la règle de confidentialité)

Partout sur la plateforme, on n'affiche **que des pseudos** et un **identifiant membre** (ex. `VD-4F7K2`). Aucun nom, aucun email, aucun numéro de téléphone. Voir la [politique de pseudonymat](cgu.md#5-pseudonymat-et-données-personnelles).
