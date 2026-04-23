import type { Module } from '../types/course';

// Kurs: Norsk eksamen VGS — basert på NOR01-07 (Utdanningsdirektoratet)
// Struktur: 5 moduler · 5 videoleksjoner · ca. 78 minutter totalt

export const norskModules: Module[] = [
  {
    id: 'norsk-mod-1',
    title: 'Velkommen & Eksamensformat',
    description: 'Full oversikt over eksamen: format, sjangre og vurderingskriterier. Etter denne modulen vet du nøyaktig hva du går til.',
    icon: 'GraduationCap',
    color: 'teal',
    sortOrder: 1,
    lessons: [
      {
        id: 'norsk-mod-1-lesson-1',
        moduleId: 'norsk-mod-1',
        sortOrder: 1,
        title: 'Hva møter du på eksamen — og hva kreves av deg?',
        description: 'Forberedelsesdag, skrivedag, de fire sjangrene og vurderingskriteriene — alt du trenger å vite før du begynner å øve.',
        durationMinutes: 16,
        videoUrl: 'PLACEHOLDER',
        resourceUrl: '',
        learningGoals: [
          'Forstå eksamensformatet: forberedelsesdag med alle hjelpemidler og fem timers skrivedag',
          'Kjenne de fire sjangrene du kan møte: essay, litterær tolkning, retorisk analyse og artikkel',
          'Vite hva sensor vurderer: innhold, struktur og språk — og hva som skiller middels fra toppkarakter',
          'Knytte kurset til kompetansemålene i læreplanen NOR01-07',
          'Ha full oversikt over alle fem moduler og kursinnholdet',
          'Vite hvordan du bruker kurset og appen mest effektivt mellom leksjonene',
        ],
      },
    ],
  },

  {
    id: 'norsk-mod-2',
    title: 'Skrivekunsten — de fire sjangrene',
    description: 'Konkrete oppskrifter for alle fire eksamenssjangre: essay, litterær tolkning, retorisk analyse og artikkel.',
    icon: 'PenLine',
    color: 'coral',
    sortOrder: 2,
    lessons: [
      {
        id: 'norsk-mod-2-lesson-1',
        moduleId: 'norsk-mod-2',
        sortOrder: 1,
        title: 'Essay, tolkning, retorisk analyse og artikkel — slik skriver du dem',
        description: 'Fire sjangre, fire oppskrifter. Du lærer kjennetegn, struktur og hva som konkret skiller en treer fra en sekser i hver sjanger.',
        durationMinutes: 21,
        videoUrl: 'PLACEHOLDER',
        resourceUrl: '',
        learningGoals: [
          'Skrive et essay med de fem kjennetegnene: utforskende, reflekterende, personlig stemme, tekstbasert og åpen avslutning',
          'Strukturere essayet med fengslende åpning, utforskende hoveddel og åpen avslutning',
          'Analysere skjønnlitteratur med litterær tolknings-oppskriften: innledning med tolkningstese, virkemidler i hoveddelen og helhetstolkning i avslutningen',
          'Sammenligne to tekster tematisk — ikke tekst for tekst',
          'Identifisere og analysere appellformene etos, patos, logos og kairos i sakprosatekster',
          'Skrive retorisk analyse med vurdering av tekstens overbevisningskraft',
          'Skrive en faglig artikkel med kildekritisk kompetanse og kildeliste',
          'Se forskjellen mellom et middels og et fremragende avsnitt — og skrive det fremragende',
        ],
      },
    ],
  },

  {
    id: 'norsk-mod-3',
    title: 'Tekstanalyse — les som en pro',
    description: 'Lær å analysere skjønnlitteratur med riktige fagbegreper, forstå realismen og modernismen, og analysere sammensatte tekster.',
    icon: 'BookOpen',
    color: 'teal',
    sortOrder: 3,
    lessons: [
      {
        id: 'norsk-mod-3-lesson-1',
        moduleId: 'norsk-mod-3',
        sortOrder: 1,
        title: 'Analyser skjønnlitteratur, litteraturhistorie og sammensatte tekster',
        description: 'Analysetrappen fra observasjon til kontekstualisering, de fire litterære sjangrene, realisme og modernisme, og multimodale tekster.',
        durationMinutes: 18,
        videoUrl: 'PLACEHOLDER',
        resourceUrl: '',
        learningGoals: [
          'Analysere de fire litterære sjangrene: novelle, roman, lyrikk og drama',
          'Bruke de seks tolkningsverktøyene: fortellerperspektiv, symbolikk, kontraster, språklige bilder, komposisjon og tematikk',
          'Gå gjennom analysetrappens fire steg: observere → beskrive med fagbegreper → tolke → kontekstualisere',
          'Analysere dikt med strofeform, rim, rytme, enjambement og bildespråk',
          'Plassere tekster i fire litteraturhistoriske epoker: realisme, naturalisme, nyrealism og modernisme',
          'Forklare hvordan synet på menneske, natur og samfunn endrer seg gjennom 170 år',
          'Analysere multimodale tekster med begrepene forankring, avløsning og kontrast',
          'Stille fem kontekstualiserende spørsmål til enhver tekst',
        ],
      },
    ],
  },

  {
    id: 'norsk-mod-4',
    title: 'Språk & Sidemål',
    description: 'Mestre nynorsk, forstå språkendring i Norge i dag, og lær den fem-stegs kvalitetssjekken som løfter karakteren.',
    icon: 'Languages',
    color: 'coral',
    sortOrder: 4,
    lessons: [
      {
        id: 'norsk-mod-4-lesson-1',
        moduleId: 'norsk-mod-4',
        sortOrder: 1,
        title: 'Nynorsk, språkendring og rettskriving',
        description: 'De 10 vanligste nynorskfeilene, en fire-ukers sidemålsstrategi, språk og identitet, og kvalitetssjekken som gjør teksten bedre.',
        durationMinutes: 11,
        videoUrl: 'PLACEHOLDER',
        resourceUrl: '',
        learningGoals: [
          'Identifisere og unngå de ti vanligste nynorskfeilene (pronomen, verb, substantiv og småord)',
          'Følge en fire-ukers sidemålsstrategi fra passiv lesing til aktiv skriving og drill',
          'Reflektere over seks tendenser i norsk språkendring i dag: dialektutjevning, engelskpåvirkning, multietnolekt og mer',
          'Bruke tre perspektiver på språk og identitet på eksamen',
          'Gjenkjenne og unngå de ti vanligste eksamensfeilene, inkludert særskriving og forvirring mellom da og når',
          'Gjennomføre fem-stegs kvalitetssjekk: særskriving, setningslengde, fyllord, formverk og helhetsblikk',
        ],
      },
    ],
  },

  {
    id: 'norsk-mod-5',
    title: 'Eksamensdagen — strategi og gjennomføring',
    description: 'Bruk forberedelsesdagen smart, disponér de fem timene riktig, velg riktig oppgave, og gjennomfør den ultimate kvalitetssjekken.',
    icon: 'ClipboardCheck',
    color: 'teal',
    sortOrder: 5,
    lessons: [
      {
        id: 'norsk-mod-5-lesson-1',
        moduleId: 'norsk-mod-5',
        sortOrder: 1,
        title: 'Fra forberedelsesdag til ferdig tekst — time for time',
        description: 'Tidsskjema for forberedelsesdagen, tekstkartet, oppgavevalg-strategi, skrivedagens fem timer og den sju-stegs kvalitetssjekken.',
        durationMinutes: 12,
        videoUrl: 'PLACEHOLDER',
        resourceUrl: '',
        learningGoals: [
          'Bruke forberedelsesdagen strategisk: les to ganger, lag tekstkart, forbered verktøy — ikke ferdig tekst',
          'Fylle ut tekstkartet for alle tekster i heftet: sjanger, tema, virkemidler, kontekst og koblinger mellom tekstene',
          'Velge riktig oppgave med fire avgjørende spørsmål',
          'Disponere skrivedagens tre hundre minutter: 30 min valg, 30 min disposisjon, 150 min skriving, 45 min redigering, 45 min kvalitetssjekk',
          'Gjennomføre sju-stegs kvalitetssjekk på 45 minutter: sjanger, struktur, innhold, rettskriving, tegnsetting, sidemål og helhetsblikk',
          'Bruke fem mentale strategier for å prestere under press på eksamensdagen',
        ],
      },
    ],
  },
];

// Metadata om kurset brukt på landingssider og kjøpsside
export const norskCourseInfo = {
  id: 'norsk-vg3',
  title: 'Norsk eksamen VGS',
  tagline: 'Alt du trenger til norskeksamen — 549 kr, tilgang for alltid',
  description: 'Kurset er bygget på læreplanen NOR01-07 og dekker alle fire eksamenssjangre, tekstanalyse fra 1850 til i dag, sidemål, rettskriving og eksamensstrategi. Fem moduler. Fem videoer. Konkrete oppskrifter som fungerer.',
  targetAudience: 'Elever på Vg3 studieforberedende som tar skriftlig norskeksamen',
  totalMinutes: 78,
  moduleCount: 5,
  lessonCount: 5,
  stripePaymentLink: 'https://buy.stripe.com/4gM5kw4uVg1z2nx1ZhbbG03',
};
