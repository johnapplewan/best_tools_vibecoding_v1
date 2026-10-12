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
];

// Colonnes ajoutées après la création des tables (ALTER TABLE ignoré si la colonne existe déjà).
const MIGRATIONS = [
  "ALTER TABLE projects ADD COLUMN image_id TEXT",
  "ALTER TABLE projects ADD COLUMN repo_private INTEGER NOT NULL DEFAULT 0",
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
