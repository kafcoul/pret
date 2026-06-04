import { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, Loader2, CheckCircle, Pencil } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../components/ui/Toast';
import { useSiteContent } from '../../lib/SiteContentContext';
import { validateDemandeFormConfigInput } from '../../lib/demandeFormConfig';
import type { ContentRow } from './types';
import { SECTION_LABELS } from './types';

const JSON_CONFIG_KEYS = new Set(['demande.form.config']);

function isJsonConfigRow(row: Pick<ContentRow, 'cle'>) {
  return JSON_CONFIG_KEYS.has(row.cle);
}

function formatJsonForEditor(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function ContentEditor() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [edits, setEdits] = useState<Map<number, string>>(new Map());
  const [saving, setSaving] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('all');
  const { toast } = useToast();
  const { reload: reloadContent } = useSiteContent();

  const loadRows = useCallback(async () => {
    setLoadingContent(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section')
      .order('ordre');
    if (error) {
      toast('Erreur de chargement du contenu.', 'error');
    } else {
      setRows((data || []).map((row) => (
        isJsonConfigRow(row)
          ? { ...row, valeur: formatJsonForEditor(row.valeur) }
          : row
      )));
    }
    setLoadingContent(false);
  }, [toast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load
  useEffect(() => { loadRows(); }, [loadRows]);

  const handleChange = (id: number, value: string) => {
    setEdits((prev) => new Map(prev).set(id, value));
    setSaved((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  const handleSave = useCallback(async (row: ContentRow) => {
    const newValue = edits.get(row.id);
    if (newValue === undefined || newValue === row.valeur) return;

    const valueToSave = isJsonConfigRow(row)
      ? (() => {
          const validation = validateDemandeFormConfigInput(newValue);
          if (!validation.isValid) {
            toast(validation.error || 'La configuration JSON du formulaire est invalide.', 'error');
            return null;
          }

          return formatJsonForEditor(newValue);
        })()
      : newValue;

    if (valueToSave === null) {
      return;
    }

    setSaving((prev) => new Set(prev).add(row.id));
    const { error } = await supabase
      .from('site_content')
      .update({ valeur: valueToSave, updated_at: new Date().toISOString() })
      .eq('id', row.id);

    setSaving((prev) => { const s = new Set(prev); s.delete(row.id); return s; });

    if (error) {
      toast('Erreur lors de la sauvegarde.', 'error');
    } else {
      toast(`"${row.libelle}" mis à jour.`, 'success');
      setSaved((prev) => new Set(prev).add(row.id));
      setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, valeur: valueToSave } : r));
      setEdits((prev) => { const m = new Map(prev); m.delete(row.id); return m; });
      await reloadContent();
    }
  }, [edits, toast, reloadContent]);

  const handleSaveAll = async () => {
    const pending = Array.from(edits.entries()).filter(([id, val]) => {
      const row = rows.find((r) => r.id === id);
      return row && val !== row.valeur;
    });
    if (pending.length === 0) {
      toast('Aucune modification à sauvegarder.', 'info');
      return;
    }
    for (const [id] of pending) {
      const row = rows.find((r) => r.id === id);
      if (row) await handleSave(row);
    }
  };

  const sections = useMemo(() => {
    const map = new Map<string, ContentRow[]>();
    rows.forEach((r) => {
      if (!map.has(r.section)) map.set(r.section, []);
      map.get(r.section)!.push(r);
    });
    return map;
  }, [rows]);

  const sectionKeys = useMemo(() => Array.from(sections.keys()), [sections]);

  const visibleSections = activeSection === 'all' ? sectionKeys : [activeSection];

  const pendingCount = Array.from(edits.entries()).filter(([id, val]) => {
    const row = rows.find((r) => r.id === id);
    return row && val !== row.valeur;
  }).length;

  if (loadingContent) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-600">
            <strong>{rows.length}</strong> éléments de contenu modifiables
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="text-xs text-amber-600 font-medium">{pendingCount} modification{pendingCount > 1 ? 's' : ''} non sauvegardée{pendingCount > 1 ? 's' : ''}</span>
          )}
          <button onClick={handleSaveAll} disabled={pendingCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary-700 text-white hover:bg-primary-600 disabled:opacity-40 font-medium transition-colors">
            <Save className="h-4 w-4" />
            Tout sauvegarder
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeSection === 'all' ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Toutes les sections
        </button>
        {sectionKeys.map((s) => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeSection === s ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {SECTION_LABELS[s] || s}
          </button>
        ))}
      </div>

      {visibleSections.map((sectionKey) => {
        const sectionRows = sections.get(sectionKey) || [];
        return (
          <div key={sectionKey} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-primary-700 text-sm">
                {SECTION_LABELS[sectionKey] || sectionKey}
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {sectionRows.map((row) => {
                const currentValue = edits.has(row.id) ? edits.get(row.id)! : row.valeur;
                const isDirty = edits.has(row.id) && edits.get(row.id) !== row.valeur;
                const isSaving = saving.has(row.id);
                const isSaved = saved.has(row.id);
                const isJsonField = isJsonConfigRow(row);

                return (
                  <div key={row.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-500">{row.libelle}</label>
                      <div className="flex items-center gap-2">
                        {isSaved && (
                          <span className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Sauvé
                          </span>
                        )}
                        {isDirty && (
                          <button onClick={() => handleSave(row)} disabled={isSaving}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-primary-700 text-white hover:bg-primary-600 disabled:opacity-50 font-medium transition-colors">
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Pencil className="h-3 w-3" />}
                            Sauvegarder
                          </button>
                        )}
                      </div>
                    </div>
                    {row.type === 'textarea' ? (
                      <textarea
                        value={currentValue}
                        onChange={(e) => handleChange(row.id, e.target.value)}
                        rows={isJsonField ? 24 : 3}
                        spellCheck={!isJsonField}
                        className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-y transition-colors outline-none ${isDirty ? 'border-amber-400 bg-amber-50/30' : 'border-gray-200'} ${isJsonField ? 'font-mono text-xs leading-6' : ''} focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20`}
                      />
                    ) : (
                      <input
                        type={row.type === 'email' ? 'email' : row.type === 'url' ? 'url' : row.type === 'tel' ? 'tel' : 'text'}
                        value={currentValue}
                        onChange={(e) => handleChange(row.id, e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors outline-none ${isDirty ? 'border-amber-400 bg-amber-50/30' : 'border-gray-200'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20`}
                      />
                    )}
                    {isJsonField && (
                      <p className="text-[11px] text-gray-500 mt-2">
                        Cette configuration pilote les étapes, labels, placeholders, options et textes de la page de demande en ligne. La structure complète du JSON est validée avant sauvegarde.
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">{row.cle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
