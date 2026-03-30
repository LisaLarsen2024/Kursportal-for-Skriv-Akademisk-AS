# Driftsguide — Skriv Akademisk Kursportal
**kurs.skrivakademisk.no** · Sist oppdatert: mars 2026

---

## Oversikt over hele systemet

```
Student betaler på Stripe
        ↓
Stripe sender webhook til kurs.skrivakademisk.no/webhook
        ↓
Webhook-server oppdaterer Supabase (hasPaidAccess = true)
        ↓
Student logger inn og får tilgang til kurset
        ↓
Videoer spilles fra Bunny.net (eller Synthesia inntil videre)
Nedlastbare filer hentes fra Supabase Storage
```

---

## Alle tjenester — med lenker og roller

### 1. Replit — Kode og hosting
**URL:** https://replit.com  
**Prosjekt:** https://replit.com/@[ditt-brukernavn]/skriv-akademisk-kurs  
**Hva det gjør:** Hoster hele kursportalen og kjører webhook-serveren. Alt av kode bor her.

**To aktive prosesser:**
| Navn | Kommando | Hva den gjør |
|---|---|---|
| Start application | `npm run dev` (dev) / `npm run start` (prod) | Selve kursportalen |
| Webhook server | `node server/webhook.js` | Lytter på betalinger fra Stripe |

**Deployments (produksjon):**  
Gå til Replit → fanen **Deploy** → klikk **Publish** etter hver kodeendring.  
Produksjons-URL: https://kurs.skrivakademisk.no  
Deployment-type: Autoscale

