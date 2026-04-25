import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const getUserId = (obj: { metadata?: Stripe.Metadata | null }) =>
    obj.metadata?.supabase_user_id ?? null;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = getUserId(session);
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          subscription_status: 'trialing',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        });
      }
      break;
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = getUserId(sub);
      if (userId) {
        await supabase.from('profiles').update({ subscription_status: sub.status }).eq('id', userId);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = getUserId(sub);
      if (userId) {
        await supabase.from('profiles').update({ subscription_status: 'canceled' }).eq('id', userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
