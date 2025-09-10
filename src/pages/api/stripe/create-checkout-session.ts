import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vérifier que les variables d'environnement Stripe sont définies
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY non définie');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Configuration Stripe manquante - Variables d\'environnement non définies',
        details: 'STRIPE_SECRET_KEY requis'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.error('❌ STRIPE_PRICE_ID non définie');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Configuration Stripe manquante - STRIPE_PRICE_ID requis'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialiser Stripe avec la clé secrète
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const { briefId, sessionId } = await request.json();

    if (!briefId && !sessionId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brief ID ou Session ID requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Price ID de votre produit 199€
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NODE_ENV === 'production' ? 'https://poppymusic.fr' : 'http://localhost:4321'}/confirmation?session_id={CHECKOUT_SESSION_ID}&brief_id=${briefId}`,
      cancel_url: `${process.env.NODE_ENV === 'production' ? 'https://poppymusic.fr' : 'http://localhost:4321'}/payment?briefId=${briefId}&sessionId=${sessionId}`,
      metadata: {
        briefId: briefId || '',
        sessionId: sessionId || '',
        source: 'poppymusic_brief'
      },
      customer_email: undefined, // Sera récupéré depuis le brief
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return new Response(JSON.stringify({ 
      success: true, 
      sessionId: session.id,
      url: session.url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur création session Stripe:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Erreur lors de la création de la session de paiement',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
