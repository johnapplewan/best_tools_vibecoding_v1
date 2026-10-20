# Charte graphique vidéo · Vibe Tools

Version 1 · 20 oct. 2026 · s'applique à toutes les vidéos listées dans [`comment-faire-videos.md`](comment-faire-videos.md).

**L'idée en une phrase** : des vidéos sombres et lumineuses à la fois, qui reprennent l'identité du site : un fond nuit, des halos violet-rose-cyan, des cartes en verre et des mouvements liquides, lents à l'entrée et doux à l'arrivée. Ça doit faire **premium, calme et clair**, jamais gadget.

---

## 1. Les cinq principes

1. **Une idée par scène.** Si une scène dit deux choses, on la coupe en deux.
2. **Le contenu d'abord, l'effet ensuite.** Un effet qui n'aide pas à comprendre est retiré.
3. **Tout bouge comme un liquide.** Pas d'apparition sèche : chaque élément glisse, s'étire et se pose.
4. **La même grammaire partout.** Mêmes couleurs, mêmes polices, mêmes transitions dans les 173 vidéos : c'est ce qui fait « pro ».
5. **Lisible sur téléphone.** Chaque écran doit se lire en format 9:16 sur un téléphone tenu à bout de bras.

---

## 2. Formats

| Format | Dimensions | Usage |
|---|---|---|
| **16:9** (principal) | 1920 × 1080, 30 i/s | Site, YouTube |
| **9:16** | 1080 × 1920, 30 i/s | Shorts, Reels, TikTok, mobile |
| **1:1** | 1080 × 1080 | Aperçu dans les fiches et réseaux |

- **Marges de sécurité** : 96 px autour en 16:9. En 9:16, 120 px en haut et 280 px en bas, pour ne pas être caché par les interfaces des réseaux sociaux.
- **Grille** : 12 colonnes en 16:9, 4 colonnes en 9:16. Les textes s'alignent toujours sur une colonne, jamais « à l'œil ».
- **Export** : MP4 H.264, débit 12 à 16 Mb/s en 1080p, audio AAC 48 kHz. Sous-titres en fichier `.srt` à part, et incrustés pour les réseaux.

---

## 3. Couleurs

Les vidéos utilisent la **version sombre** du site : les couleurs ressortent mieux et l'effet est plus cinématographique.

### Fonds

