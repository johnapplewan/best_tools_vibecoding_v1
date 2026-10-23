# Comment faire ?

Version 1 · 20 oct. 2026 · en ligne sur `/comment-faire` (lien « Comment faire ? » dans la navigation).

**Le principe** : on apprend en posant la question « Comment faire… ? ». La page propose quatre modes, pour quatre façons d'apprendre. On passe de l'un à l'autre avec le sélecteur en haut de la page.

| Mode | Pour qui | Ce qu'il fait |
|---|---|---|
| 🧭 **Le GPS** | Celui qui a une idée précise | Il part d'une destination et trace un chemin en 6 étapes adapté au niveau et à l'avancement. |
| 🗺️ **La carte** | Le grand débutant | Un parcours ludique de 20 premiers pas en 5 mondes, avec XP et badges. |
| 📚 **La bibliothèque** | Celui qui veut piocher | Toutes les fiches, filtrables, et « Ma feuille de route » à côté. |
| 🚀 **Évoluer** | Les membres qui veulent progresser vers un métier | Compétences, certifs, jobs, outils et acteurs du recrutement, tous reliés. |

## Accès

Visiteur ou membre, c'est le compte du site qui décide : il faut être connecté avec GitHub et avoir terminé l'inscription.

| Mode | Visiteur | Membre |
|---|---|---|
| Le GPS | Étapes 1 à 3 | Tout |
| La carte | Mondes 1 à 3 | Tout |
| La bibliothèque | Fiches « Facile » | Tout |
| Évoluer | Présentation et aperçu des outils clés | Tout |

Les parties réservées sont grisées et proposent « Inscription gratuite avec GitHub », ou « Terminer mon inscription » si le compte existe déjà.

## Commun aux modes A, B et C

- **Le profil** : quatre niveaux (Grand débutant, J'ai déjà bricolé, À l'aise, Pro) et quatre stades (juste une idée, un prototype, du code sur GitHub, déjà en ligne). Ce qui est déjà acquis est marqué comme tel et sort du chemin.
- **Les fiches** :
  - Il y en a 26 : 20 premiers pas et 6 tutos outils.
  - Chacune contient : contexte, objectif, niveau, durée, deux emplacements vidéo, les outils utilisés, un pas-à-pas, comment connecter, les erreurs fréquentes, un mini-défi, « Pourquoi c'est important » et « Ce qu'un senior te dirait ».
  - Les outils cités renvoient vers le catalogue (`/outils?q=…`).

## Deux workflows : poste local ou full web

