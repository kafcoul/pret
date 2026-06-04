import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Eye, EyeOff, Trash2, Save, Loader2, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../components/ui/Toast';
import type { FaqRow } from './types';
import { FAQ_CATEGORIES } from './types';

export default function FaqManager() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [loadingFaq, setLoadingFaq] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<FaqRow>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchFaqs = useCallback(async () => {
    setLoadingFaq(true);
    const { data } = await supabase.from('faq').select('*').order('ordre', { ascending: true });
    setRows(data || []);
    setLoadingFaq(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const startEdit = (row: FaqRow) => {
    setEditingId(row.id);
    setDraft({ question: row.question, reponse: row.reponse, categorie: row.categorie, ordre: row.ordre, visible: row.visible });
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(null);
    setDraft({ question: '', reponse: '', categorie: 'general', ordre: (rows.length + 1) * 10, visible: true });
    setIsAdding(true);
  };

  const cancelEdit = () => { setEditingId(null); setDraft({}); setIsAdding(false); };

  const handleSaveFaq = async () => {
    if (!draft.question?.trim() || !draft.reponse?.trim()) {
      toast('La question et la réponse sont requises.', 'error');
      return;
    }
    setSaving(true);
    if (isAdding) {
      const { error } = await supabase.from('faq').insert({
        question: draft.question,
        reponse: draft.reponse,
        categorie: draft.categorie || 'general',
        ordre: draft.ordre || 0,
        visible: draft.visible ?? true,
      });
      if (error) { toast('Erreur lors de l\'ajout.', 'error'); }
      else { toast('Question ajoutée.', 'success'); cancelEdit(); }
    } else if (editingId) {
      const { error } = await supabase.from('faq').update({
        question: draft.question,
        reponse: draft.reponse,
        categorie: draft.categorie,
        ordre: draft.ordre,
        visible: draft.visible,
      }).eq('id', editingId);
      if (error) { toast('Erreur lors de la mise à jour.', 'error'); }
      else { toast('Question mise à jour.', 'success'); cancelEdit(); }
    }
    setSaving(false);
    fetchFaqs();
  };

  const deleteFaq = async (id: number) => {
    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) { toast('Erreur lors de la suppression.', 'error'); }
    else { toast('Question supprimée.', 'success'); fetchFaqs(); }
  };

  const toggleVisibility = async (row: FaqRow) => {
    const { error } = await supabase.from('faq').update({ visible: !row.visible }).eq('id', row.id);
    if (error) { toast('Erreur.', 'error'); return; }
    setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, visible: !r.visible } : r));
  };

  if (loadingFaq) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          <strong>{rows.length}</strong> question{rows.length > 1 ? 's' : ''} dans la FAQ
        </p>
        <button onClick={startAdd} disabled={isAdding}
          className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-700 text-white hover:bg-primary-600 disabled:opacity-40 font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter une question
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl shadow-sm border border-accent-200 p-5 space-y-4">
          <h3 className="font-semibold text-primary-700 text-sm">
            {isAdding ? '✨ Nouvelle question' : '✏️ Modifier la question'}
          </h3>
          <input
            type="text"
            value={draft.question || ''}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            placeholder="Question…"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
          />
          <textarea
            value={draft.reponse || ''}
            onChange={(e) => setDraft({ ...draft, reponse: e.target.value })}
            placeholder="Réponse…"
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-y outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
          />
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Catégorie</label>
              <select
                value={draft.categorie || 'general'}
                onChange={(e) => setDraft({ ...draft, categorie: e.target.value })}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white focus:border-primary-500"
              >
                {FAQ_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Ordre</label>
              <input
                type="number"
                value={draft.ordre || 0}
                onChange={(e) => setDraft({ ...draft, ordre: parseInt(e.target.value) || 0 })}
                className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.visible ?? true}
                onChange={(e) => setDraft({ ...draft, visible: e.target.checked })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Visible
            </label>
            <div className="flex gap-2 ml-auto">
              <button onClick={cancelEdit} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                Annuler
              </button>
              <button onClick={handleSaveFaq} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-700 text-white hover:bg-primary-600 disabled:opacity-50 font-medium transition-colors">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isAdding ? 'Ajouter' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Aucune question dans la FAQ</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((row) => (
              <div key={row.id} className={`px-5 py-4 ${!row.visible ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                        {FAQ_CATEGORIES.find((c) => c.value === row.categorie)?.label || row.categorie}
                      </span>
                      <span className="text-[10px] text-gray-400">#{row.ordre}</span>
                      {!row.visible && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <EyeOff className="h-3 w-3" /> Masqué
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-primary-700 text-sm mb-1">{row.question}</p>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{row.reponse}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleVisibility(row)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title={row.visible ? 'Masquer' : 'Afficher'}>
                      {row.visible ? <Eye className="h-4 w-4 text-gray-400" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                    </button>
                    <button onClick={() => startEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Modifier">
                      <Pencil className="h-4 w-4 text-gray-400" />
                    </button>
                    <button onClick={() => deleteFaq(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
