# Module de veille — « envoie n'importe quoi, je décrypte »

Spécification fonctionnelle · version 1 · 12 oct. 2026

## Le principe

Depuis le raccourci iOS (ou le partage Android, ou la page `/admin`), vous envoyez **n'importe quel texte** :
- un nom d'outil, de module, d'app ou de skill ;
- un lien GitHub, npm, un site, une vidéo YouTube, Instagram ou TikTok ;
- une phrase (« le truc pour faire des slides avec Claude vu hier »).

La plateforme lance une **analyse complète** et vous rend un verdict **🟢 vert / 🟠 orange / 🔴 rouge**.

## Le parcours

```
Envoi (raccourci iOS) → File d'attente → Identification → Décryptage → Audit sécurité → Verdict
      → 🟢/🟠 : brouillon d'actu + script vidéo dans votre compte → vous validez → publication
      → 🔴 : archivé avec la raison, visible seulement par vous
```

L'analyse se lance **dès l'envoi**. La **tâche quotidienne** traite en plus la playlist YouTube « IA » et relance les analyses échouées.

## 1. Identification

- Si c'est un lien vidéo, la plateforme récupère le titre, la description et la chaîne (YouTube et TikTok par leur accès officiel ; pour Instagram, uniquement ce qui est public).
- Une **recherche web** trouve l'outil exact : site officiel, dépôt GitHub, paquet npm ou PyPI.
- En cas de doute (plusieurs outils du même nom), l'analyse s'arrête et vous demande de choisir.

## 2. Décryptage de l'utilité

- Ce que fait l'outil, en 2 phrases simples.
- Pour qui, et dans quelle catégorie du catalogue.
- Prix et accès : gratuit, freemium, payant, liste d'attente.
- Outils proches déjà au catalogue, avec ce qu'il apporte de plus.

## 3. Audit de sécurité (automatique et indicatif)

| Contrôle | Source |
|---|---|
| Étoiles GitHub, date du dernier commit, nombre de contributeurs, dépôt archivé ou non | API GitHub |
| Licence (open source, source disponible, propriétaire) | GitHub et site |
| Failles de sécurité connues | Base OSV.dev et alertes GitHub |
| Nom suspect, proche d'un outil connu (typosquatting) | Comparaison avec npm, PyPI et le catalogue |
| Accès demandés (lecture du code, des emails, du navigateur, des clés API…) | Documentation de l'outil |
| Politique de confidentialité, entraînement de l'IA sur vos données | Site de l'outil |
| Incidents ou alertes récents | Recherche web |
| Produit arrêté, renommé ou fermé aux nouveaux utilisateurs | awesome-vibecoding et recherche web |

> Il s'agit d'un **pré-audit automatique**, pas d'un audit de sécurité professionnel. La page publique le précise.

## 4. Le verdict

| Feu | Signification | Exemples de raisons |
|---|---|---|
| 🟢 **Vert** | Recommandable | Maintenu, licence claire, pas de faille connue, accès demandés raisonnables |
| 🟠 **Orange** | Intéressant, avec précautions | Jeune projet, peu maintenu, accès étendus, prix flou, bêta |
| 🔴 **Rouge** | À éviter | Faille non corrigée, abandonné, suspicion d'arnaque, collecte de données abusive |

Chaque verdict affiche **ses raisons**, pour que vous puissiez le contester ou le corriger.

## 5. Ce qui est produit

**Pour 🟢 vert :**
- **3 usages intéressants** et concrets (« utilisez-le pour… ») ;
- un **brouillon d'actu** ;
- un **script vidéo** ;
- une proposition d'ajout au catalogue.

**Pour 🟠 orange :** un brouillon d'actu avec un encadré « Points d'attention », et un script vidéo.

**Pour 🔴 rouge :** rien de public. Une fiche privée avec les raisons.

**Le script vidéo** (dans votre espace `/admin`), au format court de 30 à 60 secondes :
1. **Accroche** (3 secondes) : le problème ou l'effet « waouh ».
2. **Démo** en 3 temps : ce qu'on fait, comment, le résultat.
3. **Verdict** : feu vert ou orange, et pour qui.
4. **CTA** : « Commente **[MOT-CLÉ]** et je t'envoie le lien en DM ».

Il est fourni avec une légende pour le post, des hashtags, et le mot-clé du CTA, unique par outil.

**Publication :** rien n'est publié automatiquement. Vous validez chaque actu en un clic, et pouvez la modifier avant.

## 6. Le raccourci iOS

- Il s'appelle « Veille Vibe » et apparaît dans le menu « Partager » de toutes les apps, ou se lance avec Siri (« Veille Vibe »).
- Il accepte un lien partagé, un texte sélectionné ou une saisie libre.
- Il envoie le contenu à `/api/veille` avec un **jeton personnel secret**, généré dans votre espace `/admin` et révocable à tout moment.
- Il répond « ✅ Reçu, analyse en cours ». Le résultat arrive dans `/admin`, avec une notification Telegram en option.

## 7. Plus tard : l'envoi du lien en DM sans ManyChat

À étudier dans une étape séparée. Instagram autorise les réponses automatiques aux commentaires, mais seulement par son API officielle : il faut un compte professionnel, une application Meta et la validation de cette application par Meta. C'est faisable sans ManyChat, mais plus long à mettre en place.

## Ce qu'il faudra fournir

- **Une clé API Claude**, ajoutée comme secret du Worker. Elle sert à l'analyse, à la recherche web et à l'écriture (quelques centimes par analyse).
- *Optionnel* : une clé API YouTube (gratuite) pour la playlist « IA ».
- *Optionnel* : un bot Telegram pour les notifications.
