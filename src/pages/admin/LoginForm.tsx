import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, KeyRound, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

function getInitialMode(): 'login' | 'forgot' | 'reset' {
  return window.location.hash.includes('type=recovery') ? 'reset' : 'login';
}

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(getInitialMode);
  const [newPassword, setNewPassword] = useState('');

  // Handle recovery token from URL (Supabase redirects here after reset email click)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Courriel ou mot de passe invalide.');
      setLoading(false);
    } else {
      onLogin();
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/admin',
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Un courriel de réinitialisation a été envoyé. Vérifiez votre boîte de réception.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Mot de passe mis à jour ! Connexion en cours...');
      setTimeout(() => onLogin(), 1500);
    }
  };

  if (mode === 'reset') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-2xl mb-4">
              <KeyRound className="h-7 w-7 text-primary-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary-700">Nouveau mot de passe</h2>
            <p className="text-gray-500 text-sm mt-1">Choisissez votre nouveau mot de passe</p>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
              <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                placeholder="Minimum 8 caractères" />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (mode === 'forgot') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-2xl mb-4">
              <KeyRound className="h-7 w-7 text-primary-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-primary-700">Mot de passe oublié</h2>
            <p className="text-gray-500 text-sm mt-1">Entrez votre courriel pour recevoir un lien de réinitialisation</p>
          </div>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Courriel</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                placeholder="admin@solutionsfortier.com" />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
          <p className="text-center mt-6">
            <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className="text-sm text-accent-500 hover:text-accent-600 font-medium inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Retour à la connexion
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 rounded-2xl mb-4">
            <LogIn className="h-7 w-7 text-primary-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary-700">Accès administrateur</h2>
          <p className="text-gray-500 text-sm mt-1">Connectez-vous pour accéder au tableau de bord</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Courriel</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
              placeholder="admin@solutionsfortier.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm" />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-primary-700 hover:bg-primary-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button onClick={() => { setMode('forgot'); setError(''); }}
            className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
            Mot de passe oublié ?
          </button>
        </div>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-accent-500 hover:text-accent-600 font-medium">← Retour au site</Link>
        </p>
      </div>
    </div>
  );
}
