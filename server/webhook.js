import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import rateLimit from 'express-rate-limit';
import { sendWelcomeEmail } from './email.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

function maskEmail(email) {
  if (!email) return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return local.slice(0, 3) + '***@' + domain;
}

// Rate limiting — 30 forespørsler per minutt per IP (kun /api/-ruter)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'For mange forespørsler. Prøv igjen om litt.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com https://share.synthesia.io https://*.vimeo.com https://*.stripe.com",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com",
    "media-src 'self' https:",
  ].join('; '));
  next();
});

// Ekstra sikkerhetsheaders
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_LIVE_KEY;
if (!stripeKey) console.error('FEIL: Ingen Stripe-nøkkel funnet (STRIPE_SECRET_KEY eller STRIPE_LIVE_KEY)');
const stripe = new Stripe(stripeKey);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Stripe source IP ranges (updated periodically — check https://stripe.com/files/ips/ips_webhooks.txt)
const STRIPE_IP_RANGES = [
  '3.18.12.63', '3.130.192.231', '13.235.14.237', '13.235.122.149',
  '18.211.135.69', '35.154.171.200', '52.15.183.38', '54.187.174.169',
  '54.187.205.235', '54.187.216.72', '54.241.31.99', '54.241.31.102',
  '54.241.34.107',
];

app.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);

  let incomingEvent;

  if (webhookSecret && sig) {
    try {
      incomingEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log('✓ Webhook verifisert via signatur:', incomingEvent.type);
    } catch (err) {
      console.warn('Signaturverifisering feilet:', err.message);
    }
  }

  // If signature verification failed but secret is configured → reject (not from Stripe)
  if (!incomingEvent && webhookSecret) {
    console.error('Avvist: signaturverifisering feilet og webhook-secret er konfigurert');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // No webhook secret configured (dev/migration mode) — parse but log warning
  if (!incomingEvent) {
    try {
      const parsed = JSON.parse(rawBody.toString());
      if (!parsed.id || !parsed.type) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
      incomingEvent = parsed;
      console.warn('ADVARSEL: Webhook mottatt uten signaturverifisering (sett STRIPE_WEBHOOK_SECRET i produksjon)');
    } catch (err) {
      console.error('Kunne ikke parse webhook-body:', err.message);
      return res.status(400).json({ error: 'Invalid body' });
    }
  }

  res.json({ received: true });

  if (
    incomingEvent.type === 'checkout.session.completed' ||
    incomingEvent.type === 'payment_intent.succeeded'
  ) {
    const obj = incomingEvent.data.object;
    const email =
      obj.customer_details?.email ||
      obj.customer_email ||
      obj.receipt_email ||
      obj.metadata?.email ||
      null;

    // Hvilket kurs ble kjøpt? Leses fra metadata satt på Payment Link i Stripe.
    // Mangler metadata (eldre lenker) → fall tilbake til det opprinnelige kurset.
    const courseId = obj.metadata?.course_id || 'akademisk';

    if (email) {
      console.log(`Betaling bekreftet for: ${maskEmail(email)} (kurs: ${courseId})`);
      await grantAccess(email.toLowerCase(), courseId);
    } else {
      console.warn('Ingen e-post i event — sjekk Stripe-innstillinger');
    }
  }
});

async function grantAccess(email, courseId = 'akademisk') {
  // Finn brukeren via e-post
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Kunne ikke hente brukerliste:', error.message);
    return;
  }

  const match = data.users.find(u => u.email?.toLowerCase() === email);
  if (!match) {
    console.warn(`Ingen bruker funnet for: ${maskEmail(email)} (kurs: ${courseId}) — aktiver manuelt i admin-panelet`);
    return;
  }

  // ── 1. Skriv til course_access (ny felles tilgangstabell) ──────────────────
  // upsert: gjør ingenting hvis raden allerede finnes (ved duplikat-event fra Stripe)
  const { error: accessErr } = await supabase
    .from('course_access')
    .upsert({ user_id: match.id, course_id: courseId }, { onConflict: 'user_id,course_id' });

  if (accessErr) {
    console.error(`Feil ved skriving til course_access (${courseId}):`, accessErr.message);
    // Ikke return — fortsett til bakoverkompatibilitet under
  } else {
    console.log(`✓ course_access satt: ${maskEmail(email)} → ${courseId}`);
  }

  // ── 2. Bakoverkompatibilitet: set has_paid_access for det opprinnelige kurset ──
  // Eksisterende kode i frontend og admin-panel leser fremdeles has_paid_access.
  // Når frontend er migrert til å bruke course_access kan dette fjernes.
  if (courseId === 'akademisk') {
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({ id: match.id, has_paid_access: true }, { onConflict: 'id' });

    if (profileErr) {
      console.error('Feil ved oppdatering av profiles.has_paid_access:', profileErr.message);
    } else {
      console.log(`✓ profiles.has_paid_access satt for ${maskEmail(email)}`);
    }
  }

  // ── 3. Hent navn og send velkomst-e-post ──────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', match.id)
    .single();

  await sendWelcomeEmail(email, profile?.full_name || null, courseId);
}

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

// Secure profile endpoint — verifies JWT via Supabase before returning data
app.get('/api/profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice(7);
  try {
    // Verify token cryptographically via Supabase — rejects forged tokens
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, has_paid_access, is_admin')
      .eq('id', user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Profile not found' });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{*path}', (_req, res) => res.sendFile(join(distPath, 'index.html')));
  console.log('Serverer statiske filer fra dist/');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server kjører på port ${PORT}`);
});
