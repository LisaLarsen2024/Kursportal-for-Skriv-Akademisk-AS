# Kursportal Skriv Akademisk

React + TypeScript kursportal bygget med Vite, Tailwind CSS og Supabase. Designet matcher visuelt skrivakademisk.no.

## Arkitektur

- **Frontend**: React 18, TypeScript, React Router v6, Tailwind CSS, framer-motion
- **Designsystem**: Lovable-stil med Libre Baskerville + DM Sans, HSL CSS-variabler, shadcn-tokens
- **State/Data**: @tanstack/react-query (QueryClientProvider i App.tsx)
- **Backend/Auth/DB**: Supabase (eksternt, konfigurert via miljøvariabler)
- **Build-verktøy**: Vite 6 med `@/`-path-alias (peker til `./src`)

## Prosjektstruktur

```
src/
  assets/        # Statiske assets (hero-student.svg)
  components/    # Delte UI-komponenter (Layout, VideoPlayer)
  contexts/      # React Context (AuthContext, ProgressContext)
  data/          # Statisk kursdata (courseData.ts — kilden til sannhet)
  hooks/         # useCourseData.ts — adapter over statisk courseData
  lib/           # Supabase-klientoppsett
  pages/         # Sidekomponenter per rute
  types/         # TypeScript-typedefinisjoner (course.ts)
supabase/
  schema.sql     # Databaseskjema for Supabase
```

## Miljøvariabler (Replit Secrets)

- `VITE_SUPABASE_URL` — Supabase-prosjektets URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

## Kursinnhold (courseData.ts)

Alle 4 moduler og 23 leksjoner er definert med:
- `videoUrl: ''` — Erstatt med YouTube embed-URL når video er klar
- `resourceUrl: ''` — Erstatt med lenke til nedlastbar ressurs (PDF, sjekkliste)
- `learningGoals: []` — 4 læringsmål per leksjon, vises i LessonPage

**Moduloversikt:**
- Modul 01: Oppgavestruktur (7 leksjoner, ca. 1t 56 min)
- Modul 02: APA 7 Referansehåndtering (6 leksjoner, ca. 1t 32 min)
- Modul 03: Akademisk Skrivestil & Språk (5 leksjoner, ca. 1t 8 min)
- Modul 04: Veiledning & Prosess (5 leksjoner, ca. 58 min)

## Supabase-database

Supabase-prosjektkode: `xxxappopboikpvrnxnat`

Tabeller:
- `profiles` — brukerprofil med `has_paid_access` og `is_admin`
- `user_progress` — fullførte leksjon-IDer per bruker

RLS-policies er satt opp. For å aktivere sletting i admin:
```sql
CREATE POLICY "Admins kan slette brukere"
  ON profiles FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE));
```

## Betaling (Stripe)

Bruker Stripe Payment Link: `https://buy.stripe.com/cNi5kw6D39DbbY7bzRbbG02`
Pris: 1 990 NOK, engangsbetaling, livstids tilgang.
Webhook-server (`server/webhook.js`) aktiverer tilgang automatisk og sender velkomstmail via Resend.

**Merk:** Apple krever in-app purchase (ikke Stripe) for digitalt innhold i iOS-apper. Planlegg dette tidlig ved App Store-lansering via Capacitor.

## E-post (Resend)

Velkomstmail sendes automatisk etter vellykket betaling via `server/email.js`.
API-nøkkel lagret som `RESEND_API_KEY` i Replit Secrets (ikke via Replit-integrasjonen — brukeren avviste OAuth-flyten, bruker direkte API-nøkkel i stedet).
Avsenderadresse: `kurs@skrivakademisk.no` — må verifiseres i Resend-dashboardet under Domains.
E-postmal: HTML-mal i `server/email.js` med cross-sell til app.skrivakademisk.no.

## Supabase-URL for e-postbekreftelse

Sett redirect-URL til Replit dev-domene under utvikling. Oppdater til produksjonsdomene ved lansering.

## Bygg og kjør

- Utvikling: `npm run dev` (port 5000)
- Bygg: `npm run build` → `dist/`
- Deployment: Statisk via Replit Deploy
