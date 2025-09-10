import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { EmailService } from '../../lib/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const supabase = createClient(
  'https://ntvnhcpkzpovqgcaiawx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw'
);

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Signature manquante', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Erreur signature webhook:', err);
    return new Response('Signature invalide', { status: 400 });
  }

  try {
    // Gérer les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Erreur traitement webhook:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
};

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const briefId = session.metadata?.briefId;
  const sessionIdBrief = session.metadata?.sessionId;

  if (!briefId && !sessionIdBrief) {
    console.error('Métadonnées manquantes dans la session Stripe');
    return;
  }

  try {
    // Mettre à jour le brief comme payé
    const updateData = {
      is_paid: true,
      payment_intent_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
      stripe_customer_email: session.customer_details?.email,
      amount_paid: session.amount_total,
      currency: session.currency
    };

    let query = supabase.from('client_briefs_steps').update(updateData);

    if (briefId) {
      query = query.eq('id', briefId);
    } else {
      query = query.eq('session_id', sessionIdBrief);
    }

    const { error } = await query;

    if (error) {
      console.error('Erreur mise à jour brief après paiement:', error);
    } else {
      console.log('✅ Brief marqué comme payé:', briefId || sessionIdBrief);
      
      // Récupérer les données du brief pour l'email
      const { data: briefDetails, error: briefError } = await supabase
        .from('client_briefs_steps')
        .select('*')
        .eq(briefId ? 'id' : 'session_id', briefId || sessionIdBrief)
        .single();

      if (!briefError && briefDetails) {
        // Envoyer email de confirmation au client
        const emailResult = await EmailService.sendPaymentConfirmation({
          id: briefDetails.id,
          firstName: briefDetails.first_name,
          lastName: briefDetails.last_name,
          email: briefDetails.email,
          songTitle: briefDetails.song_title,
          targetFirstName: briefDetails.target_first_name,
          targetLastName: briefDetails.target_last_name,
          targetRelation: briefDetails.target_relation,
          purposeTag: briefDetails.purpose_tag,
          amountPaid: session.amount_total,
          stripeSessionId: session.id
        });

        if (emailResult.success) {
          console.log('✅ Email confirmation envoyé au client');
        } else {
          console.error('❌ Erreur email client:', emailResult.error);
        }

        // Notifier l'équipe
        const teamNotification = await EmailService.sendTeamNotification({
          id: briefDetails.id,
          firstName: briefDetails.first_name,
          lastName: briefDetails.last_name,
          email: briefDetails.email,
          songTitle: briefDetails.song_title,
          targetFirstName: briefDetails.target_first_name,
          targetLastName: briefDetails.target_last_name,
          targetRelation: briefDetails.target_relation,
          purposeTag: briefDetails.purpose_tag,
          amountPaid: session.amount_total,
          stripeSessionId: session.id
        });

        if (teamNotification.success) {
          console.log('✅ Notification équipe envoyée');
        } else {
          console.error('❌ Erreur notification équipe:', teamNotification.error);
        }
      }
    }
  } catch (error) {
    console.error('Erreur handleCheckoutCompleted:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Paiement réussi:', paymentIntent.id);
  
  // Optionnel: Actions supplémentaires après paiement réussi
  // Par exemple : déclencher la production, envoyer des notifications
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Paiement échoué:', paymentIntent.id);
  
  // Optionnel: Gérer les échecs de paiement
  // Par exemple : notifier l'utilisateur, marquer le brief comme non payé
}
