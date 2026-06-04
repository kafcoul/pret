import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Send, CheckCircle, AlertCircle, User, DollarSign,
    FileText, ChevronRight, ChevronLeft, Check,
    Phone, Briefcase, Clock, Home, Shield,
} from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import FormInput from '../components/ui/FormInput';
import FormTextarea from '../components/ui/FormTextarea';
import FormSelect from '../components/ui/FormSelect';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ui/Toast';
import { getOptionLabel, useDemandeFormConfig } from '../lib/demandeFormConfig';
import { useSiteContent } from '../lib/SiteContentContext';

// ── Interface du formulaire ────────────────────────────────────

interface DemandeForm {
    // Étape 1 — Informations personnelles
    prenom: string;
    nom: string;
    telephone: string;
    courriel: string;
    adresse: string;
    ville: string;
    codePostal: string;
    // Étape 2 — Détails du financement
    typeFinancement: string;
    montantSouhaite: string;
    dureeSouhaitee: string;
    urgence: string;
    situationEmploi: string;
    revenuAnnuel: string;
    // Étape 3 — Propriété en garantie
    typePropriete: string;
    valeurPropriete: string;
    soldeHypothecaire: string;
    adressePropriete: string;
    rangHypothecaire: string;
    // Étape 4 — Commentaire + consentement
    commentaire: string;
    consentement: boolean;
}

const initialForm: DemandeForm = {
    prenom: '', nom: '', telephone: '', courriel: '',
    adresse: '', ville: '', codePostal: '',
    typeFinancement: '', montantSouhaite: '', dureeSouhaitee: '',
    urgence: '', situationEmploi: '', revenuAnnuel: '',
    typePropriete: '', valeurPropriete: '', soldeHypothecaire: '',
    adressePropriete: '', rangHypothecaire: '',
    commentaire: '', consentement: false,
};

// ── Étapes du wizard ───────────────────────────────────────────

const STEP_ICONS = [User, DollarSign, Home, FileText];

// ══════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════

