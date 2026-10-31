import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { initialArticles } from '../data/articlesData';

// Resolve database path: configurable via environment variable or default to local data folder
const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'bytegush.sqlite');

// Ensure parent directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = createClient({
  url: `file:${dbPath}`,
});

// Single initialization flag
let initialized = false;

export async function ensureDbInitialized() {
  if (initialized) return;

  // 1. Feedbacks table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app TEXT NOT NULL DEFAULT 'bytegush',
      body TEXT NOT NULL,
      email TEXT,
      ip TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Waitlist / Newsletter table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      app TEXT NOT NULL DEFAULT 'bytegush',
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Articles table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'column',
      author TEXT NOT NULL DEFAULT 'Bytegush Studio',
      read_time TEXT DEFAULT '5 min',
      published_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default articles if table is empty
  const articleCountRes = await db.execute('SELECT COUNT(*) as count FROM articles');
  const count = Number(articleCountRes.rows[0]?.count || 0);

  if (count === 0 && initialArticles && initialArticles.length > 0) {
    for (const art of initialArticles) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO articles (slug, title, summary, content, category, author, read_time, published_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          art.slug,
          art.title,
          art.summary || '',
          art.content || '',
          art.category || 'column',
          art.author || 'Bytegush Studio',
          art.read_time || '5 min',
          art.published_at || new Date().toISOString().split('T')[0],
        ],
      });
    }
  }

  initialized = true;
}
