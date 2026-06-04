import { Building2, Home, Landmark, Building, TreePine } from 'lucide-react';
import { useSiteContent } from '../../lib/SiteContentContext';

const PROPERTY_KEYS = ['Résidentiel', 'Commercial et industriel', 'Édifices à logements', 'Résidences pour personnes retraitées', 'Terrains'];
const PROPERTY_KEYS_EN = ['Residential', 'Commercial & Industrial', 'Apartment Buildings', 'Retirement Residences', 'Land'];
const ICONS = [Home, Building2, Building, Landmark, TreePine];

export default function PropertyGuaranteeList() {
  const { c, lang } = useSiteContent();
  const labels = lang === 'en' ? PROPERTY_KEYS_EN : PROPERTY_KEYS;

  return (
    <div className="bg-primary-50 rounded-2xl p-8">
      <h3 className="font-serif text-2xl font-bold text-primary-700 mb-2">
        {c('property.types.titre', lang === 'en' ? 'Types of Properties Accepted as Collateral' : 'Types de propriétés acceptées en garantie')}
      </h3>
      <p className="text-gray-600 text-sm mb-6">
        {c('property.types.soustitre', lang === 'en' ? 'We finance a wide variety of real estate across Canada.' : 'Nous finançons une grande variété de biens immobiliers partout au Canada.')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ICONS.map((Icon, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="bg-primary-100 p-2 rounded-lg">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
