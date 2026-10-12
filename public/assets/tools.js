// Données de la page outils.html — partagées par la page et par les fonctions Cloudflare.
// Sources : A = post X de Himanshu Hingorani (9 oct. 2026), B = awesome-vibecoding (README.fr.md,
// vérifié au 18 sept. 2026), C = outils que j'utilise déjà.
// rating = note éditoriale sur 5 ; repo = dépôt GitHub (owner/name) pour récupérer les étoiles.

export const CATEGORIES = {
  inspiration: { label: "Inspiration design", emoji: "🎨" },
  ui: { label: "Composants UI", emoji: "🧩" },
  motion: { label: "Animations & effets", emoji: "✨" },
  prompts: { label: "Prompts & design system", emoji: "📝" },
  code: { label: "Agents de code", emoji: "⌨️" },
  apps: { label: "Prototypage d'apps", emoji: "🚀" },
  context: { label: "Contexte & MCP", emoji: "🔌" },
  quality: { label: "Tests & sécurité", emoji: "🛡️" },
  delivery: { label: "Déploiement & données", emoji: "☁️" },
  workspace: { label: "Espaces de travail", emoji: "🗂️" },
};

export const SOURCES = {
  A: { label: "Post X", long: "Post X · Himanshu Hingorani · 9 oct. 2026" },
  B: { label: "awesome-vibecoding", long: "Liste awesome-vibecoding · vérifiée au 18 sept. 2026" },
  C: { label: "Mes outils", long: "Outils que j'utilise déjà" },
};

