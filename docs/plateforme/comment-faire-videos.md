# Vidéos à produire : « Comment faire ? » et catalogue d'outils

Liste exhaustive des capsules vidéo de la plateforme : les vidéos de présentation, les deux vidéos de chaque fiche « Comment faire ? », les variantes « full web » (`-W`) et une capsule de découverte pour chaque outil cité sur le site.

Pour chaque vidéo : un code, un titre et son contenu en trois phrases. Ces trois phrases servent de brief à Sonnet pour écrire le script, puis à l'application de motion design pour générer la vidéo.

## Règles communes

La charte graphique complète (couleurs, polices, motion design, effets, son) est dans [`charte-video.md`](charte-video.md).

- **Ton** : tutoiement, phrases courtes, vocabulaire simple ; chaque terme technique est expliqué en une phrase la première fois.
- **Structure** : une accroche de 5 secondes (le problème ou la promesse), le contenu, puis un récapitulatif en une phrase.
- **Durées** :
  - présentation de la plateforme (P) : 60 à 90 s ;
  - « L'essentiel » d'une fiche (A) : 2 min ;
  - « Pas-à-pas » d'une fiche (B) : 1 min ;
  - capsule outil (O) : 60 s.
- **À l'écran** :
  - sous-titres toujours ;
  - aucune donnée personnelle, aucune vraie clé d'API (toujours masquée) ;
  - des comptes et projets de démonstration uniquement.
- **Deux workflows** : poste local ou full web. Chaque vidéo indique son workflow en étiquette à l'écran (« 🖥️ Poste local » ou « 🌐 Full web »).
- **Format** : les vidéos `-W` sont livrées en 16:9 **et** en 9:16 ; l'intro peut montrer l'écran d'un mobile ou d'une tablette.
- **Rappel** : les interfaces de Claude Code web, GitHub, Cloudflare et Netlify changent souvent : revérifier les écrans le jour du tournage.
- **Prompt type pour Sonnet** : « Écris le script d'une vidéo de [durée] pour des débutants en vibe coding, en français, en tutoyant. Titre : [titre]. Contenu attendu : [les 3 phrases]. Découpe en scènes avec, pour chaque scène : la voix off, le texte à l'écran et l'animation à montrer. »


## 1. Présentation de la plateforme

**P-01 · Comment faire ? : quatre façons d'apprendre**  
On présente les quatre modes de la page : le GPS, la carte, la bibliothèque et Évoluer. On montre en une scène chacun, avec le profil de personne à qui il convient le mieux. On invite à choisir son mode et à poser sa première question « Comment faire… ? ».

**P-02 · Le GPS : de ta question à ton chemin**  
On tape une destination, on choisit son niveau, où on en est et où on travaille : ordinateur ou mobile/tablette, et le chemin apparaît. On déplie une étape pour montrer le pourquoi, la façon de penser d'un vibe-coder et les conseils d'un senior. On ajoute le chemin à sa feuille de route en un clic.

**P-03 · La carte : tes premiers pas en cinq mondes**  
On présente les 20 premiers pas répartis en cinq mondes, du « C'est quoi le vibe coding ? » à « Faire évoluer sans tout casser ». On termine une fiche, on gagne des points d'expérience et on débloque un badge. On montre comment ton objectif éclaire les étapes utiles sur la carte.

**P-04 · La bibliothèque et ta feuille de route**  
On filtre les fiches par niveau, par type, par setup (Claude, ChatGPT, Codex, IA locale, serveur) et par workflow : poste local ou full web. On montre la feuille de route qui se remplit seule à partir de ton objectif. On coche une fiche terminée et on voit la progression avancer.

**P-05 · Évoluer : six portes d'entrée**  
On présente les six portes : publics et projets, compétences, outils, certifs, jobs, où et comment. On ouvre une fiche job et on suit ses liens vers une certif, puis vers une compétence, grâce au fil d'exploration. On montre le bloc « Ce qui te manque » qui dit quoi faire ensuite.

**P-06 · Passer un test de compétence**  
On lance un test : minuteur, questions tirées au sort, problème ouvert et cas pratique. On lit le corrigé : la bonne réponse, l'explication et les points perdus pour chaque erreur. On explique qu'il faut au moins 75 % pour valider et que chaque nouvelle tentative propose un tirage différent.

**P-07 · Le simulateur d'entretien**  
On choisit un poste, un numéro d'entretien, un interlocuteur et son profil, avec ou sans note interne. On répond aux questions puis on découvre la note, les points à mettre en valeur et les axes d'amélioration. On copie le compte rendu, on l'enregistre en PDF, puis on supprime tout : rien n'est conservé.

**P-08 · Les badges Vibe Tools**  
On explique qu'un public validé (toutes ses compétences au vert) devient un badge sur ta fiche. On montre l'aperçu de la fiche avec les badges et les tampons de certifications. On explique qu'un badge n'expire pas mais passe en orange si le référentiel évolue de plus de 35 %.

**P-09 · Deux façons de travailler : sur ton poste ou 100 % en ligne** (60 à 90 s, à produire juste après P-01)  
On présente les deux workflows : le poste local (éditeur, Node et terminal sur ton ordinateur) et le full web (Claude Code en ligne, GitHub pour le code, Cloudflare ou Netlify pour la mise en ligne). On montre pour chacun où vit le code et qui fait quoi, avec le type de projet qui lui convient le mieux. On invite à choisir selon son projet et son appareil, en rappelant que GitHub permet de passer de l'un à l'autre.

## 2. Fiches « Comment faire ? » : premiers pas

Chaque fiche a deux vidéos : **A · L'essentiel** (2 min) et **B · Pas-à-pas** (1 min). Quand la marche à suivre change en full web, une variante **W · Pas-à-pas full web** s'ajoute : une seule vidéo d'1 min, en texte animé sans voix off, livrée en 16:9 et en 9:16.

### F-01 · 🌈 C'est quoi le vibe coding ?

**F-01-A · L'essentiel**  
Tu décris ce que tu veux en français, l'IA écrit le code, toi tu pilotes, testes et corriges le cap. Pourquoi c'est important : l'IA écrit vite, mais c'est toi qui sais ce qui doit exister et pourquoi. Objectif de la fiche : comprendre le rôle de chacun : toi le chef de projet, l'IA le développeur.

**F-01-B · Pas-à-pas**  
À l'écran, on montre : demande à Claude ou ChatGPT : « crée-moi une page qui affiche une blague au hasard », puis ouvre le résultat et demande une modification. Piège à éviter : croire que l'IA devine tout : plus tu es précis, mieux c'est. Mini-défi pour finir : fais changer la couleur et la police de ta page de blagues en une seule phrase.

### F-02 · 🤖 Choisir son assistant IA

**F-02-A · L'essentiel**  
Claude, ChatGPT, Codex, Gemini… ils se ressemblent mais n'ont pas les mêmes forces. Pourquoi c'est important : chaque assistant a ses forces ; en connaître un à fond vaut mieux que d'en survoler quatre. Objectif de la fiche : choisir ton assistant principal selon ton usage et ton budget.

**F-02-B · Pas-à-pas**  
À l'écran, on montre : compare les offres gratuites et payantes, puis pose la même question aux deux assistants, puis garde celui dont tu comprends le mieux les réponses. Piège à éviter : payer trois abonnements dès le premier jour. Mini-défi pour finir : demande à deux assistants le même mini-site et compare. Vérifie que ton offre inclut l'agent en ligne si tu veux travailler en full web.

### F-03 · 🏠 Installer un LLM local · 🖥️ Poste local

