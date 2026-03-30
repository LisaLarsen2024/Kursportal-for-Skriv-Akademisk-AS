# Teknisk rapport — Skriv Akademisk Kursportal

**Dokument:** Intellectual Property & Technical Architecture Report  
**Versjon:** 2.0 — 29. mars 2026  
**Eier:** Skriv Akademisk AS (org.nr. 930 906 107)  
**Domene:** kurs.skrivakademisk.no  
**Utarbeidet av:** Lisa Larsen / Skriv Akademisk AS

---

## 1. Eierskapserklæring

All kode, design, innhold og funksjonalitet beskrevet i dette dokumentet er utviklet av og eies av **Skriv Akademisk AS** (org.nr. 930 906 107). Kodebasen er proprietær programvare og er beskyttet av norsk og internasjonal opphavsrettslovgivning (åndsverkloven).

Denne rapporten dokumenterer den tekniske arkitekturen som bevis på intellektuell eiendomsrett og tjener som teknisk grunnlag for eventuell patentering, lisensiering eller verdivurdering av plattformen.

---

## 2. Produktbeskrivelse

**Skriv Akademisk Kursportal** er en norsk LMS-plattform (Learning Management System) for akademisk skriving. Portalen hoster strukturerte videokurs med fremdriftssporing, betalingsmur og personalisert brukeropplevelse.

### Kurs på plattformen

| Kurs | Målgruppe | Moduler | Leksjoner | Totaltid | Pris |
|---|---|---|---|---|---|
| Akademisk skriving | Bachelor/master | 4 | 23 | ~4 timer | 1 990 kr |
| Norsk eksamen VGS | Vg3 | 5 | 5 | 78 min | 549 kr |
| Ungdomsskole | Ungdomsskole | — | — | Kommer | — |

### Primære brukerreiser
1. Besøker landingssiden → ser kursinfo → klikker "Kjøp" → Stripe-betaling → automatisk tilgang → starter kurs
2. Returnerende student → logger inn → fortsetter der de slapp → fullfører leksjon → ser fremdrift

---

## 3. Teknologistabel

### Frontend
| Teknologi | Versjon | Formål |
|---|---|---|
| React | 18.x | UI-rammeverk |
| TypeScript | 5.x | Typesikkerhet |
| Vite | 6.x | Byggeverktøy og dev-server |
| Tailwind CSS | 3.x | Stilrammeverk (utility-first) |
| Framer Motion | 11.x | Animasjoner |
| Lucide React | — | Ikonbibliotek |
| TanStack Query | 5.x | Server-state og caching |
| React Router | 6.x | Klient-side routing |
| vite-plugin-pwa | — | Progressive Web App (PWA) |

### Backend
| Teknologi | Versjon | Formål |
|---|---|---|
| Node.js | 20.x | JavaScript-kjøretid |
| Express | 4.x | HTTP-server og webhook-handler |

### Tredjepart (SaaS)
| Tjeneste | Formål | Dataflyt |
|---|---|---|
| Supabase | Database (PostgreSQL), autentisering, Row Level Security | Brukerdata, fremdrift, tilgang |
| Stripe | Betalingsbehandling, Payment Links, webhooks | Betalingstransaksjon |
| Resend | Transaksjonell e-post | Velkomstmail, kvittering |

### Hosting og distribusjon
| Komponent | Platform |
|---|---|
| Frontend + webhook-server | Replit (produksjon) |
| Database | Supabase Cloud (EU-region) |
| Domene | kurs.skrivakademisk.no |

---

## 4. Systemarkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        NETTLESER                            │
│                                                             │
│  React SPA (TypeScript + Vite)                              │
│  ┌──────────┐ ┌────────────┐ ┌──────────────┐              │
│  │LandingPage│ │DashboardPage│ │  LessonPage  │             │
│  └────┬─────┘ └─────┬──────┘ └──────┬───────┘              │
│       │             │               │                       │
│  ┌────▼─────────────▼───────────────▼──────────────┐        │
│  │       AuthContext + ProgressContext              │        │
│  │       (React Context API)                        │        │
│  └────────────────────┬─────────────────────────────┘       │
└───────────────────────┼─────────────────────────────────────┘
                        │ HTTPS (Supabase JS Client)
