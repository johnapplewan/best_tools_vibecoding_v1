# Check-up de ton App, avec rapport d'analyse critique

## Check-up express (`/checkup`)
- Réservé aux membres connectés et inscrits ; **1 par membre** (illimité pour l'admin).
- Le membre donne le lien de son app ou de son dépôt public, puis une description.
- Analyse par Claude Sonnet 5.5 (modifiable avec la variable `CHECKUP_MODEL`) : recherche web limitée, informations publiques uniquement, aucun test intrusif. Coût indicatif : 0,20 à 0,60 $.
- Le résultat comprend :
  - le verdict 🟢 🟠 🔴 et les points analysés par domaine (technique, sécurité, vie privée et RGPD, produit et UX, marché et cibles, modèle économique) ;
  - les points intéressants, risqués et incertains, et les axes d'amélioration ;
  - les 3 priorités, les angles morts et les sources ;
  - la note sur 10 en fin de rapport, dans la plage de la couleur.
- Traitement en file d'attente (tâche planifiée toutes les 5 minutes, 3 tentatives) ; bouton « Relancer » dans `/admin`.

## Check-up complet (`/checkup-complet`)
- La landing page présente ce que le membre saura après le Check-up, le dossier PDF, le déroulé, les 40 points analysés, les besoins couverts et la FAQ.
- Aucun prix n'est affiché : il est annoncé lors de l'appel.
- **Demande de rappel** : le projet, l'objectif, un mot sur le besoin, les jours (lun–sam) et les tranches horaires (9–12 h, 12–14 h, 14–18 h, 18–21 h).
- **Contact** uniquement via un lien déjà présent sur le profil du membre (Telegram, Signal ou WhatsApp en lien QR). Aucun numéro n'est demandé ni stocké.
- L'admin reçoit une notification sur le site. La demande apparaît dans `/admin` (bloc « Check-up ») avec un bouton « Contacter » et un statut : Nouvelle → Contacté → Terminée.
- La suite se fait hors plateforme pour l'instant : appel de cadrage, saisie du formulaire, analyse avec Claude, relecture, puis envoi du PDF.

Mention affichée partout : pré-diagnostic assisté par IA (et relu par un humain pour le complet), pas une certification ni un audit officiel.
