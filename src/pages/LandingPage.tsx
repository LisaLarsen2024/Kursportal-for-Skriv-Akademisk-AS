import { CheckCircle2, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { modules } from '../data/courseData';

const LandingPage = () => (
  <div className="space-y-14">
    <section className="rounded-3xl bg-gradient-to-br from-brand-teal to-brand-ink p-8 text-brand-cream shadow-soft md:p-12">
      <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm">Akademisk veiledningsapp</p>
      <h1 className="max-w-3xl text-4xl leading-tight md:text-5xl">
        Lær å skrive bachelor- og masteroppgave — steg for steg
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-brand-cream/90">
        Et komplett digitalt kurs i oppgavestruktur, APA 7 og akademisk skrivestil, laget for norske studenter.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="rounded-full bg-brand-coral px-6 py-3 font-semibold text-white" to="/betaling">
          Kjøp tilgang
        </Link>
        <Link className="rounded-full border border-white/40 px-6 py-3 font-semibold" to="/innlogging">
          Start kurset
        </Link>
      </div>
    </section>

    <section>
      <h2 className="text-3xl text-brand-teal">Moduloversikt</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <article key={module.id} className="rounded-2xl border border-brand-teal/15 bg-white p-5 shadow-soft">
            <h3 className="text-2xl text-brand-teal">{module.title}</h3>
            <p className="mt-2 text-brand-ink/80">{module.description}</p>
            <p className="mt-4 text-sm font-medium text-brand-coral">{module.lessons.length} leksjoner</p>
          </article>
        ))}
      </div>
    </section>

    <section className="grid gap-4 rounded-2xl bg-white p-6 shadow-soft md:grid-cols-3">
      <div>
        <p className="text-sm uppercase tracking-wide text-brand-coral">Pris</p>
        <p className="text-3xl text-brand-teal">1 990 NOK</p>
        <p className="text-brand-ink/70">Engangsbetaling med livstids tilgang.</p>
      </div>
      <div className="md:col-span-2 space-y-2">
        {['4 dyptgående moduler', '23 videoleksjoner', 'Nedlastbare sjekklister', 'Personlig progresjonssporing'].map((item) => (
          <p key={item} className="flex items-center gap-2 text-brand-ink">
            <CheckCircle2 size={16} className="text-brand-coral" /> {item}
          </p>
        ))}
      </div>
    </section>

    <section className="rounded-2xl bg-white p-6 shadow-soft">
      <h2 className="text-2xl text-brand-teal">Hva studentene sier</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <blockquote className="rounded-xl bg-brand-cream p-4">“Endelig forstod jeg drøftingsdelen!” — Student, UiA</blockquote>
        <blockquote className="rounded-xl bg-brand-cream p-4">“APA 7 ble enkelt med disse eksemplene.” — Student, BI</blockquote>
      </div>
      <p className="mt-5 flex items-center gap-2 text-sm text-brand-ink/70">
        <PlayCircle size={16} /> Alt innhold leveres som eksternt videoinnhold via trygg embed.
      </p>
    </section>

    <footer className="border-t border-brand-teal/15 py-8 text-sm text-brand-ink/70">
      Skriv Akademisk AS · Org.nr placeholder · www.skrivakademisk.no
    </footer>
  </div>
);

export default LandingPage;
