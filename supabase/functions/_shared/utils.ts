// Shared utilities for all Supabase Edge Functions

// ── Environment variable guard ─────────────────────────────
export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// ── CORS ───────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://solutionsfortier.com",
  "https://www.solutionsfortier.com",
];

function isAllowedOrigin(origin: string): boolean {
  // Exact match against production origins
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // In non-production, allow any localhost port (Vite can pick 5173, 5174, etc.)
  if (Deno.env.get("ENVIRONMENT") !== "production") {
    if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  }

  return false;
}

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function corsResponse(req: Request): Response {
  return new Response("ok", { headers: getCorsHeaders(req) });
}

// ── HTML escaping ──────────────────────────────────────────
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Input validation ───────────────────────────────────────
const MAX_LENGTHS: Record<string, number> = {
  prenom: 100,
  nom: 100,
  courriel: 254,
  telephone: 30,
  message: 5000,
  commentaire: 5000,
  ville: 100,
  adresse: 300,
  codePostal: 10,
  typeFinancement: 100,
  typePropriete: 100,
  montantSouhaite: 50,
  dureeSouhaitee: 50,
  urgence: 50,
  situationEmploi: 100,
  revenuAnnuel: 50,
  valeurPropriete: 50,
  soldeHypothecaire: 50,
  adressePropriete: 300,
  rangHypothecaire: 50,
  subject: 200,
  body: 10000,
  to: 254,
  recipientName: 200,
};

export function validateMaxLengths(
  data: Record<string, unknown>
): string | null {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string" && MAX_LENGTHS[key]) {
      if (value.length > MAX_LENGTHS[key]) {
        return `Le champ "${key}" dépasse la longueur maximale de ${MAX_LENGTHS[key]} caractères.`;
      }
    }
  }
  return null;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Rate limiting (per IP via dedicated table) ────────────
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Rate-limits by client IP using the `rate_limits` table.
 * Returns `true` if the request is allowed, `false` if rate-limited.
 */
export async function checkRateLimit(
  req: Request,
  action: string,
  windowMinutes: number = 5,
  maxRequests: number = 3
): Promise<boolean> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  // Skip rate limiting if we can't identify the client
  if (ip === "unknown") return true;

  try {
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    // Count recent requests from this specific IP + action
    const { count, error } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("action", action)
      .gte("created_at", since);

    if (error) {
      console.error("Rate limit check error:", error);
      return true; // Allow on error to not block legitimate requests
    }

    // Log this request for future rate-limit checks
    await supabase.from("rate_limits").insert({ ip, action });

    return (count || 0) < maxRequests;
  } catch (e) {
    console.error("Rate limit error:", e);
    return true;
  }
}

// ── Admin verification ─────────────────────────────────────
/**
 * Checks if the given user email is in the admin_emails table.
 */
export async function isAdmin(userEmail: string): Promise<boolean> {
  try {
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data, error } = await supabase
      .from("admin_emails")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();

    if (error) {
      console.error("Admin check error:", error);
      return false;
    }

    return !!data;
  } catch (e) {
    console.error("Admin check error:", e);
    return false;
  }
}

// ── JSON response helper ───────────────────────────────────
export function jsonResponse(
  req: Request,
  body: Record<string, unknown>,
  status: number = 200
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}
