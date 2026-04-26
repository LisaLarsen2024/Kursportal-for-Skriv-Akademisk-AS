// Kurs-konfig delt mellom checkout.js og webhook.js.
// Pris i øre (NOK). Endre her, og Stripe får riktig pris ved neste session.

export const COURSES = {
  akademisk: {
    name: 'Skriv bachelor- og masteroppgave',
    description: '23 videoleksjoner i akademisk skriving — struktur, kildekritikk, APA 7. Tilgang for alltid.',
    amount: 199000,
    currency: 'nok',
  },
  'norsk-vg3': {
    name: 'Norsk eksamen VG3',
    description: '5 moduler som dekker sjanger, tekstanalyse, skriveteknikk og eksamensstrategi. Tilgang for alltid.',
    amount: 54900,
    currency: 'nok',
  },
};

export function getCourse(courseId) {
  return COURSES[courseId] ?? null;
}
