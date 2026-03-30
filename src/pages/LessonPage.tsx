import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  ExternalLink,
  MessageSquare,
  Download,
  Laptop,
  ArrowRight,
  X,
  ChevronDown,
  List,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import DownloadButton from '../components/DownloadButton';
import { modules } from '../data/courseData';
import { norskModules } from '../data/norskData';
import { ungdomsskoleModules } from '../data/ungdomsskoleData';
import { useProgress } from '../contexts/ProgressContext';

const flattenedLessons = modules.flatMap((m) => m.lessons);
const flattenedNorskLessons = norskModules.flatMap((m) => m.lessons);
const flattenedUngLessons = ungdomsskoleModules.flatMap((m) => m.lessons);

const lessonPromo: Record<string, { heading: string; sub: string; emoji: string }> = {
  'mod-1-lesson-1': { emoji: '🗂️', heading: 'Usikker på strukturen i din oppgave?', sub: 'Lim inn teksten din i appen og få konkrete forslag til oppbygging' },
  'mod-1-lesson-2': { emoji: '💡', heading: 'Trenger du hjelp til å formulere problemstillingen din?', sub: 'Få hjelp av Skriv Akademisk-appen — prøv det nå' },
  'mod-1-lesson-3': { emoji: '📚', heading: 'Vil du sjekke om teorikapittelet ditt henger sammen?', sub: 'Lim inn teksten og få tilbakemelding på struktur og rød tråd' },
  'mod-1-lesson-4': { emoji: '🔬', heading: 'Trenger du hjelp til å begrunne metodevalget ditt?', sub: 'Appen gir deg konkrete forslag til hvordan du kan styrke metodedelen' },
  'mod-1-lesson-5': { emoji: '📊', heading: 'Vil du presentere funnene dine enda tydeligere?', sub: 'Sjekk resultatkapittelet ditt i appen og få råd om fremstilling' },
  'mod-1-lesson-6': { emoji: '💭', heading: 'Sliter du med å få drøftingen til å fly?', sub: 'Appen hjelper deg å koble funn, teori og argumentasjon — prøv nå' },
  'mod-1-lesson-7': { emoji: '✅', heading: 'Svarer konklusjonen din på problemstillingen?', sub: 'Sjekk konklusjonen din i appen og få tilbakemelding med én gang' },
  'mod-2-lesson-1': { emoji: '📝', heading: 'Vil du sjekke at referansene dine er riktig formatert?', sub: 'Appen ser etter APA 7-feil i teksten din automatisk' },
  'mod-2-lesson-2': { emoji: '🔍', heading: 'Usikker på om kildehenvisningene dine er korrekte?', sub: 'Lim inn et avsnitt og få sjekket parentesreferansene dine' },
  'mod-2-lesson-3': { emoji: '📋', heading: 'Vil du sjekke referanselisten din før innlevering?', sub: 'Appen hjelper deg å finne feil i referanselisten — raskt og enkelt' },
  'mod-2-lesson-4': { emoji: '📖', heading: 'Trenger du hjelp med referanser til bøker og artikler?', sub: 'Få konkrete eksempler og sjekk dine egne referanser i appen' },
  'mod-2-lesson-5': { emoji: '🌐', heading: 'Usikker på hvordan du refererer til nettsider og lover?', sub: 'Appen guider deg gjennom nettkilder og Lovdata-referanser' },
  'mod-2-lesson-6': { emoji: '✨', heading: 'Vil du slippe APA-feilene før innlevering?', sub: 'Kjør teksten gjennom appen og få en komplett APA-sjekk' },
  'mod-3-lesson-1': { emoji: '🎓', heading: 'Er teksten din akademisk nok?', sub: 'Lim inn et avsnitt i appen og få konkret tilbakemelding på skrivestilen' },
  'mod-3-lesson-2': { emoji: '✍️', heading: 'Vil du erstatte vagt språk med presise formuleringer?', sub: 'Appen peker ut unøyaktig språk og foreslår forbedringer' },
  'mod-3-lesson-3': { emoji: '📄', heading: 'Henger avsnittene dine godt sammen?', sub: 'Sjekk avsnittstrukturen i teksten din — appen gir deg tydelig tilbakemelding' },
  'mod-3-lesson-4': { emoji: '🔗', heading: 'Trenger teksten din bedre flyt og overganger?', sub: 'Appen hjelper deg å finne steder der teksten stopper opp' },
  'mod-3-lesson-5': { emoji: '🔎', heading: 'Vil du finne og rette språkfeilene i din tekst?', sub: 'Kjør korrektursjekk i appen og lever med selvtillit' },
  'mod-4-lesson-1': { emoji: '📅', heading: 'Trenger du hjelp til å komme i gang med skrivingen?', sub: 'Appen hjelper deg å bryte ned planen til konkrete skrivesteg' },
  'mod-4-lesson-2': { emoji: '🤝', heading: 'Vil du forberede deg bedre til veiledningsøkten?', sub: 'Bruk appen til å formulere spørsmål og rydde i tankene dine' },
  'mod-4-lesson-3': { emoji: '🔄', heading: 'Trenger du hjelp med å revidere teksten din?', sub: 'Lim inn det du vil forbedre — appen gir deg konkrete revisjonsforslag' },
  'mod-4-lesson-4': { emoji: '🚀', heading: 'Sitter du fast i teksten?', sub: 'Appen hjelper deg å bryte skrivesperren og komme videre' },
  'mod-4-lesson-5': { emoji: '🏁', heading: 'Klar for den siste gjennomgangen?', sub: 'Kjør hele teksten gjennom appen før du trykker lever' },
};

