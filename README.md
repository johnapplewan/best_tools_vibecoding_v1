# best_tools_vibecoding_v1
Page de référencement d'outils de vibe-coding sympa - A page listing cool vibe-coding tools

👉 La page : [`public/outils.html`](public/outils.html) (servie sur `/outils` par un Worker Cloudflare)

## Contenu

| Fichier | Rôle |
|---|---|
| `public/outils.html` | La page : recherche, filtres, notes, étoiles GitHub, avis des visiteurs |
| `public/assets/tools.js` | **Les données** (72 outils). Pour ajouter ou modifier un outil, c'est ici |
| `src/api/ratings.js` | API des avis visiteurs (Cloudflare D1) |
| `src/api/stars.js` | API des étoiles GitHub (cache de 12 h dans D1) |
| `src/worker.js` | Point d'entrée du Worker : routes de l'API et de la connexion, puis les fichiers de `public/` |
| `src/api/auth.js` | Connexion GitHub (aucune permission demandée, jeton révoqué aussitôt) |
| `src/api/members.js` | Profil, showroom, recommandations, signalements, modération |
| `src/lib/` | Sessions, schéma de la base, validations (refus des numéros et emails) |
| `public/showroom.html` | Le showroom des vibe-devs (`/showroom`) |
| `public/moi.html` | Mon profil : inscription, fiche, 4 projets, modération (`/moi`) |
| `src/api/veille.js` | Veille : réception (raccourci iOS / admin), file d'attente, publication, Actualités |
| `src/veille/analyze.js` | Analyse par Claude : enquête web, pré-audit, verdict 🟢🟠🔴, script vidéo |
| `public/actualites.html` | Onglet Actualités public (`/actualites`) |
| `public/admin.html` | Tableau de bord de la veille, réservé à l'admin (`/admin`) |
| `src/api/atelier.js` | Atelier « Créer ici » : projets, équipe, missions, calendrier, réunions, continuité du porteur |
| `public/atelier.html` | Liste des projets « Créer ici » (`/atelier`) |
| `public/projet.html` | Un projet et ses onglets (`/projet?id=…`) |
| `public/indispo.html` | Codes de récupération du porteur : gel ou reprise du rôle (`/indispo`) |
| `public/cgu.html`, `public/charte.html` | Pages légales, rendues depuis `public/legal/*.md` |
| `wrangler.jsonc` | Configuration du Worker et liaison de la base D1 |
| `docs/sources/source-A-post-X.md` | Tableau des 25 ressources du post X |
| `docs/sources/source-B-awesome-vibecoding.md` | Outils d'awesome-vibecoding par tâche, avec accès et date de vérification |
| `docs/sources/changements-de-politique.md` | Accès retirés, arrêts, bêtas, licences (constat du 12 oct. 2026) |

## Sources

