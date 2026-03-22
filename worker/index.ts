const DEVFOLIO_BASE = "https://synthesis.devfolio.co";
const ALLOWED_PATHS = ["/projects", "/catalog"];
const CACHE_TTL = 1800; // 30 minutes

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    // Health check
    if (path === "/health") {
      return json({ ok: true });
    }

    // Only proxy allowed paths
    const matched = ALLOWED_PATHS.find((p) => path.startsWith(p));
    if (!matched) {
      return json({ error: "Not found" }, 404);
    }

    // Build upstream URL
    const upstream = `${DEVFOLIO_BASE}${path}${url.search}`;

    // Check cache first
    const cache = caches.default;
    const cacheKey = new Request(upstream, { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) {
      const resp = new Response(cached.body, cached);
      resp.headers.set("x-cache", "HIT");
      setCors(resp);
      return resp;
    }

    // Fetch from Devfolio
    const res = await fetch(upstream, {
      headers: { "User-Agent": "SynthesisShowcase/1.0" },
    });

    if (!res.ok) {
      return json({ error: `Upstream error: ${res.status}` }, res.status);
    }

    const body = await res.text();
    const resp = new Response(body, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${CACHE_TTL}`,
        "x-cache": "MISS",
      },
    });

    setCors(resp);

    // Store in CF cache
    const toCache = resp.clone();
    await cache.put(cacheKey, toCache);

    return resp;
  },
};

function json(data: unknown, status = 200): Response {
  const resp = new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
  setCors(resp);
  return resp;
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function setCors(resp: Response) {
  resp.headers.set("Access-Control-Allow-Origin", "*");
}