- **🖥️ Poste local** : éditeur, Node et terminal sur l'ordinateur, puis GitHub. **🌐 Full web** : Claude Code en ligne (ordinateur, mobile ou tablette), GitHub pour le code, Cloudflare ou Netlify pour l'aperçu et la mise en ligne.
- **Sur chaque fiche** :
  - 6 fiches ont une variante full web, avec le sélecteur « 🖥️ Poste local | 🌐 Full web » : Installer son poste, Git et GitHub, Agent de code, Mettre en ligne, Faire évoluer, Prendre en main Claude Code.
  - Le sélecteur change les outils, le pas-à-pas, la connexion, le piège et le mini-défi.
  - Les autres fiches portent une étiquette : « 🖥️ Poste local » pour le LLM local, Codex CLI, Ollama et Playwright MCP (à repasser en full web si Playwright MCP tourne dans l'espace en ligne de Claude Code), « 🌐 Full web » pour toutes les autres.
- **GPS** :
  - la question « Où je travaille » (ordinateur, ou mobile et tablette) ;
  - sur mobile, les fiches s'ouvrent directement en version full web ;
  - un workflow conseillé selon le type de projet ;
  - l'encadré « Quel workflow pour quel projet ? ».
- **Bibliothèque** : un filtre Workflow (poste local, full web). Les fiches qui ont les deux versions apparaissent dans les deux cas.

## Mode A, le GPS

- Il démarre vide, avec un bouton « Voir un exemple » (jeu de cartes en ligne).
- Sous la destination, des idées de projets tournent : deux lignes sur ordinateur, cinq sur mobile, adaptées au niveau et classées par thème (saison, actu, pro, productivité, créatif, culture, sécurité, pédagogie).
- Les étapes sont repliées et se déplient avec une flèche. Les titres des étapes sont communs à tous les projets :
  1. Réfléchir avant de coder ;
  2. Préparer ton atelier ;
  3. Prototyper le cœur du projet ;
  4. Construire les fonctions clés ;
  5. Mettre en ligne ;
  6. Faire grandir le projet.
- Chaque étape contient : le pourquoi, la façon de penser d'un vibe-coder, les difficultés, les points d'attention, les questions pour le brief, les bonnes pratiques d'un senior et les fiches à suivre.

## Mode D, Évoluer

Il n'y a pas de chaîne imposée : **six portes d'entrée** équivalentes, et une recherche qui couvre tout.

| Porte | Contenu |
|---|---|
| 👥 Publics et projets | 7 publics : Pour moi, Un public, Grand public, Entreprise, Structure sensible, Décentralisé et blockchain, IA physique |
| 🎯 Compétences | 56 compétences, chacune avec un test |
| 🧰 Outils | 53 outils, classés par usage et par importance actuelle |
| 🎓 Certifs | 110 certifications gratuites et payantes, en français et en anglais |
| 💼 Jobs | 16 métiers recherchés, dont 3 Web3 et 3 IA physique |
| 📍 Où et comment | 61 plateformes, agences et communautés (France et international, remote), conseils pour se présenter, simulateur d'entretien |

**La fiche** s'ouvre dans un panneau latéral. Elle contient :
- le fil d'exploration ;
- l'action principale (passer le test, s'entraîner à l'entretien, voir la certif) ;
- « Ce qui te manque » ;
- une mini-constellation des liens directs (sur ordinateur) ;
- les blocs de liens vers les autres portes.

Chaque élément cité est cliquable.

**Les publics** : les zones 1 à 5 s'additionnent. Blockchain et IA physique demandent leurs propres compétences, plus le socle des zones 1 et 2. Quand toutes les compétences d'un public sont validées, il devient un **badge Vibe Tools** sur la fiche. Les badges n'expirent pas ; ils passent en orange si le référentiel évolue de plus de 35 %.

**Les tests** :
- Ils se déroulent en temps limité, avec un QCM tiré au sort, un problème ouvert et un cas pratique (ordonner des étapes, associer des actions à des outils).
- Le barème interne est de 100 points, pondérés selon l'importance des questions, et n'est jamais affiché. Le test est validé à 75 points.
- Le corrigé donne la bonne réponse, l'explication et les points perdus.
- Deux tests sont disponibles : « Écrire un brief et une spec » et « Sécurité des smart contracts ». Les autres compétences affichent « bientôt ».

**Le simulateur d'entretien** :
- On choisit le poste, l'entretien (du 1er au 6e), l'interlocuteur et son profil, avec une note interne optionnelle. Les critères discriminatoires présents dans la note sont détectés et ignorés.
- À la fin : une note sur 20, les points à mettre en valeur et à éviter, les axes d'amélioration, les ressources de la plateforme, la note interne mise à jour et un compte rendu à copier ou à enregistrer en PDF (via l'impression du navigateur).
- **Aucune réponse n'est enregistrée.**

## Données et stockage

- Toutes les données de contenu (fiches, compétences, outils, certifs, jobs, acteurs, tests) sont dans `public/comment-faire.html`.
- La progression (fiches faites, feuille de route, compétences validées, certifs déclarées) est gardée **dans le navigateur du membre** (`localStorage`). Elle ne suit pas d'un appareil à l'autre et ne s'affiche pas encore sur le showroom : « Aperçu de ma fiche » montre ce qui s'y affichera.
- Les certifs et les acteurs viennent d'une recherche du 17 octobre 2026. Les fiches marquées « à confirmer » (34 au total) n'ont pas pu être vérifiées en direct ; les prix sont indicatifs.

## Prochaines étapes

1. **Progression côté serveur** (D1) : compétences validées, badges et certifs déclarées, pour les afficher sur la fiche du showroom et les retrouver sur tous les appareils. Les tests seront alors corrigés côté serveur, pour qu'un badge ne puisse pas être obtenu en modifiant le navigateur.
2. **Banque de questions** pour les 54 autres compétences (10, 25 ou 40 questions selon le niveau), générée avec Claude et validée dans l'admin.
3. **Vidéos** des fiches et des outils : voir [`comment-faire-videos.md`](comment-faire-videos.md).
4. **Mise à jour hebdomadaire** des idées de projets, de la tendance des jobs et de l'importance des outils, par la veille.
5. **Claude dans le GPS et le simulateur** : un chemin généré à partir de la question, un interlocuteur qui relance selon les réponses, un problème ouvert corrigé et expliqué.
