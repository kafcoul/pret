/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
    checkRateLimit,
    corsResponse,
    escapeHtml,
    jsonResponse,
    requireEnv,
    validateEmail,
    validateMaxLengths,
} from "../_shared/utils.ts";

interface ContactPayload {
    prenom: string;
    nom: string;
    courriel: string;
    telephone?: string;
    message: string;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return corsResponse(req);

    const RESEND_API_KEY = requireEnv("RESEND_API_KEY");
    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@solutionsfortier.com";
    const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") || "notifications@solutionsfortier.com";

    try {
        // Rate limiting: max 5 contacts per 15 minutes per IP
        const allowed = await checkRateLimit(req, "submit-contact", 15, 5);
        if (!allowed) {
            return jsonResponse(req, { error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." }, 429);
        }

        const body: ContactPayload = await req.json();

        // Validate required fields
        if (!body.prenom?.trim() || !body.nom?.trim() || !body.courriel?.trim() || !body.message?.trim()) {
            return jsonResponse(req, { error: "Tous les champs obligatoires doivent être remplis." }, 400);
        }

        // Validate email format
        if (!validateEmail(body.courriel)) {
            return jsonResponse(req, { error: "Adresse courriel invalide." }, 400);
        }

        // Validate max lengths
        const lengthError = validateMaxLengths(body as unknown as Record<string, unknown>);
        if (lengthError) {
            return jsonResponse(req, { error: lengthError }, 400);
        }

        // Insert into database
        const supabase = createClient(
            requireEnv("SUPABASE_URL"),
            requireEnv("SUPABASE_SERVICE_ROLE_KEY")
        );

        const { error: dbError } = await supabase.from("contacts").insert({
            prenom: body.prenom.trim(),
            nom: body.nom.trim(),
            courriel: body.courriel.trim().toLowerCase(),
            telephone: body.telephone?.trim() || null,
            message: body.message.trim(),
        });

        if (dbError) {
            console.error("DB Error:", dbError);
            return jsonResponse(req, { error: "Erreur lors de l'enregistrement du message." }, 500);
        }

        // Escape all user input for safe HTML rendering
        const safe = {
            prenom: escapeHtml(body.prenom.trim()),
            nom: escapeHtml(body.nom.trim()),
            courriel: escapeHtml(body.courriel.trim()),
            telephone: escapeHtml(body.telephone?.trim() || "Non fourni"),
            message: escapeHtml(body.message.trim()),
        };

        // Send notification email via Resend
        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `Solutions Financement Fortier <${SENDER_EMAIL}>`,
                to: [ADMIN_EMAIL],
                subject: `Nouveau message de contact — ${safe.prenom} ${safe.nom}`,
                html: `
          <h2>Nouveau message de contact</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px;font-weight:bold;">Prénom</td><td style="padding:8px;">${safe.prenom}</td></tr>
            <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:bold;">Nom</td><td style="padding:8px;">${safe.nom}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Courriel</td><td style="padding:8px;">${safe.courriel}</td></tr>
            <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:bold;">Téléphone</td><td style="padding:8px;">${safe.telephone}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${safe.message}</td></tr>
          </table>`,
            }),
        });

        if (!emailRes.ok) {
            console.error("Resend Error:", await emailRes.text());
        }

        // Confirmation email to user
        try {
            await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: `Solutions Financement Fortier <${SENDER_EMAIL}>`,
                    to: [body.courriel],
                    subject: "Nous avons reçu votre message",
                    html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0F2B4C;padding:24px;text-align:center;">
                <h1 style="color:#C8963E;font-size:22px;margin:0;">Solutions Financement Fortier</h1>
              </div>
              <div style="padding:32px 24px;">
                <p style="font-size:16px;">Bonjour ${safe.prenom},</p>
                <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous répondrons dans les meilleurs délais.</p>
                <p>Pour toute urgence, vous pouvez nous joindre au <strong>450 914-5709</strong>.</p>
                <p style="margin-top:24px;">Cordialement,<br><strong>L'équipe Solutions Financement Fortier</strong></p>
              </div>
              <div style="background:#f8f9fa;padding:16px 24px;text-align:center;font-size:12px;color:#64748B;">
                490, rue de Kilkenny, Fossambault-sur-le-Lac, QC G3N 3C4 · 450 914-5709
              </div>
            </div>`,
                }),
            });
        } catch (e) {
            console.error("Confirmation email error:", e);
        }

        return jsonResponse(req, { success: true, message: "Message envoyé avec succès." });
    } catch (error: unknown) {
        console.error("Error:", error);
        return jsonResponse(req, { error: "Une erreur inattendue est survenue." }, 500);
    }
});
