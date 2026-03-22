import { Pool } from "pg";
import type { Project } from "./types";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://mandate:mandate_secret_2026@ckwg448co8cokcwk4c8cw8cc:5432/synthesis_previews",
});

// Rate limiting stays in-memory (ephemeral is fine)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimit = new Map<string, RateLimitEntry>();
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT = 100;

export async function storePreview(hash: string, data: Project, ip?: string): Promise<void> {
  await pool.query(
    `INSERT INTO previews (hash, data, ip) VALUES ($1, $2, $3)
     ON CONFLICT (hash) DO UPDATE SET data = $2, created_at = NOW()`,
    [hash, JSON.stringify(data), ip || null]
  );
}

export async function getPreview(hash: string): Promise<Project | null> {
  const result = await pool.query(
    `SELECT data FROM previews WHERE hash = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
    [hash]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].data as Project;
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

// Cleanup expired previews (called periodically or on deploy)
export async function cleanupExpired(): Promise<void> {
  await pool.query(`DELETE FROM previews WHERE created_at < NOW() - INTERVAL '24 hours'`);
}
