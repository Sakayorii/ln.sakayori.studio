-- Cloudflare D1 Schema for ln.sakayori.studio
-- Multi-series comments, typo reports, and rate limiting
-- Command: npx wrangler d1 execute ln-sakayori-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    novel TEXT NOT NULL DEFAULT 'rezero',
    arc INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
    ip_hash TEXT NOT NULL,                  -- SHA-256(IP + salt)
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_lookup
    ON comments (novel, arc, chapter, status, created_at DESC);

CREATE TABLE IF NOT EXISTS typo_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    novel TEXT NOT NULL DEFAULT 'rezero',
    arc INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    selected_text TEXT NOT NULL,
    user_note TEXT,
    ip_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | resolved | rejected
    created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_typo_reports_lookup
    ON typo_reports (novel, arc, chapter, status, created_at DESC);

CREATE TABLE IF NOT EXISTS rl (
    ip_hash TEXT NOT NULL,
    ts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rl_lookup ON rl (ip_hash, ts);
