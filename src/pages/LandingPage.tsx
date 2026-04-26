import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2,
  PlayCircle,
  GraduationCap,
  BookOpen,
  PenTool,
  FileText,
  Users,
  ArrowRight,
  Star,
  Clock,
  Zap,
  ChevronRight,
  Sparkles,
  ChevronDown,
  Laptop,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { modules as courseModules } from '../data/courseData';
import { motion } from 'framer-motion';
import heroStudent from '@/assets/hero-student.svg';
import { useAuth } from '../contexts/AuthContext';
import { startCheckout } from '../lib/checkout';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const moduleIcons = [BookOpen, PenTool, FileText, Users];

const moduleOutcomes = [
  'Du vet nøyaktig hvordan en akademisk oppgave er bygd opp — og har et realistisk disposisjonsforslag du faktisk klarer å følge.',
  'Du kan formulere en presis problemstilling og skrive et drøftingsavsnitt sensor vil sette pris på.',
  'Du velger riktig metode for din oppgave og vet hva du må skrive i metodekapittelet — uten å gå deg vill.',
  'Du mestrer APA 7 fullt ut: kildehenvisninger, referanseliste og sitatregler — og slipper poengfradrag.',
];

const courses = [
  {
    id: 'akademisk',
    level: 'Universitet & Høgskole',
    levelColor: 'bg-brand-teal/10 text-brand-teal',
    badge: null,
    title: 'Akademisk skriving',
    description:
      'Lær å skrive bachelor- og masteroppgaver fra bunn til topp. Oppgavestruktur, APA 7, drøfting og akademisk skrivestil — i eget tempo.',
    price: '1 990 kr',
    priceNote: 'Engangsbetaling · Tilgang for alltid',
    stats: ['23 videoleksjoner', '4 moduler', 'Nedlastbare sjekklister'],
    cta: 'Kjøp tilgang',
    ctaHref: '/betaling',
    external: false,
    available: true,
  },
  {
    id: 'norsk-vg3',
    level: 'Videregående — Vg3',
    levelColor: 'bg-brand-coral/10 text-brand-coral',
    badge: 'Ny',
    title: 'Norsk eksamen VGS',
    description:
      'Alt du trenger til norskeksamen. Fire sjangre, tekstanalyse, nynorsk og eksamensstrategi — på 78 minutter.',
    price: '549 kr',
    priceNote: 'Engangsbetaling · Tilgang for alltid',
    stats: ['5 videoleksjoner', '5 moduler', 'Basert på NOR01-07'],
    cta: 'Kjøp tilgang',
    ctaHref: '',
    external: false,
    available: true,
  },
  {
    id: 'ungdomsskole',
    level: 'Ungdomsskole — 8.–10. trinn',
    levelColor: 'bg-brand-green/10 text-brand-green',
    badge: 'August 2026',
    title: 'Skriv smartere',
    description:
      'Lær å skrive tekster som imponerer læreren — steg for steg. Drøfting, argumentasjon, kildekritikk og eksamensforberedelse for 8.–10. trinn.',
    price: '490 kr',
    priceNote: 'Lansering august 2026 · Engangsbetaling',
    stats: ['15 videoleksjoner', '5 moduler', 'Basert på LK20'],
    cta: 'Meld interesse',
    ctaHref: '/ungdomsskole',
    external: false,
    available: true,
  },
];

const testimonials = [
  {
    quote: 'Wow, noe av det beste jeg har vært borti! Gjør hele prosessen mye enklere og mer oversiktlig.',
    cite: 'Ikram',
    role: 'Masterstudent',
    stars: 5,
  },
  {
    quote: 'Appen har vært til stor hjelp i arbeidet med masteroppgaven min. Fungerer mye bedre enn andre KI-verktøy.',
    cite: 'Harleen',
    role: 'Masterstudent',
    stars: 5,
  },
  {
    quote: 'Appen er helt fantastisk og lett å bruke. Anbefales på det sterkeste.',
    cite: 'Sinem',
    role: 'Masterstudent',
    stars: 5,
  },
];

const targetGroups = [
  '📝 Du som skriver særemne eller fordypningsoppgave på VGS',
  '📝 Du som skal i gang med bacheloroppgaven',
  '📝 Du som sliter med drøfting, metode eller APA 7 på masternivå',
  '📝 Du som har et annet morsmål enn norsk og trenger ekstra støtte',
  '📝 Du som har prøvd å google deg frem — men trenger mer enn tilfeldige tips',
];