export const TOOLS = [
  // ───────────── Source A : 25 ressources du post X ─────────────
  {
    id: "scrolltide", name: "ScrollTide", url: "https://scrolltide.co", cat: "prompts", src: ["A"], tag: "Web",
    desc: "600+ prompts primés et le code source complet de sites 3D et scroll-driven : 100+ scènes 3D, 200+ dégradés interactifs, 200+ composants.",
    reco: "Idéal pour obtenir un effet « wow » en copiant un prompt dans Claude, Cursor ou Lovable. Le nom et le domaine ont été lus sur une capture basse résolution : vérifiez-les avant de payer quoi que ce soit.",
    rating: 3.5, unverified: true,
  },
  {
    id: "minimal-gallery", name: "Minimal Gallery", url: "https://minimal.gallery", cat: "inspiration", src: ["A"], tag: "Web",
    desc: "Galerie de sites haut de gamme et minimalistes, sélectionnés à la main.",
    reco: "Parfait pour donner des références visuelles précises à votre agent plutôt qu'un vague « fais beau ». Moins utile pour les interfaces denses type dashboard.",
    rating: 4,
  },
  {
    id: "godly", name: "Godly", url: "https://godly.website", cat: "inspiration", src: ["A"], tag: "Web",
    desc: "Sites web soigneusement choisis pour leur exigence de craft et leurs animations.",
    reco: "La meilleure source pour des landing pages audacieuses avec vidéo de prévisualisation. Combinez-la avec un design system pour éviter le copier-coller pur.",
    rating: 4.5,
  },
  {
    id: "refero-styles", name: "Refero Styles", url: "https://styles.refero.design", cat: "inspiration", src: ["A"], tag: "Web",
    desc: "2 000+ styles de vrais produits, avec leur typographie.",
    reco: "Très pratique pour choisir une paire de polices et une palette éprouvées en production. Exportez le style retenu dans votre DESIGN.md pour que l'agent s'y tienne.",
    rating: 4,
  },
  {
    id: "component-gallery", name: "Component Gallery", url: "https://component.gallery", cat: "inspiration", src: ["A"], tag: "Web",
    desc: "2 600+ exemples de la façon dont les grands design systems résolvent le même composant.",
    reco: "Indispensable quand vous hésitez sur l'anatomie d'un composant (tabs, combobox, toast…). Gratuit et pédagogique, même pour les non-designers.",
    rating: 4.5,
  },
  {
    id: "mobbin", name: "Mobbin", url: "https://mobbin.com", cat: "inspiration", src: ["A"], tag: "Web",
    desc: "Parcours d'applications réelles (web et mobile) capturés écran par écran.",
    reco: "La référence pour reproduire un onboarding, un checkout ou des réglages crédibles. La version gratuite est limitée, mais suffit pour démarrer.",
    rating: 4.5,
  },
  {
    id: "design-md", name: "DESIGN.md", url: "https://designmd.ai", cat: "prompts", src: ["A"], tag: "Format",
    desc: "Design systems décrits en Markdown que votre agent peut lire directement (format introduit par Google Stitch).",
    reco: "Un fichier à la racine du projet suffit à rendre Claude Code ou Cursor cohérents visuellement. Le domaine exact a été lu sur la capture : à confirmer.",
    rating: 4.5, unverified: true,
  },
  {
    id: "vibeprompt", name: "VibePrompt", url: "https://vibeprompts.dev", cat: "prompts", src: ["A"], tag: "Web",
    desc: "Prompts prêts à l'emploi pour dashboards et landing pages.",
    reco: "Bon point de départ quand on ne sait pas comment formuler une demande UI. Le domaine est difficile à lire sur la capture : vérifiez-le avant usage.",
    rating: 3, unverified: true,
  },
  {
    id: "21st-dev", name: "21st.dev", url: "https://21st.dev", cat: "ui", src: ["A"], tag: "MCP",
    desc: "Registre de composants qui se branche aux agents via MCP.",
    reco: "Le MCP « Magic » permet de demander un composant directement depuis l'éditeur. Excellente vitrine de composants communautaires shadcn-compatibles.",
    rating: 4.5,
  },
  {
    id: "kinetics", name: "Kinetics", url: "https://kinetics.colorion.co", cat: "motion", src: ["A"], tag: "Web",
    desc: "~150 micro-interactions à ressorts (spring physics), en CSS ou React, avec un prompt IA pour chacune.",
    reco: "Chaque effet est livré avec son prompt, ce qui en fait un compagnon parfait du vibe coding. Sans dépendance d'animation et sous licence MIT.",
    rating: 4,
  },
  {
    id: "shadcn-ui", name: "shadcn/ui", url: "https://ui.shadcn.com", cat: "ui", src: ["A"], tag: "React", repo: "shadcn-ui/ui",
    desc: "Toujours la référence pour une UI propre et réutilisable, copiée dans votre code.",
    reco: "Les agents connaissent parfaitement shadcn/ui : c'est le choix le plus sûr pour des résultats propres. À combiner avec Tailwind et un thème personnalisé.",
    rating: 5,
  },
  {
    id: "aceternity", name: "Aceternity UI", url: "https://ui.aceternity.com", cat: "ui", src: ["A"], tag: "React",
    desc: "200+ composants React/Tailwind animés.",
    reco: "Parfait pour un hero spectaculaire en quelques minutes. À doser : trop d'effets nuisent à la lisibilité et aux performances.",
    rating: 4,
  },
  {
    id: "magic-ui", name: "Magic UI", url: "https://magicui.design", cat: "ui", src: ["A"], tag: "React", repo: "magicuidesign/magicui",
    desc: "Composants magnifiquement conçus pour les applications web modernes.",
    reco: "Complément naturel de shadcn/ui pour les sections marketing animées. Open source et facile à installer via la CLI shadcn.",
    rating: 4.5,
  },
  {
    id: "motion-primitives", name: "Motion Primitives", url: "https://motion-primitives.com", cat: "motion", src: ["A"], tag: "React", repo: "ibelick/motion-primitives",
    desc: "Composants d'animation et d'interaction prêts à l'emploi.",
    reco: "Des animations sobres et élégantes basées sur Motion et Tailwind. Idéal pour donner de la vie à une app sans la surcharger.",
    rating: 4,
  },
  {
    id: "uiverse", name: "Uiverse", url: "https://uiverse.io", cat: "ui", src: ["A"], tag: "HTML/CSS", repo: "uiverse-io/galaxy",
    desc: "Éléments d'interface et composants interactifs créés par la communauté.",
    reco: "Une mine d'or de boutons, loaders et toggles en pur CSS à copier. La qualité varie : relisez le code avant de l'intégrer.",
    rating: 4,
  },
  {
    id: "shadcnblocks", name: "Shadcnblocks", url: "https://shadcnblocks.com", cat: "ui", src: ["A"], tag: "React",
    desc: "Des blocs complets (hero, pricing, footer…), pas seulement des boutons.",
    reco: "Fait gagner des heures pour assembler une landing page complète. Une partie des blocs est payante.",
    rating: 4,
  },
  {
    id: "mapcn", name: "mapcn", url: "https://mapcn.dev", cat: "ui", src: ["A"], tag: "React",
    desc: "Composants de cartes : marqueurs, itinéraires, popups.",
    reco: "Comble un vrai manque : des cartes interactives au style shadcn. Utile dès qu'un projet affiche des lieux.",
    rating: 3.5,
  },
  {
    id: "awwwards", name: "Awwwards", url: "https://www.awwwards.com", cat: "inspiration", src: ["A"], tag: "Web",
    desc: "Les sites qui ont réellement été primés.",
    reco: "La référence historique pour l'inspiration web haut de gamme. Attention : ces sites sont souvent très lourds, à ne pas imiter aveuglément.",
    rating: 4,
  },
  {
    id: "liquid-glass", name: "Liquid Glass", url: "https://glass.semanticui.com", cat: "motion", src: ["A"], tag: "Web",
    desc: "Composants et effets de réfraction façon « verre liquide ».",
    reco: "Pour suivre la tendance iOS 26 sans réinventer les filtres SVG. Domaine lu sur la capture à confirmer, et effet surtout fiable sur Chromium.",
    rating: 3, unverified: true,
  },
  {
    id: "css-text-effects", name: "CSS Text Effects", url: "https://text-effects.colorion.co", cat: "motion", src: ["A"], tag: "CSS",
    desc: "Animations et effets de texte créatifs en CSS.",
    reco: "Effets de titre prêts à copier, sans JavaScript. Pratique pour une touche d'originalité sur un hero.",
    rating: 3.5,
  },
  {
    id: "circle-loaders", name: "Circle Loaders", url: "https://circleloaders.colorion.co", cat: "motion", src: ["A"], tag: "CSS",
    desc: "Animations de chargement créatives.",
    reco: "Des loaders originaux pour remplacer le spinner par défaut. Le domaine est illisible sur la capture : vérifiez le lien.",
    rating: 3, unverified: true,
  },
  {
    id: "gradient-buttons", name: "Gradient Buttons", url: "https://gradientbuttons.colorion.co", cat: "motion", src: ["A"], tag: "CSS",
    desc: "100+ styles et effets de boutons en dégradé, CSS inclus.",
    reco: "Rapide pour trouver un call-to-action qui attire l'œil. Restez cohérent avec la palette de votre design system.",
    rating: 3.5,
  },
  {
    id: "shadertoy", name: "Shadertoy", url: "https://www.shadertoy.com", cat: "motion", src: ["A"], tag: "WebGL",
    desc: "Des shaders à étudier et à remixer.",
    reco: "La plus grande bibliothèque de shaders GLSL au monde, idéale pour des fonds animés uniques. Vérifiez la licence de chaque shader avant de l'utiliser.",
    rating: 4,
  },
  {
    id: "3dicons", name: "3D Icons", url: "https://3dicons.co", cat: "inspiration", src: ["A"], tag: "Assets",
    desc: "Bibliothèque d'icônes 3D gratuites pour interfaces modernes.",
    reco: "Des icônes 3D libres de droits qui donnent instantanément un look premium. Pensez à les optimiser (WebP) pour le poids des pages.",
    rating: 4,
  },
  {
    id: "animejs", name: "Anime.js", url: "https://animejs.com", cat: "motion", src: ["A"], tag: "JS", repo: "juliangarnier/anime",
    desc: "Bibliothèque JavaScript d'animation légère.",
    reco: "Légère, puissante et bien documentée : les agents l'utilisent sans difficulté. Excellent choix pour des timelines sans framework.",
    rating: 4.5,
  },

  // ───────────── Source B : awesome-vibecoding (liste principale) ─────────────
  // Code et édition
  {
    id: "aider", name: "Aider", url: "https://github.com/Aider-AI/aider", cat: "code", src: ["B"], tag: "CLI", repo: "Aider-AI/aider",
    desc: "Pair programming en terminal avec modèles cloud ou locaux et intégration Git.",
    reco: "Un classique open source qui commit proprement chaque changement. Idéal si vous voulez choisir librement votre modèle.",
    rating: 4,
  },
  {
    id: "claude-code", name: "Claude Code", url: "https://code.claude.com/docs/en/overview", cat: "code", src: ["B", "C"], tag: "CLI", repo: "anthropics/claude-code",
    desc: "Assistant de code agentique en terminal, sur le web et dans les IDE.",
    reco: "Mon outil principal : il lit le dépôt, modifie, teste et pousse en autonomie. Couplé aux MCP (GitHub, Supabase…), il couvre tout le cycle.",
    rating: 5,
  },
  {
    id: "cline", name: "Cline", url: "https://github.com/cline/cline", cat: "code", src: ["B"], tag: "IDE", repo: "cline/cline",
    desc: "Agent de code pour IDE, terminal et desktop, avec outils fichiers, commandes et navigateur.",
    reco: "Très transparent : chaque action est validée et le coût est affiché. Excellent dans VS Code avec votre propre clé API.",
    rating: 4,
  },
  {
    id: "cursor", name: "Cursor", url: "https://www.cursor.com/", cat: "code", src: ["B"], tag: "IDE",
    desc: "Éditeur et agent de code pour l'implémentation, le débogage et la revue.",
    reco: "L'IDE IA le plus populaire, très fluide pour itérer vite. Surveillez votre consommation de requêtes sur les gros projets.",
    rating: 4.5,
  },
  {
    id: "gemini-cli", name: "Gemini CLI", url: "https://github.com/google-gemini/gemini-cli", cat: "code", src: ["B"], tag: "CLI", repo: "google-gemini/gemini-cli",
    desc: "Agent open source en terminal, accès par clé API, Vertex ou offre entreprise.",
    reco: "Utile pour sa très grande fenêtre de contexte. L'accès grand public par abonnement a été retiré : prévoyez une clé API.",
    rating: 3.5,
  },
  {
    id: "github-copilot", name: "GitHub Copilot", url: "https://github.com/features/copilot", cat: "code", src: ["B"], tag: "IDE",
    desc: "Assistance au code et workflows d'agents dans GitHub et les IDE.",
    reco: "Intégration native à GitHub, idéale en équipe. Le mode agent sur les issues est pratique pour les petites tâches.",
    rating: 4,
  },
  {
    id: "goose", name: "Goose", url: "https://github.com/aaif-goose/goose", cat: "code", src: ["B"], tag: "CLI", repo: "aaif-goose/goose",
    desc: "Agent local extensible avec interfaces desktop et CLI, et outils MCP.",
    reco: "Bonne alternative open source pour automatiser au-delà du code. Sa richesse demande un peu de configuration.",
    rating: 3.5,
  },
  {
    id: "kiro", name: "Kiro", url: "https://kiro.dev", cat: "code", src: ["B"], tag: "IDE",
    desc: "Agent de code AWS avec spécifications et tests.",
    reco: "Son approche « specs d'abord » structure bien les gros projets. Particulièrement pertinent dans l'écosystème AWS.",
    rating: 3.5,
  },
  {
    id: "codex-cli", name: "OpenAI Codex CLI", url: "https://openai.com/codex/", cat: "code", src: ["B"], tag: "CLI", repo: "openai/codex",
    desc: "Agent de code OpenAI qui s'exécute localement dans le terminal.",
    reco: "Solide et rapide pour des tâches ciblées en local. Pertinent si vous avez déjà un abonnement OpenAI.",
    rating: 4,
  },
  {
    id: "pi", name: "Pi", url: "https://github.com/earendil-works/pi", cat: "code", src: ["B"], tag: "CLI", repo: "earendil-works/pi",
    desc: "Agent de code en terminal, extensible et intégrable comme harnais (MIT).",
    reco: "Minimaliste et multi-fournisseurs, avec un SDK pour construire vos propres agents. Pour les profils qui aiment bricoler leur outillage.",
    rating: 3.5,
  },
  // Prototypage d'applications
  {
    id: "bolt-new", name: "Bolt.new", url: "https://bolt.new/", cat: "apps", src: ["B"], tag: "Web", repo: "stackblitz/bolt.new",
    desc: "Création d'applications en langage naturel, par StackBlitz.",
    reco: "Démarrage instantané dans le navigateur, parfait pour un prototype en une heure. Exportez vite vers GitHub dès que le projet grossit.",
    rating: 4,
  },
  {
    id: "dyad", name: "Dyad", url: "https://github.com/dyad-sh/dyad", cat: "apps", src: ["B"], tag: "Desktop", repo: "dyad-sh/dyad",
    desc: "Créer des applications en local avec des fournisseurs de modèles configurables.",
    reco: "L'alternative locale et open source à Lovable/Bolt. Votre code reste chez vous, vous ne payez que le modèle.",
    rating: 3.5,
  },
  {
    id: "lovable", name: "Lovable", url: "https://lovable.dev/", cat: "apps", src: ["B"], tag: "Web",
    desc: "Génération d'applications full-stack avec Supabase.",
    reco: "Le plus abouti pour passer d'une idée à une app avec auth et base de données. Les crédits partent vite sur les itérations de design.",
    rating: 4.5,
  },
  {
    id: "onlook", name: "Onlook", url: "https://www.onlook.com/", cat: "apps", src: ["B"], tag: "Web", repo: "onlook-dev/onlook",
    desc: "Modifier visuellement les interfaces tout en travaillant sur le code.",
    reco: "Un « Figma dans le code » qui plaira aux profils visuels. Encore jeune, mais l'approche est prometteuse.",
    rating: 3.5,
  },
  {
    id: "replit", name: "Replit", url: "https://replit.com/", cat: "apps", src: ["B"], tag: "Web",
    desc: "Créer et itérer sur des applications avec Replit Agent.",
    reco: "Hébergement et base de données inclus : tout se passe au même endroit. Pratique pour l'apprentissage et les outils internes.",
    rating: 4,
  },
  {
    id: "v0", name: "v0", url: "https://v0.app/", cat: "apps", src: ["B"], tag: "Web",
    desc: "L'IA de Vercel pour générer des UI et du React.",
    reco: "Excellent pour générer des écrans React/shadcn de qualité. Le déploiement sur Vercel est en un clic.",
    rating: 4.5,
  },
  {
    id: "blink-new", name: "Blink.new", url: "https://blink.new", cat: "apps", src: ["C"], tag: "Web",
    desc: "Constructeur d'apps et de sites par IA, avec backend, auth et base de données intégrés.",
    reco: "Je l'utilise pour son design moderne par défaut et sa rapidité de mise en ligne. Très efficace pour un MVP présentable dès la première version.",
    rating: 4.5,
  },
  // Contexte & MCP
  {
    id: "caliber", name: "Caliber", url: "https://github.com/caliber-ai-org/ai-setup", cat: "context", src: ["B"], tag: "CLI", repo: "caliber-ai-org/ai-setup",
    desc: "Génère et synchronise les configurations d'agents pour Claude Code, Cursor et Codex.",
    reco: "Évite de maintenir trois fichiers de règles différents. Utile si vous alternez entre plusieurs agents.",
    rating: 3,
  },
  {
    id: "context7", name: "Context7", url: "https://github.com/upstash/context7", cat: "context", src: ["B", "C"], tag: "MCP", repo: "upstash/context7",
    desc: "Documentation à jour des bibliothèques injectée comme contexte.",
    reco: "Je l'utilise pour éviter que l'agent invente des API obsolètes. Un des MCP les plus rentables à installer.",
    rating: 5,
  },
  {
    id: "filesystem-mcp", name: "Filesystem MCP", url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem", cat: "context", src: ["B"], tag: "MCP", repo: "modelcontextprotocol/servers",
    desc: "Accès contrôlé des agents aux fichiers du projet.",
    reco: "Implémentation de référence pour comprendre MCP. Pas garantie pour la production : limitez bien les dossiers autorisés.",
    rating: 3.5,
  },
  {
    id: "github", name: "GitHub + GitHub MCP", url: "https://github.com/github/github-mcp-server", cat: "context", src: ["B", "C"], tag: "MCP", repo: "github/github-mcp-server",
    desc: "Dépôts, issues et pull requests accessibles aux agents.",
    reco: "Mon dépôt GitHub est le pivot de tout : l'agent y ouvre les PR et Cloudflare déploie à chaque push. Le MCP officiel rend ce flux fluide.",
    rating: 5,
  },
  {
    id: "neon", name: "Neon", url: "https://github.com/neondatabase/mcp-server-neon", cat: "delivery", src: ["B", "C"], tag: "MCP", repo: "neondatabase/mcp-server-neon",
    desc: "Postgres serverless, pilotable par les agents via MCP.",
    reco: "Les branches de base de données sont parfaites pour tester une migration générée par IA. Offre gratuite généreuse.",
    rating: 4.5,
  },
  {
    id: "notion", name: "Notion MCP", url: "https://developers.notion.com/guides/mcp/overview", cat: "context", src: ["B", "C"], tag: "MCP",
    desc: "MCP officiel hébergé pour chercher, lire et mettre à jour Notion.",
    reco: "Pratique pour donner à l'agent les specs et notes produit stockées dans Notion. Configurez finement les pages partagées.",
    rating: 4,
  },
  {
    id: "openspec", name: "OpenSpec", url: "https://github.com/Fission-AI/OpenSpec", cat: "context", src: ["B"], tag: "CLI", repo: "Fission-AI/OpenSpec",
    desc: "Développement piloté par les spécifications pour assistants de code.",
    reco: "Apporte de la rigueur : on valide la spec avant que l'agent écrive le code. Idéal pour les fonctionnalités complexes.",
    rating: 4,
  },
  {
    id: "supabase", name: "Supabase", url: "https://github.com/supabase/mcp", cat: "delivery", src: ["B", "C"], tag: "MCP", repo: "supabase/supabase",
    desc: "Postgres, auth, stockage et edge functions, avec un MCP officiel.",
    reco: "Mon backend par défaut : l'agent crée tables, policies RLS et fonctions directement. Activez toujours la RLS avant de publier.",
    rating: 5,
  },
  // Tests & sécurité
  {
    id: "agent-qa", name: "Agent QA", url: "https://github.com/vostride/agent-qa", cat: "quality", src: ["B"], tag: "MCP", repo: "vostride/agent-qa",
    desc: "Tests web et mobile écrits et exécutés en langage naturel.",
    reco: "Permet de tester un parcours sans écrire de code de test. Licence FSL à lire avant un usage commercial.",
    rating: 3,
  },
  {
    id: "playwright-mcp", name: "Playwright MCP", url: "https://github.com/microsoft/playwright-mcp", cat: "quality", src: ["B"], tag: "MCP", repo: "microsoft/playwright-mcp",
    desc: "Automatisation officielle du navigateur par instantanés structurés.",
    reco: "L'agent peut enfin voir et cliquer sur ce qu'il a construit. Indispensable pour vérifier une UI générée.",
    rating: 4.5,
  },
  {
    id: "pr-agent", name: "PR-Agent", url: "https://github.com/The-PR-Agent/pr-agent", cat: "quality", src: ["B"], tag: "GitHub", repo: "The-PR-Agent/pr-agent",
    desc: "Relecteur de pull requests maintenu par la communauté.",
    reco: "Une seconde paire d'yeux automatique sur chaque PR. Open source et configurable.",
    rating: 3.5,
  },
  {
    id: "prbl", name: "Prbl", url: "https://getprbl.com", cat: "quality", src: ["B"], tag: "Web",
    desc: "Scanner des failles fréquentes du code généré par IA, avec GitHub Action.",
    reco: "Ciblé sur les erreurs typiques du vibe coding (clés exposées, RLS absente…). Scan gratuit à lancer avant chaque mise en ligne.",
    rating: 4,
  },
  {
    id: "qodo", name: "Qodo", url: "https://www.qodo.ai", cat: "quality", src: ["B"], tag: "Web",
    desc: "Moteur de revue de code par IA (ex-CodiumAI).",
    reco: "Revue et génération de tests de bonne qualité. Pertinent surtout pour les équipes.",
    rating: 3.5,
  },
  {
    id: "semgrep", name: "Semgrep MCP", url: "https://github.com/semgrep/semgrep/tree/develop/cli/src/semgrep/mcp", cat: "quality", src: ["B"], tag: "MCP", repo: "semgrep/semgrep",
    desc: "Analyse de sécurité via le CLI Semgrep.",
    reco: "L'agent peut scanner son propre code avant de vous le rendre. Règles éprouvées et gratuites pour les cas courants.",
    rating: 4,
  },
  {
    id: "sentry", name: "Sentry", url: "https://github.com/getsentry/sentry-mcp", cat: "quality", src: ["B", "C"], tag: "MCP", repo: "getsentry/sentry-mcp",
    desc: "Erreurs d'application et diagnostic des échecs.",
    reco: "Je l'utilise pour que l'agent lise directement les stack traces de production. Le duo Sentry + agent raccourcit énormément le débogage.",
    rating: 4.5,
  },
  // Déploiement
  {
    id: "cloudflare", name: "Cloudflare", url: "https://github.com/cloudflare/mcp-server-cloudflare", cat: "delivery", src: ["B", "C"], tag: "MCP", repo: "cloudflare/mcp-server-cloudflare",
    desc: "Pages, Workers, D1, KV : déploiement et ressources cloud.",
    reco: "Ce site tourne sur un Worker Cloudflare, déployé à chaque push GitHub, avec D1 pour les avis et les profils. Rapide, gratuit pour démarrer et très complet.",
    rating: 5,
  },
  {
    id: "e2b", name: "E2B", url: "https://github.com/e2b-dev/E2B", cat: "delivery", src: ["B"], tag: "SDK", repo: "e2b-dev/E2B",
    desc: "Sandbox cloud sécurisée pour agents IA.",
    reco: "Pour exécuter du code généré sans risque pour votre machine. Surtout utile si vous construisez vos propres agents.",
    rating: 4,
  },
  {
    id: "publish-my", name: "Publish.my", url: "https://publish.my/", cat: "delivery", src: ["B"], tag: "Web",
    desc: "Publication de sites statiques pilotée par agents.",
    reco: "Le plus simple pour mettre en ligne une page générée en une commande. Limité aux sites statiques.",
    rating: 3,
  },
  {
    id: "xcodebuildmcp", name: "XcodeBuildMCP", url: "https://github.com/getsentry/XcodeBuildMCP", cat: "delivery", src: ["B"], tag: "MCP", repo: "getsentry/XcodeBuildMCP",
    desc: "Compiler, exécuter et déboguer des projets Apple.",
    reco: "Indispensable pour faire du vibe coding iOS/macOS avec un agent. Nécessite un Mac et Xcode.",
    rating: 4,
  },
  {
    id: "netlify", name: "Netlify", url: "https://www.netlify.com", cat: "delivery", src: ["C"], tag: "Web",
    desc: "Hébergement et déploiement continu de sites et apps front-end.",
    reco: "Une alternative fiable à Cloudflare Pages, avec des previews par branche très pratiques. Je le garde pour les projets qui l'utilisent déjà.",
    rating: 4,
  },
  {
    id: "cloudinary", name: "Cloudinary", url: "https://cloudinary.com", cat: "delivery", src: ["C"], tag: "API",
    desc: "Stockage, transformation et diffusion optimisée d'images et vidéos.",
    reco: "Je l'utilise pour servir des médias redimensionnés et compressés automatiquement. Le MCP permet même de générer des visuels.",
    rating: 4,
  },
  {
    id: "google-drive", name: "Google Drive", url: "https://drive.google.com", cat: "workspace", src: ["C"], tag: "Web",
    desc: "Stockage et partage de documents, accessible aux agents via connecteur.",
    reco: "Pratique pour donner à l'agent les briefs et fichiers sources du projet. Partagez uniquement les dossiers nécessaires.",
    rating: 3.5,
  },
  // Espaces de travail
  {
    id: "delta", name: "Delta (Zed)", url: "https://delta.dev/", cat: "workspace", src: ["B"], tag: "Desktop",
    desc: "Espace multijoueur pour agents de code avec revue par fils de discussion.",
    reco: "Prometteur pour faire travailler plusieurs agents et humains ensemble. Gratuit pendant la bêta publique.",
    rating: 3.5,
  },
  {
    id: "duckweed", name: "Duckweed", url: "https://github.com/MusicMaster4/Duckweed", cat: "workspace", src: ["B"], tag: "Desktop", repo: "MusicMaster4/Duckweed",
    desc: "Agents, shells, diffs Git et sessions dans un espace de travail local.",
    reco: "Réunit tout ce qu'un agent produit dans une seule fenêtre. Projet jeune, à tester sur un dépôt non critique.",
    rating: 3,
  },
  {
    id: "llm-log", name: "llm.log", url: "https://github.com/lanesket/llm.log", cat: "workspace", src: ["B"], tag: "CLI", repo: "lanesket/llm.log",
    desc: "Coûts, tokens et traces des requêtes via un proxy local.",
    reco: "Pour savoir enfin combien coûte réellement une session. Simple à mettre en place, licence MIT.",
    rating: 3.5,
  },
  {
    id: "parallel-code", name: "Parallel Code", url: "https://github.com/johannesjo/parallel-code", cat: "workspace", src: ["B"], tag: "Desktop", repo: "johannesjo/parallel-code",
    desc: "Agents dans des worktrees Git isolés, avec revue des changements.",
    reco: "Lancez plusieurs pistes en parallèle et gardez la meilleure. Très efficace pour explorer des solutions.",
    rating: 3.5,
  },
  {
    id: "shep", name: "Shep", url: "https://github.com/shep-ai/shep", cat: "workspace", src: ["B"], tag: "CLI", repo: "shep-ai/shep",
    desc: "Orchestrateur d'agents en parallèle, jusqu'aux brouillons de PR.",
    reco: "Va jusqu'au commit, au suivi CI et à la PR. Pour automatiser un backlog de petites tâches.",
    rating: 3.5,
  },
  {
    id: "superagent", name: "Superagent", url: "https://github.com/pungme/superagent-desktop", cat: "workspace", src: ["B"], tag: "Desktop", repo: "pungme/superagent-desktop",
    desc: "Claude Code ou Codex dans un espace macOS avec outils navigateur et iOS.",
    reco: "Une interface graphique agréable autour des agents en CLI. Réservé aux Mac Apple Silicon.",
    rating: 3,
  },
  {
    id: "usage", name: "usage", url: "https://github.com/aqua5230/usage", cat: "workspace", src: ["B"], tag: "Desktop", repo: "aqua5230/usage",
    desc: "Quotas des agents de code dans la barre de menu.",
    reco: "Petit utilitaire pour ne plus être surpris par une limite atteinte. Léger et open source (AGPL).",
    rating: 3,
  },
  {
    id: "warp", name: "Warp Terminal", url: "https://www.warp.dev/terminal", cat: "workspace", src: ["B"], tag: "Desktop",
    desc: "Terminal orienté agents.",
    reco: "Un terminal moderne où l'IA aide à chaque commande. Agréable même sans utiliser ses agents.",
    rating: 4,
  },
];

// Liste des dépôts GitHub (dédupliqués) pour l'API des étoiles.
export const REPOS = [...new Set(TOOLS.filter((t) => t.repo).map((t) => t.repo))];
export const TOOL_IDS = new Set(TOOLS.map((t) => t.id));
