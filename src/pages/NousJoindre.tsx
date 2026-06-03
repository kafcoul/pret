import { MapPin, Phone, Smartphone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import FormInput from '../components/ui/FormInput';
import FormTextarea from '../components/ui/FormTextarea';
import { useSiteContent } from '../lib/SiteContentContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { useTranslation } from 'react-i18next';

interface ContactForm {
    prenom: string;
    nom: string;
    courriel: string;
    telephone: string;
    message: string;
}

const initialForm: ContactForm = {
    prenom: '',
    nom: '',
    courriel: '',
    telephone: '',
    message: '',
};

export default function NousJoindre() {
    const { c } = useSiteContent();
    const { t } = useTranslation();

    function validateContact(form: ContactForm): Partial<Record<keyof ContactForm, string>> {
        const errors: Partial<Record<keyof ContactForm, string>> = {};
        if (!form.prenom.trim()) errors.prenom = t('contact_page.form.errors.firstname');
        if (!form.nom.trim()) errors.nom = t('contact_page.form.errors.lastname');
        if (!form.courriel.trim()) {
            errors.courriel = t('contact_page.form.errors.email_required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.courriel.trim())) {
            errors.courriel = t('contact_page.form.errors.email_invalid');
        }
        if (form.telephone.trim() && !/^[\d\s()+-]{7,}$/.test(form.telephone.trim())) {
            errors.telephone = t('contact_page.form.errors.phone_invalid');
        }
        if (!form.message.trim()) errors.message = t('contact_page.form.errors.message');
        return errors;
    }

    const {
        form, status, setStatus, errorMsg, fieldErrors,
        honeypot, setHoneypot, handleChange, handleSubmit, scrollRef,
    } = useFormSubmit<ContactForm>({
        functionName: 'submit-contact',
        initialForm,
        validate: validateContact,
        successMessage: t('contact_page.success_title'),
    });

    return (
        <>
            <PageHero
                title={c('contact.hero.titre', 'Nous joindre')}
                subtitle={c('contact.hero.soustitre', "Contactez-nous pour toute question ou demande d'information")}
                breadcrumb={[{ label: 'Nous joindre' }]}
            />

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact info */}
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-primary-700 mb-6">
                                {t('contact_page.coordinates')}
                            </h2>
                            <div className="space-y-5 mb-10">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-xl shrink-0">
                                        <MapPin className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary-700 mb-0.5">{t('contact_page.address_label')}</h3>
                                        <p className="text-gray-600 text-sm">
                                            {c('coord.adresse.ligne1', '490, rue de Kilkenny')}<br />
                                            {c('coord.adresse.ligne2', 'Fossambault-sur-le-Lac, QC G3N 3C4')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-xl shrink-0">
                                        <Phone className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary-700 mb-0.5">{t('contact_page.phone_label')}</h3>
                                        <p className="text-gray-600 text-sm">
                                            <a href={`tel:${c('coord.telephone1', '450 914-5709').replace(/\s/g, '')}`} className="hover:text-accent-500 transition-colors">
                                                {c('coord.telephone1', '450 914-5709')}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-xl shrink-0">
                                        <Smartphone className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary-700 mb-0.5">{t('contact_page.mobile_label')}</h3>
                                        <p className="text-gray-600 text-sm">
                                            <a href={`tel:${c('coord.telephone2', '450 914-5709').replace(/\s/g, '')}`} className="hover:text-accent-500 transition-colors">
                                                {c('coord.telephone2', '450 914-5709')}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-xl shrink-0">
                                        <Mail className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary-700 mb-0.5">{t('contact_page.email_label')}</h3>
                                        <p className="text-gray-600 text-sm">
                                            <a href={`mailto:${c('coord.courriel', 'info@solutionsfortier.com')}`} className="hover:text-accent-500 transition-colors">
                                                {c('coord.courriel', 'info@solutionsfortier.com')}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-50 p-3 rounded-xl shrink-0">
                                        <Clock className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary-700 mb-0.5">{t('contact_page.fax_label')}</h3>
                                        <p className="text-gray-600 text-sm">{c('coord.telecopieur', '450 914-5709')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps embed */}
                            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
                                <iframe
                                    title={`${c('coord.nom.entreprise', 'Solutions Financement Fortier')} - Emplacement`}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2730.5!2d-71.3555!3d46.8780!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s490+Rue+de+Kilkenny%2C+Fossambault-sur-le-Lac%2C+QC+G3N+3C4!5e0!3m2!1sfr!2sca!4v1!5m2!1sfr!2sca"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* Contact form */}
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-primary-700 mb-6">
                                {t('contact_page.send_title')}
                            </h2>

                            <div ref={scrollRef} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                                {status === 'success' ? (
                                    <div className="text-center py-10" role="status" aria-live="polite">
                                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="font-serif text-xl font-bold text-primary-700 mb-3">
                                            {t('contact_page.success_title')}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {t('contact_page.success_msg')}
                                        </p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="text-accent-500 hover:text-accent-600 font-semibold transition-colors"
                                        >
                                            {t('contact_page.send_another')}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                        {/* Honeypot anti-spam */}
                                        <div className="h-0 overflow-hidden" aria-hidden="true">
                                            <input type="text" name="website_url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput
                                                label={t('contact_page.form.firstname')}
                                                name="prenom"
                                                required
                                                placeholder={t('contact_page.form.firstname_ph')}
                                                value={form.prenom}
                                                onChange={handleChange}
                                                error={fieldErrors.prenom}
                                            />
                                            <FormInput
                                                label={t('contact_page.form.lastname')}
                                                name="nom"
                                                required
                                                placeholder={t('contact_page.form.lastname_ph')}
                                                value={form.nom}
                                                onChange={handleChange}
                                                error={fieldErrors.nom}
                                            />
                                        </div>
                                        <FormInput
                                            label={t('contact_page.form.email')}
                                            name="courriel"
                                            type="email"
                                            required
                                            placeholder="votre@courriel.com"
                                            value={form.courriel}
                                            onChange={handleChange}
                                            error={fieldErrors.courriel}
                                        />
                                        <FormInput
                                            label={t('contact_page.form.phone')}
                                            name="telephone"
                                            type="tel"
                                            placeholder={t('contact_page.form.phone_ph')}
                                            value={form.telephone}
                                            onChange={handleChange}
                                            error={fieldErrors.telephone}
                                        />
                                        <FormTextarea
                                            label={t('contact_page.form.message')}
                                            name="message"
                                            required
                                            placeholder={t('contact_page.form.message_ph')}
                                            value={form.message}
                                            onChange={handleChange}
                                            error={fieldErrors.message}
                                        />

                                        {status === 'error' && (
                                            <div className="flex items-start gap-2 bg-red-50 text-red-700 p-4 rounded-xl text-sm">
                                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                                <span>{errorMsg}</span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold transition-all"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {t('contact_page.form.submitting')}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5" />
                                                    {t('contact_page.form.submit')}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