function useUrgencyBanner() {
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const candidates = [
      { name: 'bacheloroppgaven', date: new Date(year, 4, 20) },
      { name: 'masteroppgaven', date: new Date(year, 5, 1) },
    ].map((d) => ({
      ...d,
      date: d.date < now ? new Date(year + 1, d.date.getMonth(), d.date.getDate()) : d.date,
    }));

    const nearest = candidates.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksLeft = Math.ceil((nearest.date.getTime() - now.getTime()) / msPerWeek);

    if (weeksLeft > 12) return null;
    return { weeks: weeksLeft, name: nearest.name };
  }, []);
}

const LandingPage = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const urgency = useUrgencyBanner();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (courseId: 'akademisk' | 'norsk-vg3') => {
    if (!user) {
      navigate('/innlogging?redirect=/');
      return;
    }
    setCheckoutLoading(courseId);
    try {
      await startCheckout(courseId, user.email ?? undefined);
    } catch (err) {
      console.error('Checkout failed:', err);
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="space-y-0">
      <Helmet>
        <title>Skriv Akademisk | Videokurs i akademisk skriving og norsk eksamen</title>
        <meta name="description" content="Videokurs i akademisk skriving for bachelor- og masterstudenter, norsk eksamen VGS og skriving for ungdomsskolen. Laget av Lisa — lektor med tre mastergrader. Engangsbetaling, tilgang for alltid." />
        <link rel="canonical" href="https://kurs.skrivakademisk.no/" />
        <meta property="og:url" content="https://kurs.skrivakademisk.no/" />
        <meta property="og:title" content="Skriv Akademisk | Videokurs i akademisk skriving og norsk eksamen" />
        <meta property="og:description" content="Videokurs i akademisk skriving for bachelor- og masterstudenter, norsk eksamen VGS og skriving for ungdomsskolen. Laget av Lisa — lektor med tre mastergrader." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Kurs — Skriv Akademisk",
          "url": "https://kurs.skrivakademisk.no/",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Course",
                "name": "Akademisk skriving — bachelor og master",
                "description": "23 videoleksjoner som tar deg fra «hjelp» til «levert». Struktur, kildekritikk, APA 7 og akademisk skrivestil. For alle nivåer — fra VGS til master.",
                "url": "https://kurs.skrivakademisk.no/betaling",
                "provider": { "@type": "Organization", "name": "Skriv Akademisk AS", "url": "https://skrivakademisk.no" },
                "inLanguage": "nb",
                "offers": { "@type": "Offer", "price": "1990", "priceCurrency": "NOK", "availability": "https://schema.org/InStock" }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Course",
                "name": "Norsk eksamen VGS",
                "description": "5 videoleksjoner som dekker alt du trenger til norskeksamen — sjangerkunnskap, tekstanalyse, skriveteknikk og eksamensstrategi.",
                "url": "https://kurs.skrivakademisk.no/betaling",
                "provider": { "@type": "Organization", "name": "Skriv Akademisk AS", "url": "https://skrivakademisk.no" },
                "inLanguage": "nb",
                "offers": { "@type": "Offer", "price": "549", "priceCurrency": "NOK", "availability": "https://schema.org/InStock" }
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Course",
                "name": "Skriv smartere — Ungdomsskole",
                "description": "15 videoleksjoner for 8.–10. trinn. Drøfting, argumentasjon, kildekritikk og eksamensforberedelse basert på LK20.",
                "url": "https://kurs.skrivakademisk.no/ungdomsskole",
                "provider": { "@type": "Organization", "name": "Skriv Akademisk AS", "url": "https://skrivakademisk.no" },
                "inLanguage": "nb",
                "offers": { "@type": "Offer", "price": "490", "priceCurrency": "NOK", "availability": "https://schema.org/InStock" }
              }
            }
          ]
        })}</script>
      </Helmet>

      {/* URGENCY BANNER */}
      {urgency && (
        <div className="mb-6 flex items-center justify-center gap-2 rounded-2xl border border-brand-coral/30 bg-brand-coral/10 px-5 py-3 text-sm font-medium text-brand-coral">
          <Clock size={15} className="shrink-0" />
          <span>
            Kun <strong>{urgency.weeks} uker</strong> til innlevering av {urgency.name} — kurset tar
            deg gjennom hele prosessen
          </span>
        </div>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-teal px-8 py-12 md:px-16 md:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-brand-coral/15 blur-3xl" />

        <div className="relative flex flex-col-reverse items-center gap-10 md:flex-row md:items-center md:gap-16">
          <motion.div className="flex-1" initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                <GraduationCap size={14} /> Kursportal for norsk skriving
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="max-w-2xl text-4xl leading-[1.12] text-white md:text-5xl lg:text-[3.25rem]"
            >
              Sitter du fast i oppgaven?{' '}
              <em className="text-brand-coral-light not-italic">Du er ikke alene.</em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 max-w-xl text-lg font-medium leading-snug text-white/85"
            >
              23 videoleksjoner som tar deg fra «hjelp» til «levert» — i ditt eget tempo.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="mt-3 max-w-lg text-base leading-relaxed text-white/60"
            >
              Laget av en lektor med tre mastergrader som nesten droppet ut av videregående. For alle
              nivåer — fra VGS til master.
            </motion.p>

            <motion.div variants={fadeUp} custom={4} className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/innlogging"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-4 font-semibold text-white shadow-lg shadow-brand-coral/25 transition-all hover:shadow-xl hover:shadow-brand-coral/30 hover:-translate-y-0.5"
              >
                <PlayCircle size={18} /> Se første leksjon gratis
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#moduler"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Se hva kurset inneholder <ChevronDown size={16} />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={5}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-brand-coral-light" /> Engangsbetaling —
                tilgang for alltid
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-brand-coral-light" /> Fra VGS til master
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-44 flex-shrink-0 md:w-56 lg:w-64"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] as const }}
          >
            <motion.img
              src={heroStudent}
              alt="Student som skriver"
              className="w-full drop-shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="-mt-6 relative z-10 mx-4 md:mx-8"
      >
        <div className="grid grid-cols-3 divide-x divide-brand-border rounded-2xl bg-brand-warm px-4 py-6 shadow-card border border-brand-border md:px-8 md:py-8">
          {[
            { icon: Clock, num: '3', label: 'Kurs tilgjengelig' },
            { icon: BookOpen, num: '28+', label: 'Videoleksjoner' },
            { icon: Zap, num: '∞', label: 'Tilgang for alltid' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="flex flex-col items-center text-center px-2"
            >
              <stat.icon size={20} className="mb-2 text-brand-coral" />
              <p className="text-2xl md:text-3xl text-brand-teal">{stat.num}</p>
              <p className="mt-1 text-xs md:text-sm text-brand-gray">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* KURS-KORT */}
      <motion.section
        id="kurs"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="pt-20 pb-4"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Velg ditt kurs
          </span>
          <h2 className="text-3xl md:text-4xl">Fra ungdomsskole til høgskole</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-gray">
            Vi møter deg der du er. Alle kurs er bygget på læreplanen og gir deg konkrete verktøy —
            ikke vag teori.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              variants={fadeUp}
              custom={i}
              className={`relative flex flex-col rounded-2xl border bg-brand-warm p-7 shadow-card transition-all ${
                course.available
                  ? 'border-brand-border hover:shadow-soft hover:-translate-y-0.5'
                  : 'border-dashed border-brand-border opacity-75'
              }`}
            >
              {course.badge && (
                <span
                  className={`absolute -top-3 right-5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                    course.badge === 'Ny' ? 'bg-brand-coral' : 'bg-brand-gray'
                  }`}
                >
                  {course.badge}
                </span>
              )}

              <div className="flex-1">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-4 ${course.levelColor}`}
                >
                  {course.level}
                </span>
                <h3 className="text-xl text-brand-teal leading-snug">{course.title}</h3>
                <p className="mt-3 text-sm text-brand-gray leading-relaxed">{course.description}</p>

                {course.stats.length > 0 && (
                  <ul className="mt-5 space-y-1.5">
                    {course.stats.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-xs text-brand-gray">
                        <CheckCircle2 size={13} className="shrink-0 text-brand-coral" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {!course.available && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl bg-brand-teal/10 px-4 py-3">
                    <Sparkles size={14} className="text-brand-teal" />
                    <p className="text-xs text-brand-teal font-medium">
                      Under utvikling — registrer deg for å få beskjed
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-brand-border">
                {course.price && (
                  <p className="mb-3">
                    <span className="text-2xl text-brand-teal">{course.price}</span>
                    <span className="ml-2 text-xs text-brand-gray">{course.priceNote}</span>
                  </p>
                )}
                {course.id === 'norsk-vg3' ? (
                  <button
                    type="button"
                    onClick={() => handleCheckout('norsk-vg3')}
                    disabled={checkoutLoading === 'norsk-vg3'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-coral px-5 py-3 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition disabled:opacity-60 disabled:cursor-wait"
                  >
                    {checkoutLoading === 'norsk-vg3' ? 'Sender deg til betaling…' : course.cta}
                    {checkoutLoading !== 'norsk-vg3' && <ChevronRight size={15} />}
                  </button>
                ) : (
                  <Link
                    to={course.ctaHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-coral px-5 py-3 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition"
                  >
                    {course.cta} <ChevronRight size={15} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* MODULER — akademisk kurs */}
      <motion.section
        id="moduler"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="pt-16 pb-4"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Akademisk skriving — kursinnhold
          </span>
          <h2 className="text-3xl md:text-4xl">Hva du lærer</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-gray">
            4 moduler som tar deg fra blank side til ferdig innlevert oppgave.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {courseModules.map((module, idx) => {
            const Icon = moduleIcons[idx % moduleIcons.length];
            const isExpanded = expandedModule === module.id;
            const totalMinutes = module.lessons.reduce((s, l) => s + (l.durationMinutes ?? 0), 0);

            return (
              <motion.article
                key={module.id}
                variants={fadeUp}
                custom={idx}
                className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-warm p-7 shadow-card transition-all hover:shadow-soft"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-teal/[0.04] transition-all group-hover:scale-150" />

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal transition-colors group-hover:bg-brand-coral/10 group-hover:text-brand-coral">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-coral">
                        Modul {idx + 1}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-brand-gray">
                        <Clock size={11} /> {module.lessons.length} leksjoner · {totalMinutes} min
                      </span>
                    </div>
                    <h3 className="mt-1 text-xl">{module.title}</h3>
                    <p className="mt-2 text-brand-gray leading-relaxed text-sm">
                      {module.description}
                    </p>

                    {/* Konkret læringsmål */}
                    <div className="mt-4 rounded-xl border border-brand-teal/15 bg-brand-teal/5 px-4 py-3">
                      <p className="text-xs font-semibold text-brand-teal mb-1">
                        Etter denne modulen kan du:
                      </p>
                      <p className="text-sm text-brand-gray leading-snug">
                        {moduleOutcomes[idx]}
                      </p>
                    </div>

                    {/* Leksjoner */}
                    <button
                      type="button"
                      onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                      className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-teal hover:text-brand-coral transition-colors"
                    >
                      {isExpanded ? 'Skjul leksjoner' : 'Se leksjonene'}
                      <ChevronDown
                        size={13}
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isExpanded && (
                      <ul className="mt-3 space-y-1.5 border-t border-brand-border pt-3">
                        {module.lessons.map((lesson, li) => (
                          <li key={lesson.id} className="flex items-center gap-2 text-sm text-brand-gray">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[10px] font-bold text-brand-teal">
                              {li + 1}
                            </span>
                            {lesson.title}
                            {lesson.durationMinutes ? (
                              <span className="ml-auto shrink-0 text-xs text-brand-gray/60">
                                {lesson.durationMinutes} min
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      {/* HVEM ER KURSET FOR? */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="pt-16 pb-4"
      >
        <div className="rounded-3xl border border-brand-border bg-brand-warm px-8 py-14 md:px-14">
          <motion.div variants={fadeUp} custom={0} className="mb-10 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
              Er dette kurset for meg?
            </span>
            <h2 className="text-3xl md:text-4xl">Hvem er kurset for?</h2>
          </motion.div>

          <div className="grid gap-3 md:grid-cols-2 max-w-2xl mx-auto">
            {targetGroups.map((group, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-3 rounded-xl border border-brand-border bg-brand-cream px-5 py-4"
              >
                <p className="text-sm leading-relaxed text-brand-gray">{group}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-16"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Tilbakemeldinger
          </span>
          <h2 className="text-3xl md:text-4xl">Hva studentene sier</h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.cite}
              variants={fadeUp}
              custom={i}
              className="relative rounded-2xl bg-brand-warm p-7 shadow-card border border-brand-border"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={16} className="fill-brand-coral text-brand-coral" />
                ))}
              </div>
              <p className="text-base text-brand-gray italic leading-relaxed">«{t.quote}»</p>
              <footer className="mt-4">
                <cite className="block text-sm not-italic font-semibold text-brand-ink">
                  {t.cite}
                </cite>
                <span className="text-xs text-brand-gray">{t.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </motion.section>

      {/* KOBLING TIL APPEN */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="pb-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-brand-teal/20 bg-brand-teal/5 px-8 py-10 md:px-12">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-teal/15 text-brand-teal">
            <Laptop size={28} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl text-brand-teal">Trenger du hjelp mens du skriver?</h3>
            <p className="mt-2 text-sm text-brand-gray leading-relaxed">
              Kombiner kurset med skriveappen — den gir deg konkrete forbedringsforslag i drøfting,
              metode, struktur og APA 7. Skriveappen er tilgjengelig på 13 språk.
            </p>
          </div>
          <a
            href="https://app.skrivakademisk.no"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-teal/30 px-6 py-3 text-sm font-semibold text-brand-teal hover:bg-brand-teal/10 transition-all whitespace-nowrap"
          >
            Prøv appen gratis i 3 dager <ArrowRight size={15} />
          </a>
        </div>
      </motion.section>

      {/* PRIS — humanisert */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="pb-8"
      >
        <div className="rounded-3xl border border-brand-border bg-brand-warm px-8 py-14 md:px-14">
          <motion.div variants={fadeUp} custom={0} className="max-w-xl mx-auto text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
              Pris og tilgang
            </span>
            <h2 className="text-3xl md:text-4xl">1 990 kr — én gang, tilgang for alltid</h2>
            <p className="mt-4 text-base text-brand-gray leading-relaxed">
              Det er billigere enn én veiledningstime. Og du kan se leksjonene igjen og igjen — helt
              frem til innlevering.
            </p>

            <ul className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              {[
                '23 videoleksjoner i 4 moduler',
                'Fra problemstilling til ferdig innlevering',
                'Nedlastbare sjekklister',
                'For VGS, bachelor og master',
                'Kombiner med skriveappen (13 språk)',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-brand-gray">
                  <CheckCircle2 size={16} className="shrink-0 text-brand-green" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-brand-gray/70">
              Kurset er på norsk. Skriveappen vår er tilgjengelig på 13 språk for ekstra støtte.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/betaling"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-coral px-8 py-4 font-semibold text-white shadow-lg shadow-brand-coral/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Akademisk skriving — 1 990 kr
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={() => handleCheckout('norsk-vg3')}
                disabled={checkoutLoading === 'norsk-vg3'}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-border px-8 py-4 font-semibold text-brand-teal transition hover:border-brand-teal/30 hover:bg-brand-teal/5 disabled:opacity-60 disabled:cursor-wait"
              >
                {checkoutLoading === 'norsk-vg3' ? 'Sender deg til betaling…' : 'Norsk VGS — 549 kr'}
                {checkoutLoading !== 'norsk-vg3' && <ArrowRight size={16} />}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA BUNN */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-brand-teal px-8 py-14 md:px-16 text-center">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-coral/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

          <motion.div variants={fadeUp} custom={0} className="relative">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral-light">
              Kom i gang i dag
            </span>
            <h2 className="text-3xl md:text-4xl text-white">
              Du trenger ikke starte alene.
            </h2>
            <p className="mt-3 text-white/55">
              Engangsbetaling · Ingen abonnement · Tilgang for alltid
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            className="relative mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/betaling"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-4 font-semibold text-white shadow-lg shadow-brand-coral/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Start med akademisk skriving
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => handleCheckout('norsk-vg3')}
              disabled={checkoutLoading === 'norsk-vg3'}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-8 py-4 font-semibold text-white transition hover:border-white/40 hover:bg-white/5 disabled:opacity-60 disabled:cursor-wait"
            >
              {checkoutLoading === 'norsk-vg3' ? 'Sender deg til betaling…' : 'Norsk VGS — 549 kr'}
              {checkoutLoading !== 'norsk-vg3' && (
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
