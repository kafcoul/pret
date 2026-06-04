import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  link: string;
}

export default function ServiceCard({ icon: Icon, title, description, items, link }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group">
      <div className="bg-primary-700 p-4 md:p-6 flex items-center gap-3 md:gap-4 group-hover:bg-primary-600 transition-colors">
        <div className="bg-accent-500/20 p-2 md:p-3 rounded-lg md:rounded-xl">
          <Icon className="h-5 w-5 md:h-7 md:w-7 text-accent-400" />
        </div>
        <h3 className="font-serif font-bold text-lg md:text-xl text-white">{title}</h3>
      </div>
      <div className="p-4 md:p-6">
        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">{description}</p>
        <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
              <span className="text-accent-500 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
        <Link
          to={link}
          className="inline-flex items-center text-xs md:text-sm font-semibold text-primary-600 hover:text-accent-500 transition-colors"
        >
          En savoir plus →
        </Link>
      </div>
    </div>
  );
}
