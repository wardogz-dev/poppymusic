import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export const GET: APIRoute = async ({ url }) => {
  try {
    const sessionId = url.searchParams.get('session_id');
    const paymentIntentId = url.searchParams.get('payment_intent_id');

    if (!sessionId && !paymentIntentId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Session ID ou Payment Intent ID requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let paymentStatus = 'unknown';
    let paymentDetails = null;

    if (sessionId) {
      // Récupérer les détails de la session
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent']
      });

      paymentStatus = session.payment_status;
      paymentDetails = {
        id: session.id,
        payment_intent: session.payment_intent,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        status: session.status
      };
    } else if (paymentIntentId) {
      // Récupérer les détails du Payment Intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      paymentStatus = paymentIntent.status;
      paymentDetails = {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      paid: paymentStatus === 'paid',
      paymentStatus,
      paymentDetails
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Erreur lors de la vérification du paiement',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
