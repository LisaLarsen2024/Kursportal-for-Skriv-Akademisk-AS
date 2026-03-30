import { Database, Shield, Trash2, Mail } from 'lucide-react';

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] p-7 space-y-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
        {icon}
      </div>
      <h2 className="text-xl font-heading text-brand-teal">{title}</h2>
    </div>
    <div className="text-sm text-[rgb(var(--c-ink))]/75 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const PersonvernPage = () => (
  <div className="max-w-2xl mx-auto space-y-6 pb-12">
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">Juridisk</p>
      <h1 className="text-3xl font-heading text-brand-teal">Personvernerklæring</h1>
      <p className="text-brand-gray text-sm">
        Skriv Akademisk AS (org.nr. 930 906 107) · Sist oppdatert: januar 2026
      </p>
    </div>

    <p className="text-sm text-[rgb(var(--c-ink))]/70 leading-relaxed rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] px-5 py-4">
      Vi respekterer personvernet ditt. Denne erklæringen forklarer hvilke personopplysninger vi samler inn, hvordan vi bruker dem, og hvilke rettigheter du har.
    </p>

    <Section icon={<Database size={20} />} title="Hva vi samler inn">
      <p>Vi samler kun inn personopplysninger som er nødvendige for å levere kursportalen:</p>
      <ul className="space-y-1.5 list-none pl-0">
        {[
          'E-postadresse — for innlogging, kvittering og eventuell kundekontakt',
          'Betalingsstatus — for å gi tilgang til kjøpt kursinnhold',
          'Kursfremdrift — for å vise din progresjon i kurset',
          'Navn (valgfritt) — for personlig hilsen i portalen',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-teal">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <p>Vi samler <strong>ikke</strong> inn kortinformasjon, IP-adresser for profilering, atferdsdata for reklame eller andre opplysninger utover det ovennevnte.</p>
    </Section>

    <Section icon={<Shield size={20} />} title="Deling med tredjeparter">
      <p>
        Vi deler <strong>aldri</strong> personopplysninger med tredjeparter for markedsføring eller andre formål utover det som er nødvendig for å levere tjenesten:
      </p>
      <ul className="space-y-1.5 list-none pl-0">
        {[
          'Stripe — betalingsbehandling. Stripe er PCI DSS-sertifisert og lagrer kortinformasjon på vegne av oss.',
          'Supabase — sikker lagring av brukerdata og kursfremdrift. Data lagres i EU.',
          'Resend — utsending av transaksjonelle e-poster (kvittering, velkomstmail).',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-teal">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <p>Ingen av disse tjenestene bruker dine opplysninger til egne markedsføringsformål.</p>
    </Section>

    <Section icon={<Trash2 size={20} />} title="Dine rettigheter">
      <p>I henhold til GDPR har du følgende rettigheter:</p>
      <ul className="space-y-1.5 list-none pl-0">
        {[
          'Innsyn — du kan be om å få se alle opplysninger vi har lagret om deg.',
          'Retting — du kan be om å få korrigert feilaktige opplysninger.',
          'Sletting — du kan når som helst be om sletting av kontoen og alle tilhørende data.',
          'Dataportabilitet — du kan be om en kopi av dine data i maskinlesbart format.',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-teal">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </Section>

    <Section icon={<Mail size={20} />} title="Kontakt">
      <p>
        For spørsmål om personvern, forespørsler om innsyn eller sletting — send e-post til:
      </p>
      <a
        href="mailto:kontakt@skrivakademisk.no"
        className="inline-flex items-center gap-2 rounded-xl bg-brand-teal/10 px-4 py-2.5 text-brand-teal font-medium hover:bg-brand-teal/20 transition-colors"
      >
        <Mail size={15} />
        kontakt@skrivakademisk.no
      </a>
      <p className="text-xs text-brand-gray/60">Vi svarer innen 5 virkedager.</p>
    </Section>

    <p className="text-center text-xs text-brand-gray/60 pt-2">
      © {new Date().getFullYear()} Skriv Akademisk™ AS · Alle rettigheter reservert.
    </p>
  </div>
);

export default PersonvernPage;
