# Cookies et données personnelles

Politique de confidentialité de Vibe Tools · version [À COMPLÉTER : date]

> Cette page décrit ce que le site enregistre réellement, d'après son fonctionnement technique. Les passages marqués [À COMPLÉTER] relèvent de décisions ou d'informations juridiques à fournir par l'éditeur, idéalement avec l'aide d'un professionnel du droit.

## Responsable du traitement

- **Responsable** : [À COMPLÉTER : nom ou dénomination et adresse]
- **Contact pour vos données** : le [formulaire de contact](/contact), sujet « Données personnelles »
- **Délégué à la protection des données** : [À COMPLÉTER, le cas échéant]

## Le principe : des pseudonymes, pas d'identité

Le site fonctionne avec des **pseudonymes**. Il ne demande ni nom, ni prénom, ni numéro de téléphone, ni adresse postale. La seule adresse électronique collectée est celle que vous saisissez dans le formulaire de contact, pour pouvoir vous répondre.

## Données enregistrées

| Usage | Données | Base légale | Durée de conservation |
|---|---|---|---|
| Compte membre (connexion avec GitHub) | Identifiant numérique GitHub, nom d'utilisateur GitHub (jamais affiché), adresse de l'avatar GitHub, pseudo, identifiant membre (ex. VD-4F7K2), date d'acceptation des CGU, date de dernière visite | [À COMPLÉTER] | [À COMPLÉTER] ; supprimées avec le compte |
| Profil et showroom | Bio, spécialités, disponibilité, liens vers vos réseaux que vous choisissez d'afficher, projets (titre, présentation, liens, images), recommandations | [À COMPLÉTER] | [À COMPLÉTER] ; supprimées avec le compte |
| Session de connexion | Empreinte du jeton de session (le jeton lui-même n'est pas stocké) | [À COMPLÉTER] | 30 jours au plus (durée de la session) |
| Notes du catalogue (sans compte) | Note donnée, empreinte salée de l'adresse IP (l'IP n'est pas stockée en clair), identifiant aléatoire de l'appareil | [À COMPLÉTER] | [À COMPLÉTER] |
| Protection contre les abus | Empreinte salée de l'adresse IP et compteur de requêtes | [À COMPLÉTER] | Environ 2 jours (effacement automatique) |
| Signalements entre membres | Membre signalé, motif, membre qui signale | [À COMPLÉTER] | [À COMPLÉTER] ; supprimés avec le compte |
| Atelier « Créer ici » | Projets, candidatures, missions, réunions, votes, notifications | [À COMPLÉTER] | [À COMPLÉTER] |
| Check-up de ton App | Lien et description de l'application, résultat de l'analyse, demande de rappel (jours, créneaux, réseau choisi) | [À COMPLÉTER] | [À COMPLÉTER] ; supprimés avec le compte |
| Formulaire de contact | Adresse électronique, sujet, message, date | [À COMPLÉTER] | [À COMPLÉTER] ; supprimés sur demande |

Lors de la connexion avec GitHub, le site lit votre profil GitHub public, puis **révoque immédiatement** l'autorisation accordée : aucun jeton d'accès GitHub n'est conservé.

## Cookies et stockage dans votre navigateur

Relevé d'après le code du site :

| Nom | Type | Rôle | Durée |
|---|---|---|---|
| `vt_session` | Cookie (HttpOnly, SameSite=Lax) | Garder votre session de membre ouverte | 30 jours |
| `vt_oauth_state` | Cookie (HttpOnly, SameSite=Lax) | Sécuriser la connexion avec GitHub | 10 minutes |
| `vt-theme` | Stockage local | Mémoriser le thème clair ou sombre | Jusqu'à ce que vous l'effaciez |
| `vt-device` | Stockage local | Identifiant aléatoire pour éviter qu'un même appareil note deux fois un outil | Jusqu'à ce que vous l'effaciez |
| `cf2-…` | Stockage local | Progression sur la page « Comment faire ? » (fiches faites, feuille de route, compétences, certifs) | Jusqu'à ce que vous l'effaciez |

Le site n'intègre **aucun outil de mesure d'audience, aucune publicité et aucun bouton de réseau social**.

[À COMPLÉTER : vérifier dans le tableau de bord Cloudflare si des services ajoutent des traceurs (par exemple Web Analytics ou la protection anti-robots, qui peuvent déposer leurs propres cookies), puis indiquer ici la liste définitive des traceurs et la nécessité ou non d'un consentement.]

## Destinataires et services tiers

**Services utilisés par le serveur du site** :
- **Cloudflare** : hébergement du site, base de données et journaux techniques. [À COMPLÉTER : durée de conservation des journaux]
- **GitHub** : connexion des membres ; lecture des étoiles publiques des dépôts du catalogue.
- **Anthropic (Claude)** : analyse du lien et de la description envoyés pour un Check-up, et des éléments de veille de l'administrateur.
- **Telegram** : alerte envoyée à l'administrateur (sujet et référence d'un message de contact, demandes de rappel du Check-up). Le contenu du message de contact n'y est pas envoyé.
- **Resend** (si activé) : envoi par email à l'administrateur du message de contact, avec votre adresse en réponse.

**Ressources chargées par votre navigateur** (ces services reçoivent votre adresse IP et des informations techniques sur votre navigateur) :
- **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) : polices d'écriture, sur toutes les pages.
- **Google** (`www.google.com`, et les adresses `gstatic.com` vers lesquelles il redirige) : petites icônes des outils sur la page Outils.
- **GitHub** (`opengraph.githubassets.com`) : images d'aperçu des projets liés à un dépôt GitHub.
- **GitHub** (`avatars.githubusercontent.com`) : photo de profil, seulement pour les membres qui ont choisi d'afficher leur avatar GitHub.

[À COMPLÉTER : transferts de données hors de l'Union européenne et garanties applicables pour chacun de ces services.]

## Vos droits

Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation du traitement, vous y opposer, et demander leur portabilité. Écrivez-nous par le [formulaire de contact](/contact). [À COMPLÉTER : délai de réponse]

Les membres peuvent aussi modifier leur profil et **supprimer leur compte** eux-mêmes depuis la page [Mon profil](/moi) : le profil, les projets, les recommandations, les signalements, les check-ups et les sessions sont alors effacés.

Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL : [www.cnil.fr](https://www.cnil.fr)

## Effacer les données de votre navigateur

Vous pouvez effacer à tout moment les cookies et le stockage local du site depuis les réglages de votre navigateur. Vous serez alors déconnecté, et votre progression sur « Comment faire ? » sera remise à zéro.
