import { FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock } from 'lucide-react';

type Mode = 'login' | 'signup';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError('Feil e-post eller passord. Prøv igjen.');
        setSubmitting(false);
        return;
      }
      navigate(redirectTo);
    } else {
      if (!fullName.trim()) {
        setError('Skriv inn fullt navn.');
        setSubmitting(false);
        return;
      }
      const { error: err } = await signUp(email, password, fullName);
      if (err) {
        setError(err);
        setSubmitting(false);
        return;
      }
      setSignupDone(true);
    }

    setSubmitting(false);
  };

  if (signupDone) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-[rgb(var(--c-surface))] border border-[rgb(var(--c-border))] p-8 shadow-soft text-center space-y-4">
        <div className="text-5xl">✉️</div>
        <h1 className="text-3xl font-heading text-brand-teal">Sjekk innboksen din</h1>
        <p className="text-brand-gray">
          Vi har sendt en bekreftelseslenke til <strong>{email}</strong>. Klikk på lenken for å aktivere kontoen din.
        </p>
        <button
          className="text-brand-teal underline text-sm"
          onClick={() => { setSignupDone(false); switchMode('login'); }}
          type="button"
        >
          Gå til innlogging
        </button>
      </div>
    );
  }

  const inputCls =
    'mt-1 w-full rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-bg))] px-4 py-2.5 text-[rgb(var(--c-ink))] focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20';

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-[rgb(var(--c-surface))] border border-[rgb(var(--c-border))] p-8 shadow-soft">

        {/* Heading */}
        <h1 className="text-3xl font-heading text-brand-teal">
          {mode === 'login' ? 'Velkommen tilbake 👋' : 'Opprett konto'}
        </h1>
        <p className="mt-1 text-sm text-brand-gray">
          {mode === 'login'
            ? 'Logg inn for å fortsette kurset ditt.'
            : 'Kom i gang — det tar 30 sekunder.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <label className="block text-sm font-medium text-[rgb(var(--c-ink))]">
              Fullt navn
              <input
                className={inputCls}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Ola Nordmann"
                required
                autoComplete="name"
              />
            </label>
          )}

          <label className="block text-sm font-medium text-[rgb(var(--c-ink))]">
            E-post
            <input
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="ola@student.no"
              required
              autoComplete="email"
            />
          </label>

          <label className="block text-sm font-medium text-[rgb(var(--c-ink))]">
            Passord
            <input
              className={inputCls}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Minst 6 tegn' : '••••••••'}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-teal px-4 py-3 font-semibold text-white transition hover:bg-brand-teal/90 disabled:opacity-60"
          >
            {submitting
              ? 'Vennligst vent...'
              : mode === 'login'
              ? 'Logg inn'
              : 'Opprett konto'}
          </button>
        </form>

        {/* Switch mode link */}
        <p className="mt-5 text-center text-sm text-brand-gray">
          {mode === 'login' ? (
            <>
              Ny her?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-semibold text-brand-teal underline underline-offset-2 hover:text-brand-teal/80"
              >
                Opprett konto — det tar 30 sekunder
              </button>
            </>
          ) : (
            <>
              Har du allerede konto?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-semibold text-brand-teal underline underline-offset-2 hover:text-brand-teal/80"
              >
                Logg inn
              </button>
            </>
          )}
        </p>

        {/* Trust badge — signup only */}
        {mode === 'signup' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-gray">
            <Lock size={12} className="shrink-0" />
            Ingen betalingskort nødvendig for å opprette konto
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
