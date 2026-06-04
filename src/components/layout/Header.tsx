import { Phone, Smartphone } from 'lucide-react';
import { useSiteContent } from '../../lib/SiteContentContext';

export default function Header() {
    const { c } = useSiteContent();

    return (
        <div className="bg-primary-700 text-white">
            <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <a href={`tel:${c('coord.telephone1', '450 914-5709').replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-accent-400 transition-colors">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{c('coord.telephone1', '450 914-5709')}</span>
                    </a>
                    <a href={`tel:${c('coord.telephone2', '450 914-5709').replace(/\s/g, '')}`} className="flex items-center gap-1.5 hover:text-accent-400 transition-colors">
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>{c('coord.telephone2', '450 914-5709')}</span>
                    </a>
                </div>

            </div>
        </div>
    );
}
