# Kursportal for Skriv Akademisk AS

Dette er en React + TypeScript + Tailwind-prototype for en norsk kursportal med betalingsmur, modulbasert videolæring og adminvedlikehold.

## Funksjoner i versjon 1

- Offentlig landingsside med moduler, pris og CTA
- Innlogging (Supabase-klargjort, mocket i demo)
- Betalingsside med Stripe Checkout placeholder
- Beskyttet kursdashboard med progresjonsindikatorer
- Modul- og leksjonssider med embedded video via iframe
- Markering av fullførte leksjoner (lagres i localStorage i demo)
- Profilside med tilgangsstatus og fremgang
- Enkel adminside for modulhåndtering og brukeroversikt
- Supabase SQL-schema med RLS-policyer

## Teknisk stack

- React + TypeScript
- Tailwind CSS
- React Router
- Lucide React ikoner
- Supabase JS client

## Kjøre lokalt

```bash
npm install
npm run dev
```

## Miljøvariabler

Opprett `.env`:

```env
VITE_SUPABASE_URL=https://DIN-PROSJEKTREF.supabase.co
VITE_SUPABASE_ANON_KEY=DIN_ANON_KEY
```

## Stripe-arkitektur (klar for integrasjon)

- `PaymentPage` inneholder et tydelig integrasjonspunkt for Stripe Checkout.
- I produksjon bør knappetrykk trigge en serverless edge function som oppretter Checkout Session i NOK.
- Etter vellykket webhook oppdateres `profiles.has_paid_access = true`.

## Supabase

SQL-oppsettet ligger i `supabase/schema.sql`.

