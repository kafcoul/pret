import { Building2, Home, Landmark, Building, TreePine } from 'lucide-react';

const properties = [
  { icon: Home, label: 'Résidentiel' },
  { icon: Building2, label: 'Commercial et industriel' },
  { icon: Building, label: 'Édifices à logements' },
  { icon: Landmark, label: 'Résidences pour personnes retraitées' },
  { icon: TreePine, label: 'Terrains' },
];

export default function PropertyGuaranteeList() {
  return (
    <div className="bg-primary-50 rounded-2xl p-8">
      <h3 className="font-serif text-2xl font-bold text-primary-700 mb-2">
        Types de propriétés acceptées en garantie
      </h3>
      <p className="text-gray-600 text-sm mb-6">
        Nous finançons une grande variété de biens immobiliers partout au Canada.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="bg-primary-100 p-2 rounded-lg">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