┌───────────────────────▼─────────────────────────────────────┐
│                       SUPABASE                              │
│                                                             │
│  PostgreSQL Database    Auth (JWT)    Row Level Security     │
│  ┌──────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │ profiles │  │  user_progress │  │   course_access  │    │
│  │ modules  │  │    lessons     │  │                  │    │
│  └──────────┘  └────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘

                   ╔═══════════════════════════════╗
                   ║  STRIPE BETALINGSFLYT          ║
                   ║  1. Bruker klikker "Kjøp"     ║
                   ║  2. → Stripe Payment Link      ║
                   ║  3. Bruker betaler             ║
                   ║  4. Stripe → POST /webhook     ║
                   ╚════════════╦══════════════════╝
                                ║
┌───────────────────────────────▼─────────────────────────────┐
│              EXPRESS SERVER (webhook.js)                     │
│                                                             │
│  POST /webhook   → verifiserer Stripe-signatur             │
│                  → oppdaterer profiles.has_paid_access      │
│                  → inserter i course_access                 │
│                  → sender velkomstmail via Resend           │
│                                                             │
│  GET /api/profile → verifiserer Supabase JWT               │
│                   → returnerer brukerprofil                 │
│  GET /health     → statussjekk                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Databaseskjema

### `profiles`
```sql
id               uuid (PK, ref auth.users)
email            text
full_name        text
has_paid_access  boolean DEFAULT false
has_norsk_access boolean DEFAULT false
is_admin         boolean DEFAULT false
created_at       timestamptz
updated_at       timestamptz
```

### `course_access`
```sql
id                uuid (PK)
user_id           uuid (FK → auth.users)
course_id         text  -- 'akademisk' | 'norsk-vg3'
granted_at        timestamptz
stripe_session_id text
```

### `user_progress`
```sql
id           uuid (PK)
user_id      uuid (FK → auth.users)
lesson_id    text
course_id    text
completed_at timestamptz
```

### `modules` og `lessons`
```sql
-- modules
id          uuid (PK)
course_id   text
title       text
order_index int

-- lessons
id               uuid (PK)
module_id        uuid (FK → modules)
title            text
video_url        text
duration_minutes int
order_index      int
```

