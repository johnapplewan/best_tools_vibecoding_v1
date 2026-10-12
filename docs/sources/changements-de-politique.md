# Changements de politique signalés par awesome-vibecoding

**Constat établi le 12 oct. 2026** à partir du dépôt [Scap-Mehdi/awesome-vibecoding](https://github.com/Scap-Mehdi/awesome-vibecoding), dernier commit `697b573` du 9 oct. 2026 : `README.fr.md`, `docs/lifecycle-review-2026-09-18.md`, `docs/catalog-history.md`, `data/catalog-status.json`. La revue de cycle de vie date du **18 sept. 2026**. Ces informations peuvent évoluer : revérifiez-les avant de les citer.

## Chiffres clés (README actuel)

- La liste principale est passée de **156 à 40 outils** le 18 sept. 2026. Elle exclut les produits arrêtés, archivés, fermés aux nouveaux utilisateurs ou non vérifiables (`data/catalog-status.json` : « 156 prior tool entries and 27 learning resources »).
- Le README actuel compte **43 outils** dans « Trouver des outils par tâche » : les 40 du 18 sept., plus Delta (20 sept.) et Prbl (23 sept.). Sans compter les notes de cycle de vie, c'est un ajout de plus que ce qu'indiquait le document de l'exercice. VDLC (4 oct.) est une ressource d'apprentissage, pas un outil.

## Accès retirés ou restreints

| Outil | Changement | Date | Statut dans la liste |
|---|---|---|---|
| Gemini CLI | Accès grand public (Code Assist / AI Pro / Ultra) **retiré**. Seuls la clé API, Vertex ou l'offre entreprise restent possibles | 18 juin 2026 | Conservé (liste principale) |
| Sourcegraph Cody | Offres Free / Pro / Enterprise Starter terminées. Seul Cody Enterprise reste | 23 juil. 2025 | Catalogue étendu |
| Firebase Studio | Inscriptions et nouveaux espaces de travail fermés. Fermeture totale prévue le 22 mars 2027 | 22 juin 2026 | Exclu (« sunsetting ») |
| Databutton → Riff | Renommé. Accès au constructeur d'apps pour les nouveaux utilisateurs incertain | — | Exclu (renommé) |

## Outils arrêtés ou en fin de vie

| Outil | Changement | Remplaçant suggéré |
|---|---|---|
| GitHub Spark | Fin pour les nouveaux utilisateurs le 4 août 2026, fin de l'éditeur le 31 août 2026 (fin de `llm()` le 30 juil.). Les apps déjà déployées restent en ligne | GitHub Copilot |
| Amazon Q Developer (plugins IDE) | Support des plugins arrêté le 30 avril 2027 | Kiro |
| Supermaven | Arrêt annoncé le 21 nov. 2025 (conversations agent supprimées, autocomplétion conservée) | Cursor |
| Windsurf / Codeium | Renommé **Devin Desktop** le 2 juin 2026 | Devin Desktop |
| CodeSandbox AI (Boxy) | Déprécié depuis juillet 2024 | — |
| Phind | Entreprise inactive | — |
| Roo Code | Dépôt archivé (mai 2026). Les créateurs proposent Roomote | — |
| Void, Aide, gpt-engineer, opencode | Dépôts archivés ou dépréciés | Crush (pour opencode) |
| E2B MCP | Archivé et déprécié. Le SDK E2B reste listé | E2B SDK |
| MCP « legacy » (GitHub, Slack, PostgreSQL, Puppeteer, Brave Search) | Implémentations de référence archivées | GitHub MCP officiel, etc. |

## Gratuit, bêta et payant

| Outil | Politique | Vérifié le |
|---|---|---|
| Delta (Zed) | **Gratuit pendant la bêta publique**, offres payantes prévues | 2026-09-20 |
| Prbl | Scan et GitHub Action gratuits. **Correcteur et dépôts privés payants** | 2026-09-23 |
| Publish.my | Offre gratuite, sites statiques uniquement, activation par email. Offres payantes « bientôt » | 2026-09-18 |
| Vibe Coding with Confidence (guide) | Chapitres de base gratuits, **chapitres avancés payants** (correction d'une ancienne mention « gratuit ») | 2026-09-18 |
| La plupart des outils commerciaux | Mention « Vérifier le prix » : le tarif n'a pas été revu en détail | 2026-09-18 |

## Licences à surveiller

| Outil | Licence | Conséquence |
|---|---|---|
| Agent QA | FSL-1.1-ALv2 | Source disponible, **restriction d'usage concurrent**, donc pas « open source » au sens strict |
| Sentry MCP | Functional Source License | Source disponible, restriction d'usage concurrent |
| usage | AGPL-3.0 | Copyleft fort |
| Pi, Shep, Superagent, llm.log, Parallel Code | MIT | Permissive |
| Playwright MCP | Apache-2.0 | Permissive. Conditions du modèle séparées |
| Duckweed | « Source disponible, voir la licence » | À lire avant usage |

Rappel du README : *une licence open source du client ne rend pas l'inférence du modèle gratuite*.
