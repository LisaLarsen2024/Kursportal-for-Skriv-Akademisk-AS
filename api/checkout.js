import Stripe from 'stripe';
import { getCourse } from './_courses.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_LIVE_KEY);

const SITE_URL = 'https://kurs.skrivakademisk.no';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { courseId, email } = req.body ?? {};

  const course = getCourse(courseId);
  if (!course) {
    return res.status(400).json({ error: 'Ukjent kurs' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: course.currency,
            unit_amount: course.amount,
            product_data: {
              name: course.name,
              description: course.description,
            },
          },
        },
      ],
      metadata: {
        course_id: courseId,
      },
      success_url: `${SITE_URL}/betaling/suksess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/betaling`,
      locale: 'nb',
      allow_promotion_codes: false,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout session creation failed:', err.message);
    return res.status(500).json({ error: 'Kunne ikke opprette betalingsside' });
  }
}
