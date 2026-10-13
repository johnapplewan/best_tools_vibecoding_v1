// Tables de la plateforme communautaire. Créées automatiquement au premier appel.
// Aucune donnée personnelle : pas de nom, pas d'email, pas de numéro.

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     code TEXT NOT NULL UNIQUE,              -- identifiant public pseudonyme, ex. VD-4F7K2
     github_id INTEGER NOT NULL UNIQUE,      -- identifiant technique GitHub (jamais affiché)
     github_login TEXT NOT NULL,             -- sert uniquement à reconnaître l'admin (jamais affiché)
     github_avatar TEXT,
     pseudo TEXT UNIQUE COLLATE NOCASE,
     avatar_mode TEXT NOT NULL DEFAULT 'generated',
     bio TEXT NOT NULL DEFAULT '',
     specialties TEXT NOT NULL DEFAULT '[]',
     available INTEGER NOT NULL DEFAULT 0,
     contacts TEXT NOT NULL DEFAULT '{}',
     terms_version TEXT,
     terms_accepted_at INTEGER,
     hidden INTEGER NOT NULL DEFAULT 0,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS sessions (
     token_hash TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     expires_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id)`,
  `CREATE TABLE IF NOT EXISTS projects (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     position INTEGER NOT NULL,
     title TEXT NOT NULL,
     pitch TEXT NOT NULL DEFAULT '',
     github_url TEXT,
     demo_url TEXT,
     tools TEXT NOT NULL DEFAULT '[]',
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS projects_user ON projects (user_id)`,
  `CREATE TABLE IF NOT EXISTS recommendations (
     from_user INTEGER NOT NULL,
     to_user INTEGER NOT NULL,
     message TEXT NOT NULL DEFAULT '',
     created_at INTEGER NOT NULL,
     PRIMARY KEY (from_user, to_user)
   )`,
  `CREATE INDEX IF NOT EXISTS recommendations_to ON recommendations (to_user)`,
  `CREATE TABLE IF NOT EXISTS reports (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     reporter INTEGER NOT NULL,
     target INTEGER NOT NULL,
     reason TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'open',
     created_at INTEGER NOT NULL,
     UNIQUE (reporter, target)
   )`,
  // Veille : chaque élément envoyé (raccourci iOS, admin, playlist) et sa fiche d'analyse.
  `CREATE TABLE IF NOT EXISTS veille_items (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     input TEXT NOT NULL,
     source TEXT NOT NULL DEFAULT 'admin',
     status TEXT NOT NULL DEFAULT 'pending',   -- pending | running | done | error
     attempts INTEGER NOT NULL DEFAULT 0,
     error TEXT,
     result TEXT,                              -- JSON : { card, github, dossier, model }
     verdict TEXT,                             -- green | orange | red
     tool_name TEXT,
     published INTEGER NOT NULL DEFAULT 0,
     published_at INTEGER,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS veille_status ON veille_items (status, created_at)`,
  `CREATE INDEX IF NOT EXISTS veille_published ON veille_items (published, published_at)`,
  // Images de projets (vignettes paysage), stockées en base64. Identifiant aléatoire non devinable.
  `CREATE TABLE IF NOT EXISTS project_images (
     id TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     mime TEXT NOT NULL,
     data TEXT NOT NULL,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS project_images_user ON project_images (user_id)`,
  // Jetons personnels (raccourci iOS). Seule l'empreinte est stockée.
  `CREATE TABLE IF NOT EXISTS api_tokens (
     token_hash TEXT PRIMARY KEY,
     user_id INTEGER NOT NULL,
     label TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     last_used_at INTEGER
   )`,
  // ── Atelier « Créer ici » ──
  `CREATE TABLE IF NOT EXISTS cp_projects (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     owner_id INTEGER NOT NULL,                -- porteur actuel
     founder_id INTEGER NOT NULL,              -- porteur d'origine, crédité à vie
     co_id INTEGER,                            -- co-porteur
     co_accepted_at INTEGER,
     name TEXT NOT NULL,
     pitch TEXT NOT NULL DEFAULT '',
     problem TEXT NOT NULL DEFAULT '',
     objective TEXT NOT NULL DEFAULT '',
     scope_in TEXT NOT NULL DEFAULT '',
     scope_out TEXT NOT NULL DEFAULT '',
     roles TEXT NOT NULL DEFAULT '[]',         -- [{ role, slots }]
     commitment TEXT NOT NULL DEFAULT '',
     duration TEXT NOT NULL DEFAULT '',
     level TEXT NOT NULL DEFAULT 'all',
     tools TEXT NOT NULL DEFAULT '[]',
     license TEXT NOT NULL DEFAULT 'MIT',
     channel_url TEXT,
     repo_url TEXT,
     demo_url TEXT,
     image_id TEXT,
     status TEXT NOT NULL DEFAULT 'draft',     -- draft | review | recruiting | active | paused | testing | launch_review | live | archived
     admin_note TEXT,
     charter TEXT NOT NULL DEFAULT '{}',
     charter_version INTEGER NOT NULL DEFAULT 0,
     checklist TEXT NOT NULL DEFAULT '{}',
     retro TEXT NOT NULL DEFAULT '{}',
     frozen_at INTEGER,                        -- alerte « porteur indisponible »
     reminder_stage INTEGER NOT NULL DEFAULT 0,
     interim_status TEXT,                      -- voting | admin | opposition | active
     interim_at INTEGER,
     interim_until INTEGER,
     live_at INTEGER,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS cp_projects_status ON cp_projects (status, updated_at)`,
  `CREATE TABLE IF NOT EXISTS cp_members (
     project_id INTEGER NOT NULL,
     user_id INTEGER NOT NULL,
     skill TEXT NOT NULL DEFAULT '',           -- rôle dans l'équipe (front, back, design…)
     active INTEGER NOT NULL DEFAULT 1,
     charter_version INTEGER NOT NULL DEFAULT 0,
     credited INTEGER NOT NULL DEFAULT 0,      -- crédits figés à la mise en ligne
     joined_at INTEGER NOT NULL,
     left_at INTEGER,
     PRIMARY KEY (project_id, user_id)
   )`,
  `CREATE INDEX IF NOT EXISTS cp_members_user ON cp_members (user_id)`,
  `CREATE TABLE IF NOT EXISTS cp_applications (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     project_id INTEGER NOT NULL,
     user_id INTEGER NOT NULL,
     skill TEXT NOT NULL,
     message TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'pending',   -- pending | accepted | refused
     created_at INTEGER NOT NULL,
     answered_at INTEGER
   )`,
  `CREATE INDEX IF NOT EXISTS cp_applications_project ON cp_applications (project_id, status)`,
  `CREATE TABLE IF NOT EXISTS cp_missions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     project_id INTEGER NOT NULL,
     title TEXT NOT NULL,
     description TEXT NOT NULL DEFAULT '',
     done_when TEXT NOT NULL DEFAULT '',
     size TEXT NOT NULL DEFAULT 'M',
     due TEXT,
     status TEXT NOT NULL DEFAULT 'todo',      -- todo | doing | review | done
     assignee_id INTEGER,
     created_by INTEGER NOT NULL,
     issue_url TEXT,
     pr_url TEXT,
     activity_at INTEGER NOT NULL,
     nudged_at INTEGER,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS cp_missions_project ON cp_missions (project_id)`,
  `CREATE TABLE IF NOT EXISTS cp_events (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     project_id INTEGER NOT NULL,
     kind TEXT NOT NULL,                       -- milestone | cycle | meeting
     title TEXT NOT NULL,
     day TEXT NOT NULL,                        -- AAAA-MM-JJ
     end_day TEXT,
     time TEXT,                                -- HH:MM (réunions)
     done INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE INDEX IF NOT EXISTS cp_events_project ON cp_events (project_id, day)`,
  `CREATE TABLE IF NOT EXISTS cp_meetings (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     project_id INTEGER NOT NULL,
     day TEXT NOT NULL,
     participants TEXT NOT NULL DEFAULT '[]',  -- [{ code, weather }]
     agenda TEXT NOT NULL DEFAULT '',
     decisions TEXT NOT NULL DEFAULT '',
     actions TEXT NOT NULL DEFAULT '[]',       -- [{ what, who, due, mission_id }]
     created_by INTEGER NOT NULL,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS cp_meetings_project ON cp_meetings (project_id, day)`,
  `CREATE TABLE IF NOT EXISTS cp_decisions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     project_id INTEGER NOT NULL,
     day TEXT NOT NULL,
     decision TEXT NOT NULL,
     reason TEXT NOT NULL DEFAULT '',
     meeting_id INTEGER,
     created_by INTEGER NOT NULL,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS cp_decisions_project ON cp_decisions (project_id)`,
  // Journal public du projet : changements de rôle et d'état.
  `CREATE TABLE IF NOT EXISTS cp_journal (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     project_id INTEGER NOT NULL,
     text TEXT NOT NULL,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS cp_journal_project ON cp_journal (project_id, created_at)`,
  // Codes de récupération du porteur : seule l'empreinte est stockée.
  `CREATE TABLE IF NOT EXISTS cp_recovery (
     project_id INTEGER NOT NULL,
     code_hash TEXT NOT NULL,
     used_at INTEGER,
     PRIMARY KEY (project_id, code_hash)
   )`,
  `CREATE TABLE IF NOT EXISTS cp_votes (
     project_id INTEGER NOT NULL,
     user_id INTEGER NOT NULL,
     yes INTEGER NOT NULL,
     PRIMARY KEY (project_id, user_id)
   )`,
  `CREATE TABLE IF NOT EXISTS cp_weather (
     project_id INTEGER NOT NULL,
     user_id INTEGER NOT NULL,
     week TEXT NOT NULL,                       -- AAAA-Sxx
     mood TEXT NOT NULL,                       -- sun | cloud | rain
     PRIMARY KEY (project_id, user_id, week)
   )`,
  `CREATE TABLE IF NOT EXISTS notifications (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     text TEXT NOT NULL,
     link TEXT,
     read_at INTEGER,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS notifications_user ON notifications (user_id, read_at)`,
  // Check-up : pré-diagnostic express (IA) et demandes de rappel pour le Check-up complet.
  `CREATE TABLE IF NOT EXISTS checkups (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     kind TEXT NOT NULL,                       -- express | callback
     input TEXT NOT NULL DEFAULT '{}',
     status TEXT NOT NULL DEFAULT 'pending',   -- express : pending | running | done | error ; rappel : new | contacted | done | cancelled
     attempts INTEGER NOT NULL DEFAULT 0,
     result TEXT,
     error TEXT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS checkups_user ON checkups (user_id, kind)`,
  `CREATE INDEX IF NOT EXISTS checkups_status ON checkups (kind, status, created_at)`,
  // Réglages de l'admin (chat Telegram, jeton secret du flux d'agenda…).
  `CREATE TABLE IF NOT EXISTS settings (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   )`,
];

// Colonnes ajoutées après la création des tables (ALTER TABLE ignoré si la colonne existe déjà).
const MIGRATIONS = [
  "ALTER TABLE projects ADD COLUMN image_id TEXT",
  "ALTER TABLE projects ADD COLUMN repo_private INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE users ADD COLUMN last_seen_at INTEGER",
];

let ready = false;
export async function ensureSchema(db) {
  if (ready) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  for (const sql of MIGRATIONS) {
    try {
      await db.prepare(sql).run();
    } catch (e) {
      if (!/duplicate column/i.test(String(e?.message || e))) throw e;
    }
  }
  ready = true;
}
