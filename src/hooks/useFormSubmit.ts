import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ui/Toast';
import { useSiteContent } from '../lib/SiteContentContext';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseFormSubmitOptions<T extends { [K in keyof T]: string }> {
  /** Supabase Edge Function name to invoke */
  functionName: string;
  /** Initial (empty) form values — also used to reset after success */
  initialForm: T;
  /** Return a partial record of field‑level error messages (empty = valid) */
  validate: (form: T) => Partial<Record<keyof T, string>>;
  /** Toast message shown on successful submission */
  successMessage: string;
}

/**
 * Shared hook that encapsulates the submit‑form‑via‑Supabase‑Edge‑Function
 * pattern used by NousJoindre and DemandeEnLigne (and any future form page).
 *
 * Handles: honeypot anti‑spam, client‑side rate‑limiting (30 s), field
 * validation, Supabase invocation, granular error‑type messages, toast
 * notification, form reset and scroll‑to‑top on success.
 */
export function useFormSubmit<T extends { [K in keyof T]: string }>({
  functionName,
  initialForm,
  validate,
  successMessage,
}: UseFormSubmitOptions<T>) {
  const [form, setForm] = useState<T>(initialForm);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [honeypot, setHoneypot] = useState('');
  const [lastSubmit, setLastSubmit] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { c } = useSiteContent();

  /** Generic onChange for <input>, <textarea>, and <select> */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof T]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /** Submit handler — attach directly to <form onSubmit> */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti‑spam honeypot
    if (honeypot) return;

    // Client‑side rate limit (30 s)
    if (Date.now() - lastSubmit < 30_000) {
      setErrorMsg('Veuillez patienter avant de soumettre à nouveau.');
      setStatus('error');
      return;
    }

    // Field validation
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.functions.invoke(functionName, {
        body: form,
      });

      if (error) throw error;

      setStatus('success');
      setLastSubmit(Date.now());
      toast(successMessage, 'success');
      setForm(initialForm);
      setFieldErrors({});
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: unknown) {
      setStatus('error');
      let msg = 'Une erreur est survenue. Veuillez réessayer.';

      if (err && typeof err === 'object' && 'name' in err) {
        const name = (err as { name: string }).name;
        if (name === 'FunctionsFetchError') {
          msg =
            'Impossible de joindre le serveur. Vérifiez votre connexion Internet et réessayez.';
        } else if (name === 'FunctionsHttpError') {
          // Essayer d'extraire le message d'erreur précis du serveur
          try {
            const context = (err as { context?: Response }).context;
            if (context) {
              const status = context.status;
              const data = await context.clone().json() as { error?: string };
              if (status === 429 || data?.error?.toLowerCase().includes('requêtes')) {
                msg = 'Vous avez envoyé trop de messages récemment. Veuillez patienter quelques minutes avant de réessayer.';
              } else if (data?.error) {
                msg = data.error;
              } else {
                msg = `Le serveur a rencontré une erreur. Veuillez réessayer plus tard ou nous appeler au ${c('coord.telephone1', '450 914-5709')}.`;
              }
            } else {
              msg = `Le serveur a rencontré une erreur. Veuillez réessayer plus tard ou nous appeler au ${c('coord.telephone1', '450 914-5709')}.`;
            }
          } catch {
            msg = `Le serveur a rencontré une erreur. Veuillez réessayer plus tard ou nous appeler au ${c('coord.telephone1', '450 914-5709')}.`;
          }
        } else if (name === 'FunctionsRelayError') {
          msg =
            'Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.';
        }
      }

      setErrorMsg(msg);
    }
  };

  return {
    form,
    setForm,
    status,
    setStatus,
    errorMsg,
    fieldErrors,
    setFieldErrors,
    honeypot,
    setHoneypot,
    handleChange,
    handleSubmit,
    scrollRef,
  };
}