**F-03-A · L'essentiel**  
Un modèle qui tourne sur ton ordinateur : gratuit, privé, hors ligne, mais moins puissant. Pourquoi c'est important : un modèle local protège tes données et coûte zéro à l'usage, au prix de la puissance. Objectif de la fiche : faire tourner ton premier modèle en local et lui parler.

**F-03-B · Pas-à-pas**  
À l'écran, on montre : installe Ollama ou LM Studio, puis télécharge un petit modèle (7 à 8 milliards de paramètres), puis discute avec lui, puis branche-le à ton éditeur. Piège à éviter : prendre un modèle trop gros pour ta machine. Mini-défi pour finir : demande au modèle local de résumer un texte de ton choix.

### F-04 · 📝 Écrire un bon brief

**F-04-A · L'essentiel**  
Le brief, c'est la fiche que tu donnes à l'IA : pour qui, pour quoi, comment ça marche. Pourquoi c'est important : l'IA comble chaque flou par une supposition. Un bon brief réduit les suppositions. Objectif de la fiche : avoir un brief d'une page qui évite 80 % des allers-retours.

**F-04-B · Pas-à-pas**  
À l'écran, on montre : décris ton utilisateur et son problème, puis liste ce qu'il doit pouvoir faire (5 actions max), puis ajoute ce que tu ne veux pas et un exemple d'écran. Piège à éviter : un brief de 10 pages. Mini-défi pour finir : écris le brief de ton projet en 10 lignes.

### F-05 · ✂️ Découper en petite première version

**F-05-A · L'essentiel**  
Ton idée entière est trop grosse pour un premier jet. On garde le cœur, le reste attendra. Pourquoi c'est important : une petite version en ligne t'apprend plus qu'une grande version jamais finie. Objectif de la fiche : savoir ce qui est dans la v1, et ce qui ne l'est pas.

**F-05-B · Pas-à-pas**  
À l'écran, on montre : liste toutes tes idées, puis garde les 3 sans lesquelles l'app n'a pas de sens, puis range le reste dans « plus tard ». Piège à éviter : commencer par les comptes, les paiements et les réglages. Mini-défi pour finir : coupe ta liste en deux : v1 et plus tard.

### F-06 · 🎨 Prototyper sans coder

**F-06-A · L'essentiel**  
Lovable, Bolt ou v0 te montrent ton app en quelques minutes, directement dans le navigateur. Pourquoi c'est important : voir l'écran révèle les oublis du brief en quelques minutes au lieu de quelques semaines. Objectif de la fiche : voir et cliquer ta première version avant d'installer quoi que ce soit.

**F-06-B · Pas-à-pas**  
À l'écran, on montre : colle ton brief dans Lovable, Bolt ou v0, puis demande les changements un par un, puis exporte le code vers GitHub, puis continue dans Claude Code en ligne. Piège à éviter : tout demander dans un seul message. Mini-défi pour finir : fais générer l'écran d'accueil de ton projet.

### F-07 · 💻 Installer son poste

**F-07-A · L'essentiel**  
Un éditeur, un terminal et Node : la base pour travailler sur ton ordinateur. Pourquoi c'est important : travailler sur ta machine te rend indépendant d'un outil en ligne qui peut changer ou fermer. Objectif de la fiche : ouvrir un projet et lancer une commande sans stress.

**F-07-B · Pas-à-pas**  
À l'écran, on montre : installe VS Code ou Cursor, puis installe Node (version LTS), puis ouvre le terminal et tape « node -v ». Piège à éviter : avoir peur du terminal : c'est juste une fenêtre où l'on écrit des ordres. Mini-défi pour finir : crée un dossier « mon-projet » et ouvre-le dans ton éditeur. Écran de fin : « Ou sans rien installer : version full web » (F-07-W).

**F-07-W · Pas-à-pas full web : travailler sans rien installer** · 🌐 Full web  
À l'écran, on montre : crée ton compte GitHub, puis ouvre Claude Code en ligne et connecte ton dépôt, puis lance ta première session depuis ton navigateur ou ton téléphone. Piège à éviter : oublier que l'agent ne voit que le dépôt choisi : ce qui n'y est pas n'existe pas pour lui. Mini-défi pour finir : crée un dépôt « mon-projet » et demande à Claude d'y ajouter un fichier README.

### F-08 · 🌳 Git et GitHub sans douleur

**F-08-A · L'essentiel**  
Git, c'est la sauvegarde avec historique de ton code. GitHub, c'est l'endroit où il vit en ligne. Pourquoi c'est important : sans historique, une mauvaise modification de l'IA peut effacer des heures de travail. Objectif de la fiche : sauvegarder, revenir en arrière et partager ton code.

**F-08-B · Pas-à-pas**  
À l'écran, on montre : crée un compte GitHub, puis crée ton premier dépôt, puis fais ton premier commit et ton premier push. Piège à éviter : mettre des mots de passe dans le code. Mini-défi pour finir : annule une modification avec l'historique Git.

**F-08-W · Pas-à-pas full web : GitHub depuis ton navigateur** · 🌐 Full web  
À l'écran, on montre : ouvre ton dépôt sur GitHub, puis demande à Claude de travailler sur une branche et de proposer une pull request, puis relis la différence dans GitHub avant de fusionner. Piège à éviter : fusionner sans avoir lu la différence. Mini-défi pour finir : annule une modification avec le bouton « Revert » de GitHub.

### F-09 · 🧑‍🚀 Travailler avec un agent de code

**F-09-A · L'essentiel**  
Un agent lit ton projet, modifie plusieurs fichiers et lance les commandes à ta place. Pourquoi c'est important : un agent change plusieurs fichiers d'un coup : sans relecture, tu perds le fil de ton propre projet. Objectif de la fiche : confier une vraie tâche à un agent et relire ce qu'il a fait.

**F-09-B · Pas-à-pas**  
À l'écran, on montre : installe Claude Code, Codex CLI ou ouvre Cursor, puis demande-lui d'expliquer ton projet, puis confie une petite tâche, puis relis la différence. Piège à éviter : tout accepter sans lire. Mini-défi pour finir : demande à l'agent d'ajouter un bouton et de l'expliquer.

**F-09-W · Pas-à-pas full web : l'agent de code en ligne** · 🌐 Full web  
À l'écran, on montre : ouvre Claude Code en ligne et choisis ton dépôt, puis confie-lui une petite tâche, puis relis la différence et crée la pull request. Piège à éviter : croire que l'agent voit ton ordinateur : il travaille dans un espace isolé, avec ton dépôt seulement. Mini-défi pour finir : depuis ton téléphone, demande d'ajouter un bouton et fais-toi expliquer ce qu'il a changé.

### F-10 · 🔍 Lire le code généré

**F-10-A · L'essentiel**  
Pas besoin de savoir coder pour comprendre en gros ce que fait un fichier. Pourquoi c'est important : tu n'as pas besoin d'écrire le code, mais tu dois savoir où il se trouve pour le piloter. Objectif de la fiche : repérer où se trouve quoi dans ton projet.

**F-10-B · Pas-à-pas**  
À l'écran, on montre : demande à l'IA un plan des fichiers, puis fais expliquer un fichier ligne par ligne, puis repère où sont les textes et les couleurs. Piège à éviter : modifier au hasard un fichier qu'on ne comprend pas. Mini-défi pour finir : trouve seul où changer le titre de ta page.

### F-11 · 🐛 Déboguer avec l'IA

**F-11-A · L'essentiel**  
Ça plante ? Normal. La compétence clé, c'est de bien décrire le problème. Pourquoi c'est important : un bug bien décrit est à moitié résolu ; un bug mal décrit fait tourner l'IA en rond. Objectif de la fiche : résoudre une erreur sans tourner en rond.

