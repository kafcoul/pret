import { Phone } from 'lucide-react';
import { useSiteContent } from '../../lib/SiteContentContext';

export default function FloatingContact() {
  const { c } = useSiteContent();
  const phone = c('coord.telephone1', '450 914-5709');

  return (
    <a
      href={`tel:+1${phone.replace(/\s|-/g, '')}`}
      aria-label={`Appelez-nous au ${phone}`}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-accent-500 hover:bg-accent-400 text-white pl-3 pr-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 group"
    >
      <Phone className="h-5 w-5 animate-pulse group-hover:animate-none" />
      <span className="text-sm font-semibold hidden sm:inline">{phone}</span>
    </a>
  );
}
