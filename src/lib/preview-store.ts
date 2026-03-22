import type { Project } from "./types";

interface PreviewEntry {
  data: Project;
  createdAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, PreviewEntry>();
const rateLimit = new Map<string, RateLimitEntry>();

const TTL = 24 * 60 * 60 * 1000; // 24 hours
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT = 100;

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.createdAt > TTL) store.delete(key);
  }
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(key);
  }
}

export function storePreview(hash: string, data: Project): void {
  cleanup();
  store.set(hash, { data, createdAt: Date.now() });
}

export function getPreview(hash: string): Project | null {
  const entry = store.get(hash);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL) {
    store.delete(hash);
    return null;
  }
  return entry.data;
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
