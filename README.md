# best_tools_vibecoding_v1
Page de référencement d'outils de vibe-coding sympa - A page listing cool vibe-coding tools

👉 La page : [`outils.html`](outils.html) (servie sur `/outils` par Cloudflare Pages)

## Contenu

| Fichier | Rôle |
|---|---|
| `outils.html` | La page : recherche, filtres, notes, étoiles GitHub, avis des visiteurs |
| `assets/tools.js` | **Les données** (72 outils). Pour ajouter ou modifier un outil, c'est ici |
| `functions/api/ratings.js` | API des avis visiteurs (Cloudflare D1) |
| `functions/api/stars.js` | API des étoiles GitHub (cache de 12 h) |
| `wrangler.toml` | Configuration Cloudflare Pages et liaison de la base D1 |
| `docs/sources/source-A-post-X.md` | Tableau des 25 ressources du post X |
| `docs/sources/source-B-awesome-vibecoding.md` | Outils d'awesome-vibecoding par tâche, avec accès et date de vérification |
| `docs/sources/changements-de-politique.md` | Accès retirés, arrêts, bêtas, licences (constat du 12 oct. 2026) |

## Sources

- **A** — Post X de Himanshu Hingorani, 9 oct. 2026 (`docs/Vibe-coding/Vibe-coding.png`)
- **B** — [awesome-vibecoding](https://github.com/Scap-Mehdi/awesome-vibecoding) (`README.fr.md`, vérifié au 18 sept. 2026)
- **C** — Mes outils

## Déploiement sur Cloudflare Pages

Le dépôt est relié à Cloudflare : chaque push déclenche un déploiement.

1. **Workers & Pages → Créer → Pages → Connecter à Git** et choisir ce dépôt.
   - Framework : *Aucun* · Commande de build : *(vide)* · Répertoire de sortie : `/`
2. C'est tout pour les avis : la base D1 `vibe-ratings` existe déjà, et `wrangler.toml` la lie automatiquement sous le nom **`DB`**.
3. *(Optionnel)* *Settings → Variables and secrets* :
   - `RATING_SALT` : une phrase secrète au hasard, pour hacher les IP.
   - `GITHUB_TOKEN` : un jeton GitHub en lecture seule, pour ne pas atteindre la limite de l'API.

Sans la base `DB`, la page fonctionne quand même : seuls les avis visiteurs affichent « indisponibles ».

### Tester en local

```bash
npx wrangler pages dev .
# puis ouvrir http://localhost:8788/outils
```

## Avis visiteurs : comment l'unicité est garantie

- Pas d'email, pas de compte.
- Un identifiant aléatoire est enregistré dans le navigateur, **et** l'adresse IP est hachée (SHA-256 + sel). L'IP n'est jamais stockée en clair.
- Un seul vote par outil : si l'identifiant **ou** l'IP a déjà voté, le vote est refusé (contrainte `UNIQUE` dans D1).
- Limite connue : deux personnes derrière la même connexion (bureau, box) ne peuvent pas noter le même outil.
