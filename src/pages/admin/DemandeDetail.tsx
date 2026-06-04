import { useState } from 'react';
import {
  ChevronLeft, Trash2, Phone, Mail, MapPin,
  DollarSign, Building, FileText, StickyNote,
  Briefcase, Clock, Home, User,
} from 'lucide-react';
import type { Demande } from './types';
import { STATUTS } from './types';
import { InfoCard } from './helpers';
import { formatDate } from './utils';
import ReplyForm from './ReplyForm';

export default function DemandeDetail({ demande, onBack, onUpdate, onDelete }: {
  demande: Demande;
  onBack: () => void;
  onUpdate: (updates: Partial<Demande>) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(demande.notes || '');
  const [saving, setSaving] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    await onUpdate({ notes });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-accent-500 hover:text-accent-600 font-medium">
          <ChevronLeft className="h-4 w-4" />
          Retour à la liste
        </button>
        <button onClick={onDelete} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="h-4 w-4" />
          Supprimer
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-primary-700">
              {demande.prenom} {demande.nom}
            </h2>
            <p className="text-gray-500 text-sm">{formatDate(demande.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={demande.statut} onChange={(e) => onUpdate({ statut: e.target.value })}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-primary-500 outline-none bg-white cursor-pointer font-medium">
              {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-5">
          {/* ── Coordonnées ──────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Coordonnées
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <InfoCard icon={Phone} label="Téléphone" value={demande.telephone} href={`tel:${demande.telephone}`} />
              <InfoCard icon={Mail} label="Courriel" value={demande.courriel} href={`mailto:${demande.courriel}`} />
              <InfoCard icon={MapPin} label="Adresse" value={[demande.adresse, demande.ville, demande.code_postal].filter(Boolean).join(', ') || '—'} />
            </div>
          </div>

          {/* ── Financement ──────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Financement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <InfoCard icon={FileText} label="Type" value={demande.type_financement || '—'} />
              <InfoCard icon={DollarSign} label="Montant souhaité" value={demande.montant_souhaite ? `${demande.montant_souhaite} $` : '—'} />
              <InfoCard icon={Clock} label="Durée souhaitée" value={demande.duree_souhaitee || '—'} />
              <InfoCard icon={Clock} label="Urgence" value={demande.urgence || '—'} />
              <InfoCard icon={Briefcase} label="Situation d'emploi" value={demande.situation_emploi || '—'} />
              <InfoCard icon={DollarSign} label="Revenu annuel" value={demande.revenu_annuel ? `${demande.revenu_annuel} $` : '—'} />
            </div>
          </div>

          {/* ── Propriété ────────────────────────── */}
          <div>
            <h3 className="text-xs font-semibold text-accent-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5" /> Propriété en garantie
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <InfoCard icon={Building} label="Type" value={demande.type_propriete || '—'} />
              <InfoCard icon={DollarSign} label="Valeur estimée" value={demande.valeur_propriete ? `${demande.valeur_propriete} $` : '—'} />
              <InfoCard icon={DollarSign} label="Solde hypothécaire" value={demande.solde_hypothecaire ? `${demande.solde_hypothecaire} $` : '—'} />
              <InfoCard icon={MapPin} label="Adresse propriété" value={demande.adresse_propriete || 'Même adresse'} />
              <InfoCard icon={FileText} label="Rang hypothécaire" value={demande.rang_hypothecaire || '—'} />
            </div>
          </div>
        </div>

        {demande.commentaire && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-1 font-medium">Commentaire du client</p>
            <p className="text-gray-800 text-sm whitespace-pre-wrap">{demande.commentaire}</p>
          </div>
        )}
      </div>

      {/* Notes admin */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="h-4 w-4 text-accent-500" />
          <h3 className="font-semibold text-primary-700 text-sm">Notes internes</h3>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          rows={4} placeholder="Ajoutez des notes privées sur cette demande..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none text-sm resize-y" />
        <div className="flex justify-end mt-3">
          <button onClick={saveNotes} disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white font-medium transition-colors">
            {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <a href={`tel:${demande.telephone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium transition-colors">
          <Phone className="h-4 w-4" />
          Appeler
        </a>
        <a href={`mailto:${demande.courriel}?subject=Votre demande de financement — Solutions Financement Fortier`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-colors">
          <Mail className="h-4 w-4" />
          Ouvrir dans messagerie
        </a>
      </div>

      {/* Integrated Reply */}
      <ReplyForm
        to={demande.courriel}
        recipientName={`${demande.prenom} ${demande.nom}`}
        defaultSubject="Re: Votre demande de financement — Solutions Financement Fortier"
      />
    </div>
  );
}
