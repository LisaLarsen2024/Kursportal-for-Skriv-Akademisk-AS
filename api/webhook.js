import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_LIVE_KEY);
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function maskEmail(email) {
  if (!email) return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return local.slice(0, 3) + '***@' + domain;
}

const COURSE_CONTENT = {
  akademisk: {
    subject: 'Velkommen til kurset, {{navn}}! 🎓 Her er din plan',
    title: 'Du har nå tilgang til alle 23 leksjoner.',
    courseTitle: '«Skriv bachelor- og masteroppgave»',
    description: 'Start med Modul 1 — Oppgavestruktur. Den legger grunnlaget for alt som kommer. Sett av 20 minutter om gangen — én leksjon er ett steg nærmere innlevering.',
    bullets: [
      'Du har nå tilgang til alle 23 leksjoner',
      '4 moduler: struktur, kildekritikk, APA 7 og akademisk skrivestil',
      'Nedlastbare sjekklister og maler (.docx)',
      'Se leksjonene i ditt eget tempo — så mange ganger du vil',
    ],
    ctaUrl: 'https://kurs.skrivakademisk.no',
    ctaText: 'Åpne kurset →',
  },
  'norsk-vg3': {
    subject: 'Velkommen — kursplassen din er klar! 📝',
    title: 'Du er klar til eksamen.',
    courseTitle: '«Norsk eksamen VG3»',
    description: 'Kurset dekker alt du trenger til norskeksamen — fra sjangerkunnskap og tekstanalyse til skriveteknikk og eksamensstrategi. Fem moduler med tydelige gjennomganger du kan se i eget tempo.',
    bullets: [
      '5 moduler med én video per modul',
      'Nedlastbare hjelpedokumenter',
      'Tydelig struktur tilpasset eksamen',
      'Tilgang for alltid',
    ],
    ctaUrl: 'https://kurs.skrivakademisk.no',
    ctaText: 'Gå til kurset →',
  },
};