type Article = { title: string; url: string };
const lessonArticles: Record<string, Article[]> = {
  'mod-1-lesson-1': [
    { title: 'Hvordan skrive bacheloroppgave', url: 'https://skrivakademisk.no/hvordanskrivebacheloroppgave/' },
    { title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' },
    { title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' },
  ],
  'mod-1-lesson-2': [
    { title: 'Hvordan skrive bacheloroppgave', url: 'https://skrivakademisk.no/hvordanskrivebacheloroppgave/' },
    { title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' },
  ],
  'mod-1-lesson-3': [
    { title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' },
    { title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' },
  ],
  'mod-1-lesson-4': [
    { title: 'Metodekapittelet forklart', url: 'https://skrivakademisk.no/metodekapittel/' },
    { title: 'Metodekapittel i bacheloroppgaven', url: 'https://skrivakademisk.no/metodekapittel-bacheloroppgave/' },
    { title: 'Metodekapittel i masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/metodekapittel/' },
  ],
  'mod-1-lesson-5': [{ title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' }],
  'mod-1-lesson-6': [
    { title: 'Drøfting i bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/drofting/' },
    { title: 'Drøftingsoppgave mal', url: 'https://skrivakademisk.no/droftingsoppgave-mal/' },
  ],
  'mod-1-lesson-7': [
    { title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' },
    { title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' },
  ],
  'mod-2-lesson-1': [{ title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' }],
  'mod-2-lesson-2': [{ title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' }],
  'mod-2-lesson-3': [{ title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' }],
  'mod-2-lesson-4': [{ title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' }],
  'mod-2-lesson-5': [{ title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' }],
  'mod-2-lesson-6': [{ title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' }],
  'mod-3-lesson-1': [{ title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' }],
  'mod-3-lesson-2': [{ title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' }],
  'mod-3-lesson-3': [{ title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' }],
  'mod-3-lesson-4': [
    { title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' },
    { title: 'Drøftingsoppgave mal', url: 'https://skrivakademisk.no/droftingsoppgave-mal/' },
  ],
  'mod-3-lesson-5': [{ title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' }],
  'mod-4-lesson-1': [{ title: 'Hvordan skrive bacheloroppgave', url: 'https://skrivakademisk.no/hvordanskrivebacheloroppgave/' }],
  'mod-4-lesson-2': [{ title: 'Hvordan skrive bacheloroppgave', url: 'https://skrivakademisk.no/hvordanskrivebacheloroppgave/' }],
  'mod-4-lesson-3': [{ title: 'Hvordan skrive bacheloroppgave', url: 'https://skrivakademisk.no/hvordanskrivebacheloroppgave/' }],
  'mod-4-lesson-4': [{ title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' }],
  'mod-4-lesson-5': [
    { title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' },
    { title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' },
  ],
};

const lessonReflections: Record<string, string[]> = {
  'mod-1-lesson-1': ['Hvilken struktur passer best for din oppgave — og vet du hva hvert kapittel skal inneholde?', 'Tegn en rask disposisjon for oppgaven din. Hvilket kapittel føles mest uklart?', 'Hva er det svakeste leddet i strukturen din nå — og hva kan du gjøre for å styrke det?'],
  'mod-1-lesson-2': ['Skriv ned problemstillingen din med egne ord. Er den tydelig avgrenset og mulig å besvare?', 'Hvilken bakgrunn trenger leseren for å forstå hvorfor oppgaven din er viktig?', 'Hva er formålet med oppgaven din — og kommer det tydelig frem i innledningen?'],
  'mod-1-lesson-3': ['Hvilke teorier har du valgt, og hvordan er de direkte relevante for problemstillingen din?', 'Har du forklart koblingen mellom teorien og problemstillingen eksplisitt i teksten?', 'Er det teorier du har valgt bort som leseren kan forvente? Bør du begrunne det valget?'],
  'mod-1-lesson-4': ['Hvilken metode har du valgt — og kan du begrunne valget i én tydelig setning?', 'Har du beskrevet datainnsamlingen din slik at noen andre kunne gjentatt den?', 'Hvilke svakheter har metoden din, og har du adressert dem i teksten?'],
  'mod-1-lesson-5': ['Presenterer du funn og tolkning i separate avsnitt, eller blander du dem?', 'Bruker du tabeller eller figurer — og er alle referert til i teksten din?', 'Hvordan kobler du hvert funn eksplisitt tilbake til problemstillingen?'],
  'mod-1-lesson-6': ['Tar du stilling i drøftingen, eller bare beskriver du? Finn ett sted du kan være mer analytisk.', 'Har du brukt motargumenter for å styrke din posisjon i minst ett avsnitt?', 'Er det en rød tråd fra problemstillingen gjennom hele drøftingen?'],
  'mod-1-lesson-7': ['Svarer konklusjonen din direkte på problemstillingen — punkt for punkt?', 'Gjentar du drøftingen i konklusjonen, eller oppsummerer du bare de viktigste funnene?', 'Hvilke anbefalinger for videre forskning kan du gi basert på funnene dine?'],
  'mod-2-lesson-1': ['Har du satt opp dokumentet ditt med riktige APA 7-marger og font?', 'Vet du hva som er de viktigste endringene fra APA 6 til APA 7 i dine referanser?', 'Er det steder i teksten din der du bruker andres ideer uten kildehenvisning?'],
  'mod-2-lesson-2': ['Gå gjennom ett avsnitt i oppgaven din — er alle kildehenvisninger i korrekt APA 7-format?', 'Har du et direkte sitat i teksten? Har du inkludert sidetall i referansen?', 'Bruker du narrativ- og parentesreferanser konsekvent, eller varierer du uten system?'],
  'mod-2-lesson-3': ['Er alle kildene i referanselisten faktisk sitert i teksten — og omvendt?', 'Sjekk én tilfeldig referanse i listen din: har den hengende innrykk og alle obligatoriske felt?', 'Er referanselisten sortert alfabetisk etter forfatterens etternavn?'],
  'mod-2-lesson-4': ['Har du en bok i referanselisten — er forlag og alle nødvendige felt inkludert?', 'Har du referert til en tidsskriftartikkel? Er DOI-nummeret inkludert?', 'Sjekk en bokkapittelreferanse: er redaktøren og bokens fulle tittel med?'],
  'mod-2-lesson-5': ['Har du en nettside uten forfatter? Vet du hvilken enhet som er oppgitt som forfatter i stedet?', 'Har du referert til en norsk lov — brukte du Lovdata og inkluderte § og lovens fulle navn?', 'Har alle nettkilder hentet dato dersom innholdet kan endres over tid?'],
  'mod-2-lesson-6': ['Gå gjennom tre tilfeldige referanser i teksten din og sjekk mot de vanligste APA-feilene.', 'Har du vurdert å bruke Zotero eller Mendeley for å håndtere referanser fremover?', 'Lag en personlig APA-sjekkliste med de feilene du gjør oftest — og bruk den før innlevering.'],
  'mod-3-lesson-1': ['Les et avsnitt fra oppgaven din høyt. Høres det akademisk ut — eller mer som en samtale?', 'Finn ett sted der du skriver "jeg mener" eller "jeg synes" — kan du omformulere det?', 'Er det fagord du bruker uten å ha definert dem for leseren første gang?'],
  'mod-3-lesson-2': ['Finn tre vage ord i oppgaven din (f.eks. "mye", "veldig", "mange") og erstatt med presise tall eller formuleringer.', 'Er det påstander i teksten som ikke er underbygget med kilde? Marker dem og finn kilden.', 'Les ett avsnitt og spør deg selv: er dette objektivt presentert, eller inneholder det personlig synsing?'],
  'mod-3-lesson-3': ['Skriv ned temasetningen for hvert avsnitt i ett kapittel. Henger de logisk sammen?', 'Har hvert avsnitt én tydelig idé — eller prøver det å si for mye på én gang?', 'Prøv å avslutte ett avsnitt med en delkonklusjon og se om flyten forbedres.'],
  'mod-3-lesson-4': ['Tell antall ganger du bruker "og" i ett avsnitt — kan noen erstattes med et presist sammenbindingsord?', 'Les overgangen mellom to kapitler i oppgaven. Er det tydelig for leseren hva som nå skal komme?', 'Finn ett sted der to avsnitt ikke henger godt sammen og skriv en overgangsfrase.'],
  'mod-3-lesson-5': ['Søk etter "det er" og "det har" i teksten din — kan du omformulere til en mer aktiv setning?', 'Har du brukt forkortelser uten å definere dem første gang de dukker opp?', 'Les siste avsnitt du skrev baklengs, setning for setning — finner du feil du normalt overser?'],
  'mod-4-lesson-1': ['Hva er innleveringsdatoen din — og har du telt bakover for å sette konkrete milepæler?', 'Hvilken del av oppgaven frykter du mest å skrive? Sett av ekstra tid til den i planen.', 'Har du planlagt tid til revisjon, korrekturlesing og teknisk formatering mot slutten?'],
  'mod-4-lesson-2': ['Hva er de tre spørsmålene du mest trenger svar på fra veileder akkurat nå?', 'Skriv ned hva du vil ha godkjent eller tilbakemelding på til neste veiledningsøkt.', 'Har du fulgt opp det som ble avtalt i forrige veiledningsøkt?'],
  'mod-4-lesson-3': ['Se på siste tilbakemelding du har fått — hvilke tre endringer vil gi størst forbedring?', 'Har du revidert en del av oppgaven og glemt å sjekke at den fortsatt henger sammen med resten?', 'Lag en liste: hvilke avsnitt er ferdige, hvilke trenger revisjon, og hvilke mangler?'],
  'mod-4-lesson-4': ['Hva er den minste oppgaven du kan gjøre akkurat nå for å komme videre i skrivingen?', 'Har du prøvt å sette en timer på 25 minutter og bare skrive — uten å redigere underveis?', 'Hva er det egentlig du er redd for å skrive? Skriv det ned uten å sensurere deg selv.'],
  'mod-4-lesson-5': ['Har du sjekket at alle figurer og tabeller er nummerert og referert til i teksten?', 'Er sammendraget ditt oppdatert og speiler det den endelige versjonen?', 'Les innledningen og konklusjonen etter hverandre — svarer konklusjonen på det innledningen lovet?'],
};

const norskLessonPromo: Record<string, { heading: string; sub: string; emoji: string }> = {
  'norsk-mod-1-lesson-1': { emoji: '🎓', heading: 'Vil du øve på å skrive til eksamen?', sub: 'Skriv Akademisk-appen gir deg tilbakemelding på teksten din i sanntid' },
  'norsk-mod-2-lesson-1': { emoji: '✍️', heading: 'Prøv å skrive et essay — og få tilbakemelding', sub: 'Appen hjelper deg å se om du treffer sjangerkravene' },
  'norsk-mod-3-lesson-1': { emoji: '🔍', heading: 'Øv på tekstanalyse med appen', sub: 'Lim inn en analyse og få konkret tilbakemelding på fagbegreper og dybde' },
  'norsk-mod-4-lesson-1': { emoji: '📝', heading: 'Trenger du hjelp med nynorsk?', sub: 'Appen fanger opp typiske nynorskfeil og gir deg konkrete rettelser' },
  'norsk-mod-5-lesson-1': { emoji: '🏁', heading: 'Klar for eksamen — øv på kvalitetssjekken', sub: 'Bruk appen til å gjøre en fullstendig sjekk av teksten din før eksamen' },
};

const norskLessonArticles: Record<string, { title: string; url: string }[]> = {
  'norsk-mod-1-lesson-1': [{ title: 'Skrivehjelpeverktøy for elever', url: 'https://app.skrivakademisk.no' }],
  'norsk-mod-2-lesson-1': [{ title: 'Skriv Akademisk-appen — prøv gratis', url: 'https://app.skrivakademisk.no' }],
  'norsk-mod-3-lesson-1': [{ title: 'Skriv Akademisk-appen — prøv gratis', url: 'https://app.skrivakademisk.no' }],
  'norsk-mod-4-lesson-1': [{ title: 'Skriv Akademisk-appen — prøv gratis', url: 'https://app.skrivakademisk.no' }],
  'norsk-mod-5-lesson-1': [{ title: 'Skriv Akademisk-appen — prøv gratis', url: 'https://app.skrivakademisk.no' }],
};

const norskLessonReflections: Record<string, string[]> = {
  'norsk-mod-1-lesson-1': ['Hvilken av de fire sjangrene kjenner du best fra før — og hvilken trenger du mest øvelse i?', 'Hva vektlegger sensor mest: innhold, struktur eller språk — og hva bør du prioritere?', 'Hva er planen din for forberedelsesdagen? Hva vil du gjøre annerledes etter denne leksjonen?'],
  'norsk-mod-2-lesson-1': ['Velg én sjanger og skriv én innledning basert på oppskriften du fikk — hva fungerte?', 'Hva er forskjellen på et middels og et fremragende avsnitt i din egen skriving?', 'Hvilken sjanger synes du er vanskeligst, og hva kan du gjøre for å øve spesifikt på den?'],
  'norsk-mod-3-lesson-1': ['Finn et dikt og gå gjennom de fire analysetrinnene: observere, beskrive, tolke, kontekstualisere.', 'Hvilken epoke passer teksten du analyserte best inn i — og hva forteller det om budskapet?', 'Finn en reklame eller en nettartikkel og analyser samspillet mellom tekst og bilde.'],
  'norsk-mod-4-lesson-1': ['Skriv tre setninger på nynorsk og sjekk dem mot de ti vanligste feilene på listen.', 'Hvilke av de seks språkendringene opplever du i din egen hverdag?', 'Gå gjennom en tekst du har skrevet og bruk femstegs-sjekklisten — hva fant du?'],
  'norsk-mod-5-lesson-1': ['Lag et utkast til tekstkart med kolonner for sjanger, tema, virkemidler og koblinger.', 'Velg en oppgave fra en tidligere eksamen og test oppgavevalg-strategien med fire spørsmål.', 'Øv på sjusteg-sjekklisten på en tekst du allerede har skrevet — hvor lang tid tok det?'],
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { completedLessonIds, toggleComplete } = useProgress();

  const [justCompleted, setJustCompleted] = useState(false);
  const [pcBannerDismissed, setPcBannerDismissed] = useState(() => {
    try { return localStorage.getItem('sa-pc-banner-dismissed') === 'true'; } catch { return false; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isNorsk = lessonId?.startsWith('norsk-') ?? false;
  const isUng = lessonId?.startsWith('ung-') ?? false;
  const allLessons = isNorsk ? flattenedNorskLessons : isUng ? flattenedUngLessons : flattenedLessons;
  const courseModules = isNorsk ? norskModules : isUng ? ungdomsskoleModules : modules;
  const basePath = isNorsk ? '/norsk' : isUng ? '/ungdomsskole' : '';
  const dashboardPath = isNorsk ? '/norsk/dashboard' : isUng ? '/ungdomsskole/dashboard' : '/dashboard';

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[currentIndex];
  const moduleIndex = courseModules.findIndex((m) => m.id === lesson?.moduleId);
  const parentModule = courseModules[moduleIndex];
  const lessonIndexInModule = parentModule
    ? parentModule.lessons.findIndex((l) => l.id === lessonId)
    : -1;
  const lessonCode = parentModule ? `${moduleIndex + 1}.${lessonIndexInModule + 1}` : '';
  const previous = allLessons[currentIndex - 1];
  const next = allLessons[currentIndex + 1];
  const nextModule = courseModules[moduleIndex + 1];

  const isCompleted = completedLessonIds.has(lesson?.id ?? '');
  const isLastInModule =
    parentModule && lessonIndexInModule === parentModule.lessons.length - 1;
  const isLastLesson = currentIndex === allLessons.length - 1;
  const isModuleFullyDone =
    parentModule &&
    parentModule.lessons.every((l) => completedLessonIds.has(l.id));

  const completedInModule = parentModule
    ? parentModule.lessons.filter((l) => completedLessonIds.has(l.id)).length
    : 0;
  const moduleProgress = parentModule
    ? Math.round((completedInModule / parentModule.lessons.length) * 100)
    : 0;

  const dismissPcBanner = () => {
    setPcBannerDismissed(true);
    try { localStorage.setItem('sa-pc-banner-dismissed', 'true'); } catch { }
  };

  const handleToggleComplete = async () => {
    if (!isCompleted) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 3500);
    }
    await toggleComplete(lesson.id);
  };

  if (!lesson) {
    return (
      <div className="rounded-2xl bg-brand-warm border border-brand-border p-8 shadow-soft text-center">
        <p className="italic text-brand-coral">Fant ikke leksjon.</p>
        <Link to={`${basePath}/dashboard`} className="mt-4 inline-block text-brand-teal underline">
          Tilbake til dashboard
        </Link>
      </div>
    );
  }

  const promoMap = isNorsk ? norskLessonPromo : lessonPromo;
  const promoFallback = isNorsk
    ? { emoji: '✍️', heading: 'Øv på skriving mellom leksjonene', sub: 'Skriv Akademisk-appen gir deg tilbakemelding i sanntid' }
    : { emoji: '✍️', heading: 'Trenger du hjelp med din egen tekst?', sub: 'Få hjelp av Skriv Akademisk-appen' };
  const promo = promoMap[lesson.id] ?? promoFallback;

  return (
    <div className="max-w-[1200px] mx-auto">

      {/* BREADCRUMB */}
      <div className="flex items-center gap-1.5 text-sm text-brand-gray flex-wrap mb-4">
        <Link to={`${basePath}/dashboard`} className="hover:text-brand-teal transition-colors">
          Kurset
        </Link>
        <ChevronRight size={13} className="opacity-40" />
        {parentModule && (
          <>
            <Link
              to={`${basePath}/modul/${parentModule.id}`}
              className="hover:text-brand-teal transition-colors hidden sm:inline"
            >
              Modul {moduleIndex + 1}: {parentModule.title}
            </Link>
            <ChevronRight size={13} className="opacity-40 hidden sm:inline" />
          </>
        )}
        <span className="text-[rgb(var(--c-primary))] font-semibold truncate max-w-[200px]">
          Leksjon {lessonCode}: {lesson.title}
        </span>
      </div>

      {/* MOBIL: vis alle leksjoner knapp */}
      {parentModule && (
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-3 flex w-full items-center justify-between rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] px-4 py-3 text-sm font-medium text-[rgb(var(--c-ink))] transition hover:border-[rgb(var(--c-primary))]/30 lg:hidden"
        >
          <span className="flex items-center gap-2">
            <List size={15} className="text-[rgb(var(--c-primary))]" />
            Se alle leksjoner i {parentModule.title}
          </span>
          <ChevronDown
            size={15}
            className={`text-brand-gray transition-transform ${sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* MOBIL: innfellbart leksjonspanel */}
      {sidebarOpen && parentModule && (
        <div className="mb-4 rounded-xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] p-3 space-y-1 lg:hidden">
          {parentModule.lessons.map((l, i) => {
            const isCurrent = l.id === lessonId;
            const isDone = completedLessonIds.has(l.id);
            return (
              <Link
                key={l.id}
                to={`${basePath}/leksjon/${l.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                  isCurrent
                    ? 'bg-[rgb(var(--c-primary))]/10 text-[rgb(var(--c-primary))] font-semibold'
                    : isDone
                    ? 'text-[rgb(var(--c-ink))]/60 hover:bg-[rgb(var(--c-border))]/50'
                    : 'text-[rgb(var(--c-ink))] hover:bg-[rgb(var(--c-border))]/50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={14} className="shrink-0 text-green-500" />
                ) : isCurrent ? (
                  <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[rgb(var(--c-primary))] bg-[rgb(var(--c-primary))]/20" />
                ) : (
                  <Circle size={14} className="shrink-0 text-brand-gray/40" />
                )}
                <span className="truncate">{moduleIndex + 1}.{i + 1} {l.title}</span>
                {isCurrent && <span className="ml-auto text-[10px] text-[rgb(var(--c-primary))]">← nå</span>}
              </Link>
            );
          })}
          <p className="pt-1 px-3 text-xs text-brand-gray">
            {completedInModule}/{parentModule.lessons.length} fullført
          </p>
        </div>
      )}

      {/* HOVED-GRID: innhold + sidebar */}
      <div className="grid lg:grid-cols-[1fr_256px] gap-6 items-start">

      {/* VENSTRE: alt innhold */}
      <div className="space-y-6 min-w-0">

      {/* MOBIL-ANBEFALING */}
      {!pcBannerDismissed && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-teal/20 bg-brand-teal/8 px-4 py-3 md:hidden">
          <div className="flex items-center gap-2 text-xs text-brand-teal">
            <Laptop size={15} className="shrink-0" />
            <span>For best læringsopplevelse, bruk PC — lettere å følge med og ta notater samtidig.</span>
          </div>
          <button
            type="button"
            onClick={dismissPcBanner}
            className="shrink-0 text-brand-gray hover:text-brand-teal transition-colors"
            aria-label="Lukk"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* VIDEO — dominant */}
      <div className="overflow-hidden rounded-2xl shadow-soft">
        <div className="bg-brand-teal">
          <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
        </div>
        <div className="bg-brand-warm border-x border-b border-brand-border px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-coral/15 text-brand-coral px-3 py-1 text-xs font-bold uppercase tracking-widest">
              {parentModule?.title}
            </span>
            <span className="text-xs text-brand-gray">Leksjon {lessonCode}</span>
            {lesson.durationMinutes && (
              <span className="flex items-center gap-1 text-xs text-brand-gray bg-brand-teal/8 px-2.5 py-1 rounded-xl">
                <Clock size={11} />
                {lesson.durationMinutes} min
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl text-brand-teal leading-tight">
            {lesson.title}
          </h1>
          <p className="mt-1.5 text-brand-gray leading-relaxed text-sm">{lesson.description}</p>

          {parentModule && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-brand-gray">
                <span>Fremgang i {parentModule.title}</span>
                <span className="font-semibold text-brand-teal">{moduleProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-brand-teal/10">
                <div
                  className="h-full rounded-full bg-brand-teal transition-all duration-500"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LÆRINGSMÅL */}
      {lesson.learningGoals && lesson.learningGoals.length > 0 && (
        <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/8 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-brand-teal" />
            <p className="text-sm font-bold text-brand-teal uppercase tracking-wide">
              I denne leksjonen lærer du:
            </p>
          </div>
          <ul className="space-y-2">
            {lesson.learningGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-brand-gray">
                <span className={`mt-0.5 font-bold shrink-0 ${isCompleted ? 'text-brand-green' : 'text-brand-teal'}`}>
                  •
                </span>
                {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MERK SOM FULLFØRT */}
      <div className="flex flex-wrap items-center gap-4">
        {isCompleted ? (
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-brand-green/15 border border-brand-green/25 px-6 py-3 text-base font-semibold text-brand-green">
              <CheckCircle2 size={20} /> Fullført
            </div>
            <button
              type="button"
              onClick={() => toggleComplete(lesson.id)}
              className="text-xs text-brand-gray hover:text-brand-coral underline transition-colors"
            >
              Angre?
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggleComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-7 py-3 text-base font-semibold text-white shadow-soft hover:opacity-90 transition-all active:scale-95"
          >
            <Circle size={20} /> Merk som fullført ✅
          </button>
        )}
      </div>

      {/* FEIRING — nettopp fullført */}
      {justCompleted && (
        <div className="animate-pulse rounded-2xl border border-brand-green/30 bg-brand-green/10 px-6 py-4 text-center">
          <p className="text-lg font-semibold text-brand-green">Bra jobba! 🎉</p>
          <p className="text-sm text-brand-gray mt-1">
            {next ? 'Klar for neste leksjon?' : 'Du har fullført hele kurset!'}
          </p>
        </div>
      )}

      {/* MODUL FULLFØRT */}
      {isCompleted && isLastInModule && isModuleFullyDone && !isLastLesson && (
        <div className="rounded-2xl border border-brand-teal/25 bg-brand-teal/8 px-7 py-6 text-center">
          <p className="text-2xl mb-2">✅</p>
          <h2 className="text-xl text-brand-teal">Modul {moduleIndex + 1} fullført!</h2>
          <p className="mt-2 text-sm text-brand-gray leading-relaxed">
            Du har lært {parentModule?.title?.toLowerCase()}. Bra jobba!
          </p>
          {nextModule && (
            <div className="mt-4">
              <p className="text-sm text-brand-gray mb-3">
                Neste modul handler om <strong className="text-brand-ink">{nextModule.title}</strong> — klar?
              </p>
              <Link
                to={`${basePath}/modul/${nextModule.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Start {nextModule.title} <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KURS FULLFØRT */}
      {isCompleted && isLastLesson && (
        <div className="rounded-2xl border border-brand-coral/25 bg-brand-coral/8 px-7 py-8 text-center">
          <p className="text-4xl mb-3">🎓</p>
          <h2 className="text-2xl text-brand-teal">Du har fullført hele kurset!</h2>
          <p className="mt-3 text-brand-gray leading-relaxed max-w-md mx-auto">
            {allLessons.length} leksjoner. {courseModules.length} moduler. Du gjorde det.
          </p>
          <p className="mt-2 text-sm text-brand-gray max-w-sm mx-auto">
            Nå har du verktøyene du trenger for å skrive en oppgave du er stolt av. Lykke til med innleveringen!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to={`${basePath}/dashboard`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Gå til dashboard
            </Link>
            <a
              href="mailto:?subject=Sjekk dette kurset&body=Jeg har nettopp fullført kurset i akademisk skriving på kurs.skrivakademisk.no — anbefales på det sterkeste!"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-teal/25 px-7 py-3 text-sm font-semibold text-brand-teal hover:bg-brand-teal/5 transition"
            >
              Del kurset med en medstudent 💛
            </a>
          </div>
        </div>
      )}

      {/* NEDLASTBAR RESSURS */}
      {lesson.resourceUrl && (
        <div className="flex items-center gap-4 rounded-2xl border border-brand-teal/20 bg-brand-teal/5 px-6 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/15 text-brand-teal">
            <Download size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal mb-0.5">
              Nedlastbar ressurs
            </p>
            <p className="text-sm text-brand-gray truncate">{lesson.resourceUrl}</p>
          </div>
          <DownloadButton filename={lesson.resourceUrl} />
        </div>
      )}

      {/* REFLEKSJONSSPØRSMÅL */}
      {(isNorsk ? norskLessonReflections : lessonReflections)[lesson.id] && (
        <div className="rounded-2xl border border-brand-border bg-brand-warm p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-brand-coral" />
            <p className="text-sm font-bold text-brand-ink uppercase tracking-wide">
              Refleksjonsspørsmål
            </p>
          </div>
          <ol className="space-y-3">
            {(isNorsk ? norskLessonReflections : lessonReflections)[lesson.id].map((q, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-brand-gray">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {q}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ARTIKLER */}
      {(isNorsk ? norskLessonArticles : lessonArticles)[lesson.id] && (
        <div className="rounded-2xl border border-brand-border bg-brand-warm p-5 shadow-soft">
          <p className="text-sm font-bold text-brand-ink uppercase tracking-wide mb-3">
            {isNorsk ? 'Nyttige ressurser' : 'Les mer på skrivakademisk.no'}
          </p>
          <ul className="space-y-2">
            {(isNorsk ? norskLessonArticles : lessonArticles)[lesson.id].map((a) => (
              <li key={a.url}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-brand-teal hover:text-brand-coral font-medium transition-colors"
                >
                  <ExternalLink size={13} className="shrink-0" />
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* APP-PROMO */}
      <a
        href="https://app.skrivakademisk.no"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 rounded-2xl bg-brand-warm border border-brand-border px-6 py-4 hover:border-brand-coral/40 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold text-brand-teal group-hover:text-brand-coral transition-colors">
            {promo.emoji} {promo.heading}
          </p>
          <p className="text-xs text-brand-gray mt-0.5">{promo.sub}</p>
        </div>
        <span className="shrink-0 text-sm font-bold text-brand-coral whitespace-nowrap">
          Prøv appen →
        </span>
      </a>

      {/* NAVIGASJON — tydeligere */}
      <div className="grid gap-3 sm:grid-cols-2 border-t border-brand-border pt-6">
        {previous ? (
          <Link
            to={`${basePath}/leksjon/${previous.id}`}
            className="group flex flex-col rounded-2xl border border-brand-border bg-brand-warm px-5 py-4 transition hover:border-brand-teal/30 hover:bg-brand-teal/5"
          >
            <span className="flex items-center gap-1 text-xs text-brand-gray mb-1">
              <ChevronLeft size={13} /> Forrige leksjon
            </span>
            <span className="text-sm font-semibold text-brand-ink group-hover:text-brand-teal transition leading-snug">
              {previous.title}
            </span>
            {previous.description && (
              <span className="mt-1 text-xs text-brand-gray line-clamp-1">{previous.description}</span>
            )}
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to={`${basePath}/leksjon/${next.id}`}
            className="group flex flex-col rounded-2xl border-2 border-brand-teal/25 bg-brand-teal/5 px-5 py-4 transition hover:border-brand-teal/50 hover:bg-brand-teal/10"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-brand-teal mb-1">
              Neste leksjon <ChevronRight size={13} />
            </span>
            <span className="text-sm font-semibold text-brand-teal leading-snug text-right">
              {next.title}
            </span>
            {next.description && (
              <span className="mt-1 text-xs text-brand-gray text-right line-clamp-1">
                {next.description}
              </span>
            )}
          </Link>
        ) : (
          <Link
            to={`${basePath}/dashboard`}
            className="group flex flex-col items-end rounded-2xl border-2 border-brand-coral/25 bg-brand-coral/5 px-5 py-4 transition hover:border-brand-coral/40 hover:bg-brand-coral/10"
          >
            <span className="flex items-center gap-1 text-xs text-brand-coral mb-1">
              Tilbake til oversikt <ChevronRight size={13} />
            </span>
            <span className="text-sm font-semibold text-brand-coral">Dashboard</span>
          </Link>
        )}
      </div>

      </div>

      {/* SIDEBAR — desktop sticky */}
      {parentModule && (
        <aside className="hidden lg:block sticky top-6 space-y-1">
          <div className="rounded-2xl border border-[rgb(var(--c-border))] bg-[rgb(var(--c-surface))] p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-brand-gray/60">
              Modul {moduleIndex + 1}
            </p>
            <p className="mb-3 text-sm font-semibold text-[rgb(var(--c-ink))] leading-snug">
              {parentModule.title}
            </p>
            <div className="space-y-0.5">
              {parentModule.lessons.map((l, i) => {
                const isCurrent = l.id === lessonId;
                const isDone = completedLessonIds.has(l.id);
                return (
                  <Link
                    key={l.id}
                    to={`${basePath}/leksjon/${l.id}`}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition group ${
                      isCurrent
                        ? 'bg-[rgb(var(--c-primary))]/10 text-[rgb(var(--c-primary))] font-semibold'
                        : isDone
                        ? 'text-[rgb(var(--c-ink))]/55 hover:bg-[rgb(var(--c-border))]/40'
                        : 'text-[rgb(var(--c-ink))]/80 hover:bg-[rgb(var(--c-border))]/40'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={13} className="shrink-0 text-green-500" />
                    ) : isCurrent ? (
                      <div className="h-3 w-3 shrink-0 rounded-full border-2 border-[rgb(var(--c-primary))]" />
                    ) : (
                      <Circle size={13} className="shrink-0 text-brand-gray/30" />
                    )}
                    <span className="flex-1 leading-snug line-clamp-2">
                      {moduleIndex + 1}.{i + 1} {l.title}
                    </span>
                    {isCurrent && (
                      <span className="shrink-0 text-[9px] font-bold text-[rgb(var(--c-primary))] opacity-70">du</span>
                    )}
                  </Link>
                );
              })}
            </div>
            <p className="mt-3 pt-3 border-t border-[rgb(var(--c-border))] text-[11px] text-brand-gray text-center">
              {completedInModule}/{parentModule.lessons.length} fullført
            </p>
          </div>
        </aside>
      )}

      </div>
    </div>
  );
};

export default LessonPage;
