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

// NB: secrets lus à l'intérieur du handler pour éviter les crashs au boot Deno
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@solutionsfortier.com";
const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") || "notifications@solutionsfortier.com";

interface DemandePayload {
    // Étape 1 — Coordonnées
    prenom: string;
    nom: string;
    telephone: string;
    courriel: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    // Étape 2 — Financement
    typeFinancement?: string;
    montantSouhaite?: string;
    dureeSouhaitee?: string;
    urgence?: string;
    situationEmploi?: string;
    revenuAnnuel?: string;
    // Étape 3 — Propriété
    typePropriete?: string;
    valeurPropriete?: string;
    soldeHypothecaire?: string;
    adressePropriete?: string;
    rangHypothecaire?: string;
    commentaire?: string;
    // Étape 4 — Consentement
    consentement?: boolean;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return corsResponse(req);

    // Lire les secrets ici (jamais au niveau module) pour éviter les crashs au boot
    const RESEND_API_KEY = requireEnv("RESEND_API_KEY");

    try {
        // Rate limiting: max 3 demandes per 10 minutes per IP
        const allowed = await checkRateLimit(req, "submit-demande", 10, 3);
        if (!allowed) {
            return jsonResponse(req, { error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." }, 429);
        }

        const body: DemandePayload = await req.json();

        // Valider les champs obligatoires
        if (!body.prenom?.trim() || !body.nom?.trim() || !body.telephone?.trim() || !body.courriel?.trim()) {
            return jsonResponse(req, { error: "Tous les champs obligatoires doivent être remplis." }, 400);
        }

        // Valider le format du courriel
        if (!validateEmail(body.courriel)) {
            return jsonResponse(req, { error: "Adresse courriel invalide." }, 400);
        }

        // Valider les longueurs maximales
        const lengthError = validateMaxLengths(body as unknown as Record<string, unknown>);
        if (lengthError) {
            return jsonResponse(req, { error: lengthError }, 400);
        }

        // Insérer dans la base de données
        const supabase = createClient(
            requireEnv("SUPABASE_URL"),
            requireEnv("SUPABASE_SERVICE_ROLE_KEY")
        );

        const { error: dbError } = await supabase.from("demandes").insert({
            prenom: body.prenom.trim(),
            nom: body.nom.trim(),
            telephone: body.telephone.trim(),
            courriel: body.courriel.trim().toLowerCase(),
            adresse: body.adresse?.trim() || null,
            ville: body.ville?.trim() || null,
            code_postal: body.codePostal?.trim() || null,
            type_financement: body.typeFinancement?.trim() || null,
            montant_souhaite: body.montantSouhaite?.trim() || null,
            duree_souhaitee: body.dureeSouhaitee?.trim() || null,
            urgence: body.urgence?.trim() || null,
            situation_emploi: body.situationEmploi?.trim() || null,
            revenu_annuel: body.revenuAnnuel?.trim() || null,
            type_propriete: body.typePropriete?.trim() || null,
            valeur_propriete: body.valeurPropriete?.trim() || null,
            solde_hypothecaire: body.soldeHypothecaire?.trim() || null,
            adresse_propriete: body.adressePropriete?.trim() || null,
            rang_hypothecaire: body.rangHypothecaire?.trim() || null,
            commentaire: body.commentaire?.trim() || null,
            consentement: body.consentement ?? false,
        });

        if (dbError) {
            console.error("DB Error:", dbError);
            return jsonResponse(req, { error: "Erreur lors de l'enregistrement de la demande." }, 500);
        }

        // Préparer les valeurs sécurisées pour le courriel HTML
        const safe = {
            prenom: escapeHtml(body.prenom.trim()),
            nom: escapeHtml(body.nom.trim()),
            telephone: escapeHtml(body.telephone.trim()),
            courriel: escapeHtml(body.courriel.trim()),
            adresse: escapeHtml(body.adresse?.trim() || "—"),
            ville: escapeHtml(body.ville?.trim() || "—"),
            codePostal: escapeHtml(body.codePostal?.trim() || "—"),
            typeFinancement: escapeHtml(body.typeFinancement?.trim() || "—"),
            montantSouhaite: escapeHtml(body.montantSouhaite?.trim() || "—"),
            dureeSouhaitee: escapeHtml(body.dureeSouhaitee?.trim() || "—"),
            urgence: escapeHtml(body.urgence?.trim() || "—"),
            situationEmploi: escapeHtml(body.situationEmploi?.trim() || "—"),
            revenuAnnuel: escapeHtml(body.revenuAnnuel?.trim() || "—"),
            typePropriete: escapeHtml(body.typePropriete?.trim() || "—"),
            valeurPropriete: escapeHtml(body.valeurPropriete?.trim() || "—"),
            soldeHypothecaire: escapeHtml(body.soldeHypothecaire?.trim() || "—"),
            adressePropriete: escapeHtml(body.adressePropriete?.trim() || "Même adresse"),
            rangHypothecaire: escapeHtml(body.rangHypothecaire?.trim() || "—"),
            commentaire: escapeHtml(body.commentaire?.trim() || "Aucun"),
        };

        const row = (label: string, value: string, bg = false) =>
            `<tr${bg ? ' style="background:#f8f9fa;"' : ''}><td style="padding:8px 12px;font-weight:bold;color:#0F2B4C;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;">${value}</td></tr>`;

        const section = (title: string) =>
            `<tr><td colspan="2" style="padding:16px 12px 6px;font-size:14px;font-weight:bold;color:#C8963E;border-bottom:2px solid #E5E7EB;">${title}</td></tr>`;

        // Courriel de notification à l'admin
        const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `Solutions Financement Fortier <${SENDER_EMAIL}>`,
                to: [ADMIN_EMAIL],
                subject: `🆕 Nouvelle demande — ${safe.prenom} ${safe.nom} | ${safe.montantSouhaite} $`,
                html: `
          <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;">
            <div style="background:#0F2B4C;padding:20px;text-align:center;">
              <h1 style="color:#C8963E;font-size:20px;margin:0;">Nouvelle demande de financement</h1>
            </div>
            <table style="border-collapse:collapse;width:100%;font-size:14px;">
              ${section("👤 Coordonnées")}
              ${row("Prénom", safe.prenom)}
              ${row("Nom", safe.nom, true)}
              ${row("Téléphone", safe.telephone)}
              ${row("Courriel", safe.courriel, true)}
              ${row("Adresse", safe.adresse)}
              ${row("Ville", safe.ville, true)}
              ${row("Code postal", safe.codePostal)}
              ${section("💰 Financement")}
              ${row("Type", safe.typeFinancement)}
              ${row("Montant souhaité", safe.montantSouhaite + " $", true)}
              ${row("Durée", safe.dureeSouhaitee)}
              ${row("Urgence", safe.urgence, true)}
              ${row("Situation d'emploi", safe.situationEmploi)}
              ${row("Revenu annuel", safe.revenuAnnuel + " $", true)}
              ${section("🏠 Propriété en garantie")}
              ${row("Type de propriété", safe.typePropriete)}
              ${row("Valeur estimée", safe.valeurPropriete + " $", true)}
              ${row("Solde hypothécaire", safe.soldeHypothecaire + " $")}
              ${row("Adresse propriété", safe.adressePropriete, true)}
              ${row("Rang hypothécaire", safe.rangHypothecaire)}
              ${section("💬 Commentaire")}
              ${row("", safe.commentaire)}
            </table>
          </div>`,
            }),
        });

        if (!emailRes.ok) {
            console.error("Resend Error:", await emailRes.text());
        }

        // Courriel de confirmation au client
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
                    subject: "Confirmation de votre demande de financement",
                    html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#0F2B4C;padding:24px;text-align:center;">
                <h1 style="color:#C8963E;font-size:22px;margin:0;">Solutions Financement Fortier</h1>
              </div>
              <div style="padding:32px 24px;">
                <p style="font-size:16px;">Bonjour ${safe.prenom},</p>
                <p>Nous avons bien reçu votre demande de financement. Un spécialiste vous contactera dans les <strong>48 heures ouvrables</strong> pour discuter de vos options.</p>
                <div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;padding:16px;margin:20px 0;">
                  <p style="margin:0 0 8px;font-weight:bold;color:#92400E;">📋 Documents à préparer pour votre rencontre :</p>
                  <ul style="margin:0;padding-left:20px;color:#78350F;font-size:14px;">
                    <li>Pièce d'identité avec photo</li>
                    <li>Évaluation municipale de la propriété</li>
                    <li>Relevé hypothécaire récent (si applicable)</li>
                    <li>Preuve de propriété (acte de vente)</li>
                    <li>Preuve de revenus</li>
                  </ul>
                </div>
                <p>Si vous avez des questions entre-temps, n'hésitez pas à nous appeler au <strong>450 914-5709</strong>.</p>
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

        return jsonResponse(req, { success: true, message: "Demande soumise avec succès." });
    } catch (error: unknown) {
        console.error("Error:", error);
        return jsonResponse(req, { error: "Une erreur inattendue est survenue." }, 500);
    }
});
