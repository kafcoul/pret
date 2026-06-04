import { FileText } from 'lucide-react';
import { getStatutInfo } from './types';

// ── Badges ─────────────────────────────────────────────────────
export function StatutBadge({ statut }: { statut: string }) {
  const info = getStatutInfo(statut);
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
      <info.icon className="h-3 w-3" />
      {info.label}
    </span>
  );
}

export function UnreadDot({ lu }: { lu: boolean }) {
  if (lu) return null;
  return <span className="h-2.5 w-2.5 bg-blue-500 rounded-full shrink-0" title="Non lu" />;
}

// ── Stat Card ──────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, accent = false }: { icon: typeof FileText; label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'bg-primary-700 border-primary-600 text-white' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${accent ? 'bg-white/10' : 'bg-primary-50'}`}>
          <Icon className={`h-5 w-5 ${accent ? 'text-accent-400' : 'text-primary-600'}`} />
        </div>
        <div>
          <p className={`text-2xl font-bold font-serif ${accent ? '' : 'text-primary-700'}`}>{value}</p>
          <p className={`text-xs ${accent ? 'text-primary-200' : 'text-gray-500'}`}>{label}</p>
        </div>
      </div>
    </div>
  );
}

// ── Info Card ──────────────────────────────────────────────────
export function InfoCard({ icon: Icon, label, value, href }: { icon: typeof FileText; label: string; value: string; href?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <p className="text-gray-500 text-xs">{label}</p>
      </div>
      {href ? (
        <a href={href} className="font-medium text-accent-500 hover:text-accent-600 hover:underline text-sm">{value}</a>
      ) : (
        <p className="font-medium text-gray-800 text-sm">{value}</p>
      )}
    </div>
  );
}

// ── Confirm Modal ──────────────────────────────────────────────
export function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <p className="text-gray-800 font-medium mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Annuler</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors">Supprimer</button>
        </div>
      </div>
    </div>
  );
}
