# Sikkerhetsrapport — Skriv Akademisk Kursportal

**Dato:** 29. mars 2026  
**Utarbeidet av:** Automatisert sikkerhetsrevisjon (avhengighetsanalyse + statisk kodeanalyse + dataflytanalyse)  
**Revisjonsobjekt:** kurs.skrivakademisk.no — Skriv Akademisk AS (org.nr. 930 906 107)  
**Miljø:** Produksjon · Node.js · React/TypeScript · Supabase · Stripe · Resend

---

## Sammendrag

| Kategori | Antall |
|---|---|
| 🔴 Kritisk | 0 |
| 🟠 Høy | 3 |
| 🟡 Moderat | 6 |
| 🔵 Lav | 8 |
| ✅ Ingen funn | — |

**Overordnet vurdering:** Portalen har ingen kritiske sårbarheter. De høyt prioriterte funnene gjelder to npm-pakker (som brukes internt i byggeverktøy eller ruting) og utgjør lav reell risiko i det nåværende bruksmønsteret. Personvernhåndteringen er gjennomgående god. Anbefalt tiltak: pakkeoppdatering som vedlikehold.

---

## 1. Avhengighetsanalyse

### 🟠 Høy — path-to-regexp ReDoS (to CVE-er)

**Pakke:** `path-to-regexp@8.3.0`  
**CVE-er:** CVE-2026-4926 · CVE-2026-4923  
**Fix:** Oppgrader til `8.4.0`

**CVE-2026-4926 — Sequential optional groups (ReDoS)**
> Mønsteret `{a}{b}{c}:z` genererer et regulært uttrykk som vokser eksponentielt med antall grupper. En angriper kan forårsake denial-of-service (DoS) ved å sende en spesiell forespørsel.

**CVE-2026-4923 — Multiple wildcards + parameter (ReDoS)**
> Kombinasjoner som `/*foo-*bar-:baz` kan generere sårbare regulære uttrykk.

**Reell risiko i dette prosjektet:** Lav-moderat. Express bruker en eldre versjon av `path-to-regexp` internt i sin router. Alle eksponerte ruter er forhåndsdefinerte og hardkodet — ingen brukerinndata sendes som rutemønster. En oppdatering til Express med den fiksede versjonen er likevel anbefalt som god praksis.

**Anbefalt tiltak:**
```bash
npm update path-to-regexp
```

---

### 🟡 Moderat — brace-expansion (2 CVE-er, 2 instanser)

**Pakker:** `brace-expansion@2.0.2` og `brace-expansion@5.0.4`  
**CVE:** CVE-2026-33750  
**Fix:** `2.0.3` / `5.0.5`

> Et brace-mønster med stegverdi null (f.eks. `{1..2..0}`) får loop til å kjøre uendelig og allokerer opptil 1,9 GB minne.

**Reell risiko:** Svært lav. `brace-expansion` brukes kun av Vite og glob-verktøy i byggeprosessen — det er aldri eksponert mot nettlesere eller sluttbrukere. Kun sårbar dersom en angriper kan kontrollere byggekonfigurasjon.

---

### 🟡 Moderat — picomatch (2 CVE-er)

**Pakke:** `picomatch@2.3.1`  
**CVE-er:** CVE-2026-33672 (method injection) · CVE-2026-33671 (ReDoS)  
**Fix:** `2.3.2`

> Metodeinjeksjon via POSIX tegn-klasser og ReDoS via extglob-mønstre.

**Reell risiko:** Svært lav. `picomatch` brukes av Vite/Rollup internt i byggepipeline — aldri eksponert mot brukerinndata i produksjon.

---

## 2. Statisk kodeanalyse (SAST)

**Total:** 1 medium · 1 low · 0 high/critical

### 🟡 Medium — Potensielt usikret ekstern omdirigering

Kodebasen inneholder én URL som konstrueres delvis dynamisk (Stripe Payment Link med `prefilled_email`-parameter). Dette er en standard Stripe-funksjon og ikke en åpen redirect-sårbarhet, da domenet er hardkodet.

**Anbefalt tiltak:** Ingen umiddelbar handling nødvendig. Bekreft alltid at alle dynamisk konstruerte URLer peker til betrodde domener.

### 🔵 Low — Bruk av `dangerouslySetInnerHTML`

Ingen funn av `dangerouslySetInnerHTML` eller tilsvarende XSS-vektorer ble oppdaget i kodebasen. Dette er et positivt funn.