- **A** — Post X de Himanshu Hingorani, 9 oct. 2026 (`docs/Vibe-coding/Vibe-coding.png`)
- **B** — [awesome-vibecoding](https://github.com/Scap-Mehdi/awesome-vibecoding) (`README.fr.md`, vérifié au 18 sept. 2026)
- **C** — Mes outils

## Déploiement sur Cloudflare (Workers)

Le dépôt est relié au Worker Cloudflare **`best-tools-vibecoding-v1`** (Workers Builds) : chaque push sur `main` lance `npx wrangler deploy`.

- Le site est servi depuis `public/`. L'API (`/api/ratings`, `/api/stars`) passe par `src/worker.js`.
- La base D1 `vibe-ratings` est liée sous le nom **`DB`** dans `wrangler.jsonc`. Les tables sont créées automatiquement.
- Worker → *Settings → Variables and secrets* (type **Secret**) :
  - `RATING_SALT` (**recommandé**) : une longue phrase secrète au hasard, pour hacher les IP (votes et limites anti-abus).
  - `GITHUB_TOKEN` : un jeton GitHub en lecture seule, pour ne pas atteindre la limite de l'API.

Adresse : https://best-tools-vibecoding-v1.johnapplewan.workers.dev/outils

**Créer ici** : rien à configurer. Une tâche planifiée horaire (le même déclencheur que la veille) envoie les relances du porteur et des missions, et active les intérims à la fin du délai d'opposition.

**Veille** : secret `ANTHROPIC_API_KEY` (clé API Claude). Optionnel : variable `VEILLE_MODEL` pour changer de modèle (par défaut `claude-opus-5-5`). Une tâche planifiée (`triggers.crons`, toutes les 5 min) analyse la file. Coût indicatif : environ 0,25 à 0,50 $ par analyse avec Claude Opus 5.5 (recherche web comprise).

**Connexion GitHub** : OAuth App avec l'adresse de retour `https://best-tools-vibecoding-v1.johnapplewan.workers.dev/auth/callback`, et les secrets `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` (en Production). Les admins sont désignés par leur **identifiant GitHub numérique** dans `ADMIN_GITHUB_IDS` (`wrangler.jsonc`), qui ne change jamais même si le compte est renommé.

### Tester en local

```bash
printf 'DEV_LOGIN=1\nADMIN_GITHUB_IDS=900001\nVEILLE_MOCK=1\n' > .dev.vars   # connexion et analyse factices, locales uniquement
npm install
npx wrangler@4 dev --test-scheduled   # puis curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*"
# puis ouvrir http://localhost:8787/auth/dev-login?n=1 (membre 1), ?n=2 (membre 2)…
```

## Sécurité

- Connexion GitHub sans aucune permission ; jeton GitHub révoqué aussitôt ; session dans un cookie HttpOnly/Secure/SameSite, seule son empreinte est en base.
- Toute action qui modifie des données doit venir du site lui-même (contrôle de l'origine).
- Limites de fréquence par IP hachée (connexion, écritures, recommandations, signalements, avis, lecture du showroom) et quota quotidien de contacts par membre (`src/lib/ratelimit.js`).
- Liens de contact réservés aux membres connectés, délivrés au clic seulement.
- En-têtes : CSP stricte (aucune ressource externe sauf polices Google et images GitHub), anti-clickjacking, HSTS (`public/_headers`).
- Images de projet (vignettes paysage 2:1) : JPEG/PNG/WebP vérifiés sur leur contenu, 400 Ko max, 12 par membre, stockées dans D1 et servies sur `/img/…` avec une CSP qui bloque tout script. Case « Dépôt privé » : le lien GitHub n'est montré qu'au propriétaire.
- « Créer ici » : codes de récupération du porteur stockés sous forme d'empreinte, à usage unique et limités en nombre d'essais ; intérim encadré (vote, admin, 7 jours d'opposition) ; jamais d'éjection du porteur par un vote.
- Validation serveur : refus des numéros, emails et liens `wa.me/<numéro>` ; tout texte de membre est échappé à l'affichage.

## Avis visiteurs : comment l'unicité est garantie

- Pas d'email, pas de compte.
- Un identifiant aléatoire est enregistré dans le navigateur, **et** l'adresse IP est hachée (SHA-256 + sel). L'IP n'est jamais stockée en clair.
- Un seul vote par outil : si l'identifiant **ou** l'IP a déjà voté, le vote est refusé (contrainte `UNIQUE` dans D1).
- Limite connue : deux personnes derrière la même connexion (bureau, box) ne peuvent pas noter le même outil.

## Plateforme communautaire (en préparation)

- [`docs/plateforme/creer-ici.md`](docs/plateforme/creer-ici.md) : spécification de l'atelier « Créer ici » (en ligne sur `/atelier`, voir « Mise en œuvre »)
- [`public/legal/cgu.md`](public/legal/cgu.md) : conditions générales d'utilisation, affichées sur `/cgu` (brouillon à faire relire)
- [`public/legal/charte.md`](public/legal/charte.md) : charte déontologique des membres, affichée sur `/charte`
- [`docs/plateforme/veille.md`](docs/plateforme/veille.md) : module de veille (raccourci iOS, analyse, feu tricolore, script vidéo)
