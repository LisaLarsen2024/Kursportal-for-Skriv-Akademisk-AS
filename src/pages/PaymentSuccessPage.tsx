import { CheckCircle2, ArrowRight, Gift, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const PaymentSuccessPage = () => {
  const { user, profile } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const [accessGranted, setAccessGranted] = useState(profile?.hasPaidAccess ?? false);

  useEffect(() => {
    if (accessGranted) return;

    const poll = setInterval(async () => {
      await supabase.auth.refreshSession();
      setAttempts((n) => n + 1);
    }, 3000);

    const timeout = setTimeout(() => clearInterval(poll), 90000);

    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, [accessGranted]);

  useEffect(() => {
    if (profile?.hasPaidAccess) setAccessGranted(true);
  }, [profile?.hasPaidAccess]);

  return (
    <div className="mx-auto max-w-xl py-10">
      <AnimatePresence mode="wait">
        {accessGranted ? (
          <motion.div
            key="success"
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            {/* Animated check circle */}
            <motion.div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-teal/10"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <CheckCircle2 size={48} className="text-brand-teal" />
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} custom={0}>
              <h1 className="text-4xl text-brand-teal">Tilgang aktivert!</h1>
              <p className="mt-3 text-brand-ink/60 text-lg">
                Kurset er klart. Velkommen til Skriv Akademisk!
              </p>
            </motion.div>

            {/* Promo code box */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="rounded-2xl border-2 border-brand-teal/15 bg-white p-6 shadow-card text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-coral/10 text-brand-coral">
                  <Gift size={18} />
                </div>
                <p className="font-semibold text-brand-ink">Inkludert i kjøpet ditt</p>
              </div>
              <p className="text-sm text-brand-ink/65 mb-4">
                1 måned gratis på <strong>Skriv Akademisk-appen</strong> — AI-verktøyet som gir deg konkrete forslag på drøfting, struktur og APA 7.
              </p>
              <div className="rounded-xl border-2 border-dashed border-brand-teal/30 bg-brand-teal/[0.03] py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink/40 mb-1">Din rabattkode</p>
                <p className="font-mono text-3xl font-bold tracking-[0.2em] text-brand-teal">KURS1MND</p>
              </div>
              <p className="mt-3 text-xs text-brand-ink/45 text-center">
                Bruk koden på <a href="https://app.skrivakademisk.no" className="underline hover:text-brand-teal">app.skrivakademisk.no</a> — første måned gratis
              </p>
            </motion.div>

            <motion.div variants={fadeUp} custom={2}>
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-teal px-8 py-4 font-semibold text-white shadow-lg shadow-brand-teal/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <BookOpen size={18} />
                Start kurset nå
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

        ) : (
          <motion.div
            key="waiting"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            {/* Pulsing loader */}
            <motion.div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-coral/10"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <BookOpen size={40} className="text-brand-coral" />
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} custom={0}>
              <h1 className="text-3xl text-brand-teal">Takk for kjøpet!</h1>
              <p className="mt-3 text-brand-ink/65">
                Betalingen er bekreftet. Vi aktiverer tilgangen din nå —
                {user?.email && (
                  <> bekreftelse sendes til <strong>{user.email}</strong>.</>
                )}
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="rounded-2xl bg-white p-6 shadow-card text-left space-y-4"
            >
              {[
                { done: true, label: 'Betaling bekreftet av Stripe' },
                { done: attempts > 0, label: 'Tilgang aktiveres i systemet' },
                { done: false, label: 'Bekreftelsesmail sendes til deg' },
              ].map(({ done, label }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${done ? 'bg-brand-teal text-white' : 'bg-brand-teal/10 text-brand-teal/40'}`}>
                    {done ? <CheckCircle2 size={15} /> : i + 1}
                  </div>
                  <p className={`text-sm transition-colors duration-500 ${done ? 'text-brand-ink/80' : 'text-brand-ink/40'}`}>{label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} custom={2}>
              <p className="text-sm text-brand-ink/40 animate-pulse">
                Sjekker automatisk hvert 3. sekund…
              </p>
              <p className="mt-3 text-sm text-brand-ink/35">
                Problemer? <a href="mailto:support@skrivakademisk.no" className="underline hover:text-brand-teal">Kontakt oss</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentSuccessPage;