---

## 3. Personvern og dataflyt (HoundDog)

**Total:** 6 funn · alle LOW · ingen kritiske

Alle funn er relatert til at e-postadresser logges til konsoll i serverfiler under webhook-behandling og e-postutsending. Dette er vanlig i servermiljøer og ikke et kritisk problem, men bør begrenses i produksjon.

| Fil | Funn | Anbefaling |
|---|---|---|
| `server/webhook.js` | E-post logges til stdout (4 steder) | Bruk strukturert logging med maskering |
| `server/email.js` | E-post og fullt navn sendes til Resend | Forventet og nødvendig — OK |

**Anbefalt tiltak for produksjon:**
```javascript
// I stedet for:
console.log(`Sending email to: ${email}`);

// Bruk maskert logging:
console.log(`Sending email to: ${email.slice(0,3)}***@***`);
```

---

## 4. Manuell sikkerhetsgjennomgang

### ✅ Autentisering — God praksis
- Supabase Auth håndterer all autentisering (ikke egenutviklet)
- JWT-tokens verifiseres server-side i `/api/profile`-endepunktet
- Ingen passord lagres i kodebasen
- Magic links og e-post/passord-innlogging er tilgjengelig

### ✅ Betalingsflyt — Sikker arkitektur
- Stripe Payment Links brukes (høyere sikkerhet enn egenutviklet betalingsintegrasjon)
- Webhook-signaturer verifiseres med `stripe.webhooks.constructEvent()` og `STRIPE_WEBHOOK_SECRET`
- Ingen kortdata berøres av applikasjonen (PCI-samsvar ivaretas av Stripe)
- Tilgangstildeling skjer server-side via Service Role Key — ikke klient-side

### ✅ Database — Row Level Security (RLS) aktivert
- Supabase RLS sikrer at brukere kun kan lese/skrive egne data
- `user_progress`: brukere kan kun endre egne fremdriftsrader
- `profiles`: kun eier kan lese/oppdatere sin profil
- `SUPABASE_SERVICE_ROLE_KEY` brukes kun i backend-kode, aldri eksponert til nettleser

### ✅ Miljøvariabler — Korrekt håndtert
- Alle hemmeligheter lagres i miljøvariabler (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`)
- Ingen hemmeligheter er hardkodet i kodebasen
- Frontend-variabler (`VITE_*`) inneholder kun offentlig informasjon (URL-er, anon key)

### ✅ Videoinnhold — IP-beskyttelse implementert
- Høyreklikk deaktivert på videospiller
- Halvtransparent vannmerke («Skriv Akademisk™») i alle videoer
- Videoer serveres via ekstern tredjepart (beskyttet av referrer-policy)

### ✅ Innholdssikring
- `noindex, nofollow` i meta-robots hindrer søkemotorindeksering av kursinnhold
- Alle kursruter krever autentisering + betalt tilgang
- Admin-siden krever `isAdmin: true` i profilen

### ⚠️ Anbefalt fremtidig tiltak — Rate limiting
Webhook-endepunktet og API-endepunktet har ikke eksplisitt rate limiting implementert. For videre produksjonsharding anbefales:
```javascript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({ windowMs: 60 * 1000, max: 30 });
app.use('/api/', limiter);
```

### ⚠️ Anbefalt fremtidig tiltak — CSP-header
Content Security Policy er ikke konfigurert. For maksimal XSS-beskyttelse:
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; frame-src 'self' *.vimeo.com; script-src 'self' 'unsafe-inline'");
  next();
});
```

---

## 5. Oppsummert tiltaksplan

| Prioritet | Tiltak | Innsats |
|---|---|---|
| Høy (vedlikehold) | Oppdater `path-to-regexp` til 8.4.0 | 5 min |
| Middels | Masker e-poster i serverlogger | 30 min |
| Lav | Legg til rate limiting på API-endepunkter | 1 time |
| Lav | Konfigurer CSP-header | 1 time |
| Lav | Oppdater `brace-expansion` og `picomatch` | 5 min |

---

*Rapporten er generert automatisk og manuelt gjennomgått. Ingen kritiske sårbarheter ble identifisert. Portalen anses som sikker for produksjonsbruk per 29. mars 2026.*

---

**Skriv Akademisk AS** · org.nr. 930 906 107 · kontakt@skrivakademisk.no
