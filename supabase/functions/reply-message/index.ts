/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
    corsResponse,
    escapeHtml,
    isAdmin,
    jsonResponse,
    requireEnv,
    validateEmail,
    validateMaxLengths,
} from "../_shared/utils.ts";

const RESEND_API_KEY = requireEnv("RESEND_API_KEY");
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") || "notifications@solutionsfortier.com";

interface ReplyPayload {
    to: string;
    subject: string;
    body: string;
    recipientName?: string;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return corsResponse(req);

    try {
        // ── Auth check: only authenticated admin can send replies ──
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return jsonResponse(req, { error: "Non autorisé." }, 401);
        }

        const supabase = createClient(
            requireEnv("SUPABASE_URL"),
            requireEnv("SUPABASE_ANON_KEY"),
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return jsonResponse(req, { error: "Session invalide. Veuillez vous reconnecter." }, 401);
        }

        // ── Verify user is an authorized admin ──
        const adminCheck = await isAdmin(user.email || "");
        if (!adminCheck) {
            return jsonResponse(req, { error: "Accès refusé. Vous n'êtes pas administrateur." }, 403);
        }

        // ── Parse and validate payload ──
        const payload: ReplyPayload = await req.json();

        if (!payload.to?.trim() || !payload.subject?.trim() || !payload.body?.trim()) {
            return jsonResponse(req, { error: "Les champs destinataire, sujet et message sont requis." }, 400);
        }

        if (!validateEmail(payload.to)) {
            return jsonResponse(req, { error: "Adresse courriel invalide." }, 400);
        }

        // Validate max lengths
        const lengthError = validateMaxLengths(payload as unknown as Record<string, unknown>);
        if (lengthError) {
            return jsonResponse(req, { error: lengthError }, 400);
        }

        const safeName = escapeHtml(payload.recipientName?.trim() || "");
        const safeBody = escapeHtml(payload.body.trim()).replace(/\n/g, "<br>");

        // ── Send email via Resend ──
        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `Solutions Financement Fortier <${SENDER_EMAIL}>`,
                to: [payload.to],
                subject: payload.subject,
                html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0F2B4C;padding:24px;text-align:center;">
              <h1 style="color:#C8963E;font-size:22px;margin:0;">Solutions Financement Fortier</h1>
            </div>
            <div style="padding:32px 24px;">
              ${safeName ? `<p style="font-size:16px;">Bonjour ${safeName},</p>` : ""}
              <div style="font-size:15px;line-height:1.7;color:#1E293B;">
                ${safeBody}
              </div>
              <p style="margin-top:32px;font-size:14px;">Cordialement,<br><strong>L'équipe Solutions Financement Fortier</strong></p>
            </div>
            <div style="background:#f8f9fa;padding:16px 24px;text-align:center;font-size:12px;color:#64748B;">
              490, rue de Kilkenny, Fossambault-sur-le-Lac, QC G3N 3C4 · 450 914-5709<br>
              <a href="https://solutionsfortier.com" style="color:#C8963E;">solutionsfortier.com</a>
            </div>
          </div>`,
            }),
        });

        if (!emailRes.ok) {
            const errText = await emailRes.text();
            console.error("Resend Error:", errText);
            return jsonResponse(req, { error: "Échec de l'envoi du courriel. Veuillez réessayer." }, 500);
        }

        return jsonResponse(req, { success: true, message: "Courriel envoyé avec succès." });
    } catch (error: unknown) {
        console.error("Error:", error);
        return jsonResponse(req, { error: "Une erreur inattendue est survenue." }, 500);
    }
});