### Row Level Security-regler (utvalg)
```sql
-- Brukere kan kun lese/skrive egne fremdriftsdata
CREATE POLICY "own_progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Brukere kan kun lese sin egen profil
CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

---

## 6. Filstruktur

```
kursportal/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           — Hoved-layout: header, footer, nav, mobil-meny
│   │   └── VideoPlayer.tsx      — Videospiller med vannmerke og IP-beskyttelse
│   ├── contexts/
│   │   ├── AuthContext.tsx      — Supabase-session + profil-state
│   │   └── ProgressContext.tsx  — Kursfremdrift, syncing mot Supabase
│   ├── data/
│   │   ├── courseData.ts        — Akademisk skriving (4 moduler, 23 leksjoner)
│   │   └── norskData.ts         — Norsk VGS (5 moduler, 5 leksjoner, 78 min)
│   ├── lib/
│   │   └── supabase.ts          — Supabase-klient (singleton)
│   └── pages/
│       ├── LandingPage.tsx      — Offentlig markedsføringsside
│       ├── AuthPage.tsx         — Innlogging / registrering
│       ├── PaymentPage.tsx      — Kjøpssider (begge kurs)
│       ├── PaymentSuccessPage.tsx
│       ├── DashboardPage.tsx    — Kursoversikt: Akademisk skriving
│       ├── NorskDashboardPage.tsx — Dashboard: Norsk VGS
│       ├── ModulePage.tsx       — Modullisting med leksjoner
│       ├── LessonPage.tsx       — Leksjonside: video + innhold + sidebar
│       ├── ResourcesPage.tsx    — Nedlastbare ressurser
│       ├── ProfilePage.tsx      — Brukerprofil
│       ├── AdminPage.tsx        — Admin: manuell tilgangsstyring
│       ├── VilkarPage.tsx       — Bruksvilkår (juridisk, /vilkar)
│       └── PersonvernPage.tsx   — Personvernerklæring (/personvern)
├── server/
│   ├── webhook.js               — Express-server: Stripe webhook + profil-API
│   └── email.js                 — Resend e-postmaler
├── supabase/
│   └── schema.sql               — Komplett databaseskjema
├── public/
│   ├── manifest.json            — PWA-manifest
│   └── icons/                   — App-ikoner (alle størrelser)
├── index.html                   — HTML-entry med meta-tags og PWA
├── TEKNISK_RAPPORT.md           — Dette dokumentet
└── SIKKERHETSRAPPORT.md         — Sikkerhetsrevisjon (29.03.2026)
```

---

## 7. Sentrale designbeslutninger

### Statisk kursdata vs. databasedrevet innhold
Kursinnhold (moduler og leksjoner) er definert i statiske TypeScript-filer. Dette gir:
- Null nettverkslatens ved lasting av kursstruktur
- Enkel versjonskontroll av innhold via git
- Ingen mulighet for brukerinndata-manipulering av kursstruktur
- Trivial lokal utvikling uten databasetilkobling

### Hybrid state-håndtering
- **Server-state** (fremdrift, tilgang, profil): Synkronisert mot Supabase
- **Lokal state** (tema, banners, gjestfremdrift): `localStorage`

| localStorage-nøkkel | Innhold |
|---|---|
| `sa-theme` | `'dark'` eller `'light'` |
| `sa-pc-banner-dismissed` | Onboarding-banner sett |
| `sa-onboarding-seen` | Førstegangsveiledning vist |

### Stripe Payment Links
Betalingsflyten bruker Stripe-hostede Payment Links fremfor Stripe.js embedded checkout:
- Stripe håndterer PCI-samsvar fullstendig
- Ingen kortdata berøres av plattformens kode
- E-post forhåndsutfylles via `?prefilled_email=`-parameter

### Dark mode som standard
Portalen starter i mørk modus (`html.dark`). Temaet lagres i `localStorage` og gjenopprettes via inline `<script>` i `<head>` for å unngå «flash of wrong theme» (FOWT).

### PWA (Progressive Web App)
Konfigurert via `vite-plugin-pwa`:
- «Legg til på hjemskjerm» på iOS og Android
- Native app-opplevelse uten App Store-distribusjon
- Offline-cache for allerede besøkte sider

---

## 8. UX-designprinsipper

Portalen er designet med følgende bærende prinsipper, implementert gjennom alle 7 designiterasjoner (januar–mars 2026):

1. **Mørk modus som standard** — tryggere, mer konsentrasjonsfremmende for studenter
2. **Norsk tone** — varm, direkte, studentnær kommunikasjon ("Du er ikke alene")
3. **Investerings-framing** — betaling presenteres som investering ("Billigere enn én veiledningstime")
4. **Fremdriftsmotivasjon** — prosentindikator, modul-sidebar, "X av Y fullført"
5. **Onboarding** — første-gangs-velkomst-boks forsvinner etter avvisning
6. **IP-beskyttelse** — vannmerke + høyreklikksblokking på video
7. **Juridisk tilstedeværelse** — vilkår, personvern, copyright i footer på alle sider

---

## 9. Sikkerhetsarkitektur

| Lag | Mekanisme |
|---|---|
| Autentisering | Supabase Auth (JWT, e-post/passord) |
| Autorisasjon (DB) | Row Level Security (RLS) — brukere ser kun egne data |
| Autorisasjon (ruter) | React Router guards — ubetalte omdirigeres til betalingssiden |
| Betalingsvalidering | Stripe webhook-signaturverifisering |
| Hemmeligheter | Miljøvariabler — aldri i klientkode |
| IP-beskyttelse video | Høyreklikk deaktivert + Skriv Akademisk™-vannmerke |
| Søkemotorbeskyttelse | `noindex, nofollow` meta-tag på alle sider |
| Copyright-metadata | `<meta name="author">` og `<meta name="copyright">` |

---

## 10. Stripe-konfigurasjon

| Produkt | Stripe Payment Link | Pris |
|---|---|---|
| Akademisk skriving | `https://buy.stripe.com/cNi5kw6D39DbbY7bzRbbG02` | 1 990 kr |
| Norsk eksamen VGS | `https://buy.stripe.com/4gM5kw4uVg1z2nx1ZhbbG03` | 549 kr |