export default function DemandeEnLigne() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<DemandeForm>(initialForm);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [lastSubmit, setLastSubmit] = useState(0);
    const topRef = useRef<HTMLDivElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { c } = useSiteContent();
    const demandeConfig = useDemandeFormConfig();

    const steps = demandeConfig.steps.map((stepConfig, index) => ({
        ...stepConfig,
        icon: STEP_ICONS[index] ?? FileText,
    }));
    const currentStep = steps[step] ?? steps[steps.length - 1];

    const totalSteps = steps.length;

    // ── Handlers ───────────────────────────────────────────────

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: checked }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    // ── Validation par étape ───────────────────────────────────

    const validateStep = (s: number, showToast = false): boolean => {
        const errors: Record<string, string> = {};

        if (s === 0) {
            if (!form.prenom.trim()) errors.prenom = demandeConfig.validation.prenomRequired;
            if (!form.nom.trim()) errors.nom = demandeConfig.validation.nomRequired;
            if (!form.telephone.trim()) {
                errors.telephone = demandeConfig.validation.telephoneRequired;
            } else if (!/^[\d\s()+-]{7,}$/.test(form.telephone.trim())) {
                errors.telephone = demandeConfig.validation.telephoneInvalid;
            }
            if (!form.courriel.trim()) {
                errors.courriel = demandeConfig.validation.courrielRequired;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.courriel.trim())) {
                errors.courriel = demandeConfig.validation.courrielInvalid;
            }
            if (!form.ville.trim()) errors.ville = demandeConfig.validation.villeRequired;
        }

        if (s === 1) {
            if (!form.typeFinancement) errors.typeFinancement = demandeConfig.validation.typeFinancementRequired;
            if (!form.montantSouhaite.trim()) errors.montantSouhaite = demandeConfig.validation.montantRequired;
            if (!form.situationEmploi) errors.situationEmploi = demandeConfig.validation.situationEmploiRequired;
        }

        if (s === 2) {
            if (!form.typePropriete) errors.typePropriete = demandeConfig.validation.typeProprieteRequired;
            if (!form.valeurPropriete.trim()) errors.valeurPropriete = demandeConfig.validation.valeurProprieteRequired;
        }

        if (s === 3) {
            if (!form.consentement) errors.consentement = demandeConfig.validation.consentementRequired;
        }

        setFieldErrors(errors);

        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors) {
            // Scroll vers la première erreur pour la rendre visible
            requestAnimationFrame(() => {
                const firstErrorEl = document.querySelector('[role="alert"]');
                firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            if (showToast) {
                toast(demandeConfig.submitErrors.validation, 'error');
            }
        }
        return !hasErrors;
    };

    // ── Navigation ─────────────────────────────────────────────

    const goNext = () => {
        if (!validateStep(step)) return;
        setStep((prev) => Math.min(prev + 1, totalSteps - 1));
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const goBack = () => {
        setStep((prev) => Math.max(prev - 1, 0));
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const goToStep = (target: number) => {
        if (target > step) {
            if (!validateStep(step)) return;
        }
        setStep(target);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // ── Soumission finale ──────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (honeypot) return;
        if (Date.now() - lastSubmit < 30_000) {
            setErrorMsg(demandeConfig.submitErrors.retryLater);
            setStatus('error');
            toast(demandeConfig.submitErrors.retryLater, 'error');
            return;
        }
        if (!validateStep(totalSteps - 1, true)) return;

        setStatus('loading');
        setErrorMsg('');

        try {
            const { error } = await supabase.functions.invoke('submit-demande', {
                body: form,
            });
            if (error) throw error;

            setStatus('success');
            setLastSubmit(Date.now());
            toast(demandeConfig.success.title, 'success');
            // Redirection vers la page de confirmation dédiée
            navigate('/demande-confirmation', {
                state: { prenom: form.prenom },
                replace: true,
            });
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (err: unknown) {
            setStatus('error');
            let msg = demandeConfig.submitErrors.server.replace('{phone}', c('coord.telephone1', '450 914-5709'));
            if (err && typeof err === 'object' && 'name' in err) {
                const eName = (err as { name: string }).name;
                if (eName === 'FunctionsFetchError') {
                    msg = demandeConfig.submitErrors.network;
                } else if (eName === 'FunctionsHttpError') {
                    // Décoder le corps de la réponse pour obtenir le message précis (ex: 429)
                    try {
                        const context = (err as { context?: Response }).context;
                        if (context) {
                            const httpStatus = context.status;
                            const data = await context.clone().json() as { error?: string };
                            if (httpStatus === 429 || data?.error?.toLowerCase().includes('requêtes')) {
                                msg = demandeConfig.submitErrors.retryLater;
                            } else if (data?.error) {
                                msg = data.error;
                            } else {
                                msg = demandeConfig.submitErrors.server.replace('{phone}', c('coord.telephone1', '450 914-5709'));
                            }
                        } else {
                            msg = demandeConfig.submitErrors.server.replace('{phone}', c('coord.telephone1', '450 914-5709'));
                        }
                    } catch {
                        msg = demandeConfig.submitErrors.server.replace('{phone}', c('coord.telephone1', '450 914-5709'));
                    }
                } else if (eName === 'FunctionsRelayError') {
                    msg = demandeConfig.submitErrors.relay;
                }
            }
            setErrorMsg(msg);
            toast(msg, 'error');
            // Scroll vers le message d'erreur pour qu'il soit visible
            requestAnimationFrame(() => {
                errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    };

    // ══════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════

    return (
        <>
            {/* ── Overlay de chargement global ─────────────────── */}
            {status === 'loading' && (
                <div
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm"
                    role="status"
                    aria-label={demandeConfig.buttons.submitLoading}
                >
                    <div className="w-16 h-16 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin" />
                    <p className="text-lg font-semibold text-primary-700">{demandeConfig.buttons.submitLoading}</p>
                    <p className="text-sm text-gray-500">Veuillez ne pas quitter la page.</p>
                </div>
            )}

            <PageHero
                title={c('demande.hero.titre', 'Demande de financement en ligne')}
                subtitle={c('demande.hero.soustitre', 'Remplissez le formulaire étape par étape — un spécialiste vous contactera en 48h')}
                breadcrumb={[{ label: c('breadcrumb.demande', 'Demande en ligne') }]}
            />

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-4xl px-4">
                    <div ref={topRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">

                        {/* ── Barre de progression ────────────────── */}
                        {status !== 'success' && (
                            <div className="mb-10">
                                {/* Desktop */}
                                <div className="hidden md:flex items-center justify-between relative">
                                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                                    <div
                                        className="absolute top-5 left-0 h-0.5 bg-accent-500 transition-all duration-500"
                                        style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
                                    />
                                    {steps.map((s, i) => {
                                        const Icon = s.icon;
                                        const done = i < step;
                                        const active = i === step;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => goToStep(i)}
                                                className="relative flex flex-col items-center group z-10"
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                                                    ? 'bg-accent-500 border-accent-500 text-white'
                                                    : active
                                                        ? 'bg-white border-accent-500 text-accent-500 ring-4 ring-accent-100'
                                                        : 'bg-white border-gray-300 text-gray-400'
                                                    }`}>
                                                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                                </div>
                                                <span className={`mt-2 text-xs font-medium transition-colors ${done || active ? 'text-primary-700' : 'text-gray-400'
                                                    }`}>
                                                    {s.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Mobile */}
                                <div className="md:hidden">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-primary-700">
                                            Étape {step + 1} / {totalSteps}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {currentStep.label}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent-500 rounded-full transition-all duration-500"
                                            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Succès ──────────────────────────────── */}
                        {status === 'success' ? (
                            <div className="text-center py-10" role="status" aria-live="polite">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h2 className="font-serif text-2xl font-bold text-primary-700 mb-3">
                                    {demandeConfig.success.title}
                                </h2>
                                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                                    {demandeConfig.success.message}
                                </p>
                                <div className="bg-blue-50 rounded-xl p-5 max-w-md mx-auto mb-6 text-left">
                                    <h3 className="font-semibold text-primary-700 mb-2 text-sm">
                                        📋 {demandeConfig.documents.title}
                                    </h3>
                                    <ul className="text-sm text-gray-600 space-y-1.5">
                                        {demandeConfig.documents.items.map((doc, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                <span>{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => { setStatus('idle'); setStep(0); setForm(initialForm); }}
                                    className="text-accent-500 hover:text-accent-600 font-semibold transition-colors"
                                >
                                    {demandeConfig.buttons.submitAnother}
                                </button>
                            </div>
                        ) : (

                            /* ── Formulaire ───────────────────────────── */
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Honeypot */}
                                <div className="h-0 overflow-hidden" aria-hidden="true">
                                    <input type="text" name="website_url" tabIndex={-1} autoComplete="off"
                                        value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                                </div>

                                {/* ════ ÉTAPE 1 — Coordonnées ════ */}
                                {step === 0 && (
                                    <div className="space-y-5 animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-primary-50 p-2.5 rounded-xl">
                                                <User className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <h2 className="font-serif text-xl font-bold text-primary-700">{demandeConfig.sections.contact.title}</h2>
                                                <p className="text-gray-500 text-sm">{demandeConfig.sections.contact.subtitle}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label={demandeConfig.fields.prenom.label} name="prenom" required
                                                placeholder={demandeConfig.fields.prenom.placeholder} value={form.prenom}
                                                onChange={handleChange} error={fieldErrors.prenom} />
                                            <FormInput label={demandeConfig.fields.nom.label} name="nom" required
                                                placeholder={demandeConfig.fields.nom.placeholder} value={form.nom}
                                                onChange={handleChange} error={fieldErrors.nom} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label={demandeConfig.fields.telephone.label} name="telephone" type="tel" required
                                                placeholder={demandeConfig.fields.telephone.placeholder} value={form.telephone}
                                                onChange={handleChange} error={fieldErrors.telephone} />
                                            <FormInput label={demandeConfig.fields.courriel.label} name="courriel" type="email" required
                                                placeholder={demandeConfig.fields.courriel.placeholder} value={form.courriel}
                                                onChange={handleChange} error={fieldErrors.courriel} />
                                        </div>
                                        <FormInput label={demandeConfig.fields.adresse.label} name="adresse"
                                            placeholder={demandeConfig.fields.adresse.placeholder} value={form.adresse}
                                            onChange={handleChange} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label={demandeConfig.fields.ville.label} name="ville" required
                                                placeholder={demandeConfig.fields.ville.placeholder} value={form.ville}
                                                onChange={handleChange} error={fieldErrors.ville} />
                                            <FormInput label={demandeConfig.fields.codePostal.label} name="codePostal"
                                                placeholder={demandeConfig.fields.codePostal.placeholder} value={form.codePostal}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                )}

                                {/* ════ ÉTAPE 2 — Financement ════ */}
                                {step === 1 && (
                                    <div className="space-y-5 animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-primary-50 p-2.5 rounded-xl">
                                                <DollarSign className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <h2 className="font-serif text-xl font-bold text-primary-700">{demandeConfig.sections.financing.title}</h2>
                                                <p className="text-gray-500 text-sm">{demandeConfig.sections.financing.subtitle}</p>
                                            </div>
                                        </div>

                                        <FormSelect label={demandeConfig.fields.typeFinancement.label} name="typeFinancement" required
                                            value={form.typeFinancement} onChange={handleChange}
                                            options={demandeConfig.options.typeFinancement} placeholder={demandeConfig.fields.typeFinancement.placeholder}
                                            error={fieldErrors.typeFinancement} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label={demandeConfig.fields.montantSouhaite.label} name="montantSouhaite" required
                                                placeholder={demandeConfig.fields.montantSouhaite.placeholder} value={form.montantSouhaite}
                                                onChange={handleChange} error={fieldErrors.montantSouhaite} />
                                            <FormSelect label={demandeConfig.fields.dureeSouhaitee.label} name="dureeSouhaitee"
                                                value={form.dureeSouhaitee} onChange={handleChange}
                                                options={demandeConfig.options.dureeSouhaitee} placeholder={demandeConfig.fields.dureeSouhaitee.placeholder} />
                                        </div>

                                        <FormSelect label={demandeConfig.fields.urgence.label} name="urgence"
                                            value={form.urgence} onChange={handleChange}
                                            options={demandeConfig.options.urgence} placeholder={demandeConfig.fields.urgence.placeholder} />

                                        <div className="border-t border-gray-100 pt-5 mt-2">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-gray-400" />
                                                {demandeConfig.sections.financing.financialSituationTitle}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <FormSelect label={demandeConfig.fields.situationEmploi.label} name="situationEmploi" required
                                                    value={form.situationEmploi} onChange={handleChange}
                                                    options={demandeConfig.options.situationEmploi} placeholder={demandeConfig.fields.situationEmploi.placeholder}
                                                    error={fieldErrors.situationEmploi} />
                                                <FormInput label={demandeConfig.fields.revenuAnnuel.label} name="revenuAnnuel"
                                                    placeholder={demandeConfig.fields.revenuAnnuel.placeholder} value={form.revenuAnnuel}
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ════ ÉTAPE 3 — Propriété ════ */}
                                {step === 2 && (
                                    <div className="space-y-5 animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-primary-50 p-2.5 rounded-xl">
                                                <Home className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <h2 className="font-serif text-xl font-bold text-primary-700">{demandeConfig.sections.property.title}</h2>
                                                <p className="text-gray-500 text-sm">{demandeConfig.sections.property.subtitle}</p>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mb-2">
                                            {demandeConfig.sections.property.notice}
                                        </div>

                                        <FormSelect label={demandeConfig.fields.typePropriete.label} name="typePropriete" required
                                            value={form.typePropriete} onChange={handleChange}
                                            options={demandeConfig.options.typePropriete} placeholder={demandeConfig.fields.typePropriete.placeholder}
                                            error={fieldErrors.typePropriete} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label={demandeConfig.fields.valeurPropriete.label} name="valeurPropriete" required
                                                placeholder={demandeConfig.fields.valeurPropriete.placeholder} value={form.valeurPropriete}
                                                onChange={handleChange} error={fieldErrors.valeurPropriete} />
                                            <FormInput label={demandeConfig.fields.soldeHypothecaire.label} name="soldeHypothecaire"
                                                placeholder={demandeConfig.fields.soldeHypothecaire.placeholder} value={form.soldeHypothecaire}
                                                onChange={handleChange} />
                                        </div>

                                        <FormInput label={demandeConfig.fields.adressePropriete.label} name="adressePropriete"
                                            placeholder={demandeConfig.fields.adressePropriete.placeholder}
                                            value={form.adressePropriete} onChange={handleChange} />

                                        <FormSelect label={demandeConfig.fields.rangHypothecaire.label} name="rangHypothecaire"
                                            value={form.rangHypothecaire} onChange={handleChange}
                                            options={demandeConfig.options.rangHypothecaire} placeholder={demandeConfig.fields.rangHypothecaire.placeholder} />

                                        <FormTextarea label={demandeConfig.fields.commentaire.label} name="commentaire"
                                            placeholder={demandeConfig.fields.commentaire.placeholder}
                                            value={form.commentaire} onChange={handleChange} rows={4} />
                                    </div>
                                )}

                                {/* ════ ÉTAPE 4 — Révision ════ */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-fadeIn">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-primary-50 p-2.5 rounded-xl">
                                                <FileText className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <h2 className="font-serif text-xl font-bold text-primary-700">{demandeConfig.sections.review.title}</h2>
                                                <p className="text-gray-500 text-sm">{demandeConfig.sections.review.subtitle}</p>
                                            </div>
                                        </div>

                                        {/* Résumé des sections */}
                                        <ReviewSection
                                            icon={User} title={demandeConfig.review.contactTitle} onEdit={() => goToStep(0)}
                                            editLabel={demandeConfig.review.editButtonLabel}
                                            items={[
                                                { label: demandeConfig.review.fullNameLabel, value: `${form.prenom} ${form.nom}`.trim() || '—' },
                                                { label: demandeConfig.fields.telephone.label, value: form.telephone || '—' },
                                                { label: demandeConfig.fields.courriel.label, value: form.courriel || '—' },
                                                { label: demandeConfig.review.addressLabel, value: [form.adresse, form.ville, form.codePostal].filter(Boolean).join(', ') || '—' },
                                            ]}
                                        />
                                        <ReviewSection
                                            icon={DollarSign} title={demandeConfig.review.financingTitle} onEdit={() => goToStep(1)}
                                            editLabel={demandeConfig.review.editButtonLabel}
                                            items={[
                                                { label: demandeConfig.review.typeLabel, value: getOptionLabel(demandeConfig.options.typeFinancement, form.typeFinancement) },
                                                { label: demandeConfig.review.amountLabel, value: form.montantSouhaite ? `${form.montantSouhaite} $` : '—' },
                                                { label: demandeConfig.review.durationLabel, value: getOptionLabel(demandeConfig.options.dureeSouhaitee, form.dureeSouhaitee) },
                                                { label: demandeConfig.review.urgencyLabel, value: getOptionLabel(demandeConfig.options.urgence, form.urgence) },
                                                { label: demandeConfig.review.employmentLabel, value: getOptionLabel(demandeConfig.options.situationEmploi, form.situationEmploi) },
                                                { label: demandeConfig.review.annualIncomeLabel, value: form.revenuAnnuel ? `${form.revenuAnnuel} $` : '—' },
                                            ]}
                                        />
                                        <ReviewSection
                                            icon={Home} title={demandeConfig.review.propertyTitle} onEdit={() => goToStep(2)}
                                            editLabel={demandeConfig.review.editButtonLabel}
                                            items={[
                                                { label: demandeConfig.review.typeLabel, value: getOptionLabel(demandeConfig.options.typePropriete, form.typePropriete) },
                                                { label: demandeConfig.review.estimatedValueLabel, value: form.valeurPropriete ? `${form.valeurPropriete} $` : '—' },
                                                { label: demandeConfig.review.mortgageBalanceLabel, value: form.soldeHypothecaire ? `${form.soldeHypothecaire} $` : '—' },
                                                { label: demandeConfig.review.propertyAddressLabel, value: form.adressePropriete || demandeConfig.review.sameAddressFallback },
                                                { label: demandeConfig.review.mortgageRankLabel, value: getOptionLabel(demandeConfig.options.rangHypothecaire, form.rangHypothecaire) },
                                            ]}
                                        />
                                        {form.commentaire && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-1">{demandeConfig.review.commentLabel}</p>
                                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{form.commentaire}</p>
                                            </div>
                                        )}

                                        {/* Documents à préparer */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                                            <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {demandeConfig.documents.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {demandeConfig.documents.items.map((doc, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                                                        <Check className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                                        <span>{doc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-xs text-amber-700 mt-3 italic">
                                                {demandeConfig.documents.footnote}
                                            </p>
                                        </div>

                                        {/* Consentement */}
                                        <div className={`border rounded-xl p-5 transition-colors ${fieldErrors.consentement ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}>
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    name="consentement"
                                                    checked={form.consentement}
                                                    onChange={handleCheckbox}
                                                    className="mt-1 h-5 w-5 rounded border-gray-300 text-accent-500 focus:ring-accent-500/30 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 leading-relaxed">
                                                    {demandeConfig.consent.text}
                                                </span>
                                            </label>
                                            {fieldErrors.consentement && (
                                                <p className="text-red-500 text-xs mt-2" role="alert">
                                                    {fieldErrors.consentement}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── Erreur globale ─────────────────────── */}
                                {status === 'error' && (
                                    <div ref={errorRef} className="flex items-start gap-2 bg-red-50 text-red-700 p-4 rounded-xl text-sm mt-6" role="alert">
                                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                {/* ── Boutons de navigation ───────────────── */}
                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                                    {step > 0 ? (
                                        <button type="button" onClick={goBack}
                                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                                            <ChevronLeft className="h-4 w-4" />
                                            {demandeConfig.buttons.previous}
                                        </button>
                                    ) : <div />}

                                    {step < totalSteps - 1 ? (
                                        <button type="button" onClick={goNext}
                                            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                                            {demandeConfig.buttons.next}
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button type="submit" disabled={status === 'loading'}
                                            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all">
                                            {status === 'loading' ? (
                                                <>
                                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {demandeConfig.buttons.submitLoading}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5" />
                                                    {demandeConfig.buttons.submit}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>

                    {/* ── Bandeau de confiance ─────────────────────── */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span>{demandeConfig.trustBadges.confidentiality}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4 text-accent-500" />
                            <span>{demandeConfig.trustBadges.response}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Phone className="h-4 w-4 text-primary-600" />
                            <span>{c('coord.telephone1', '450 914-5709')}</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// ══════════════════════════════════════════════════════════════
// COMPOSANT — Section de révision
// ══════════════════════════════════════════════════════════════

function ReviewSection({ icon: Icon, title, editLabel, items, onEdit }: {
    icon: React.ElementType;
    title: string;
    editLabel: string;
    items: { label: string; value: string }[];
    onEdit: () => void;
}) {
    return (
        <div className="bg-gray-50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-700 flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4" />
                    {title}
                </h3>
                <button type="button" onClick={onEdit}
                    className="text-xs text-accent-500 hover:text-accent-600 font-medium transition-colors">
                    {editLabel}
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between sm:flex-col">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