| Rôle | Couleur | Code |
|---|---|---|
| Fond principal | Nuit | `#07070C` |
| Fond secondaire | Nuit bleutée | `#0D0D15` |
| Carte en verre | Verre sombre | `#16162299` (70 % d'opacité) + flou 24 px |
| Bordure de carte | Blanc à 7 % | `#FFFFFF12` |

### Couleurs de marque

| Rôle | Nom | Code |
|---|---|---|
| Principale | Violet | `#8B7DFF` |
| Secondaire | Rose | `#FF6FAE` |
| Tertiaire | Cyan | `#38D3F5` |
| Texte principal | Blanc doux | `#F3F3F8` |
| Texte secondaire | Gris lavande | `#A3A3B8` |
| Texte discret | Gris | `#6F6F86` |

**Le dégradé signature** (titres et accents) : violet `#8B7DFF` → rose `#FF6FAE` → cyan `#38D3F5`, à 100°. On l'utilise pour **un seul mot par écran** au maximum, jamais pour un paragraphe.

**Les halos** (le « fond aurora » du site) : deux grandes taches floues (flou 80 à 120 px) en fond, une violette `#7C6CFF` à 28 % en haut à gauche, une rose `#FF5FA2` à 16 % en haut à droite. Elles dérivent très lentement (voir la partie 7).

### Couleurs fonctionnelles (toujours avec le même sens)

| Sens | Code | Exemple |
|---|---|---|
| ✅ Validé, bien | `#34D399` | Compétence validée, bonne pratique |
| ⚠️ Attention | `#FBBF24` | Point de vigilance, feu orange |
| ⛔ Erreur, danger | `#F87171` | Piège à éviter, faille |

### Couleurs des six portes d'« Évoluer »

| Porte | Code |
|---|---|
| Publics et projets | `#F59E0B` |
| Compétences | `#8B5CF6` |
| Outils | `#0EA5E9` |
| Certifs | `#10B981` |
| Jobs | `#EC4899` |
| Où et comment | `#64748B` |

### Règles

- Au maximum **trois couleurs vives à l'écran** en même temps, plus le fond.
- Le texte se pose toujours sur le fond nuit ou sur une carte en verre, jamais directement sur un dégradé.
- Contraste minimal de 4,5:1 pour tout texte (largement atteint en blanc doux sur nuit).

---

## 4. Typographie

| Usage | Police | Graisse | Taille en 16:9 | Taille en 9:16 |
|---|---|---|---|---|
| Grand titre | **Inter** | ExtraBold 800, interlettrage −2 % | 96 à 120 px | 88 à 104 px |
| Mot mis en avant | **Instrument Serif** *italique* | Regular, en dégradé | même taille que le titre | même taille |
| Sous-titre | Inter | SemiBold 600 | 44 à 56 px | 48 à 56 px |
| Texte courant | Inter | Medium 500 | 32 à 40 px | 40 à 44 px |
| Étiquette / petit titre | Inter | Bold 700, MAJUSCULES, interlettrage +8 % | 22 à 26 px | 28 px |
| Code, commande | **JetBrains Mono** | Medium 500 | 28 à 34 px | 32 px |
| Sous-titres (voix off) | Inter | SemiBold 600, sur bandeau noir à 60 % | 40 px | 46 px |

Les trois polices sont gratuites (Google Fonts).

**La signature typographique du site** : un titre en Inter très gras, dont **un mot** passe en Instrument Serif italique avec le dégradé. Par exemple : « Comment *faire…* ? », « Évoluer, *à ta façon* ».

**Règles** :
- 7 mots maximum par ligne de titre et 3 lignes maximum par écran.
- Toujours en phrase normale (pas de titre tout en majuscules, sauf les petites étiquettes).
- Le texte reste à l'écran au moins le temps de le lire deux fois : environ 1 seconde pour 3 mots, et jamais moins de 1,5 seconde.

---

## 5. Style d'illustration

**Le style** : des **objets 3D doux et brillants**, façon pâte de verre, posés dans un espace sombre, avec un éclairage violet et rose. On pense à des icônes 3D lisses, pas à des personnages de dessin animé.

| Élément | Style |
|---|---|
| **Icônes** | 3D doux (style « 3D Icons » ou « clay » brillant), ou icônes au trait fin de 2 px (Lucide, Phosphor) en blanc doux. Ne pas mélanger les deux dans une même scène. |
| **Interfaces** | Captures réelles des outils, posées dans une **carte en verre** : coins arrondis à 24 px, bordure fine, légère ombre portée violette, inclinaison 3D de 4 à 8° qui se redresse en entrant. |
| **Code** | Fenêtre d'éditeur sombre, coloration syntaxique dans la palette (mots-clés violets, chaînes roses, nombres cyan), curseur qui clignote. Le code s'écrit lettre par lettre. |
| **Schémas** | Lignes fines de 2 px, nœuds ronds aux couleurs des six portes, flèches animées en tracé progressif. |
| **Personnages** | Évités. S'il en faut un, une silhouette stylisée en verre, sans visage réaliste. |
| **Logo** | Le carré arrondi au dégradé conique violet-rose-cyan, avec l'étoile ✦ blanche, et « Vibe Tools » en Inter Bold. |
| **Émojis** | Seulement ceux déjà utilisés dans l'appli (🧭 🗺️ 📚 🚀 🎯 🧰 🎓 💼 📍), en grand, comme des pictogrammes. |

**À proscrire** :
- les banques d'images photo génériques (poignées de main, personnes devant un écran) ;
- le flat design plat et coloré « années 2015 » ;
- les visages générés par IA ;
- les écrans d'ordinateur en perspective avec reflets ;
- les dégradés arc-en-ciel ;
- les vraies données personnelles ou les vraies clés d'API à l'écran.

---

## 6. Motion design : le mouvement « liquide »

### Les courbes de mouvement (à régler une fois, puis réutiliser partout)

| Nom | Usage | Réglage |
|---|---|---|
| **Liquide** (par défaut) | Entrées, déplacements | Courbe de Bézier `0.22, 1, 0.36, 1` (sortie douce et longue) |
| **Ressort doux** | Cartes, boutons, éléments qui « se posent » | Ressort : raideur 170, amortissement 22, masse 1 (léger rebond, sans oscillation visible) |
| **Sortie** | Éléments qui partent | Bézier `0.64, 0, 0.78, 0`, et 30 % plus rapide que l'entrée |
| **Dérive** | Halos, particules de fond | Linéaire, très lente (une boucle de 12 à 20 s) |

**Les durées** :
- micro-mouvement : 200 à 300 ms ;
- entrée d'un élément : 500 à 700 ms ;
- changement de scène : 600 à 900 ms.

**Rien en dessous de 150 ms, rien au-dessus de 1,2 s.**

### Les règles du mouvement fluide

1. **Décalage en cascade** : quand plusieurs éléments entrent, ils arrivent les uns après les autres, avec 60 à 90 ms d'écart. Jamais tous ensemble.
2. **Entrée type** : l'élément monte de 24 à 40 px, passe de 0 à 100 % d'opacité et de 96 à 100 % de taille, en même temps, avec la courbe « Liquide ».
3. **Mouvement continu** : rien n'est jamais complètement figé. Pendant qu'on lit, le fond dérive et la carte principale « respire » (zoom de 100 à 102 % en 6 s).
4. **Flou de mouvement** léger sur les déplacements rapides (angle d'obturateur de 180°).
5. **Un seul mouvement principal à la fois** : l'œil suit ce qui bouge le plus. On ne fait pas bouger deux choses importantes en même temps.

### Les transitions maison (toujours les mêmes)

| Nom | Description | Quand |
|---|---|---|
| **Goutte** | Une goutte du dégradé s'étire depuis un bord, recouvre l'écran comme un liquide visqueux (effet « gooey »), puis se retire en révélant la scène suivante. 700 à 900 ms. | Entre deux parties d'une vidéo |
| **Fondu de verre** | La scène se floute (0 → 20 px) pendant que la suivante se défloute par-dessus. 600 ms. | Entre deux scènes d'une même partie |
| **Zoom carte** | On zoome dans une carte en verre et son contenu devient la scène suivante. | Pour entrer dans un détail |
| **Morphose** | Une forme se transforme en une autre (un cercle devient une carte, une icône devient un écran). | Pour relier deux idées |

**À proscrire** : volets, étoiles, cubes 3D qui tournent, fondus au blanc, glitch, secousses de caméra.

---

## 7. Effets

| Effet | Réglage | Usage |
|---|---|---|
| **Lueur (glow)** | Halo de la couleur de l'élément, flou 24 à 40 px, opacité 35 à 50 % | Boutons et éléments importants, avec parcimonie |
| **Verre (glassmorphism)** | Fond `#16162299`, flou d'arrière-plan 24 px, bordure blanche à 7 %, reflet léger en haut | Toutes les cartes |
| **Halos de fond (aurora)** | 2 ou 3 taches floues qui dérivent de 5 à 10 % de l'écran en 15 s | Fond de toutes les scènes |
| **Grain** | Bruit monochrome à 3 ou 4 % | Sur toute l'image, pour un rendu « cinéma » et contre les bandes dans les dégradés |
| **Lumière qui balaie** | Un reflet diagonal traverse une carte ou un titre en 800 ms | Une fois par vidéo maximum, sur l'élément clé |
| **Particules** | 20 à 40 petits points lumineux qui flottent lentement, opacité 20 % | Intro et outro uniquement |
| **Surlignage** | Un trait au dégradé se dessine sous un mot | Pour pointer un mot important |
| **Curseur et clic** | Curseur clair, cercle qui s'agrandit et s'efface au clic (300 ms) | Démonstrations d'outils |

**Accessibilité** : jamais plus de 3 flashs par seconde, aucun clignotement rapide, aucun effet stroboscopique.

---

## 8. Son

- **Musique** : électro douce ou lo-fi, 90 à 110 BPM, sans paroles. À −22 à −18 LUFS sous la voix et à −14 LUFS en intro et en outro.
- **Voix off** : chaleureuse, posée, tutoiement, environ 150 mots par minute. Normalisée à −16 LUFS.
- **Bruitages** : discrets et toujours les mêmes, à −24 LUFS :
  - « pop » doux pour l'entrée d'une carte ;
  - « whoosh » léger pour la transition Goutte ;
  - « tick » pour une case cochée ;
  - petit carillon pour une réussite (test validé, badge).
- **Synchronisation** : les entrées d'éléments tombent sur les temps de la musique quand c'est possible.

---

## 9. Habillage récurrent

| Élément | Description | Durée |
|---|---|---|
| **Intro** | Le logo ✦ se forme comme une goutte qui se pose, le dégradé conique tourne d'un quart de tour, puis « Vibe Tools » apparaît. | 1,5 s |
| **Carton de titre** | Le titre de la vidéo (signature Inter + Instrument Serif), le code de la vidéo en petit (ex. `F-04-A`), la porte ou la série en étiquette colorée. | 2,5 s |
| **Bandeau d'outil** | En bas à gauche : nom de l'outil + catégorie, dans une petite carte en verre. | Toute la démo |
| **Encadrés pédagogiques** | « 🔑 Pourquoi » (violet), « ⚠️ Piège à éviter » (orange), « 🎓 Conseil de senior » (bordure en pointillés orange), « 🏋️ Mini-défi » (vert). Mêmes couleurs que sur le site. | 3 à 5 s |
| **Récap** | Une carte en verre avec 1 à 3 points cochés ✅ qui apparaissent en cascade. | 4 s |
| **Outro** | « Retrouve la fiche sur Vibe Tools » + l'adresse de la page, le logo, et un appel à l'action simple (« Passe le test », « Ouvre la fiche »). | 3 s |

---

## 10. Structure type par série

| Série | Durée | Déroulé |
|---|---|---|
| **P** · Présentation | 60 à 90 s | Intro → promesse (5 s) → 3 scènes de démonstration → récap → outro |
| **F/T-A** · L'essentiel | 2 min | Intro → accroche (le problème) → contexte → pourquoi c'est important → objectif → encadré « Conseil de senior » → récap → outro |
| **F/T-B** · Pas-à-pas | 1 min | Carton de titre → 3 étapes numérotées à l'écran → encadré « Piège à éviter » → « Mini-défi » → outro |
| **O** · Découvrir un outil | 60 s | Carton + logo de l'outil → « C'est quoi » (10 s) → démonstration (35 s) → « À retenir » (10 s) → outro |

---

## 11. Sous-titres

- Toujours présents, en Inter SemiBold, blanc doux, sur un bandeau noir à 60 % aux coins arrondis à 12 px.
- 2 lignes maximum, 42 caractères maximum par ligne.
- Le mot clé de la phrase passe dans la couleur de la porte ou en violet.
- Ils sont placés en bas, dans la marge de sécurité. En 9:16, ils remontent au tiers inférieur.

---

## 12. Check-list avant publication

- [ ] Une idée par scène, et chaque texte se lit deux fois avant de disparaître
- [ ] Trois couleurs vives maximum par écran, le dégradé sur un seul mot
- [ ] Polices : Inter, Instrument Serif, JetBrains Mono, et rien d'autre
- [ ] Toutes les entrées utilisent la courbe « Liquide » ou le « Ressort doux », avec des décalages en cascade
- [ ] Transitions : uniquement Goutte, Fondu de verre, Zoom carte ou Morphose
- [ ] Aucune donnée personnelle, aucune vraie clé, aucun vrai email à l'écran
- [ ] Sous-titres présents et relus ; aucun flash rapide
- [ ] Son : voix à −16 LUFS, musique en retrait, bruitages discrets
- [ ] Intro et outro présentes, avec le code de la vidéo sur le carton de titre
- [ ] Vérifiée en 9:16 sur un vrai téléphone

---

## 13. Bloc à coller dans les prompts (Sonnet et l'appli de motion)

> **Charte Vibe Tools** : fond nuit `#07070C` avec deux halos flous qui dérivent lentement (violet `#7C6CFF` en haut à gauche, rose `#FF5FA2` en haut à droite) et un grain léger.
>
> Les contenus sont posés dans des cartes en verre sombre (`#16162299`, flou 24 px, coins de 24 px, bordure blanche à 7 %). Les titres sont en Inter ExtraBold blanc `#F3F3F8`, avec un seul mot en Instrument Serif italique au dégradé violet `#8B7DFF` → rose `#FF6FAE` → cyan `#38D3F5`. Le texte courant est en Inter Medium et le code en JetBrains Mono.
>
> Mouvement liquide et fluide : les éléments entrent en montant de 30 px, en fondu, avec un léger zoom, sur une courbe `0.22, 1, 0.36, 1` (500 à 700 ms) et en cascade de 80 ms. Les cartes se posent avec un ressort doux. Transitions par goutte liquide au dégradé ou par fondu de verre (flou). Aucune transition de type volet, cube ou glitch.
>
> Illustrations : icônes 3D douces et brillantes ou icônes au trait fin, captures d'outils réelles dans des cartes en verre. Pas de photos génériques ni de visages. Couleurs de sens : vert `#34D399` validé, orange `#FBBF24` attention, rouge `#F87171` erreur. Sous-titres en Inter SemiBold sur bandeau noir à 60 %. Formats 16:9 en 1920 × 1080 et 9:16 en 1080 × 1920.
