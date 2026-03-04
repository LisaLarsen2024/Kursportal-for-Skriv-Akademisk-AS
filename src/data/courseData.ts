import type { Module, Profile } from '../types/course';

const placeholderVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

export const modules: Module[] = [
  {
    id: 'mod-1',
    title: 'Oppgavestruktur',
    description: 'Lær hvordan en bachelor- eller masteroppgave bygges opp — fra innledning til konklusjon.',
    icon: 'BookOpen',
    sortOrder: 1,
    lessons: [
      ['Oversikt over oppgavestrukturen', 'Hva er de ulike delene, og hvorfor er de viktige?', 14],
      ['Innledning & problemstilling', 'Slik formulerer du en god problemstilling', 18],
      ['Teorikapittelet', 'Hvordan velge og presentere teori', 16],
      ['Metodekapittelet', 'Kvalitativ vs. kvantitativ — hva passer for din oppgave?', 17],
      ['Resultater & analyse', 'Presentere funn på en ryddig måte', 19],
      ['Drøfting', 'Slik kobler du teori, metode og funn', 21],
      ['Konklusjon & veien videre', 'Avrunding og anbefalinger', 11]
    ].map(([title, description, durationMinutes], idx) => ({
      id: `mod-1-lesson-${idx + 1}`,
      moduleId: 'mod-1',
      title,
      description,
      durationMinutes,
      videoUrl: placeholderVideo,
      sortOrder: idx + 1
    }))
  },
  {
    id: 'mod-2',
    title: 'APA 7 Referansehåndtering',
    description: 'Mestre referansestandarden som brukes ved de fleste norske utdanningsinstitusjoner.',
    icon: 'LibraryBig',
    sortOrder: 2,
    lessons: [
      ['Introduksjon til APA 7', 'Hvorfor referanser, og hva er nytt i 7. utgave?', 13],
      ['Kildehenvisning i tekst', 'Parentesreferanser og narrativreferanser', 15],
      ['Referanselisten', 'Oppbygging og formatering', 14],
      ['Bøker, artikler & rapporter', 'De vanligste kildetypene', 20],
      ['Nettkilder & lover', 'Referere til nettsider, lovdata og offentlige dokumenter', 18],
      ['Vanlige feil & tips', 'Feilene alle gjør — og hvordan unngå dem', 12]
    ].map(([title, description, durationMinutes], idx) => ({
      id: `mod-2-lesson-${idx + 1}`,
      moduleId: 'mod-2',
      title,
      description,
      durationMinutes,
      videoUrl: placeholderVideo,
      sortOrder: idx + 1
    }))
  },
  {
    id: 'mod-3',
    title: 'Akademisk Skrivestil & Språk',
    description: 'Skriv klart, presist og akademisk — uten å miste din egen stemme.',
    icon: 'PenSquare',
    sortOrder: 3,
    lessons: [
      ['Hva er akademisk språk?', 'Kjennetegn og prinsipper', 12],
      ['Presisjon & objektivitet', 'Unngå vagt språk og synsing', 14],
      ['Avsnittstruktur', 'Temasetninger, argumentasjon og flyt', 16],
      ['Sammenbindingsord & overganger', 'Slik skaper du rød tråd', 11],
      ['Vanlige språkfeil', 'Gjennomgang av typiske tabber', 15]
    ].map(([title, description, durationMinutes], idx) => ({
      id: `mod-3-lesson-${idx + 1}`,
      moduleId: 'mod-3',
      title,
      description,
      durationMinutes,
      videoUrl: placeholderVideo,
      sortOrder: idx + 1
    }))
  },
  {
    id: 'mod-4',
    title: 'Veiledning & Prosess',
    description: 'Få kontroll på prosessen fra start til innlevering.',
    icon: 'Compass',
    sortOrder: 4,
    lessons: [
      ['Planlegging & tidslinje', 'Lag en realistisk fremdriftsplan', 10],
      ['Samarbeid med veileder', 'Forberedelse til veiledningsmøter', 13],
      ['Tilbakemelding & revisjon', 'Slik bruker du tilbakemeldinger effektivt', 14],
      ['Motivasjon & skrivesperre', 'Tips for å holde flyten oppe', 12],
      ['Siste sjekk før innlevering', 'Sjekkliste for den endelige gjennomgangen', 9]
    ].map(([title, description, durationMinutes], idx) => ({
      id: `mod-4-lesson-${idx + 1}`,
      moduleId: 'mod-4',
      title,
      description,
      durationMinutes,
      videoUrl: placeholderVideo,
      sortOrder: idx + 1
    }))
  }
];

export const demoProfiles: Profile[] = [
  {
    id: '1',
    fullName: 'Admin Bruker',
    email: 'admin@skrivakademisk.no',
    hasPaidAccess: true,
    isAdmin: true
  },
  {
    id: '2',
    fullName: 'Student Eksempel',
    email: 'student@example.com',
    hasPaidAccess: false,
    isAdmin: false
  }
];
