import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Trash2, RefreshCw, ShieldCheck, ShieldOff,
  UserCheck, Users, TrendingUp, GraduationCap,
  Clock, Search, AlertCircle, Sparkles, BookOpen, School,
} from 'lucide-react';

interface UserRow {
  id: string;
  full_name: string | null;
  has_paid_access: boolean;
  is_admin: boolean;
  created_at: string;
}

type Filter = 'alle' | 'betalende' | 'ikke-aktivert';

const COURSES = [
  { id: 'akademisk',    label: 'Akademisk',   short: 'Akad.',      color: 'bg-brand-teal/15 text-brand-teal hover:bg-red-50 hover:text-red-500',    inactive: 'bg-brand-teal/8 text-brand-gray hover:bg-brand-teal/15 hover:text-brand-teal' },
  { id: 'norsk-vg3',   label: 'Norsk VGS',   short: 'Norsk',      color: 'bg-[#7C6FAF]/15 text-[#7C6FAF] hover:bg-red-50 hover:text-red-500',      inactive: 'bg-[#7C6FAF]/8 text-brand-gray hover:bg-[#7C6FAF]/15 hover:text-[#7C6FAF]' },
  { id: 'ungdomsskole', label: 'Ungdomsskole', short: 'Ung.',       color: 'bg-[#5B9E6F]/15 text-[#5B9E6F] hover:bg-red-50 hover:text-red-500',      inactive: 'bg-[#5B9E6F]/8 text-brand-gray hover:bg-[#5B9E6F]/15 hover:text-[#5B9E6F]' },
] as const;

const isNew = (dateStr: string) =>
  Date.now() - new Date(dateStr).getTime() < 7 * 24 * 60 * 60 * 1000;

const initials = (name: string | null) => {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
};

const AVATAR_COLORS = [
  'bg-brand-teal text-white', 'bg-brand-coral text-white',
  'bg-[#5B9E6F] text-white',  'bg-[#7C6FAF] text-white',
  'bg-[#C97B4B] text-white',  'bg-[#4A8FA8] text-white',
];

