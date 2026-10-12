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
- *(Optionnel)* Worker → *Settings → Variables and secrets* :
  - `RATING_SALT` : une phrase secrète au hasard, pour hacher les IP.
  - `GITHUB_TOKEN` : un jeton GitHub en lecture seule, pour ne pas atteindre la limite de l'API.

Adresse : https://best-tools-vibecoding-v1.johnapplewan.workers.dev/outils

**Connexion GitHub** : OAuth App avec l'adresse de retour `https://best-tools-vibecoding-v1.johnapplewan.workers.dev/auth/callback`, et les secrets `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` (en Production). Les comptes admin sont listés dans `ADMIN_GITHUB_LOGINS` (`wrangler.jsonc`).

### Tester en local

```bash
printf 'DEV_LOGIN=1\nADMIN_GITHUB_LOGINS=dev-user-1\n' > .dev.vars   # connexion factice, locale uniquement
npx wrangler@4 dev
# puis ouvrir http://localhost:8787/auth/dev-login?n=1 (membre 1), ?n=2 (membre 2)…
```

## Avis visiteurs : comment l'unicité est garantie

- Pas d'email, pas de compte.
- Un identifiant aléatoire est enregistré dans le navigateur, **et** l'adresse IP est hachée (SHA-256 + sel). L'IP n'est jamais stockée en clair.
- Un seul vote par outil : si l'identifiant **ou** l'IP a déjà voté, le vote est refusé (contrainte `UNIQUE` dans D1).
- Limite connue : deux personnes derrière la même connexion (bureau, box) ne peuvent pas noter le même outil.

## Plateforme communautaire (en préparation)

- [`docs/plateforme/creer-ici.md`](docs/plateforme/creer-ici.md) : spécification de l'atelier « Créer ici »
- [`public/legal/cgu.md`](public/legal/cgu.md) : conditions générales d'utilisation, affichées sur `/cgu` (brouillon à faire relire)
- [`public/legal/charte.md`](public/legal/charte.md) : charte déontologique des membres, affichée sur `/charte`
- [`docs/plateforme/veille.md`](docs/plateforme/veille.md) : module de veille (raccourci iOS, analyse, feu tricolore, script vidéo)
