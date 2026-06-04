import { useState } from 'react';
import { ChevronLeft, Trash2, Phone, Mail, StickyNote } from 'lucide-react';
import type { Contact } from './types';
import { STATUTS } from './types';
import { InfoCard } from './helpers';
import { formatDate } from './utils';
import ReplyForm from './ReplyForm';

export default function ContactDetail({ contact, onBack, onUpdate, onDelete }: {
  contact: Contact;
  onBack: () => void;
  onUpdate: (updates: Partial<Contact>) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(contact.notes || '');
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
            <h2 className="font-serif text-xl font-bold text-primary-700">{contact.prenom} {contact.nom}</h2>
            <p className="text-gray-500 text-sm">{formatDate(contact.created_at)}</p>
          </div>
          <select value={contact.statut} onChange={(e) => onUpdate({ statut: e.target.value })}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-primary-500 outline-none bg-white cursor-pointer font-medium">
            {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          <InfoCard icon={Mail} label="Courriel" value={contact.courriel} href={`mailto:${contact.courriel}`} />
          <InfoCard icon={Phone} label="Téléphone" value={contact.telephone || 'Non fourni'} href={contact.telephone ? `tel:${contact.telephone}` : undefined} />
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-gray-500 text-xs mb-2 font-medium">Message</p>
          <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{contact.message}</p>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-3">
          <StickyNote className="h-4 w-4 text-accent-500" />
          <h3 className="font-semibold text-primary-700 text-sm">Notes internes</h3>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          rows={3} placeholder="Notes privées..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none text-sm resize-y" />
        <div className="flex justify-end mt-3">
          <button onClick={saveNotes} disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white font-medium transition-colors">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {contact.telephone && (
          <a href={`tel:${contact.telephone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium transition-colors">
            <Phone className="h-4 w-4" />
            Appeler
          </a>
        )}
        <a href={`mailto:${contact.courriel}?subject=Re: Votre message — Solutions Financement Fortier`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium transition-colors">
          <Mail className="h-4 w-4" />
          Ouvrir dans messagerie
        </a>
      </div>

      {/* Integrated Reply */}
      <ReplyForm
        to={contact.courriel}
        recipientName={`${contact.prenom} ${contact.nom}`}
        defaultSubject="Re: Votre message — Solutions Financement Fortier"
      />
    </div>
  );
}
