import type { APIRoute } from 'astro';
import { EmailService } from '../../lib/emailService';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🔧 Test debug email - Vérification configuration...');
    
    // Vérifier les variables d'environnement
    const resendApiKey = process.env.RESEND_API_KEY;
    console.log('RESEND_API_KEY présente:', !!resendApiKey);
    console.log('RESEND_API_KEY (début):', resendApiKey?.substring(0, 10) + '...');

    if (!resendApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'RESEND_API_KEY manquante',
        debug: {
          env: process.env.NODE_ENV,
          keys: Object.keys(process.env).filter(k => k.includes('RESEND'))
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Données de test réalistes
    const testData = {
      id: 'debug-test-' + Date.now(),
      firstName: 'Test',
      lastName: 'Debug',
      email: 'hello@poppymusic.fr', // Votre email pour recevoir le test
      songTitle: 'Test Email Debug',
      targetFirstName: 'Marie',
      targetLastName: 'Dupont',
      targetRelation: 'ma sœur',
      purposeTag: 'Test',
      amountPaid: 50000,
      stripeSessionId: 'debug_session_' + Date.now()
    };

    console.log('📧 Envoi email de test avec les données:', testData);

    // Test envoi email client
    const clientResult = await EmailService.sendPaymentConfirmation(testData);
    console.log('Résultat email client:', clientResult);

    // Test notification équipe
    const teamResult = await EmailService.sendTeamNotification(testData);
    console.log('Résultat notification équipe:', teamResult);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Tests emails exécutés',
      results: {
        client: clientResult,
        team: teamResult
      },
      debug: {
        resendConfigured: !!resendApiKey,
        testData: testData
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Erreur debug email:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
