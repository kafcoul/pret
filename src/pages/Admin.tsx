import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    FileText, MessageSquare, Mail, LogOut, Eye, User,
    Search, Trash2, Download, RefreshCw, Clock,
    CheckCircle, AlertCircle, Filter, BarChart3,
    ArrowUpDown, Newspaper, Pencil, HelpCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ui/Toast';

// ── Admin sub-modules ──────────────────────────────────────────
import type { Demande, Contact, NewsletterSub, Tab, SortDir } from './admin/types';
import { STATUTS } from './admin/types';
import { StatutBadge, UnreadDot, StatCard, ConfirmModal } from './admin/helpers';
import { formatShortDate, exportCSV } from './admin/utils';
import LoginForm from './admin/LoginForm';
import DemandeDetail from './admin/DemandeDetail';
import ContactDetail from './admin/ContactDetail';
import ContentEditor from './admin/ContentEditor';
import FaqManager from './admin/FaqManager';

// ══════════════════════════════════════════════════════════════
// MAIN ADMIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Admin() {
    const [session, setSession] = useState<boolean | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [tab, setTab] = useState<Tab>('demandes');
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newsletter, setNewsletter] = useState<NewsletterSub[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statutFilter, setStatutFilter] = useState('all');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: number | string } | null>(null);
    const { toast } = useToast();

    // ── Auth ───────────────────────────────────────────────────
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(!!s));
        return () => subscription.unsubscribe();
    }, []);

    // ── Fetch all data on login ────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true);
        // Vérifier si l'utilisateur est admin (RLS retourne vide sinon)
        const { data: testAdmin } = await supabase
            .from('demandes')
            .select('id')
            .limit(1);
        // Si la requête retourne null (pas d'erreur mais aucun accès) et qu'il y a 0 résultats,
        // on fait un 2e check : si le count réel est 0, c'est un vrai admin sans données.
        // On utilise plutôt un appel RPC ou un select count pour distinguer.
        const { count } = await supabase
            .from('demandes')
            .select('*', { count: 'exact', head: true });
        // Si count est null, c'est que RLS bloque (pas admin)
        if (count === null && (!testAdmin || testAdmin.length === 0)) {
            // Vérification supplémentaire : essayer de lire les contacts aussi
            const { count: cCount } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true });
            if (cCount === null) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }
        }
        setIsAdmin(true);
        const [d, c, n] = await Promise.all([
            supabase.from('demandes').select('*').order('created_at', { ascending: false }),
            supabase.from('contacts').select('*').order('created_at', { ascending: false }),
            supabase.from('newsletter').select('*').order('created_at', { ascending: false }),
        ]);
        setDemandes(d.data || []);
        setContacts(c.data || []);
        setNewsletter(n.data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetch on session change
        if (session) fetchAll();
    }, [session, fetchAll]);

    // ── Actions ────────────────────────────────────────────────
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(false);
    };

    const updateDemande = async (id: number, updates: Partial<Demande>) => {
        const { error } = await supabase.from('demandes').update(updates).eq('id', id);
        if (error) { toast('Erreur lors de la mise à jour.', 'error'); return; }
        setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, ...updates } : d));
        if (selectedDemande?.id === id) setSelectedDemande((prev) => prev ? { ...prev, ...updates } : prev);
        toast('Demande mise à jour.', 'success');
    };

    const updateContact = async (id: number, updates: Partial<Contact>) => {
        const { error } = await supabase.from('contacts').update(updates).eq('id', id);
        if (error) { toast('Erreur lors de la mise à jour.', 'error'); return; }
        setContacts((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
        if (selectedContact?.id === id) setSelectedContact((prev) => prev ? { ...prev, ...updates } : prev);
        toast('Message mis à jour.', 'success');
    };

    const deleteDemande = async (id: number) => {
        const { error } = await supabase.from('demandes').delete().eq('id', id);
        if (error) { toast('Erreur lors de la suppression.', 'error'); return; }
        setDemandes((prev) => prev.filter((d) => d.id !== id));
        if (selectedDemande?.id === id) setSelectedDemande(null);
        toast('Demande supprimée.', 'success');
    };

    const deleteContact = async (id: number) => {
        const { error } = await supabase.from('contacts').delete().eq('id', id);
        if (error) { toast('Erreur lors de la suppression.', 'error'); return; }
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (selectedContact?.id === id) setSelectedContact(null);
        toast('Message supprimé.', 'success');
    };

    const deleteNewsletter = async (id: string) => {
        const { error } = await supabase.from('newsletter').delete().eq('id', id);
        if (error) { toast('Erreur lors de la suppression.', 'error'); return; }
        setNewsletter((prev) => prev.filter((n) => n.id !== id));
        toast('Abonné supprimé.', 'success');
    };

    const handleConfirmDelete = () => {
        if (!confirmDelete) return;
        const { type, id } = confirmDelete;
        if (type === 'demande') deleteDemande(id as number);
        else if (type === 'contact') deleteContact(id as number);
        else if (type === 'newsletter') deleteNewsletter(id as string);
        setConfirmDelete(null);
    };

    // ── Filtered / sorted lists ────────────────────────────────
    const filteredDemandes = useMemo(() => {
        let list = [...demandes];
        if (statutFilter !== 'all') list = list.filter((d) => d.statut === statutFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((d) =>
                `${d.prenom} ${d.nom} ${d.courriel} ${d.telephone} ${d.ville || ''} ${d.adresse || ''} ${d.type_financement || ''} ${d.situation_emploi || ''} ${d.type_propriete || ''}`.toLowerCase().includes(q)
            );
        }
        if (sortDir === 'asc') list.reverse();
        return list;
    }, [demandes, statutFilter, searchQuery, sortDir]);

    const filteredContacts = useMemo(() => {
        let list = [...contacts];
        if (statutFilter !== 'all') list = list.filter((c) => c.statut === statutFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((c) =>
                `${c.prenom} ${c.nom} ${c.courriel} ${c.message}`.toLowerCase().includes(q)
            );
        }
        if (sortDir === 'asc') list.reverse();
        return list;
    }, [contacts, statutFilter, searchQuery, sortDir]);

    // ── Dashboard stats ────────────────────────────────────────
    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = demandes.filter((d) => new Date(d.created_at).getMonth() === now.getMonth() && new Date(d.created_at).getFullYear() === now.getFullYear());
        return {
            totalDemandes: demandes.length,
            totalContacts: contacts.length,
            totalNewsletter: newsletter.filter((n) => n.active !== false).length,
            demandesNouveaux: demandes.filter((d) => d.statut === 'nouveau').length,
            demandesEnCours: demandes.filter((d) => d.statut === 'en_cours').length,
            demandesApprouvees: demandes.filter((d) => d.statut === 'approuve').length,
            contactsNonLus: contacts.filter((c) => !c.lu).length,
            demandeCeMois: thisMonth.length,
        };
    }, [demandes, contacts, newsletter]);

    // ── Export handlers ────────────────────────────────────────
    const exportDemandes = () => {
        exportCSV('demandes-sff.csv',
            ['Date', 'Prénom', 'Nom', 'Téléphone', 'Courriel', 'Adresse', 'Ville', 'Code postal', 'Type financement', 'Montant', 'Durée souhaitée', 'Urgence', 'Situation emploi', 'Revenu annuel', 'Type propriété', 'Valeur propriété', 'Solde hypothécaire', 'Adresse propriété', 'Rang hypothécaire', 'Consentement', 'Statut', 'Notes', 'Commentaire'],
            demandes.map((d) => [formatShortDate(d.created_at), d.prenom, d.nom, d.telephone, d.courriel, d.adresse || '', d.ville || '', d.code_postal || '', d.type_financement || '', d.montant_souhaite || '', d.duree_souhaitee || '', d.urgence || '', d.situation_emploi || '', d.revenu_annuel || '', d.type_propriete || '', d.valeur_propriete || '', d.solde_hypothecaire || '', d.adresse_propriete || '', d.rang_hypothecaire || '', d.consentement ? 'Oui' : 'Non', d.statut, d.notes || '', d.commentaire || ''])
        );
        toast('Demandes exportées en CSV.', 'success');
    };

    const exportContacts = () => {
        exportCSV('contacts-sff.csv',
            ['Date', 'Prénom', 'Nom', 'Courriel', 'Téléphone', 'Message', 'Statut', 'Notes'],
            contacts.map((c) => [formatShortDate(c.created_at), c.prenom, c.nom, c.courriel, c.telephone || '', c.message, c.statut, c.notes || ''])
        );
        toast('Messages exportés en CSV.', 'success');
    };

    const exportNewsletter = () => {
        exportCSV('newsletter-sff.csv',
            ['Date', 'Courriel', 'Actif'],
            newsletter.map((n) => [formatShortDate(n.created_at), n.courriel, n.active ? 'Oui' : 'Non'])
        );
        toast('Abonnés exportés en CSV.', 'success');
    };

    // ── Loading / Auth ─────────────────────────────────────────
    if (session === null) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) return <LoginForm onLogin={() => setSession(true)} />;

    // ── Accès refusé (connecté mais pas dans admin_emails) ─────
    if (isAdmin === false) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-4">
                        <AlertCircle className="h-7 w-7 text-red-500" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-primary-700 mb-2">Accès refusé</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Ce compte n'a pas les droits d'administration.
                        Contactez un administrateur pour obtenir l'accès.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 border border-red-200 transition-colors font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                    </button>
                </div>
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════
    return (
        <section className="py-6 min-h-[80vh]">
            <div className="mx-auto max-w-7xl px-4">
                {/* ── Header ──────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-primary-700">Tableau de bord</h1>
                        <p className="text-gray-500 text-sm">Solutions Financement Fortier — Administration</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchAll} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-primary-600 hover:bg-gray-50 transition-colors disabled:opacity-40 font-medium" title="Actualiser">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualiser
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium" title="Déconnexion">
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </button>
                    </div>
                </div>

                {/* ── Tabs ────────────────────────────────────── */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
                    {([
                        { id: 'dashboard' as Tab, label: 'Vue d\'ensemble', icon: BarChart3, count: null },
                        { id: 'demandes' as Tab, label: 'Formulaires', icon: FileText, count: stats.demandesNouveaux || null },
                        { id: 'contacts' as Tab, label: 'Messages', icon: MessageSquare, count: stats.contactsNonLus || null },
                        { id: 'newsletter' as Tab, label: 'Infolettre', icon: Newspaper, count: null },
                        { id: 'contenu' as Tab, label: 'Contenu du site', icon: Pencil, count: null },
                        { id: 'faq' as Tab, label: 'FAQ', icon: HelpCircle, count: null },
                    ]).map((t) => (
                        <button key={t.id} onClick={() => { setTab(t.id); setSelectedDemande(null); setSelectedContact(null); setSearchQuery(''); setStatutFilter('all'); }}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-primary-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <t.icon className="h-4 w-4" />
                            {t.label}
                            {t.count && t.count > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">{t.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <p className="mb-6 text-sm text-gray-500">
                    Formulaires = demandes de financement soumises depuis le site.
                </p>

                {loading && !demandes.length ? (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ═══════════════════════════════════════ */}
                        {/* DASHBOARD TAB                           */}
                        {/* ═══════════════════════════════════════ */}
                        {tab === 'dashboard' && (
                            <div className="space-y-6">
                                {/* KPI cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard icon={FileText} label="Formulaires reçus" value={stats.totalDemandes} accent />
                                    <StatCard icon={AlertCircle} label="Nouveaux formulaires" value={stats.demandesNouveaux} />
                                    <StatCard icon={Clock} label="En cours" value={stats.demandesEnCours} />
                                    <StatCard icon={CheckCircle} label="Approuvés" value={stats.demandesApprouvees} />
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    <StatCard icon={MessageSquare} label="Messages reçus" value={stats.totalContacts} />
                                    <StatCard icon={Mail} label="Messages non lus" value={stats.contactsNonLus} />
                                    <StatCard icon={Newspaper} label="Abonnés infolettre" value={stats.totalNewsletter} />
                                </div>

                                {/* Recent activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Recent demandes */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-primary-700 text-sm">Derniers formulaires</h3>
                                            <button onClick={() => setTab('demandes')} className="text-xs text-accent-500 hover:text-accent-600 font-medium">Voir tous les formulaires →</button>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {demandes.slice(0, 5).map((d) => (
                                                <div key={d.id} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => { setTab('demandes'); setSelectedDemande(d); updateDemande(d.id, { lu: true }); }}>
                                                    <UnreadDot lu={d.lu} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">{d.prenom} {d.nom}</p>
                                                        <p className="text-xs text-gray-400">{d.type_financement || 'Non spécifié'}</p>
                                                    </div>
                                                    <StatutBadge statut={d.statut} />
                                                    <span className="text-xs text-gray-400 hidden sm:block">{formatShortDate(d.created_at)}</span>
                                                </div>
                                            ))}
                                            {demandes.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">Aucune demande</p>}
                                        </div>
                                    </div>
                                    {/* Recent contacts */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-primary-700 text-sm">Derniers messages</h3>
                                            <button onClick={() => setTab('contacts')} className="text-xs text-accent-500 hover:text-accent-600 font-medium">Voir tout →</button>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {contacts.slice(0, 5).map((c) => (
                                                <div key={c.id} className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    onClick={() => { setTab('contacts'); setSelectedContact(c); updateContact(c.id, { lu: true }); }}>
                                                    <UnreadDot lu={c.lu} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">{c.prenom} {c.nom}</p>
                                                        <p className="text-xs text-gray-400 truncate">{c.message}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400 hidden sm:block">{formatShortDate(c.created_at)}</span>
                                                </div>
                                            ))}
                                            {contacts.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">Aucun message</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════ */}
                        {/* DEMANDES TAB                            */}
                        {/* ═══════════════════════════════════════ */}
                        {tab === 'demandes' && !selectedDemande && (
                            <div className="space-y-4">
                                {/* Toolbar */}
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Rechercher..." className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none w-56" />
                                        </div>
                                        <div className="relative">
                                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}
                                                className="pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 outline-none appearance-none bg-white cursor-pointer">
                                                <option value="all">Tous les statuts</option>
                                                {STATUTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                                            </select>
                                        </div>
                                        <button onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" title="Trier par date">
                                            <ArrowUpDown className="h-4 w-4 text-gray-500" />
                                            {sortDir === 'desc' ? 'Récent' : 'Ancien'}
                                        </button>
                                    </div>
                                    <button onClick={exportDemandes} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition-colors">
                                        <Download className="h-4 w-4" />
                                        Exporter CSV
                                    </button>
                                </div>

                                {/* List */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {filteredDemandes.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400">
                                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>{searchQuery || statutFilter !== 'all' ? 'Aucun résultat trouvé' : 'Aucune demande reçue'}</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {filteredDemandes.map((d) => (
                                                <button key={d.id}
                                                    onClick={() => { setSelectedDemande(d); if (!d.lu) updateDemande(d.id, { lu: true }); }}
                                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                                                    <UnreadDot lu={d.lu} />
                                                    <div className="bg-primary-50 p-2 rounded-lg shrink-0">
                                                        <User className="h-4 w-4 text-primary-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-primary-700 text-sm">{d.prenom} {d.nom}</p>
                                                        <p className="text-gray-500 text-xs truncate">{d.courriel} · {d.telephone}{d.ville ? ` · ${d.ville}` : ''}</p>
                                                    </div>
                                                    <StatutBadge statut={d.statut} />
                                                    <span className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">{formatShortDate(d.created_at)}</span>
                                                    <Eye className="h-4 w-4 text-gray-300 shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">{filteredDemandes.length} demande{filteredDemandes.length > 1 ? 's' : ''} affichée{filteredDemandes.length > 1 ? 's' : ''}</p>
                            </div>
                        )}

                        {/* ── Demande detail ──────────────────── */}
                        {tab === 'demandes' && selectedDemande && (
                            <DemandeDetail
                                demande={selectedDemande}
                                onBack={() => setSelectedDemande(null)}
                                onUpdate={(updates) => updateDemande(selectedDemande.id, updates)}
                                onDelete={() => setConfirmDelete({ type: 'demande', id: selectedDemande.id })}
                            />
                        )}

                        {/* ═══════════════════════════════════════ */}
                        {/* CONTACTS TAB                            */}
                        {/* ═══════════════════════════════════════ */}
                        {tab === 'contacts' && !selectedContact && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Rechercher..." className="pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none w-56" />
                                        </div>
                                        <button onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')} className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                            <ArrowUpDown className="h-4 w-4 text-gray-500" />
                                            {sortDir === 'desc' ? 'Récent' : 'Ancien'}
                                        </button>
                                    </div>
                                    <button onClick={exportContacts} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition-colors">
                                        <Download className="h-4 w-4" />
                                        Exporter CSV
                                    </button>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {filteredContacts.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>{searchQuery ? 'Aucun résultat trouvé' : 'Aucun message reçu'}</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {filteredContacts.map((c) => (
                                                <button key={c.id}
                                                    onClick={() => { setSelectedContact(c); if (!c.lu) updateContact(c.id, { lu: true }); }}
                                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                                                    <UnreadDot lu={c.lu} />
                                                    <div className="bg-accent-50 p-2 rounded-lg shrink-0">
                                                        <Mail className="h-4 w-4 text-accent-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-primary-700 text-sm">{c.prenom} {c.nom}</p>
                                                        <p className="text-gray-500 text-xs truncate">{c.message}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">{formatShortDate(c.created_at)}</span>
                                                    <Eye className="h-4 w-4 text-gray-300 shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">{filteredContacts.length} message{filteredContacts.length > 1 ? 's' : ''}</p>
                            </div>
                        )}

                        {/* ── Contact detail ──────────────────── */}
                        {tab === 'contacts' && selectedContact && (
                            <ContactDetail
                                contact={selectedContact}
                                onBack={() => setSelectedContact(null)}
                                onUpdate={(updates) => updateContact(selectedContact.id, updates)}
                                onDelete={() => setConfirmDelete({ type: 'contact', id: selectedContact.id })}
                            />
                        )}

                        {/* ═══════════════════════════════════════ */}
                        {/* NEWSLETTER TAB                          */}
                        {/* ═══════════════════════════════════════ */}
                        {tab === 'newsletter' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600"><strong>{newsletter.filter((n) => n.active !== false).length}</strong> abonné{newsletter.length > 1 ? 's' : ''} actif{newsletter.length > 1 ? 's' : ''}</p>
                                    <button onClick={exportNewsletter} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition-colors">
                                        <Download className="h-4 w-4" />
                                        Exporter CSV
                                    </button>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {newsletter.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400">
                                            <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            <p>Aucun abonné pour le moment</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Courriel</th>
                                                    <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
                                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Statut</th>
                                                    <th className="px-5 py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {newsletter.map((n) => (
                                                    <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-5 py-3 font-medium text-gray-800">{n.courriel}</td>
                                                        <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{formatShortDate(n.created_at)}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${n.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {n.active !== false ? 'Actif' : 'Inactif'}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            <button onClick={() => setConfirmDelete({ type: 'newsletter', id: n.id })} className="text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══════════════════════════════════════ */}
                        {/* CONTENU DU SITE TAB                     */}
                        {/* ═══════════════════════════════════════ */}
                        {tab === 'contenu' && <ContentEditor />}

                        {/* ═══════════════════════════════════════ */}
                        {/* FAQ TAB                                  */}
                        {/* ═══════════════════════════════════════ */}
                        {tab === 'faq' && <FaqManager />}
                    </>
                )}
            </div>

            {/* Confirm delete modal */}
            {confirmDelete && (
                <ConfirmModal
                    message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </section>
    );
}