async function sendWelcomeEmail(email, fullName, courseId = 'akademisk') {
  const firstName = fullName ? fullName.split(' ')[0] : null;
  const greeting = firstName ? `Hei ${firstName}!` : 'Hei!';
  const content = COURSE_CONTENT[courseId] ?? COURSE_CONTENT['akademisk'];
  const subject = content.subject.replace('{{navn}}', firstName || 'deg');

  const { data, error } = await resend.emails.send({
    from: 'Skriv Akademisk <kontakt@skrivakademisk.no>',
    replyTo: 'kontakt@skrivakademisk.no',
    to: email,
    subject,
    html: `<!DOCTYPE html>
<html lang="nb">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
        <tr><td style="background-color:#2C6E6A;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
          <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#A8D5D1;">SKRIV AKADEMISK</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">${content.title}</h1>
        </td></tr>
        <tr><td style="background-color:#ffffff;padding:40px 40px 32px 40px;border-left:1px solid #E8E4DE;border-right:1px solid #E8E4DE;">
          <p style="margin:0 0 20px 0;font-size:17px;color:#1a1a1a;line-height:1.6;">${greeting}</p>
          <p style="margin:0 0 20px 0;font-size:16px;color:#333333;line-height:1.7;">Tusen takk for at du har kjøpt kurset <strong>${content.courseTitle}</strong>. Betalingen er bekreftet, og tilgangen din er nå aktivert.</p>
          <p style="margin:0 0 28px 0;font-size:16px;color:#333333;line-height:1.7;">${content.description}</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 36px 0;"><tr><td style="background-color:#2C6E6A;border-radius:8px;">
            <a href="${content.ctaUrl}" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;">${content.ctaText}</a>
          </td></tr></table>
          <hr style="border:none;border-top:1px solid #E8E4DE;margin:0 0 32px 0;" />
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FAF9;border-radius:8px;border:1px solid #C2E0DE;margin:0 0 32px 0;"><tr><td style="padding:28px;">
            <p style="margin:0 0 6px 0;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#2C6E6A;">🎁 INKLUDERT I KJØPET DITT</p>
            <p style="margin:0 0 12px 0;font-size:17px;font-weight:700;color:#1a1a1a;">1 måned gratis tilgang til Skriv Akademisk-appen</p>
            <p style="margin:0 0 20px 0;font-size:15px;color:#333333;line-height:1.6;">Som kurskunde får du 1 måned gratis på <strong>Skriv Akademisk-appen</strong> — verktøyet som gir deg konkrete forbedringsforslag på drøfting, metode, struktur og APA 7.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;"><tr><td style="background-color:#ffffff;border:2px dashed #2C6E6A;border-radius:8px;padding:16px 20px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#888888;">Din rabattkode</p>
              <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:4px;color:#2C6E6A;font-family:monospace;">KURS1MND</p>
            </td></tr></table>
            <p style="margin:0 0 16px 0;font-size:14px;color:#666666;line-height:1.5;">Gå til appen → velg abonnement → lim inn koden i rabattfeltet ved betaling.</p>
            <table cellpadding="0" cellspacing="0"><tr><td style="background-color:#2C6E6A;border-radius:6px;">
              <a href="https://app.skrivakademisk.no" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">Aktiver gratismåneden →</a>
            </td></tr></table>
          </td></tr></table>
          <p style="margin:0 0 14px 0;font-size:15px;font-weight:600;color:#1a1a1a;">Kurset inneholder:</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${content.bullets.map(b => `<tr><td style="padding:5px 0;font-size:15px;color:#333333;">✓&nbsp;&nbsp;${b}</td></tr>`).join('\n            ')}
          </table>
        </td></tr>
        <tr><td style="background-color:#F5F2EE;border-radius:0 0 12px 12px;border:1px solid #E8E4DE;border-top:none;padding:24px 40px;text-align:center;">
          <p style="margin:0 0 6px 0;font-size:13px;color:#888888;line-height:1.6;">Spørsmål? Svar på denne e-posten, så hjelper vi deg.</p>
          <p style="margin:0;font-size:12px;color:#aaaaaa;">Skriv Akademisk AS · kurs.skrivakademisk.no</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
  });

  if (error) {
    console.error('Feil ved sending av velkomstmail:', error);
    return false;
  }
  console.log(`Velkomstmail sendt til ${maskEmail(email)}`);
  return true;
}

async function grantAccess(email, courseId = 'akademisk') {
  const url = process.env.VITE_SUPABASE_URL || '';
  const keyPrefix = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').slice(0, 20);
  console.log(`Supabase URL: ${url} | key starter med: ${keyPrefix}...`);
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) { console.error('Kunne ikke hente brukerliste:', error.message); return; }

  console.log(`listUsers returnerte ${data.users?.length ?? 0} brukere, leter etter ${maskEmail(email)}`);
  const match = data.users.find(u => u.email?.toLowerCase() === email);
  if (!match) {
    console.warn(`Ingen bruker funnet for: ${maskEmail(email)}. Eksisterende: ${data.users.map(u => maskEmail(u.email)).join(', ')}`);
    return;
  }

  const { error: accessErr } = await supabase
    .from('course_access')
    .upsert({ user_id: match.id, course_id: courseId }, { onConflict: 'user_id,course_id' });

  if (accessErr) console.error(`Feil course_access:`, accessErr.message);
  else console.log(`course_access satt: ${maskEmail(email)} → ${courseId}`);

  if (courseId === 'akademisk') {
    const { error: profileErr } = await supabase
      .from('profiles')
      .upsert({ id: match.id, has_paid_access: true }, { onConflict: 'id' });
    if (profileErr) console.error('Feil profiles:', profileErr.message);
  }

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', match.id).single();
  await sendWelcomeEmail(email, profile?.full_name || null, courseId);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const obj = event.data.object;
    const email = obj.customer_details?.email || obj.customer_email || obj.receipt_email || obj.metadata?.email || null;
    const courseId = obj.metadata?.course_id || 'akademisk';

    if (email) {
      console.log(`Betaling bekreftet for: ${maskEmail(email)} (kurs: ${courseId})`);
      await grantAccess(email.toLowerCase(), courseId);
    }
  }

  res.json({ received: true });
}

export const config = {
  api: { bodyParser: false },
};
