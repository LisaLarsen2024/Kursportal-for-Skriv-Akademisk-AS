import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Clock, ChevronDown, ChevronRight,
  FileText, Scale, Search, GraduationCap, Globe,
  PlayCircle, Star, Sparkles, type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ungdomsskoleModules, ungdomsskoleCourseInfo } from '../data/ungdomsskoleData';
import { useAuth } from '../contexts/AuthContext';

// ⬇️ STRIPE: Bytt denne linjen med Payment Link fra Stripe når den er klar (f.eks. 'https://buy.stripe.com/xxxxx')
const STRIPE_UNGDOMSSKOLE = 'mailto:kontakt@skrivakademisk.no?subject=Interesse%20for%20ungdomsskolekurset';

const moduleIcons: Record<string, LucideIcon> = {
  FileText, Scale, Search, GraduationCap, Globe,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const targetGroups = [
  '📝 Elever som vil forstå hva drøfting egentlig betyr',
  '📝 Elever som alltid starter med "blank side-panikk"',
  '📝 Elever som ikke vet hvilke kilder de kan bruke',
  '📝 Elever som er redd for tentamen og eksamen',
  '📝 Foreldre som vil hjelpe — men ikke vet hvordan',
  '📝 Elever med norsk som andrespråk som trenger ekstra støtte',
];

const whyPoints = [
  { emoji: '⚡', title: 'Korte, punchy leksjoner', text: '8–12 minutter per leksjon. En ting du kan bruke med én gang.' },
  { emoji: '🎯', title: 'Basert på LK20', text: 'Alt innhold er knyttet til konkrete kompetansemål i norsk, engelsk og samfunnsfag.' },
  { emoji: '🧠', title: 'Laget av en lektor', text: 'Lisa har tre mastergrader og har lært hundrevis av elever å skrive bedre.' },
  { emoji: '♾️', title: 'Tilgang for alltid', text: 'Én betaling. Se leksjonene så mange ganger du vil — til eksamen er over.' },
];

const UngdomskoleLandingPage = () => {
  const { profile } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const hasAccess = profile?.hasUngdomsskoleAccess ?? false;
  const totalMinutes = ungdomsskoleCourseInfo.totalMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="space-y-0">
      <Helmet>
        <title>Skriv smartere | Kurs for ungdomsskolen (8.–10. trinn) | Skriv Akademisk</title>
        <meta name="description" content="Lær å skrive tekster som imponerer læreren — steg for steg. Drøfting, argumentasjon, kildekritikk og eksamensforberedelse for 8.–10. trinn. Basert på LK20. 490 kr, tilgang for alltid." />
        <link rel="canonical" href="https://kurs.skrivakademisk.no/ungdomsskole" />
        <meta property="og:url" content="https://kurs.skrivakademisk.no/ungdomsskole" />
        <meta property="og:title" content="Skriv smartere | Kurs for ungdomsskolen (8.–10. trinn)" />
        <meta property="og:description" content="Lær å skrive tekster som imponerer læreren — steg for steg. Drøfting, argumentasjon, kildekritikk og eksamensforberedelse for 8.–10. trinn. Basert på LK20." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Skriv smartere — Ungdomsskole",
          "description": "15 videoleksjoner for 8.–10. trinn. Lær å skrive tekster som imponerer læreren — drøfting, argumentasjon, kildekritikk og eksamensforberedelse. Basert på LK20.",
          "url": "https://kurs.skrivakademisk.no/ungdomsskole",
          "inLanguage": "nb",
          "educationalLevel": "secondary",
          "teaches": ["Drøfting", "Argumentasjon", "Kildekritikk", "Tekstskriving", "Eksamensforberedelse"],
          "provider": {
            "@type": "Organization",
            "name": "Skriv Akademisk AS",
            "url": "https://skrivakademisk.no"
          },
          "instructor": {
            "@type": "Person",
            "name": "Lisa",
            "jobTitle": "Lektor",
            "description": "Lektor med tre mastergrader"
          },
          "offers": {
            "@type": "Offer",
            "price": "490",
            "priceCurrency": "NOK",
            "availability": "https://schema.org/InStock",
            "url": "https://kurs.skrivakademisk.no/ungdomsskole"
          },
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "courseWorkload": "PT2H14M"
          }
        })}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-teal px-8 py-12 md:px-14 md:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-coral/15 blur-3xl" />

        <motion.div className="relative max-w-2xl" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} custom={0}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
              <Sparkles size={13} /> Lansering august 2026 · 8.–10. trinn
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl leading-tight text-white md:text-5xl">
            Skriv smartere
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="mt-3 text-xl font-medium text-white/80">
            Lær å skrive tekster som imponerer læreren — steg for steg.
          </motion.p>

          <motion.p variants={fadeUp} custom={3} className="mt-3 max-w-xl text-base leading-relaxed text-white/60">
            Drøfting, argumentasjon, kildekritikk og eksamensforberedelse for ungdomsskoleelever.
            Basert på LK20. Laget av Lisa — lektor med tre mastergrader.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
            {[
              `${ungdomsskoleCourseInfo.totalLessons} videoleksjoner`,
              `${ungdomsskoleCourseInfo.moduleCount} moduler`,
              `${hours} t ${mins} min totalt`,
              'Basert på LK20',
            ].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-brand-coral-light" /> {s}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} custom={5} className="mt-8 flex flex-wrap gap-4 items-center">
            {hasAccess ? (
              <Link
                to="/ungdomsskole/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-4 font-semibold text-white shadow-lg shadow-brand-coral/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-coral/30"
              >
                <PlayCircle size={18} /> Gå til kurset <ChevronRight size={16} />
              </Link>
            ) : (
              <>
                <a
                  href="#kjop"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-8 py-4 font-semibold text-white shadow-lg shadow-brand-coral/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-coral/30"
                >
                  Meld interesse <ChevronRight size={16} />
                </a>
                <a
                  href="#moduler"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Se innholdet <ChevronDown size={16} />
                </a>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* WHY */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
        className="pt-16 pb-4"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-10 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Hvorfor dette kurset?
          </span>
          <h2 className="text-3xl md:text-4xl">Én gang for alle</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-gray">
            Lærerne har ikke tid til individuell veiledning. Lærebøkene forklarer <em>hva</em> du skal gjøre — ikke <em>hvordan</em>. Det gjør dette kurset.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {whyPoints.map((p, i) => (
            <motion.div
              key={p.title} variants={fadeUp} custom={i}
              className="flex gap-4 rounded-2xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] p-6"
            >
              <span className="text-3xl">{p.emoji}</span>
              <div>
                <p className="font-semibold text-[rgb(var(--c-ink))]">{p.title}</p>
                <p className="mt-1 text-sm text-brand-gray leading-relaxed">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* MODULES */}
      <motion.section
        id="moduler"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
        className="pt-16 pb-4"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-8 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Kursinnhold
          </span>
          <h2 className="text-3xl md:text-4xl">5 moduler · 15 leksjoner</h2>
        </motion.div>

        <div className="space-y-4">
          {ungdomsskoleModules.map((mod, idx) => {
            const Icon = moduleIcons[mod.icon] ?? FileText;
            const isBonus = mod.id === 'ung-mod-5';
            const isOpen = expandedModule === mod.id;
            const totalMin = mod.lessons.reduce((s, l) => s + l.durationMinutes, 0);

            return (
              <motion.div
                key={mod.id} variants={fadeUp} custom={idx}
                className="rounded-2xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedModule(isOpen ? null : mod.id)}
                  className="flex w-full items-start gap-4 p-6 text-left"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-coral">
                        {isBonus ? 'Bonus' : `Modul ${idx + 1}`}
                      </span>
                      <span className="text-xs text-brand-gray">
                        {mod.lessons.length} leksjoner · {totalMin} min
                      </span>
                    </div>
                    <h3 className="text-lg font-heading text-brand-teal leading-snug">{mod.title}</h3>
                    <p className="mt-1 text-sm text-brand-gray leading-relaxed">{mod.description}</p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`mt-1 shrink-0 text-brand-gray transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[rgb(var(--c-border))] px-6 pb-5 pt-4">
                    <ul className="space-y-2.5">
                      {mod.lessons.map((lesson, li) => (
                        <li key={lesson.id} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[10px] font-bold text-brand-teal">
                            {li + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[rgb(var(--c-ink))] leading-snug">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-brand-gray mt-0.5">{lesson.description}</p>
                          </div>
                          <span className="shrink-0 text-xs text-brand-gray/60 flex items-center gap-1">
                            <Clock size={10} /> {lesson.durationMinutes} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* TARGET GROUPS */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
        className="pt-16 pb-4"
      >
        <div className="rounded-3xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] px-8 py-12 md:px-12">
          <motion.div variants={fadeUp} custom={0} className="mb-8 text-center">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
              Er dette kurset for deg?
            </span>
            <h2 className="text-3xl">Hvem er kurset for?</h2>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
            {targetGroups.map((g, i) => (
              <motion.div
                key={i} variants={fadeUp} custom={i}
                className="flex items-start gap-3 rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-bg))] px-5 py-4"
              >
                <p className="text-sm leading-relaxed text-brand-gray">{g}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
        className="pt-16 pb-4"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-8 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Fra de som kjenner Lisa
          </span>
          <h2 className="text-3xl">Hva studentene sier</h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { quote: 'Endelig forstod jeg hva drøfting egentlig er. Burde hatt dette på ungdomsskolen!', name: 'Ikram', role: 'Vg1-elev' },
            { quote: 'TEBS-modellen ble en gamechanger for meg. Karakteren gikk opp med én hel karakter.', name: 'Harleen', role: 'Vg2-elev' },
            { quote: 'Mamma kjøpte kurset til meg, og det var den beste investeringen vi har gjort.', name: 'Sinem', role: '10. trinn' },
          ].map((t, i) => (
            <motion.blockquote
              key={t.name} variants={fadeUp} custom={i}
              className="rounded-2xl bg-[rgb(var(--c-surface))] p-7 shadow-card border border-[rgb(var(--c-border))]"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={15} className="fill-brand-coral text-brand-coral" />
                ))}
              </div>
              <p className="text-base text-brand-gray italic leading-relaxed">«{t.quote}»</p>
              <footer className="mt-4">
                <cite className="block text-sm not-italic font-semibold text-[rgb(var(--c-ink))]">{t.name}</cite>
                <span className="text-xs text-brand-gray">{t.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </motion.section>

      {/* INTEREST SECTION */}
      {!hasAccess && (
        <motion.section
          id="kjop"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
          className="pt-16 pb-4"
        >
          <motion.div
            variants={fadeUp} custom={0}
            className="rounded-3xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] p-8 md:p-12 text-center max-w-lg mx-auto"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-coral mb-4">
              Lansering
            </p>
            <p className="text-4xl font-heading text-brand-teal">August 2026</p>
            <p className="mt-2 text-brand-gray text-sm">490 kr · Engangsbetaling · Tilgang for alltid</p>

            <ul className="mt-6 space-y-2.5 text-left">
              {[
                '15 videoleksjoner i 5 moduler',
                'Drøfting, argumentasjon, kildekritikk',
                'Eksamen- og tentamenstrategi',
                'Basert på LK20 (norsk, engelsk, samfunnsfag)',
                'Tilgang for alltid — inkl. fremtidige oppdateringer',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-brand-gray">
                  <CheckCircle2 size={15} className="shrink-0 text-brand-teal" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3">
              <a
                href={STRIPE_UNGDOMSSKOLE}
                className="block w-full rounded-xl bg-brand-coral px-6 py-4 text-center font-semibold text-white shadow-lg shadow-brand-coral/20 transition hover:opacity-90 hover:-translate-y-0.5"
              >
                Meld interesse — få beskjed når kurset åpner
              </a>
              <p className="text-xs text-brand-gray/60">
                Vi sender deg en e-post når kurset er klart i august 2026.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-brand-teal/20 bg-brand-teal/5 px-4 py-3">
              <p className="text-xs text-brand-teal font-semibold">
                Billigere enn én time med privatlektor
              </p>
              <p className="text-xs text-brand-gray mt-0.5">
                En privatlektor koster 500–800 kr/time. Her får du 2+ timer kurs for 490 kr — for alltid.
              </p>
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* ALREADY HAS ACCESS */}
      {hasAccess && (
        <div className="pt-10 pb-4 text-center">
          <Link
            to="/ungdomsskole/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-8 py-4 font-semibold text-white shadow-lg shadow-brand-teal/20 transition hover:opacity-90"
          >
            <PlayCircle size={18} /> Gå til kurset <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* OTHER COURSES */}
      <div className="pt-12 pb-4">
        <div className="rounded-2xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[rgb(var(--c-ink))]">
              🎓 For bachelor- og masterstudenter?
            </p>
            <p className="text-xs text-brand-gray mt-0.5">
              Vi har et eget kurs for universitets- og høgskolestudenter — 23 leksjoner, APA 7, drøfting og mer.
            </p>
          </div>
          <Link
            to="/betaling"
            className="shrink-0 text-sm font-bold text-brand-coral hover:underline whitespace-nowrap"
          >
            Se akademisk skriving →
          </Link>
        </div>
      </div>

    </div>
  );
};

export default UngdomskoleLandingPage;