**Webhook-endepunkt:** `https://kurs.skrivakademisk.no/webhook`  
**Webhook-event:** `checkout.session.completed`

---

## 11. E-postflyt

Etter vellykket betaling sendes automatisk velkomstmail:

| Felt | Verdi |
|---|---|
| Avsender | `kontakt@skrivakademisk.no` (via Resend) |
| Emne | `Velkommen til kurset, [navn]! 🎓 Her er din plan` |
| Personalisering | Brukerens fornavn, kurslenke, ukeplan |

---

## 12. Tredjepartstjenester og GDPR

| Tjeneste | Formål | GDPR DPA | Datalagring |
|---|---|---|---|
| Supabase | Database og auth | ✅ Standard DPA | EU (Frankfurt) |
| Stripe | Betaling | ✅ DPA | EU/USA (SCC) |
| Resend | E-post | ✅ DPA tilgjengelig | USA (SCC) |

Ingen av tjenestene bruker persondata til egne markedsføringsformål. Full detaljer i `/personvern`.

---

## 13. Kursinnhold — Akademisk skriving (4 moduler, 23 leksjoner)

| Modul | Tittel | Leksjoner |
|---|---|---|
| 1 | Oppgavestruktur og disposisjon | 7 |
| 2 | Akademisk språk og skrivestil | 6 |
| 3 | Kilder, referanser og akademisk redelighet | 5 |
| 4 | Revisjon, levering og stressmestring | 5 |

---

## 14. Kursinnhold — Norsk eksamen VGS (5 moduler, 5 leksjoner)

| Modul | Tittel | Varighet |
|---|---|---|
| 1 | Sakprosatekster | 16 min |
| 2 | Skjønnlitteratur og analyse | 21 min |
| 3 | Skriveteknikk og argumentasjon | 18 min |
| 4 | Eksamensstrategi | 11 min |
| 5 | Revidering og innlevering | 12 min |

**Total:** 78 min

---

## 15. Fremtidig veikart

| Prioritet | Tiltak | Status |
|---|---|---|
| Høy | Ungdomsskole-kurs — innhold og publisering | Planlagt |
| Middels | Rate limiting på API-endepunkter | Anbefalt |
| Middels | Content Security Policy (CSP) header | Anbefalt |
| Lav | Automatiserte ende-til-ende-tester (Playwright) | Fremtidig |
| Lav | Sentry feil-logging i produksjon | Fremtidig |
| Lav | Video DRM (Vimeo DRM) | Fremtidig |

---

## Vedlegg: Nøkkelpersoner

| Rolle | Navn | Kontakt |
|---|---|---|
| Eier / daglig leder | Lisa Sveenlarsen | lisasveenlarsen@gmail.com |
| Teknisk kontakt | Skriv Akademisk AS | kontakt@skrivakademisk.no |

---

*Dette dokumentet er konfidensielt og eid av Skriv Akademisk AS. Distribusjon krever skriftlig samtykke fra eier.*

**© 2026 Skriv Akademisk™ AS · Alle rettigheter reservert · org.nr. 930 906 107**