**F-11-B · Pas-à-pas**  
À l'écran, on montre : copie le message d'erreur exact, puis dis ce que tu attendais et ce qui se passe, puis demande une cause avant une solution. Piège à éviter : dire juste « ça marche pas ». Mini-défi pour finir : provoque une erreur volontaire et fais-la corriger.

### F-12 · 🧱 Les bases d'une app web

**F-12-A · L'essentiel**  
Le front (ce qu'on voit), le back (ce qui calcule), la base de données (ce qui se souvient). Pourquoi c'est important : savoir ce qui tourne où, c'est savoir ce qui est visible par tout le monde… et ce qui doit rester caché. Objectif de la fiche : savoir de quoi parle l'IA quand elle dit front, back ou API.

**F-12-B · Pas-à-pas**  
À l'écran, on montre : regarde le schéma en 3 blocs, puis place chaque fonction de ton app dans un bloc, puis demande à l'IA de valider ton schéma. Piège à éviter : tout mettre dans le front, y compris les secrets. Mini-défi pour finir : dessine le schéma de ton app sur une feuille.

### F-13 · 🗄️ Une base de données avec Supabase

**F-13-A · L'essentiel**  
Supabase te donne une base de données, des comptes et du temps réel sans gérer de serveur. Pourquoi c'est important : tes données valent plus que ton code : le code se réécrit, les données perdues ne reviennent pas. Objectif de la fiche : enregistrer et relire des données depuis ton app.

**F-13-B · Pas-à-pas**  
À l'écran, on montre : crée un projet Supabase, puis crée ta première table, puis connecte ton app avec la clé publique. Piège à éviter : oublier les règles de sécurité (RLS). Mini-défi pour finir : crée une table « messages » et ajoute une ligne à la main.

### F-14 · 🔐 Les comptes utilisateurs

**F-14-A · L'essentiel**  
Se connecter, s'inscrire, rester connecté : à ne jamais coder soi-même de zéro. Pourquoi c'est important : la connexion est la porte d'entrée des pirates : un service éprouvé a déjà corrigé les failles que tu ne connais pas. Objectif de la fiche : ajouter une connexion sûre en utilisant un service éprouvé.

**F-14-B · Pas-à-pas**  
À l'écran, on montre : active l'authentification dans Supabase, puis choisis email, GitHub ou Google, puis protège les pages réservées. Piège à éviter : stocker des mots de passe soi-même. Mini-défi pour finir : affiche « Bonjour, pseudo » après connexion.

### F-15 · ⚡ Le temps réel : chat et multijoueur

**F-15-A · L'essentiel**  
Quand un joueur joue, les autres doivent le voir tout de suite. C'est le temps réel. Pourquoi c'est important : dès que plusieurs personnes agissent en même temps, il faut un arbitre unique : le serveur. Objectif de la fiche : faire apparaître un message chez tous les participants sans recharger.

**F-15-B · Pas-à-pas**  
À l'écran, on montre : choisis Supabase Realtime ou Cloudflare Durable Objects, puis crée un « salon » par partie, puis envoie et reçois un premier message. Piège à éviter : faire confiance au navigateur du joueur (triche). Mini-défi pour finir : ouvre deux onglets et fais-les discuter. Cloudflare Durable Objects se publie directement en full web.

### F-16 · 🚀 Mettre en ligne

**F-16-A · L'essentiel**  
Ton app sort de ton ordinateur et reçoit une adresse que tout le monde peut ouvrir. Pourquoi c'est important : une app en ligne reçoit de vrais retours ; une app sur ton ordinateur ne reçoit que les tiens. Objectif de la fiche : publier ton app et la mettre à jour à chaque push, depuis ton navigateur ou ton téléphone.

**F-16-B · Pas-à-pas**  
À l'écran, on montre : connecte ton dépôt GitHub à Cloudflare ou Netlify (depuis ton navigateur ou ton téléphone), puis choisis la commande de build, puis ouvre l'adresse et partage-la. Piège à éviter : oublier les variables d'environnement en ligne. Mini-défi pour finir : mets en ligne ta page de blagues.

**F-16-W · Pas-à-pas full web : l'aperçu en ligne de chaque branche** · 🌐 Full web  
À l'écran, on montre : connecte ton dépôt GitHub à Cloudflare ou Netlify, puis ouvre l'adresse d'aperçu de ta branche sur ton téléphone, puis fusionne et regarde la mise en ligne. Piège à éviter : oublier les variables d'environnement dans l'hébergeur. Mini-défi pour finir : change un titre depuis ton téléphone, vérifie l'aperçu, puis publie.

### F-17 · 🗝️ Secrets et sécurité de base

**F-17-A · L'essentiel**  
Une clé d'API dans le code, c'est une carte bancaire laissée sur la table. Pourquoi c'est important : une clé publiée sur GitHub est trouvée par des robots en quelques minutes. Objectif de la fiche : ranger tes clés au bon endroit et éviter les failles classiques.

**F-17-B · Pas-à-pas**  
À l'écran, on montre : mets les clés dans les secrets de l'hébergeur, puis ajoute .env au .gitignore, puis fais passer Semgrep sur ton code. Piège à éviter : coller une clé dans un chat ou un ticket. Mini-défi pour finir : vérifie que ton dépôt ne contient aucune clé.

### F-18 · 🧪 Tester son app

**F-18-A · L'essentiel**  
Un test, c'est un robot qui clique dans ton app pour vérifier que rien n'est cassé. Pourquoi c'est important : chaque nouvelle fonctionnalité peut casser une ancienne sans que tu le voies. Objectif de la fiche : avoir un test qui tourne avant chaque mise en ligne.

**F-18-B · Pas-à-pas**  
À l'écran, on montre : branche Playwright MCP à ton agent, puis demande-lui de tester le parcours principal, puis relance le test après chaque changement. Piège à éviter : tester seulement « à la main » et oublier. Mini-défi pour finir : fais tester la connexion par un robot.

### F-19 · 📈 Suivre son app en ligne

**F-19-A · L'essentiel**  
Les utilisateurs ne te diront pas toujours que ça plante. Sentry, si. Pourquoi c'est important : ce que tu ne mesures pas, tu ne peux pas l'améliorer, et tu ne sais pas quand ça casse. Objectif de la fiche : être prévenu d'une erreur avant tes utilisateurs.

**F-19-B · Pas-à-pas**  
À l'écran, on montre : crée un projet Sentry, puis ajoute le petit bout de code fourni, puis provoque une erreur et regarde l'alerte. Piège à éviter : envoyer des données personnelles dans les erreurs. Mini-défi pour finir : reçois ta première alerte Sentry.

### F-20 · 🌱 Faire évoluer sans tout casser

**F-20-A · L'essentiel**  
La v2 est souvent plus dure que la v1. Petites étapes, branches et tests. Pourquoi c'est important : plus une app grandit, plus chaque changement touche d'autres morceaux. Objectif de la fiche : ajouter une fonctionnalité sans casser l'existant.

**F-20-B · Pas-à-pas**  
À l'écran, on montre : crée une branche par fonctionnalité, puis écris d'abord la spec avec OpenSpec, puis teste, relis, puis fusionne. Piège à éviter : tout changer d'un coup. Mini-défi pour finir : ajoute une fonctionnalité sur une branche, puis fusionne-la.

**F-20-W · Pas-à-pas full web : une branche, un aperçu, une fusion** · 🌐 Full web  
À l'écran, on montre : demande une fonctionnalité sur une nouvelle branche, puis ouvre son aperçu en ligne, puis relis et fusionne. Piège à éviter : fusionner sans avoir ouvert l'aperçu. Mini-défi pour finir : ajoute une petite fonctionnalité sur une branche, vérifie l'aperçu, puis fusionne.

### Variantes facultatives (à décider plus tard, non comptées)

- **F-11-W** : copier le journal d'erreur du build Cloudflare ou Netlify dans la session, et demander la cause avant la solution.
- **F-17-W** : ranger les clés dans les secrets de l'hébergeur et de GitHub, sans fichier `.env` local.
- **F-18-W** : faire lancer les tests automatiquement à chaque pull request.

## 3. Fiches « Comment faire ? » : tutos outils

### T-01 · ✳️ Prendre en main Claude Code

**T-01-A · L'essentiel**  
L'agent de code d'Anthropic, dans ton terminal ou ton éditeur. Pourquoi c'est important : un agent dans ton terminal voit tout ton projet : c'est sa force et sa responsabilité. Objectif de la fiche : l'installer, le connecter à ton projet et lui confier une première tâche.

**T-01-B · Pas-à-pas**  
À l'écran, on montre : installe Claude Code, puis ouvre ton projet et lance-le, puis ajoute Context7 et Playwright MCP. Piège à éviter : lui donner trop de permissions sans comprendre. Mini-défi pour finir : fais-lui écrire le README de ton projet.

**T-01-W · Pas-à-pas full web : Claude Code sur le web, mobile et tablette** · 🌐 Full web  
À l'écran, on montre : connecte GitHub à Claude Code en ligne, puis ouvre une session sur ton dépôt depuis ton téléphone, puis suis ses actions et relis la différence. Piège à éviter : lui donner un dépôt sensible sans comprendre ce qu'il peut modifier. Mini-défi pour finir : demande-lui d'écrire le README de ton projet depuis ta tablette.

### T-02 · 💜 Lovable + Supabase + GitHub

**T-02-A · L'essentiel**  
Le trio le plus simple pour une vraie app avec données, sans installer quoi que ce soit. Pourquoi c'est important : relier les trois dès le début évite d'être enfermé dans un seul outil. Objectif de la fiche : relier les trois et retrouver ton code sur GitHub.

**T-02-B · Pas-à-pas**  
À l'écran, on montre : crée ton app dans Lovable, puis clique « Connect Supabase », puis clique « Connect GitHub », puis continue dans Claude Code en ligne. Piège à éviter : ne pas exporter vers GitHub (ton code reste coincé). Mini-défi pour finir : ajoute une liste qui se sauvegarde dans Supabase.

### T-03 · ☁️ Déployer sur Cloudflare

**T-03-A · L'essentiel**  
Hébergement rapide et gratuit pour démarrer, avec Workers et base D1. Pourquoi c'est important : le déploiement automatique transforme chaque push en mise en ligne : rapide, mais à surveiller. Objectif de la fiche : relier ton dépôt et publier à chaque push ; chaque branche reçoit une adresse d'aperçu, et Netlify fonctionne de la même façon.

**T-03-B · Pas-à-pas**  
À l'écran, on montre : crée un compte Cloudflare, puis Workers & Pages → Connecter GitHub, puis ajoute tes secrets dans Réglages, puis ouvre l'adresse d'aperçu de ta branche. Piège à éviter : mettre les clés dans wrangler.jsonc au lieu des secrets. Mini-défi pour finir : publie ton projet et ouvre son adresse.

### T-04 · 🧠 Codex CLI avec ChatGPT · 🖥️ Poste local

**T-04-A · L'essentiel**  
L'agent de code d'OpenAI, utilisable avec ton abonnement ChatGPT. Pourquoi c'est important : connaître deux agents te permet de comparer et de ne pas dépendre d'un seul. Objectif de la fiche : l'installer et lui confier une tâche dans ton projet.

**T-04-B · Pas-à-pas**  
À l'écran, on montre : installe Codex CLI, puis connecte ton compte ChatGPT, puis lance-le dans ton dossier de projet. Piège à éviter : le lancer hors du dossier du projet. Mini-défi pour finir : demande-lui de corriger une faute dans ta page.

### T-05 · 🦙 Ollama dans ton éditeur · 🖥️ Poste local

**T-05-A · L'essentiel**  
Un assistant de code 100 % local et gratuit, sans envoyer ton code en ligne. Pourquoi c'est important : le local, c'est la confidentialité totale : ton code ne quitte pas ta machine. Objectif de la fiche : brancher Ollama sur VS Code avec Cline.

**T-05-B · Pas-à-pas**  
À l'écran, on montre : installe Ollama et un modèle de code, puis installe l'extension Cline, puis choisis Ollama comme fournisseur. Piège à éviter : un modèle trop lent : prends plus petit. Mini-défi pour finir : fais expliquer un fichier par ton modèle local.

### T-06 · 🎭 Playwright MCP : un testeur robot

> À vérifier avant le tournage : si Playwright MCP tourne dans l'espace en ligne de Claude Code, la fiche passe en « 🌐 Full web » ; sinon, étiquette « 🖥️ Poste local ».

**T-06-A · L'essentiel**  
Ton agent ouvre un vrai navigateur et clique dans ton app comme un humain. Pourquoi c'est important : un robot ne se fatigue pas et ne saute pas d'étape. Objectif de la fiche : faire tester ton app automatiquement par l'agent.

**T-06-B · Pas-à-pas**  
À l'écran, on montre : ajoute Playwright MCP à ton agent, puis demande : « teste l'inscription », puis lis le rapport et les captures. Piège à éviter : le laisser cliquer sur ton site en production avec de vraies données. Mini-défi pour finir : fais tester ta page d'accueil sur mobile.

## 4. Capsules « Découvrir un outil » (60 s)

Une capsule par outil cité sur le site (catalogue /outils et page Évoluer). Structure : ce que c'est, la démonstration à l'écran, ce qu'il faut retenir.

### Assistants IA et recherche

**O-001 · Découvrir ChatGPT**  
L'assistant d'OpenAI, le plus utilisé du grand public, pour rédiger, résumer et brainstormer. À l'écran : on crée un projet, on y dépose un document et on lui fait produire un premier brief d'application. À retenir : il est excellent pour démarrer, mais une réponse se vérifie toujours avant d'être réutilisée.

**O-002 · Découvrir Claude**  
L'assistant d'Anthropic, réputé pour les textes longs, le raisonnement et le code. À l'écran : on lui demande une petite page web, on l'ouvre en artefact interactif, puis on la fait modifier en une phrase. À retenir : les projets avec documents de référence évitent de tout réexpliquer à chaque conversation.

**O-003 · Découvrir Gemini**  
L'assistant de Google, intégré à Gmail, Docs et Drive, avec un très long contexte. À l'écran : on lui fait résumer un long document Drive, puis rédiger un plan d'action dans Docs. À retenir : c'est le bon choix si toute l'équipe travaille déjà dans Google Workspace.

**O-004 · Découvrir Le Chat (Mistral)**  
L'assistant de Mistral AI, une alternative européenne avec des modèles ouverts. À l'écran : on compare sa réponse à celle d'un autre assistant sur une même demande de code simple. À retenir : c'est un argument de souveraineté auprès des clients français et européens.

**O-005 · Découvrir Perplexity**  
Un moteur de réponses qui cite ses sources à chaque phrase. À l'écran : on lui pose une question technique récente et on ouvre les sources pour vérifier la réponse. À retenir : c'est le réflexe à avoir pour vérifier une information avant de construire dessus.

**O-006 · Découvrir NotebookLM**  
L'outil de Google pour apprendre à partir de ses propres documents. À l'écran : on importe une documentation technique, on pose des questions et on génère un résumé audio. À retenir : ses réponses citent toujours le passage source : idéal pour apprendre une réglementation ou une doc.

### Coder avec l'IA : agents et éditeurs

**O-007 · Découvrir Claude Code**  
L'agent de code d'Anthropic, dans le terminal, sur le web et dans les éditeurs. À l'écran : on lui demande d'expliquer un projet, puis d'ajouter une fonctionnalité et de lancer les tests. À retenir : une tâche, une demande, un commit : on relit toujours la différence avant de valider, et il fonctionne aussi dans le navigateur, sur mobile et tablette (workflow full web).

**O-008 · Découvrir OpenAI Codex CLI** · 🖥️ Poste local  
L'agent de code d'OpenAI qui s'exécute en local dans le terminal. À l'écran : on le connecte au compte ChatGPT et on lui fait corriger un bug ciblé dans un dossier. À retenir : toujours le lancer à la racine du projet, pour qu'il voie tout le contexte.

**O-009 · Découvrir Cursor** · 🖥️ Poste local  
Un éditeur de code avec agent intégré, pour écrire, déboguer et relire. À l'écran : on ouvre un projet, on sélectionne une fonction et on demande une modification guidée, fichier par fichier. À retenir : surveiller sa consommation de requêtes sur les gros projets.

**O-010 · Découvrir GitHub Copilot**  
L'assistant de code de GitHub, dans les éditeurs et directement sur GitHub. À l'écran : on assigne une petite issue à l'agent Copilot et on relit la pull request qu'il propose. À retenir : c'est l'outil le plus présent en entreprise : souvent déjà payé par l'employeur. Workflow full web : tout se passe dans GitHub, sans rien installer.

**O-011 · Découvrir Gemini CLI**  
L'agent open source de Google, en terminal, avec une très grande fenêtre de contexte. À l'écran : on lui fait analyser un gros dépôt en une seule fois et résumer son architecture. À retenir : il faut prévoir une clé API : l'accès par abonnement grand public a été retiré.

**O-012 · Découvrir Aider** · 🖥️ Poste local  
Un agent de pair programming en terminal, compatible avec de nombreux modèles. À l'écran : on lui confie une modification et on montre qu'il crée un commit propre pour chaque changement. À retenir : idéal pour choisir librement son modèle, y compris un modèle local.

**O-013 · Découvrir Cline** · 🖥️ Poste local  
Un agent de code pour VS Code qui demande validation à chaque action. À l'écran : on le branche avec sa propre clé API et on suit le coût affiché à chaque étape. À retenir : sa transparence en fait un excellent outil pour apprendre ce que fait un agent.

**O-014 · Découvrir Goose**  
Un agent local extensible, en ligne de commande ou en application, avec outils MCP. À l'écran : on lui ajoute une extension MCP et on lui fait automatiser une tâche hors code. À retenir : très puissant, mais il demande un peu de configuration au départ.

**O-015 · Découvrir Kiro**  
L'agent de code d'AWS qui part des spécifications et des tests. À l'écran : on écrit une spec, on la fait valider, puis l'agent génère le code et les tests associés. À retenir : son approche « spec d'abord » structure bien les projets plus ambitieux.

**O-016 · Découvrir Pi**  
Un agent de code minimaliste en terminal, extensible et multi-fournisseurs. À l'écran : on montre son SDK en construisant un petit agent personnalisé. À retenir : pour les profils qui aiment bricoler leur propre outillage.

**O-017 · Découvrir Ollama** · 🖥️ Poste local  
Un outil pour faire tourner des modèles d'IA sur sa propre machine. À l'écran : on installe un modèle de 8 milliards de paramètres et on lui parle hors ligne. À retenir : gratuit et privé, mais moins puissant : choisir un modèle adapté à sa machine.

**O-018 · Découvrir LM Studio** · 🖥️ Poste local  
Une application de bureau pour télécharger et utiliser des modèles locaux en un clic. À l'écran : on cherche un modèle, on le télécharge et on lance une conversation sans terminal. À retenir : la porte d'entrée la plus douce vers l'IA locale.

**O-019 · Découvrir Hugging Face**  
Le grand hub des modèles, jeux de données et démos d'IA ouverts. À l'écran : on trouve un modèle, on teste sa démo en ligne (Space) et on lit sa fiche. À retenir : ses cours gratuits sont parmi les meilleurs pour progresser.

**O-020 · Découvrir Model Context Protocol (MCP)**  
Le standard ouvert qui permet de brancher une IA à des outils et des données. À l'écran : on ajoute un serveur MCP à Claude Code et on montre l'agent l'utiliser pour lire un vrai service. À retenir : c'est la compétence clé pour construire des agents utiles : à comprendre absolument.

**O-021 · Découvrir VS Code** · 🖥️ Poste local  
L'éditeur de code gratuit de Microsoft, le plus utilisé au monde. À l'écran : on l'installe, on ouvre un dossier, on découvre le terminal intégré et les extensions. À retenir : c'est la base sur laquelle se greffent Copilot, Cline et bien d'autres.

**O-022 · Découvrir Warp Terminal**  
Un terminal moderne pensé pour travailler avec des agents. À l'écran : on tape une commande en langage naturel et Warp la traduit en vraie commande. À retenir : agréable même pour qui a peur du terminal.

### Créer des apps sans tout coder

**O-023 · Découvrir Lovable**  
Un générateur d'applications complètes, branché à Supabase et GitHub. À l'écran : on décrit une app, on la génère, puis on connecte Supabase et GitHub en deux clics. À retenir : les crédits partent vite en itérations de design : préparer son brief avant. Exporte vers GitHub pour continuer en full web.

**O-024 · Découvrir Bolt.new**  
Le créateur d'applications de StackBlitz, directement dans le navigateur. À l'écran : on génère un prototype en quelques minutes, puis on l'exporte vers GitHub. À retenir : exporter vers GitHub dès que le projet grossit. Exporte vers GitHub pour continuer en full web.

**O-025 · Découvrir v0**  
L'IA de Vercel qui génère des interfaces React de qualité. À l'écran : on génère un tableau de bord, on ajuste un composant, puis on déploie en un clic. À retenir : parfait pour des écrans soignés ; la logique métier se fait ensuite ailleurs. Exporte vers GitHub pour continuer en full web.

**O-026 · Découvrir Replit**  
Un environnement en ligne avec agent, hébergement et base de données inclus. À l'écran : on demande un outil interne à Replit Agent et on le publie sans quitter la page. À retenir : pratique pour apprendre et pour les petits outils internes. Exporte vers GitHub pour continuer en full web.

**O-027 · Découvrir Dyad**  
Une alternative locale et open source à Lovable et Bolt. À l'écran : on crée une app sur sa machine avec son propre fournisseur de modèle. À retenir : le code reste chez soi : on ne paie que le modèle utilisé.

**O-028 · Découvrir Onlook**  
Un éditeur visuel qui modifie directement le code de l'interface. À l'écran : on déplace et restyle un élément à la souris et on voit le code changer. À retenir : idéal pour les profils visuels qui veulent garder la main sur le code.

**O-029 · Découvrir Blink.new**  
Un constructeur d'apps et de sites avec backend, comptes et base de données intégrés. À l'écran : on génère un MVP présentable et on le met en ligne dans la même séance. À retenir : son design par défaut moderne fait gagner du temps sur une première version.

**O-030 · Découvrir Figma**  
L'outil de design de référence pour maquettes et prototypes cliquables. À l'écran : on dessine un écran simple, puis on s'en sert comme référence visuelle pour l'IA. À retenir : parler Figma facilite énormément le travail avec des designers.

### Design et inspiration

**O-031 · Découvrir Minimal Gallery**  
Une galerie de sites minimalistes haut de gamme, sélectionnés à la main. À l'écran : on choisit deux références et on les donne à l'agent au lieu d'un vague « fais beau ». À retenir : moins utile pour les interfaces denses comme les tableaux de bord.

**O-032 · Découvrir Godly**  
Des sites choisis pour leur exigence et leurs animations, avec vidéo d'aperçu. À l'écran : on analyse une landing page primée et on en extrait trois idées réutilisables. À retenir : s'inspirer, oui ; copier tel quel, non : combiner avec son propre design system.

**O-033 · Découvrir Refero Styles**  
Plus de 2 000 styles de vrais produits, avec leurs typographies et palettes. À l'écran : on choisit une paire de polices et une palette, puis on l'exporte dans un DESIGN.md. À retenir : un style éprouvé en production vaut mieux qu'un mélange improvisé.

**O-034 · Découvrir Component Gallery**  
Des milliers d'exemples montrant comment les design systems résolvent un même composant. À l'écran : on compare trois façons de faire des onglets et on choisit la plus claire. À retenir : gratuit et très pédagogique, même pour les non-designers.

**O-035 · Découvrir Mobbin**  
Des parcours d'applications réelles capturés écran par écran. À l'écran : on étudie un onboarding de référence et on le reproduit dans son projet. À retenir : la version gratuite suffit pour démarrer.

**O-036 · Découvrir Awwwards**  
La vitrine historique des sites web primés. À l'écran : on parcourt les gagnants du mois et on note ce qui rend chacun mémorable. À retenir : ces sites sont souvent lourds : ne pas imiter aveuglément.

**O-037 · Découvrir 3D Icons**  
Une bibliothèque d'icônes 3D gratuites pour un rendu premium. À l'écran : on intègre trois icônes dans un hero et on les optimise en WebP. À retenir : toujours compresser les images pour garder une page rapide.

### Prompts et contexte visuel

**O-038 · Découvrir ScrollTide**  
Des centaines de prompts primés et le code de sites 3D et animés au défilement. À l'écran : on copie un prompt dans un agent et on obtient une section spectaculaire. À retenir : parfait pour un effet « wow », à doser pour garder un site lisible.

**O-039 · Découvrir DESIGN.md**  
Un format de design system écrit en Markdown, lisible directement par les agents. À l'écran : on place un DESIGN.md à la racine du projet et on montre l'agent respecter les couleurs et polices. À retenir : un seul fichier suffit à rendre un agent cohérent visuellement.

**O-040 · Découvrir VibePrompt**  
Des prompts prêts à l'emploi pour tableaux de bord et landing pages. À l'écran : on prend un prompt, on l'adapte à son projet et on compare le résultat. À retenir : un bon point de départ quand on ne sait pas formuler une demande d'interface.

### Composants d'interface

**O-041 · Découvrir shadcn/ui**  
La bibliothèque de composants de référence, copiés directement dans ton code. À l'écran : on ajoute un bouton et une boîte de dialogue en une commande, puis on change le thème. À retenir : les agents la connaissent parfaitement : c'est le choix le plus sûr.

**O-042 · Découvrir 21st.dev**  
Un registre de composants communautaires qui se branche aux agents via MCP. À l'écran : on demande un composant depuis l'éditeur grâce au MCP « Magic ». À retenir : une vitrine idéale de composants compatibles shadcn.

**O-043 · Découvrir Aceternity UI**  
Plus de 200 composants React et Tailwind animés. À l'écran : on assemble un hero spectaculaire en quelques minutes. À retenir : trop d'effets nuisent à la lisibilité et à la vitesse : doser.

**O-044 · Découvrir Magic UI**  
Des composants animés pour les sections marketing modernes. À l'écran : on installe un composant via la CLI shadcn et on l'intègre à une landing page. À retenir : c'est le complément naturel de shadcn/ui.

**O-045 · Découvrir Uiverse**  
Des boutons, loaders et interrupteurs en pur CSS créés par la communauté. À l'écran : on copie un bouton et on l'adapte aux couleurs de son projet. À retenir : la qualité varie : relire le code avant de l'intégrer.

**O-046 · Découvrir Shadcnblocks**  
Des blocs complets (hero, tarifs, pied de page) prêts à assembler. À l'écran : on construit une landing page entière en empilant quatre blocs. À retenir : une partie des blocs est payante.

**O-047 · Découvrir mapcn**  
Des composants de cartes interactives au style shadcn. À l'écran : on affiche des lieux avec marqueurs et fenêtres d'information. À retenir : utile dès qu'un projet montre des adresses ou des itinéraires.

### Animations et effets

**O-048 · Découvrir Kinetics**  
Environ 150 micro-interactions à ressorts, chacune livrée avec son prompt. À l'écran : on copie le prompt d'une interaction dans l'agent et on l'applique à un bouton. À retenir : sans dépendance et sous licence MIT : idéal pour le vibe coding.

**O-049 · Découvrir Motion Primitives**  
Des composants d'animation sobres basés sur Motion et Tailwind. À l'écran : on anime l'apparition d'une liste sans surcharger la page. À retenir : donner de la vie sans distraire : c'est tout l'art de l'animation.

**O-050 · Découvrir Liquid Glass**  
Des effets de réfraction façon « verre liquide ». À l'écran : on applique l'effet à une carte et on vérifie le rendu sur plusieurs navigateurs. À retenir : effet surtout fiable sur les navigateurs basés sur Chromium.

**O-051 · Découvrir CSS Text Effects**  
Des effets de titres créatifs en pur CSS. À l'écran : on anime le titre d'un hero sans une ligne de JavaScript. À retenir : une touche d'originalité à réserver aux titres principaux.

**O-052 · Découvrir Circle Loaders**  
Des animations de chargement originales. À l'écran : on remplace le spinner par défaut par un loader aux couleurs du site. À retenir : vérifier le lien et la licence avant usage.

**O-053 · Découvrir Gradient Buttons**  
Plus de 100 styles de boutons en dégradé, CSS inclus. À l'écran : on choisit un bouton d'appel à l'action et on l'aligne sur sa palette. À retenir : rester cohérent avec son design system.

**O-054 · Découvrir Shadertoy**  
La plus grande bibliothèque de shaders GLSL à étudier et remixer. À l'écran : on adapte un shader pour en faire un fond animé de page. À retenir : vérifier la licence de chaque shader avant de l'utiliser.

**O-055 · Découvrir Anime.js**  
Une bibliothèque JavaScript d'animation légère et bien documentée. À l'écran : on crée une petite timeline qui anime trois éléments à la suite. À retenir : les agents l'utilisent sans difficulté : un excellent choix sans framework.

### Contexte et spécifications

**O-056 · Découvrir Context7**  
Un MCP qui injecte la documentation à jour des bibliothèques dans l'agent. À l'écran : on montre l'agent se tromper sur une API, puis réussir avec Context7 activé. À retenir : un des MCP les plus rentables à installer.

**O-057 · Découvrir Caliber**  
Un outil qui génère et synchronise les règles d'agents pour Claude Code, Cursor et Codex. À l'écran : on écrit ses règles une fois et on les retrouve dans les trois outils. À retenir : utile si on alterne entre plusieurs agents.

**O-058 · Découvrir Filesystem MCP**  
Le serveur MCP de référence pour donner à un agent un accès contrôlé aux fichiers. À l'écran : on autorise un seul dossier et on montre l'agent y lire et écrire. À retenir : toujours limiter les dossiers autorisés.

**O-059 · Découvrir GitHub + GitHub MCP**  
Les dépôts, issues et pull requests accessibles aux agents. À l'écran : l'agent ouvre une pull request, et le site se déploie automatiquement après la fusion. À retenir : le dépôt GitHub est le pivot de tout projet sérieux. Workflow full web : tout se passe dans GitHub, sans rien installer.

**O-060 · Découvrir Notion MCP**  
Le MCP officiel pour lire et mettre à jour Notion depuis un agent. À l'écran : l'agent lit une spec dans Notion et coche la tâche une fois le code écrit. À retenir : ne partager que les pages nécessaires.

**O-061 · Découvrir OpenSpec**  
Une méthode et un outil de développement piloté par les spécifications. À l'écran : on rédige une spec, on la valide, puis l'agent code en la suivant. À retenir : valider la spec avant le code évite les mauvaises surprises.

### Données, backend et mise en ligne

**O-062 · Découvrir Supabase**  
Postgres, comptes, stockage et fonctions, avec un MCP officiel. À l'écran : on crée une table, on active la sécurité RLS et on lit les données depuis l'app. À retenir : toujours activer la RLS avant de publier.

**O-063 · Découvrir Neon**  
Une base Postgres serverless avec des branches de base de données. À l'écran : on crée une branche pour tester une migration générée par l'IA, sans risque. À retenir : son offre gratuite est généreuse pour démarrer.

**O-064 · Découvrir Cloudflare**  
Hébergement, Workers, base D1 et protection, déployés à chaque push. À l'écran : on relie un dépôt GitHub et on publie un site, puis on ajoute un secret. À retenir : les clés vont dans les secrets, jamais dans le code. Chaque branche reçoit un aperçu : c'est le cœur du workflow full web.

**O-065 · Découvrir Netlify**  
Hébergement et déploiement continu pour sites et apps front-end. À l'écran : on publie un site et on montre la prévisualisation automatique par branche. À retenir : les aperçus par branche facilitent la relecture avant mise en ligne. Chaque branche reçoit un aperçu : c'est le cœur du workflow full web.

**O-066 · Découvrir E2B**  
Des bacs à sable cloud pour exécuter le code généré par une IA en sécurité. À l'écran : on fait tourner un script généré dans une sandbox isolée. À retenir : indispensable dès qu'on construit ses propres agents.

**O-067 · Découvrir Publish.my**  
La publication de sites statiques en une commande, pilotée par agent. À l'écran : on met en ligne une page générée en quelques secondes. À retenir : limité aux sites statiques.

**O-068 · Découvrir XcodeBuildMCP**  
Un MCP pour compiler, lancer et déboguer des apps Apple avec un agent. À l'écran : l'agent compile une app iOS et corrige une erreur de build. À retenir : nécessite un Mac et Xcode.

**O-069 · Découvrir Cloudinary**  
Le stockage et la diffusion optimisée d'images et de vidéos. À l'écran : on sert une image redimensionnée et compressée automatiquement selon l'écran. À retenir : des médias légers, c'est un site plus rapide et mieux référencé.

**O-070 · Découvrir Google Drive**  
Le stockage et le partage de documents, accessible aux agents via connecteur. À l'écran : l'agent lit un brief stocké dans Drive pour démarrer un projet. À retenir : ne partager que les dossiers utiles.

### Automatiser

**O-071 · Découvrir n8n**  
Un outil open source d'automatisation et d'agents IA visuels. À l'écran : on construit un workflow qui trie les emails entrants avec une IA et répond automatiquement. À retenir : très demandé en entreprise, et auto-hébergeable pour garder ses données.

**O-072 · Découvrir Make**  
Un outil d'automatisation visuelle avec des milliers d'intégrations. À l'écran : on relie un formulaire, un tableur et un email en un scénario. À retenir : tester sur de fausses données avant de brancher les vraies.

**O-073 · Découvrir Zapier**  
L'automatisation la plus connue, avec le plus grand nombre d'intégrations. À l'écran : on crée un « Zap » qui prévient sur messagerie à chaque nouvelle vente. À retenir : souvent déjà présent chez les clients : un bon point d'entrée.

### Qualité, sécurité et suivi

**O-074 · Découvrir Playwright MCP**  
L'automatisation officielle du navigateur, pilotable par un agent. À l'écran : l'agent ouvre l'app, teste l'inscription et rapporte une capture d'écran. À retenir : indispensable pour vérifier une interface générée.

**O-075 · Découvrir Agent QA**  
Des tests web et mobiles écrits et exécutés en langage naturel. À l'écran : on décrit un parcours en français et l'outil le teste. À retenir : lire la licence avant un usage commercial.

**O-076 · Découvrir PR-Agent**  
Un relecteur automatique de pull requests, open source. À l'écran : on ouvre une pull request et on lit les remarques générées. À retenir : une seconde paire d'yeux ne remplace pas la relecture humaine.

**O-077 · Découvrir Prbl**  
Un scanner des failles typiques du code généré par IA. À l'écran : on scanne un projet et on corrige une clé exposée détectée. À retenir : à lancer avant chaque mise en ligne.

**O-078 · Découvrir Qodo**  
Un moteur de revue de code et de génération de tests par IA. À l'écran : on génère des tests pour une fonction existante et on les lance. À retenir : surtout pertinent pour les équipes.

**O-079 · Découvrir Semgrep**  
Une analyse de sécurité du code, utilisable par un agent via MCP. À l'écran : l'agent scanne son propre code et corrige une faille avant de le rendre. À retenir : des règles éprouvées et gratuites pour les cas courants.

**O-080 · Découvrir Sentry**  
La surveillance des erreurs d'application en production. À l'écran : on provoque une erreur et on montre l'alerte, puis l'agent qui lit la trace pour corriger. À retenir : ne jamais envoyer de données personnelles dans les erreurs.

### Espace de travail et suivi des agents

**O-081 · Découvrir Delta (Zed)**  
Un espace multijoueur où agents et humains travaillent ensemble. À l'écran : deux agents travaillent sur un projet et l'humain commente leurs changements. À retenir : prometteur, encore en bêta.

**O-082 · Découvrir Duckweed**  
Un espace local qui regroupe agents, terminaux et différences Git. À l'écran : on suit dans une seule fenêtre tout ce qu'un agent produit. À retenir : projet jeune : tester sur un dépôt non critique.

**O-083 · Découvrir llm.log**  
Un proxy local qui mesure coûts, tokens et requêtes. À l'écran : on lance une session d'agent et on lit son coût réel à la fin. À retenir : savoir ce qu'on dépense, c'est garder le contrôle.

**O-084 · Découvrir Parallel Code**  
Plusieurs agents dans des copies isolées du projet, avec revue des changements. À l'écran : trois agents explorent trois solutions ; on garde la meilleure. À retenir : très efficace pour comparer des approches.

**O-085 · Découvrir Shep**  
Un orchestrateur qui pousse des agents jusqu'aux brouillons de pull request. À l'écran : on lui confie trois petites tâches et on relit les pull requests créées. À retenir : pour vider un backlog de petites tâches.

**O-086 · Découvrir Superagent**  
Une interface macOS autour de Claude Code ou Codex, avec outils navigateur et iOS. À l'écran : on pilote un agent en interface graphique plutôt qu'en terminal. À retenir : réservé aux Mac à puce Apple.

**O-087 · Découvrir usage**  
Un petit utilitaire qui affiche les quotas des agents dans la barre de menu. À l'écran : on montre la jauge de quota se remplir pendant une session. À retenir : pour ne plus être surpris par une limite atteinte.

### Voix et images

**O-088 · Découvrir ElevenLabs**  
La référence de la synthèse vocale réaliste et des agents vocaux. À l'écran : on transforme un texte en voix off, puis on crée un petit agent vocal. À retenir : toujours respecter les droits sur les voix utilisées.

**O-089 · Découvrir Midjourney**  
Un générateur d'images reconnu pour la qualité de ses visuels. À l'écran : on génère trois visuels cohérents pour une landing page. À retenir : garder un même style d'un visuel à l'autre.

### Web3 et blockchain

**O-090 · Découvrir Remix IDE**  
L'éditeur Solidity dans le navigateur, sans installation. À l'écran : on écrit un petit contrat, on le compile et on le déploie sur un réseau de test. À retenir : la porte d'entrée de tout développeur Solidity.

**O-091 · Découvrir Foundry**  
La boîte à outils pour compiler, tester et déployer des smart contracts. À l'écran : on écrit un test, puis un test de fuzzing qui trouve un cas limite. À retenir : les auditeurs l'utilisent au quotidien.

**O-092 · Découvrir Hardhat**  
Un environnement de développement Ethereum en JavaScript. À l'écran : on lance un réseau local et on teste un contrat avec un script. À retenir : très répandu dans les équipes JavaScript.

**O-093 · Découvrir OpenZeppelin**  
Des contrats audités et réutilisables (tokens, contrôle d'accès…). À l'écran : on crée un token ERC-20 à partir du modèle OpenZeppelin. À retenir : ne jamais réinventer un token : partir de contrats éprouvés.

**O-094 · Découvrir Slither**  
Un analyseur statique de code Solidity. À l'écran : on lance Slither sur un contrat et on lit les failles détectées. À retenir : premier passage obligatoire avant un audit.

**O-095 · Découvrir Tenderly**  
Un outil pour simuler et déboguer des transactions. À l'écran : on rejoue une transaction qui échoue et on trouve la ligne en cause. À retenir : simuler avant d'envoyer, c'est éviter de perdre des fonds.

**O-096 · Découvrir Etherscan**  
L'explorateur de la blockchain Ethereum. À l'écran : on suit une transaction, on lit un contrat vérifié et ses événements. À retenir : le premier réflexe d'analyse on-chain.

**O-097 · Découvrir Dune**  
Des requêtes SQL sur les données de la blockchain et des tableaux de bord publics. À l'écran : on construit un graphique sur l'activité d'un token. À retenir : une vitrine idéale pour un portfolio d'analyste.

**O-098 · Découvrir The Graph**  
L'indexation des événements blockchain, interrogeables en GraphQL. À l'écran : on interroge les événements d'un contrat pour alimenter une DApp. À retenir : indispensable pour des applications Web3 rapides.

**O-099 · Découvrir thirdweb**  
Des outils pour connecter un wallet et déployer des contrats prêts à l'emploi. À l'écran : on ajoute un bouton « Connecter mon wallet » à une app. À retenir : le raccourci du vibe-coder Web3.

**O-100 · Découvrir Safe**  
Le portefeuille multisignature de référence. À l'écran : on crée un Safe à trois signataires et on valide une transaction à deux. À retenir : toute trésorerie ou clé d'administration devrait être sur un multisig.

**O-101 · Découvrir Snapshot**  
L'outil de vote des DAO, sans frais de transaction. À l'écran : on crée une proposition et on fait voter des membres de test. À retenir : des règles de vote claires évitent les conflits.

### IA physique et objets connectés

**O-102 · Découvrir Home Assistant**  
La plateforme domotique open source de référence. À l'écran : on ajoute une ampoule et un capteur, puis on crée une automatisation. À retenir : tout peut fonctionner en local, sans cloud.

**O-103 · Découvrir ESPHome**  
Programmer une carte ESP32 sans coder, avec un simple fichier de configuration. À l'écran : on crée un capteur de température et on le voit apparaître dans Home Assistant. À retenir : le chemin le plus court vers son premier objet connecté.

**O-104 · Découvrir Arduino**  
La plateforme de prototypage électronique la plus populaire. À l'écran : on fait clignoter une LED, puis on lit un capteur de lumière. À retenir : une énorme communauté répond à presque toutes les questions.

**O-105 · Découvrir Raspberry Pi**  
Un mini-ordinateur Linux pour l'IoT et l'IA embarquée. À l'écran : on installe le système et on fait tourner une petite détection d'objets avec une caméra. À retenir : le couteau suisse de l'IA physique.

**O-106 · Découvrir Node-RED**  
Un outil de flux visuels pour relier objets, API et tableaux de bord. À l'écran : on relie un capteur MQTT à une alerte et à un graphique. À retenir : c'est l'équivalent de n8n pour le monde des objets.

**O-107 · Découvrir Mosquitto (MQTT)**  
Un serveur de messages MQTT, la langue des objets connectés. À l'écran : on publie un message depuis un capteur et on le reçoit sur un tableau de bord. À retenir : toujours protéger le serveur par mot de passe et chiffrement.

**O-108 · Découvrir ROS 2**  
Le standard logiciel pour faire travailler capteurs et moteurs d'un robot. À l'écran : on lance une simulation de robot et on lui envoie une commande de déplacement. À retenir : exigé dans la quasi-totalité des offres en robotique.

**O-109 · Découvrir NVIDIA Isaac Sim**  
Un simulateur réaliste pour tester des robots avant le monde réel. À l'écran : on fait naviguer un robot virtuel dans un entrepôt simulé. À retenir : simuler avant de risquer du matériel.

**O-110 · Découvrir LeRobot**  
Les modèles, jeux de données et outils open source de Hugging Face pour la robotique. À l'écran : on montre un bras robotique abordable apprendre un geste par démonstration. À retenir : la porte d'entrée open source de la robotique IA.

**O-111 · Découvrir Edge Impulse**  
Entraîner des modèles d'IA légers pour microcontrôleurs. À l'écran : on entraîne un modèle qui reconnaît un mot-clé vocal et on le déploie sur une carte. À retenir : l'IA embarquée sans être data scientist.

**O-112 · Découvrir Unity**  
Le moteur 3D le plus utilisé pour la réalité augmentée et virtuelle. À l'écran : on place un objet 3D dans une scène AR sur téléphone. À retenir : le moteur le plus demandé dans les offres XR.

**O-113 · Découvrir three.js + WebXR**  
La 3D et la réalité augmentée directement dans le navigateur. À l'écran : on ouvre une expérience AR depuis un simple QR code, sans installation. À retenir : idéal pour prototyper une expérience AR accessible à tous.

## Récapitulatif

| Série | Nombre |
|---|---|
| P · Présentation (P-01 à P-09) | 9 |
| F · Premiers pas (40) + variantes `-W` (5) | 45 |
| T · Tutos outils (12) + variante `-W` (1) | 13 |
| O · Capsules outils | 113 |
| **Total** | **180** |

*Les variantes facultatives F-11-W, F-17-W et F-18-W en ajouteraient 3.*

Ordre de production conseillé : P-01 et **P-09**, puis P-05, puis les vidéos A de F-01 à F-10, **puis F-07-W, F-09-W, F-16-W, F-08-W, F-20-W et T-01-W**, puis les capsules O des outils les plus cités (Claude, ChatGPT, Claude Code, Cursor, Lovable, Supabase, GitHub, Cloudflare, n8n, Make).
