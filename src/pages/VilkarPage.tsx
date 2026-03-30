import { ShieldCheck, CreditCard, Lock, FileText } from 'lucide-react';

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

const VilkarPage = () => (
  <div className="max-w-2xl mx-auto space-y-6 pb-12">
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">Juridisk</p>
      <h1 className="text-3xl font-heading text-brand-teal">Bruksvilkår</h1>
      <p className="text-brand-gray text-sm">
        Sist oppdatert: januar 2026 · Skriv Akademisk AS (org.nr. 930 906 107)
      </p>
    </div>

    <p className="text-sm text-[rgb(var(--c-ink))]/70 leading-relaxed rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] px-5 py-4">
      Ved å bruke kursportalen på kurs.skrivakademisk.no godtar du disse vilkårene i sin helhet. Hvis du ikke godtar vilkårene, ber vi deg om å ikke benytte tjenesten.
    </p>

    <Section icon={<ShieldCheck size={20} />} title="Immaterielle rettigheter">
      <p>
        Alt innhold i kursportalen — inkludert, men ikke begrenset til, videoer, tekst, sjekklister, design og programvare — er eid av <strong>Skriv Akademisk AS</strong> (org.nr. 930 906 107) og er beskyttet av norsk og internasjonal opphavsrettslovgivning.
      </p>
      <p>
        Kopiering, nedlasting, distribusjon, offentlig visning eller videresalg av kursinnhold er <strong>forbudt</strong> uten skriftlig samtykke fra Skriv Akademisk AS. Tilgangen er personlig og kan ikke deles, selges videre eller overdras til andre.
      </p>
      <p>
        Brudd på disse rettighetene kan medføre erstatningskrav og anmeldelse i henhold til åndsverkloven § 79.
      </p>
    </Section>

    <Section icon={<CreditCard size={20} />} title="Betaling og tilgang">
      <p>
        Kurset «Akademisk skriving» koster <strong>1 990 kr</strong> som engangsbetaling. Kurset «Norsk eksamen VGS» koster <strong>549 kr</strong> som engangsbetaling. Tilgangen er livstid fra kjøpsdato.
      </p>
      <p>
        Betaling håndteres via <strong>Stripe</strong>, en sertifisert betalingsløsning. Vi lagrer aldri kortinformasjon. Kvittering sendes automatisk til oppgitt e-postadresse etter betaling.
      </p>
      <p>
        Skriv Akademisk AS forbeholder seg retten til å endre priser for nye kjøp. Eksisterende tilganger påvirkes ikke av prisendringer.
      </p>
    </Section>

    <Section icon={<Lock size={20} />} title="Personvern">
      <p>
        Vi samler kun inn data som er nødvendig for å levere tjenesten: e-postadresse, betalingsstatus og kursfremdrift. Se vår <a href="/personvern" className="text-brand-teal underline underline-offset-2">personvernerklæring</a> for detaljer.
      </p>
    </Section>

    <Section icon={<FileText size={20} />} title="Ansvar og endringer">
      <p>
        Skriv Akademisk AS er ikke ansvarlig for eventuelle tap som følge av bruk av kursinnholdet. Innholdet er ment som et pedagogisk hjelpemiddel og erstatter ikke individuell veiledning eller rådgivning.
      </p>
      <p>
        Vi forbeholder oss retten til å oppdatere disse vilkårene uten forvarsel. Vesentlige endringer vil varsles via e-post til registrerte brukere.
      </p>
      <p>
        Spørsmål om vilkårene kan rettes til{' '}
        <a href="mailto:kontakt@skrivakademisk.no" className="text-brand-teal underline underline-offset-2">
          kontakt@skrivakademisk.no
        </a>
        .
      </p>
    </Section>

    <p className="text-center text-xs text-brand-gray/60 pt-2">
      © {new Date().getFullYear()} Skriv Akademisk™ AS · Alle rettigheter reservert · Kursinnhold og videoer er opphavsrettslig beskyttet.
    </p>
  </div>
);

export default VilkarPage;
