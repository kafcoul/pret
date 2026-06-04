import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../components/ui/Toast';

export default function ReplyForm({ to, recipientName, defaultSubject }: {
  to: string;
  recipientName: string;
  defaultSubject: string;
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!body.trim()) {
      toast('Le message ne peut pas être vide.', 'error');
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('reply-message', {
        body: { to, subject, body: body.trim(), recipientName },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast('Courriel envoyé avec succès !', 'success');
      setSent(true);
      setBody('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi du courriel.';
      toast(message, 'error');
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-700 text-white hover:bg-primary-600 text-sm font-medium transition-colors shadow-sm">
        <Send className="h-4 w-4" />
        Répondre depuis le tableau de bord
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 text-primary-500" />
          <h3 className="font-semibold text-primary-700 text-sm">Répondre par courriel</h3>
        </div>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xs font-medium">
          Annuler
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 font-medium w-10">À :</span>
          <span className="text-gray-800">{recipientName} &lt;{to}&gt;</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-gray-500 font-medium text-sm w-10">Sujet :</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none text-sm" />
        </div>

        <textarea value={body} onChange={(e) => setBody(e.target.value)}
          rows={6} placeholder="Écrivez votre réponse ici..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none text-sm resize-y" />

        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs">
            Envoyé depuis : notifications@solutionsfortier.com
          </p>
          <div className="flex items-center gap-3">
            {sent && (
              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <CheckCircle className="h-3.5 w-3.5" />
                Envoyé
              </span>
            )}
            <button onClick={handleSend} disabled={sending || !body.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-700 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
