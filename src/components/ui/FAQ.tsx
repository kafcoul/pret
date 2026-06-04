import { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useSiteContent } from '../../lib/SiteContentContext';

interface FaqRow {
  id: number;
  question: string;
  reponse: string;
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const headingId = `faq-heading-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border border-gray-200 rounded-lg md:rounded-xl overflow-hidden transition-all">
      <h3>
        <button
          id={headingId}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-sm md:text-base text-primary-700">{question}</span>
          <ChevronDown
            className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
              }`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        hidden={!open}
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 md:px-6 pb-3 md:pb-4 text-gray-600 text-xs md:text-sm leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { c } = useSiteContent();
  const [faqs, setFaqs] = useState<FaqRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('faq')
        .select('id, question, reponse')
        .eq('visible', true)
        .order('ordre', { ascending: true })
        .limit(8);

      setFaqs(data || []);
    })();
  }, []);

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-8 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {c('faq.home.badge')}
          </div>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-700 mb-2 md:mb-4">
            {c('faq.home.titre')}
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
            {c('faq.home.soustitre')}
          </p>
        </div>

        <div className="space-y-2 md:space-y-3" role="list">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.reponse} index={i} />
          ))}
          {faqs.length === 0 && (
            <div className="rounded-xl border border-gray-200 px-6 py-5 text-center text-sm text-gray-500">
              {c('faq.home.empty')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
