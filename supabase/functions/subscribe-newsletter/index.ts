/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
    checkRateLimit,
    corsResponse,
    jsonResponse,
    requireEnv,
    validateEmail,
} from "../_shared/utils.ts";

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return corsResponse(req);

    try {
        // Rate limiting: max 5 subscriptions per 10 minutes per IP
        const allowed = await checkRateLimit(req, "subscribe-newsletter", 10, 5);
        if (!allowed) {
            return jsonResponse(req, { error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." }, 429);
        }

        const body: { courriel?: string } = await req.json();

        if (!body.courriel?.trim() || !validateEmail(body.courriel)) {
            return jsonResponse(req, { error: "Adresse courriel invalide." }, 400);
        }

        const email = body.courriel.toLowerCase().trim();

        const supabase = createClient(
            requireEnv("SUPABASE_URL"),
            requireEnv("SUPABASE_SERVICE_ROLE_KEY")
        );

        // Check if already subscribed
        const { data: existing } = await supabase
            .from("newsletter")
            .select("id")
            .eq("courriel", email)
            .maybeSingle();

        if (existing) {
            return jsonResponse(req, { success: true, message: "Vous êtes déjà inscrit à notre infolettre." });
        }

        const { error: dbError } = await supabase.from("newsletter").insert({
            courriel: email,
        });

        if (dbError) {
            console.error("DB Error:", dbError);
            return jsonResponse(req, { error: "Erreur lors de l'inscription." }, 500);
        }

        return jsonResponse(req, { success: true, message: "Inscription réussie ! Merci." });
    } catch (error: unknown) {
        console.error("Error:", error);
        return jsonResponse(req, { error: "Une erreur inattendue est survenue." }, 500);
    }
});
