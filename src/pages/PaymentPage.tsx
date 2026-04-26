import { useState } from 'react';
import { CheckCircle2, Lock, Mail, Star, ArrowRight, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { startCheckout } from '../lib/checkout';

const included = [
  '23 videoleksjoner i 4 moduler',
  'Fra problemstilling til innlevering',
  'Nedlastbare sjekklister og maler',
  'For VGS, bachelor og master',
  'Kombiner med skriveappen (13 språk)',
  'Se leksjonene så mange ganger du vil',
];

const forWho = [
  { icon: '🎓', text: 'Bachelor- og masterstudenter som vil levere en oppgave de er stolte av' },
  { icon: '⏱️', text: 'Studenter som sliter med struktur, APA-referanser eller akademisk språk' },
  { icon: '🚀', text: 'Alle som vil komme raskere i gang og unngå de vanligste feilene' },
];

const testimonials = [
  {
    quote: 'Anbefales på det sterkeste — skulle ønske jeg hadde tilgang lenge før.',
    name: 'Sinem',
    role: 'Masterstudent',
  },
  {
    quote: 'Endelig forstod jeg drøftingsdelen! APA 7 ble enkelt med disse eksemplene.',
    name: 'Ikram',
    role: 'Bachelorstudent, UiA',
  },
  {
    quote: 'Kurset ga meg selvtillit til å faktisk begynne å skrive. Leksjonene er tydelige.',
    name: 'Harleen',
    role: 'Bachelorstudent, UiO',
  },
];

const faqs = [
  {
    q: 'Hvor lenge har jeg tilgang?',
    a: 'Tilgangen er livsvarig. Du betaler én gang og har tilgang for alltid, inkludert alle fremtidige oppdateringer.',
  },
  {
    q: 'Passer kurset for alle studieretninger?',
    a: 'Ja. Kurset dekker generell oppgavestruktur, APA 7 og akademisk skrivestil som gjelder på tvers av fag.',
  },
  {
    q: 'Hva om kurset ikke passer for meg?',
    a: 'Ta kontakt med oss på support@skrivakademisk.no, så finner vi en løsning.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const PaymentPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (profile?.hasPaidAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleBuyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      navigate('/innlogging?redirect=/betaling');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await startCheckout('akademisk', user.email ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">

      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative overflow-hidden rounded-3xl bg-brand-teal px-8 py-14 text-center shadow-card md:px-16"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-coral/10 blur-3xl" />

        <motion.div variants={fadeUp} custom={0} className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm mb-6">
            <Star size={13} className="fill-brand-coral-light text-brand-coral-light" />
            Norges mest komplette kurs i akademisk skriving
          </div>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="relative text-4xl leading-tight text-white md:text-5xl">
          Skriv bachelor- eller masteroppgaven<br className="hidden md:block" /> med selvtillit
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} className="relative mt-5 text-lg text-white/70 max-w-xl mx-auto">
          Steg-for-steg videoveiledning i oppgavestruktur, APA 7 og akademisk skrivestil — laget spesielt for norske studenter.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="relative mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/55">
          <span className="flex items-center gap-2"><Clock size={15} /> 23 videoleksjoner</span>
          <span className="flex items-center gap-2"><Star size={15} className="fill-current" /> Tilgang for alltid</span>
          <span className="flex items-center gap-2"><Award size={15} /> APA 7 + sjekklister</span>
        </motion.div>
      </motion.section>

      {/* For hvem */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="text-center space-y-6"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-2xl text-brand-teal">Passer dette for deg?</motion.h2>
        <div className="grid gap-4 md:grid-cols-3">
          {forWho.map(({ icon, text }, i) => (
            <motion.div key={text} variants={fadeUp} custom={i + 1} className="rounded-2xl bg-[rgb(var(--c-surface))] p-6 shadow-card text-left space-y-3 border border-[rgb(var(--c-border))]">
              <span className="text-3xl">{icon}</span>
              <p className="text-[rgb(var(--c-ink))]/75 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Kjøpsboks + inkludert */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="grid gap-6 md:grid-cols-2 items-start"
      >
        {/* Hva er inkludert */}
        <motion.div variants={fadeUp} custom={0} className="rounded-2xl bg-[rgb(var(--c-surface))] p-7 shadow-card space-y-4 border border-[rgb(var(--c-border))]">
          <h2 className="text-xl text-brand-teal">Dette er inkludert</h2>
          <ul className="space-y-3">
            {included.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-[rgb(var(--c-ink))]/75">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-coral" />
                {f}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Kjøpskort */}
        <motion.div
          variants={fadeUp}
          custom={1}
          className="sticky top-6 rounded-3xl bg-brand-teal p-8 text-white space-y-5 shadow-card overflow-hidden relative"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <p className="text-sm text-white/60 font-medium mb-1">🎓 Investér i oppgaven din</p>
            <div className="flex items-end gap-2">
              <p className="text-6xl font-bold font-heading text-white">1 990</p>
              <p className="text-white/60 mb-2">kr</p>
            </div>
            <p className="text-white/50 text-sm">Én gang — tilgang for alltid</p>
          </div>

          <ul className="relative space-y-2">
            {included.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 size={14} className="shrink-0 text-green-300" />
                {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleBuyClick}
            disabled={loading}
            className="relative group flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-coral px-6 py-4 font-bold text-white text-lg shadow-lg shadow-brand-coral/30 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-wait"
          >
            {loading ? 'Sender deg til betaling…' : 'Kjøp tilgang — 1 990 kr'}
            {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
          </button>

          {error && (
            <p className="relative text-center text-xs text-red-200">{error}</p>
          )}

          <p className="relative text-center text-xs text-white/50 italic leading-relaxed">
            Billigere enn én veiledningstime. Og du kan se leksjonene igjen og igjen.
          </p>

          <div className="relative space-y-2 pt-1">
            <div className="flex items-center gap-2.5 text-white/45 text-xs">
              <Lock size={13} /> Sikker betaling via Stripe
            </div>
            <div className="flex items-center gap-2.5 text-white/45 text-xs">
              <Mail size={13} /> Kvittering sendes på e-post
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Sosialt bevis */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="space-y-6"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-2xl text-brand-teal text-center">Hva studentene sier</motion.h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map(({ quote, name, role }, i) => (
            <motion.figure key={name} variants={fadeUp} custom={i + 1} className="rounded-2xl bg-[rgb(var(--c-surface))] p-6 shadow-card space-y-3 border border-[rgb(var(--c-border))]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-brand-coral fill-brand-coral" />
                ))}
              </div>
              <blockquote className="text-sm text-[rgb(var(--c-ink))]/75 italic leading-relaxed">"{quote}"</blockquote>
              <figcaption className="text-xs text-[rgb(var(--c-ink))]/40 font-medium">
                — {name}, <span className="font-normal">{role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
        className="max-w-2xl mx-auto space-y-4"
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-2xl text-brand-teal text-center">Vanlige spørsmål</motion.h2>
        {faqs.map(({ q, a }, i) => (
          <motion.div key={q} variants={fadeUp} custom={i + 1} className="rounded-2xl bg-[rgb(var(--c-surface))] p-6 shadow-card border border-[rgb(var(--c-border))]">
            <p className="font-semibold text-brand-teal">{q}</p>
            <p className="mt-2 text-sm text-[rgb(var(--c-ink))]/65 leading-relaxed">{a}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Bottom CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl bg-brand-coral px-8 py-14 text-center text-white shadow-card"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative space-y-4">
          <h2 className="text-3xl text-white">Klar til å skrive en oppgave du er stolt av?</h2>
          <p className="text-white/75">Én betaling. Tilgang for alltid. Start i dag.</p>
          <button
            type="button"
            onClick={handleBuyClick}
            disabled={loading}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-brand-coral text-lg shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-wait"
          >
            {loading ? 'Sender deg til betaling…' : 'Kjøp tilgang — 1 990 kr'}
            {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </div>
      </motion.section>

    </div>
  );
};

export default PaymentPage;