const avatarColor = (id: string) =>
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('nb-NO', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminPage = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [courseAccess, setCourseAccess] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('alle');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    const { data: profileData, error: err } = await supabase.rpc('get_all_profiles');
    if (err) {
      const { data: fb, error: fbErr } = await supabase
        .from('profiles')
        .select('id, full_name, has_paid_access, is_admin, created_at')
        .order('created_at', { ascending: false });
      if (fbErr) setError(`Kunne ikke laste brukere: ${fbErr.message}`);
      else setUsers(fb ?? []);
    } else {
      setUsers(profileData ?? []);
    }

    const { data: accessData } = await supabase
      .from('course_access')
      .select('user_id, course_id');
    const accessMap: Record<string, Set<string>> = {};
    for (const row of accessData ?? []) {
      if (!accessMap[row.user_id]) accessMap[row.user_id] = new Set();
      accessMap[row.user_id].add(row.course_id);
    }
    setCourseAccess(accessMap);

    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const updateProfile = async (userId: string, patch: Partial<UserRow>) => {
    setActionLoading(userId);
    const { error: err } = await supabase.from('profiles').update(patch).eq('id', userId);
    if (!err) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...patch } : u));
    setActionLoading(null);
  };

  const toggleCourse = async (userId: string, courseId: string, currentlyHas: boolean) => {
    setActionLoading(userId);
    if (currentlyHas) {
      await supabase.from('course_access').delete().eq('user_id', userId).eq('course_id', courseId);
      setCourseAccess(prev => {
        const s = new Set(prev[userId] ?? []);
        s.delete(courseId);
        return { ...prev, [userId]: s };
      });
      if (courseId === 'akademisk') {
        await supabase.from('profiles').update({ has_paid_access: false }).eq('id', userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, has_paid_access: false } : u));
      }
    } else {
      await supabase.from('course_access').upsert(
        { user_id: userId, course_id: courseId },
        { onConflict: 'user_id,course_id' }
      );
      setCourseAccess(prev => ({
        ...prev,
        [userId]: new Set([...(prev[userId] ?? []), courseId]),
      }));
      if (courseId === 'akademisk') {
        await supabase.from('profiles').update({ has_paid_access: true }).eq('id', userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, has_paid_access: true } : u));
      }
    }
    setActionLoading(null);
  };

  const deleteUser = async (userId: string) => {
    setActionLoading(userId);
    const { error: err } = await supabase.from('profiles').delete().eq('id', userId);
    if (!err) setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeleteConfirm(null);
    setActionLoading(null);
  };

  const userHasCourse = (user: UserRow, courseId: string) => {
    if (courseId === 'akademisk') return user.has_paid_access;
    return courseAccess[user.id]?.has(courseId) ?? false;
  };

  const total      = users.length;
  const paid       = users.filter((u) => u.has_paid_access).length;
  const norskCount = Object.values(courseAccess).filter(s => s.has('norsk-vg3')).length;
  const ungCount   = Object.values(courseAccess).filter(s => s.has('ungdomsskole')).length;
  const unpaid     = total - paid;
  const newWeek    = users.filter((u) => isNew(u.created_at)).length;
  const conversion = total > 0 ? Math.round((paid / total) * 100) : 0;

  const anyAccess = (u: UserRow) =>
    u.has_paid_access ||
    (courseAccess[u.id]?.has('norsk-vg3') ?? false) ||
    (courseAccess[u.id]?.has('ungdomsskole') ?? false);

  const needsAction = users
    .filter((u) => !anyAccess(u))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filtered = users
    .filter((u) => {
      if (filter === 'betalende') return anyAccess(u);
      if (filter === 'ikke-aktivert') return !anyAccess(u);
      return true;
    })
    .filter((u) => !search || (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredPaid   = filtered.filter(anyAccess).length;
  const filteredUnpaid = filtered.filter(u => !anyAccess(u)).length;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-coral mb-1">Adminpanel</p>
          <h1 className="text-3xl font-heading text-brand-teal leading-tight">
            {paid} betalende{' '}
            <span className="text-brand-ink/30 text-xl font-normal">av {total} registrerte</span>
          </h1>
          {newWeek > 0 && (
            <p className="mt-1 text-sm text-brand-gray flex items-center gap-1.5">
              <Sparkles size={13} className="text-brand-coral" />
              {newWeek} ny{newWeek !== 1 ? 'e' : ''} registrering{newWeek !== 1 ? 'er' : ''} siste 7 dager
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="mt-1 inline-flex items-center gap-2 rounded-xl border border-brand-teal/20 px-4 py-2 text-sm font-semibold text-brand-teal hover:bg-brand-teal/5 transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Oppdater
        </button>
      </div>

      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-brand-teal px-5 pt-5 pb-4 text-white shadow-soft relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
            <Users size={20} />
          </div>
          <p className="text-4xl font-heading font-bold leading-none">{total}</p>
          <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-white/60">Totalt</p>
        </div>

        <div className="rounded-2xl bg-[#5B9E6F] px-5 pt-5 pb-4 text-white shadow-soft relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
            <GraduationCap size={20} />
          </div>
          <p className="text-4xl font-heading font-bold leading-none">{paid}</p>
          <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-white/60">Akademisk</p>
        </div>

        <div className="rounded-2xl bg-[#7C6FAF] px-5 pt-5 pb-4 text-white shadow-soft relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
            <BookOpen size={20} />
          </div>
          <p className="text-4xl font-heading font-bold leading-none">{norskCount}</p>
          <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-white/60">Norsk VGS</p>
        </div>

        <div className="rounded-2xl bg-brand-coral px-5 pt-5 pb-4 text-white shadow-soft relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 mb-3">
            <School size={20} />
          </div>
          <p className="text-4xl font-heading font-bold leading-none">{ungCount}</p>
          <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-white/60">Ungdomsskole</p>
        </div>
      </div>

      {/* ── Conversion bar ── */}
      {total > 0 && (
        <div className="rounded-2xl bg-[rgb(var(--c-surface))] border border-[rgb(var(--c-border))] px-5 py-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-brand-ink">Registrert → betalt (akademisk)</p>
            <p className="text-xs text-brand-gray">{paid} av {total} · {conversion}% konvertering</p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-brand-teal/8 flex">
            <div className="h-full rounded-full bg-[#5B9E6F] transition-all duration-700" style={{ width: `${conversion}%` }} />
          </div>
        </div>
      )}

      {/* ── Needs action ── */}
      {needsAction.length > 0 && (
        <div className="rounded-2xl border-2 border-brand-coral/30 bg-[#FFF8F5] shadow-soft overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-coral/15 bg-brand-coral/5">
            <AlertCircle size={16} className="text-brand-coral shrink-0" />
            <p className="text-sm font-bold text-brand-coral">
              {needsAction.length} bruker{needsAction.length !== 1 ? 'e' : ''} har registrert seg — men har ikke tilgang til noe kurs
            </p>
          </div>
          <ul className="divide-y divide-brand-coral/10">
            {needsAction.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(u.id)}`}>
                  {initials(u.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-ink truncate">
                    {u.full_name || <span className="italic text-brand-ink/30 font-normal">Ukjent navn</span>}
                  </p>
                  <p className="text-xs text-brand-gray">{fmtDate(u.created_at)}</p>
                </div>
                {isNew(u.created_at) && (
                  <span className="shrink-0 rounded-full bg-brand-coral/15 text-brand-coral px-2.5 py-0.5 text-xs font-bold">NY</span>
                )}
                <button
                  type="button"
                  disabled={actionLoading === u.id}
                  onClick={() => toggleCourse(u.id, 'akademisk', false)}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#5B9E6F] text-white px-4 py-2 text-xs font-bold hover:bg-[#4e8a60] transition disabled:opacity-50 shadow-sm"
                >
                  <UserCheck size={13} />
                  Gi akademisk
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Full user table ── */}
      <section className="rounded-2xl bg-[rgb(var(--c-surface))] border border-[rgb(var(--c-border))] shadow-soft overflow-hidden">

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[rgb(var(--c-border))] bg-brand-cream/30">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-brand-ink">Alle brukere</h2>
            <span className="rounded-full bg-brand-teal/10 text-brand-teal px-2.5 py-0.5 text-xs font-bold">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded-xl border border-[rgb(var(--c-border))] overflow-hidden text-xs font-bold">
              {([
                { key: 'alle',          label: `Alle (${total})` },
                { key: 'betalende',     label: `Aktive (${filteredPaid})` },
                { key: 'ikke-aktivert', label: `Uten tilgang (${filteredUnpaid})` },
              ] as { key: Filter; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`px-3 py-2 transition ${filter === key ? 'bg-brand-teal text-white' : 'bg-[rgb(var(--c-surface))] text-brand-gray hover:bg-brand-cream'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
              <input
                type="search"
                placeholder="Søk etter navn…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] pl-8 pr-3 py-2 text-sm focus:border-brand-teal focus:outline-none w-44"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && !users.length && (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-brand-teal border-t-transparent" />
            <p className="text-sm text-brand-gray">Laster brukere…</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-sm text-brand-ink/40 py-12">
            {search || filter !== 'alle' ? 'Ingen brukere matcher filteret.' : 'Ingen brukere funnet.'}
          </p>
        )}

        {filtered.length > 0 && (
          <ul className="divide-y divide-[rgb(var(--c-border))]">
            {filtered.map((user) => {
              const isNewUser = isNew(user.created_at);
              const hasAny = anyAccess(user);
              return (
                <li
                  key={user.id}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors border-l-4 ${
                    hasAny ? 'border-l-[#5B9E6F] hover:bg-[#5B9E6F]/5'
                    : isNewUser ? 'border-l-brand-coral hover:bg-[#FFF8F5]'
                    : 'border-l-transparent hover:bg-brand-cream/40'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor(user.id)}`}>
                    {initials(user.full_name)}
                  </div>

                  {/* Name + date + course pills */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-brand-ink text-sm leading-tight">
                        {user.full_name || <span className="italic text-brand-ink/30 font-normal">Ukjent navn</span>}
                      </p>
                      {isNewUser && (
                        <span className="rounded-full bg-brand-coral text-white px-2 py-0.5 text-xs font-bold">NY</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-brand-gray">
                        <Clock size={10} /> {fmtDate(user.created_at)}
                      </span>
                      <span className="text-brand-gray/30">·</span>
                      {COURSES.map((course) => {
                        const has = userHasCourse(user, course.id);
                        return (
                          <button
                            key={course.id}
                            type="button"
                            disabled={actionLoading === user.id}
                            onClick={() => toggleCourse(user.id, course.id, has)}
                            title={has ? `Fjern tilgang til ${course.label}` : `Gi tilgang til ${course.label}`}
                            className={`rounded-lg px-2 py-0.5 text-xs font-bold transition disabled:opacity-50 ${has ? course.color : course.inactive}`}
                          >
                            {has ? '✓' : '+'} {course.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Admin toggle */}
                  <button
                    type="button"
                    disabled={actionLoading === user.id}
                    onClick={() => updateProfile(user.id, { is_admin: !user.is_admin })}
                    title={user.is_admin ? 'Fjern admin' : 'Gjør til admin'}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${
                      user.is_admin
                        ? 'bg-brand-coral/15 text-brand-coral hover:bg-red-50 hover:text-red-600'
                        : 'bg-brand-teal/8 text-brand-gray hover:bg-brand-teal/15 hover:text-brand-teal'
                    }`}
                  >
                    {user.is_admin ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                    {user.is_admin ? 'Admin' : 'Bruker'}
                  </button>

                  {/* Delete */}
                  {deleteConfirm === user.id ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        className="rounded-xl px-3 py-2 text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition"
                      >Slett</button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-xl px-3 py-2 text-xs font-bold bg-brand-cream text-brand-gray hover:bg-brand-border transition"
                      >Nei</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(user.id)}
                      className="shrink-0 rounded-xl p-2 text-brand-border hover:text-red-500 hover:bg-red-50 transition"
                      title="Slett bruker"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Legend */}
        <div className="border-t border-[rgb(var(--c-border))] px-5 py-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {COURSES.map(c => (
            <span key={c.id} className="text-xs text-brand-gray flex items-center gap-1.5">
              <span className={`inline-block w-2.5 h-2.5 rounded-sm ${c.color.split(' ')[0]}`} />
              {c.label} — klikk for å gi/fjerne tilgang
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