**Miljøvariabler (Secrets):**  
Replit → venstre meny → **Secrets**
| Variabel | Hva den inneholder |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe hemmelig nøkkel (starter med `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook-signeringshemmelighet fra Stripe |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin-nøkkel (kun server-side) |
| `VITE_SUPABASE_ANON_KEY` | Supabase offentlig nøkkel (frontend) |
| `VITE_SUPABASE_URL` | URL til Supabase-prosjektet |
| `VITE_ADMIN_EMAILS` | Kommaseparert liste over admin-e-poster |

---

### 2. Supabase — Database, innlogging og fillagring
**URL:** https://supabase.com  
**Prosjekt-ID:** `xxxappopboikpvrnxnat`  
**Dashboard:** https://supabase.com/dashboard/project/xxxappopboikpvrnxnat

**Hva det gjør:**
- Håndterer innlogging (e-post + passord)
- Lagrer brukerprofiler og betalingsstatus
- Lagrer nedlastbare kursfiler (.docx)

**Tre viktige steder i Supabase-dashboardet:**

**a) Authentication → Users**  
Her ser du alle registrerte brukere. Du kan manuelt gi tilgang (se avsnitt under).

**b) Table Editor → profiles**  
Tabellen med alle brukerprofiler. Kolonner:  
- `id` — bruker-ID  
- `full_name` — navn  
- `email` — e-postadresse  
- `has_paid_access` — **sett denne til `true` manuelt for å gi tilgang**  
- `is_admin` — sett til `true` for å gi admin-tilgang

**c) Storage → course-downloads**  
Her ligger alle 9 .docx-filer (og ZIP-filen når den lastes opp).  
For å legge til en ny fil: klikk **Upload file** i denne bucketen.  
Filnavn må stemme nøyaktig med det som er kodet i appen — bruk kun små bokstaver, bindestreker og filendelsen `.docx` (f.eks. `skriveramme-innledning.docx`). Filer lastes ned som tidsbegrensede lenker (5 minutters varighet) — dette er en sikkerhetsfunksjon som gjør at kun betalende studenter kan laste ned.

---

### 3. Stripe — Betalingsløsning
**URL:** https://dashboard.stripe.com  
**Hva det gjør:** Tar imot betaling fra studenter og varsler appen automatisk når en betaling er gjennomført.

**To viktige steder i Stripe-dashboardet:**

**a) Payments**  
Her ser du alle betalinger. Klikk på en betaling for å se detaljer, inkludert hvilken e-postadresse som ble brukt. Dette er nyttig hvis du skal feilsøke en student som hevder de har betalt, men ikke fått tilgang.

**b) Developers → Webhooks**  
Her er koblingen mellom Stripe og appen din satt opp.  
Webhook-URL: `https://kurs.skrivakademisk.no/webhook`  
Hendelse som lyttets på: `checkout.session.completed`

> **Viktig:** Hvis du bytter domene eller deployer til en ny URL, må du oppdatere denne webhook-URL-en i Stripe. Ellers vil ingen betalinger gi tilgang automatisk.

**Betalingssiden i appen** bruker en fast Stripe Payment Link og sender med studentens e-post automatisk, slik at Stripe vet hvem som har betalt. Du finner og oppdaterer denne lenken i filen `src/pages/PaymentPage.tsx`.

---

## Vanlige oppgaver — steg for steg

### Gi en student manuell tilgang
Dette er nyttig hvis en betaling ikke gikk gjennom automatisk, eller du vil gi noen gratis tilgang.

1. Gå til [Supabase Dashboard](https://supabase.com/dashboard/project/xxxappopboikpvrnxnat)
2. Klikk **Table Editor** i venstre meny
3. Velg tabellen **profiles**
4. Finn studenten ved å søke på e-post
5. Klikk på raden og sett `has_paid_access` til **`true`**
6. Klikk **Save**

Studenten kan nå logge inn og få full tilgang umiddelbart — ingen e-post eller beskjed sendes automatisk, så du bør gjerne sende en melding selv.

---

### Gi noen admin-tilgang
Admin-tilgang gir tilgang til administrasjonspanelet inne i appen (oversikt over alle brukere, mulighet til å gi/fjerne tilgang).

Det er to steg — begge må gjøres:

**Steg 1 — Legg til i miljøvariabel:**  
Gå til Replit → **Secrets** → finn `VITE_ADMIN_EMAILS` → legg til den nye e-postadressen, atskilt med komma (uten mellomrom):  
```
fornavn@eksempel.no,annen@eksempel.no
```
Etter endringen: deploy appen på nytt (Replit → Deploy → Publish).

**Steg 2 — Sett flagg i databasen:**  
Gå til Supabase → Table Editor → profiles → finn brukeren → sett `is_admin` til **`true`**.

Begge steg må være på plass for at admin-tilgangen skal fungere.

---

### Legge til eller bytte ut en kursfil (.docx)
1. Gå til [Supabase Storage](https://supabase.com/dashboard/project/xxxappopboikpvrnxnat/storage/buckets)
2. Klikk på bucketen **course-downloads**
3. Last opp den nye filen med **Upload file**
4. Sørg for at filnavnet er nøyaktig det samme som den eksisterende filen (eller oppdater referansen i koden om du bruker nytt navn)

> Filnavnet som brukes i koden finner du i `src/data/courseData.ts` — der står `downloadFile: 'filnavn.docx'` ved hvert innhold som har en nedlastbar fil.

---

### Fjerne en students tilgang
1. Gå til Supabase → Table Editor → profiles
2. Finn studenten
3. Sett `has_paid_access` til **`false`**
4. Klikk **Save**

Studenten vil miste tilgang ved neste innlasting av appen.

---

### Se hvem som har kjøpt kurset
Du har to steder å sjekke:

- **I appen:** Logg inn med admin-kontoen din → gå til **Admin**-siden → her ser du en fullstendig liste over alle brukere, hvem som har betalt og hvem som ikke har det.
- **I Stripe:** Dashboard → Payments → gir deg en kronologisk liste over alle betalinger med beløp og e-post.

---

## Kursinnholdet — slik er det bygget opp

Kurset har **4 moduler** og **23 videoleksjoner**. Alt innhold er definert i filen `src/data/courseData.ts` — det er her du gjør endringer hvis du vil oppdatere titler, beskrivelser, videolenker eller nedlastbare filer.

| Modul | Tittel | Antall leksjoner |
|---|---|---|
| 1 | Oppgavestruktur (IMRoD) | 7 |
| 2 | APA 7 Referansehåndtering | 6 |
| 3 | Akademisk skrivestil og språk | 5 |
| 4 | Veiledning og prosess | 5 |

**Slik ser én leksjon ut i koden:**
```js
{
  id: 'lesson-1-1',
  title: 'Innledning til IMRoD-strukturen',
  description: 'Lær hvorfor struktur er nøkkelen til en god oppgave.',
  duration: '8 min',
  videoUrl: 'https://share.synthesia.io/...',
  downloadFile: 'skriveramme-innledning.docx',
  learningGoals: ['Forstå IMRoD', 'Kjenne igjen de ulike delene']
}
```

Vil du bytte en videolenkene (f.eks. når du bytter fra Synthesia til Bunny.net), endrer du bare `videoUrl` for den aktuelle leksjonen.

---

## Feilsøking — de vanligste problemene

### "Studenten har betalt, men har ikke fått tilgang"

Dette skjer nesten alltid av én av tre grunner:

1. **Webhook nådde ikke frem** — Gå til Stripe → Developers → Webhooks → klikk på webhook-endepunktet → sjekk loggen under "Recent deliveries". Er det røde feil der? Da kan det hende webhook-serveren var nede da betalingen kom inn.  
   → Løsning: Gi tilgang manuelt (se avsnitt over), og sjekk at webhook-serveren kjører i Replit.

2. **Feil e-post** — Studenten betalte med én e-post, men er registrert i appen med en annen.  
   → Løsning: Gi tilgang manuelt basert på e-postadressen de er registrert med.

3. **Webhook-hemmeligheten er feil** — Hvis `STRIPE_WEBHOOK_SECRET` i Replit ikke stemmer med det Stripe har, vil alle webhooks bli avvist.  
   → Løsning: Kopier hemmeligheten på nytt fra Stripe → Developers → Webhooks → klikk på endepunktet → "Signing secret".

---

### "Appen viser tom skjerm eller krasjer"

1. Sjekk at **Start application**-prosessen kjører i Replit (grønt lys)
2. Sjekk at alle **Secrets** er satt riktig — en manglende miljøvariabel er den vanligste årsaken
3. Gå til Replit → Deploy → sjekk **Deployment logs** for feilmeldinger

---

### "En video spiller ikke av"

Videoene hentes fra Synthesia (eller Bunny.net). Hvis en video ikke spiller:
1. Kopier video-URL-en fra `src/data/courseData.ts` og åpne den direkte i nettleseren
2. Virker den der? Da er det et innbyggingsproblem — ta kontakt med Synthesia/Bunny support
3. Virker den ikke? Da er videoen slettet eller lenken er utgått — last opp på nytt og oppdater URL-en i koden

---

### "En fil kan ikke lastes ned"

Nedlastbare filer genererer en tidsbegrenset lenke (5 minutter). Hvis nedlasting feiler:
1. Kontroller at filen finnes i Supabase Storage → course-downloads
2. Sjekk at filnavnet i Storage er nøyaktig likt det i `courseData.ts` (inkludert store/små bokstaver)
3. Kontroller at RLS-policiene (Row Level Security) i Supabase tillater lesing for betalende brukere

---

## Sikkerhetsnotater

- **`SUPABASE_SERVICE_ROLE_KEY`** gir full tilgang til databasen uten noen begrensninger. Del aldri denne nøkkelen — den brukes kun av webhook-serveren på serversiden.
- **`VITE_`-variabler** er synlige i nettleseren — legg aldri hemmelige nøkler i variabler som starter med `VITE_`.
- Filnedlastninger beskyttet av **signerte URL-er** — selv om noen deler en nedlastningslenke, utløper den automatisk etter 5 minutter.
- Supabase **Row Level Security (RLS)** er aktivert — databasereglene sørger for at studenter kun kan se sin egen data, selv om noen skulle prøve å hente andres informasjon direkte via API.

---

## Kontaktpunkter og support

| Tjeneste | Support |
|---|---|
| Replit | https://replit.com/support |
| Supabase | https://supabase.com/support |
| Stripe | https://support.stripe.com |
| Synthesia | https://help.synthesia.io |

---

*Du har bygget noe genuint nyttig for norske studenter. Denne guiden er ment å gjøre det trygt og enkelt å drifte det selv — du trenger ikke være utvikler for å holde hjulene i gang. Lykke til!* 🌿
