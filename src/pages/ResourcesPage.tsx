import { FileText, Archive, Clock } from 'lucide-react';
import DownloadButton from '../components/DownloadButton';

interface ResourceItem {
  title: string;
  description: string;
  filename: string;
  lesson: string;
  comingSoon?: boolean;
}

const resources: { category: string; items: ResourceItem[] }[] = [
  {
    category: 'Modul 1 – Oppgavestruktur',
    items: [
      {
        title: 'Skriveramme: Innledning',
        description: 'Traktmodellen steg for steg — fra bakgrunn til problemstilling',
        filename: '01-skriveramme-innledning.docx',
        lesson: 'Leksjon 1.2',
      },
      {
        title: 'Skriveramme: Teorikapittelet',
        description: 'Tre nivåer — fra overordnet rammeverk til spesifikk forskning',
        filename: '02-skriveramme-teorikapittel.docx',
        lesson: 'Leksjon 1.3',
      },
      {
        title: 'Skriveramme: Metodekapittelet',
        description: 'Seks deler som gjør metoden din transparent og etterprøvbar',
        filename: '03-skriveramme-metodekapittel.docx',
        lesson: 'Leksjon 1.4',
      },
      {
        title: 'Skriveramme: Resultatkapittelet',
        description: 'Presenter funnene dine systematisk — tema for tema',
        filename: '04-skriveramme-resultater.docx',
        lesson: 'Leksjon 1.5',
      },
      {
        title: 'Skriveramme: Drøfting',
        description: 'Drøftingstriangelet — funn, teori, forskning og refleksjon',
        filename: '05-skriveramme-drofting.docx',
        lesson: 'Leksjon 1.6',
      },
      {
        title: 'Skriveramme: Konklusjonen',
        description: 'Snu trakten — fra spesifikt svar til brede implikasjoner',
        filename: '06-skriveramme-konklusjon.docx',
        lesson: 'Leksjon 1.7',
      },
    ],
  },
  {
    category: 'Modul 2 – APA 7 Referansehåndtering',
    items: [
      {
        title: 'APA 7 hurtigreferanse',
        description: 'Alle kildetyper på én side — bøker, artikler, nettsider, lover og mer',
        filename: '10-apa7-hurtigreferanse.docx',
        lesson: 'Leksjon 2.4',
      },
      {
        title: 'Referanselistemalen',
        description: 'Word-mal med korrekt hengende innrykk og APA 7-formatering ferdig satt opp',
        filename: '11-apa7-referanseliste-mal.docx',
        lesson: 'Leksjon 2.3',
      },
    ],
  },
  {
    category: 'Modul 3 – Akademisk Skrivestil & Språk',
    items: [
      {
        title: 'Akademisk fraseoversikt',
        description: 'Sammenbindingsord, overganger og faste akademiske uttrykk du kan bruke direkte',
        filename: '12-akademisk-fraseoversikt.docx',
        lesson: 'Leksjon 3.4',
      },
      {
        title: 'Korrektursjekkliste: språk og stil',
        description: 'Systematisk gjennomgang av akademisk språk, grammatikk og formelle krav',
        filename: '13-korrektursjekkliste-sprak.docx',
        lesson: 'Leksjon 3.5',
      },
    ],
  },
  {
    category: 'Modul 4 – Veiledning & Prosess',
    items: [
      {
        title: 'Sjekkliste: Siste sjekk før innlevering',
        description: 'Fire sjekklister for innhold, APA, formatering og polering',
        filename: '07-sjekkliste-siste-sjekk.docx',
        lesson: 'Leksjon 4.5',
      },
      {
        title: 'Planlegger: 16-ukers tidslinje',
        description: 'En realistisk plan for bacheloroppgaven — tilpass den til dine rammer',
        filename: '08-planlegger-16-ukers-tidslinje.docx',
        lesson: 'Leksjon 4.1',
      },
      {
        title: 'Mal: Veiledermøte',
        description: 'Forberedelse og referat — bruk denne før og etter hvert møte',
        filename: '09-mal-veiledermoete.docx',
        lesson: 'Leksjon 4.2',
      },
    ],
  },
];

const ResourcesPage = () => {
  return (
    <div className="space-y-8">
      <section className="relative rounded-2xl bg-brand-teal overflow-hidden px-8 py-10">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-teal-light opacity-10 translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-brand-teal-light opacity-10 -translate-x-10 translate-y-10 pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-coral mb-2">Ressurser</p>
          <h1 className="text-3xl font-heading text-white">Nedlastbare maler & sjekklister</h1>
          <p className="mt-2 text-white/80 max-w-xl leading-relaxed">
            Alle maler og sjekklister fra kurset — klar til å fylles ut i Word. Last ned enkeltfiler eller hele pakken.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-brand-warm border border-brand-border p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-coral text-white">
            <Archive size={22} />
          </div>
          <div className="flex-1">
            <p className="font-heading text-xl text-brand-teal">Komplett pakke — alle filer</p>
            <p className="text-brand-gray text-sm mt-1">
              Last ned alle tilgjengelige maler og sjekklister i én ZIP-fil
            </p>
            <div className="mt-4">
              <DownloadButton
                filename="skriverammer-komplett-pakke.zip"
                label="Last ned alt (.zip)"
                variant="primary"
              />
            </div>
          </div>
        </div>
      </section>

      <a
        href="https://app.skrivakademisk.no"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 rounded-2xl bg-brand-warm border border-brand-border px-6 py-4 hover:border-brand-coral/40 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold text-brand-teal group-hover:text-brand-coral transition-colors">
            Fyll inn skriverammen — sjekk så teksten i appen
          </p>
          <p className="text-xs text-brand-gray mt-0.5">Skriv Akademisk-appen gir deg konkret tilbakemelding på teksten din etter at du har brukt malen</p>
        </div>
        <span className="shrink-0 text-sm font-bold text-brand-coral whitespace-nowrap">
          Prøv appen →
        </span>
      </a>

      {resources.map((group) => (
        <section key={group.category} className="rounded-2xl bg-white border border-brand-border shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">{group.category}</p>
          </div>
          <ul className="divide-y divide-brand-border">
            {group.items.map((item) => (
              <li
                key={item.filename}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${item.comingSoon ? 'opacity-60' : 'hover:bg-brand-cream'}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.comingSoon ? 'bg-brand-border text-brand-gray' : 'bg-brand-teal-pale text-brand-teal'}`}>
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-brand-ink text-sm">{item.title}</p>
                    {item.comingSoon && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-teal-pale px-2.5 py-0.5 text-xs font-semibold text-brand-teal">
                        <Clock size={10} />
                        Kommer snart
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-gray mt-0.5">{item.description}</p>
                  <p className="text-xs text-brand-coral font-semibold mt-0.5">{item.lesson}</p>
                </div>
                {!item.comingSoon && (
                  <DownloadButton filename={item.filename} />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ResourcesPage;
