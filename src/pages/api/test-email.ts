import type { APIRoute } from 'astro';
import { EmailService } from '../../lib/emailService';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vérifier que Resend est configuré
    if (!process.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'RESEND_API_KEY non configurée' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { briefId, testType } = await request.json();

    if (!briefId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brief ID requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Données de test
    const testBriefData = {
      id: briefId,
      firstName: 'Test',
      lastName: 'User',
      email: 'hello@poppymusic.fr', // Envoyer à l'équipe pour test
      songTitle: 'Ma Chanson de Test',
      targetFirstName: 'Marie',
      targetLastName: 'Dupont',
      targetRelation: 'ma sœur',
      purposeTag: 'Anniversaire',
      amountPaid: 50000, // 500€ en centimes
      stripeSessionId: 'cs_test_' + Date.now()
    };

    let result;
    if (testType === 'team') {
      result = await EmailService.sendTeamNotification(testBriefData);
    } else {
      result = await EmailService.sendPaymentConfirmation(testBriefData);
    }

    return new Response(JSON.stringify({ 
      success: result.success,
      message: result.success ? 'Email envoyé avec succès' : 'Erreur envoi email',
      emailId: result.emailId,
      error: result.error
    }), {
      status: result.success ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur test email:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Erreur lors du test d\'email',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
