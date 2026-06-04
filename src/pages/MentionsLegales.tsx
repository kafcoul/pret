import PageHero from '../components/ui/PageHero';
import { useSiteContent } from '../lib/SiteContentContext';

export default function MentionsLegales() {
  const { c } = useSiteContent();
  const phone = c('coord.telephone1');
  const email = c('coord.courriel');

  return (
    <>
      <PageHero title={c('legal.hero.titre')} subtitle={c('legal.hero.soustitre')} />

      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.editor.title')}</h2>
            <ul className="space-y-1">
              <li><strong>{c('legal.editor.company_label')} :</strong> {c('legal.editor.company_value')}</li>
              <li><strong>{c('legal.editor.legal_form_label')} :</strong> {c('legal.editor.legal_form_value')}</li>
              <li><strong>{c('legal.editor.publisher_label')} :</strong> {c('legal.editor.publisher_value')}</li>
              <li><strong>{c('legal.editor.address_label')} :</strong> {c('legal.editor.address_value')}</li>
              <li><strong>{c('legal.editor.phone_label')} :</strong> <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-blue-700 hover:underline">{phone}</a></li>
              <li><strong>{c('legal.editor.email_label')} :</strong> <a href={`mailto:${email}`} className="text-blue-700 hover:underline">{email}</a></li>
              <li><strong>{c('legal.editor.website_label')} :</strong> <a href="https://www.solutionsfortier.com" className="text-blue-700 hover:underline">{c('legal.editor.website_value')}</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.hosting.title')}</h2>
            <ul className="space-y-1">
              <li><strong>{c('legal.hosting.provider_label')} :</strong> {c('legal.hosting.provider_value')}</li>
              <li><strong>{c('legal.hosting.address_label')} :</strong> {c('legal.hosting.address_value')}</li>
              <li><strong>{c('legal.hosting.website_label')} :</strong> {c('legal.hosting.website_value')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.ip.title')}</h2>
            <p>{c('legal.ip.body')}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.liability.title')}</h2>
            <p>{c('legal.liability.body')}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.privacy.title')}</h2>
            <p>
              {c('legal.privacy.prefix')}{' '}
              <a href="/politique-confidentialite" className="text-blue-700 hover:underline">
                {c('legal.privacy.link')}
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.law.title')}</h2>
            <p>{c('legal.law.body')}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{c('legal.regulation.title')}</h2>
            <p>{c('legal.regulation.body')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
