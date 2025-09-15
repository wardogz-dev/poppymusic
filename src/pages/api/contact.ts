import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vérifier que Resend est configuré
    if (!process.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Configuration email manquante' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { firstName, lastName, phone, message } = await request.json();

    // Validation des données
    if (!firstName || !lastName || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Prénom, nom et message sont obligatoires' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📧 Nouveau message de contact:', { firstName, lastName, phone });

    // Envoyer l'email à l'équipe
    const { data, error } = await resend.emails.send({
      from: 'Poppy Music <hello@poppymusic.fr>',
      to: ['hello@poppymusic.fr'],
      subject: `💬 Nouveau message de contact - ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouveau message de contact - Poppy Music</title>
            <style>
                body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                .header { background: linear-gradient(135deg, #c76927 0%, #a85520 100%); padding: 40px 30px; text-align: center; color: white; }
                .logo { font-size: 28px; font-weight: bold; margin: 0; letter-spacing: -1px; }
                .tagline { font-size: 16px; opacity: 0.9; margin: 8px 0 0; }
                .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
                .contact-box { background-color: #f8f9fa; border-left: 4px solid #c76927; padding: 25px; margin: 30px 0; }
                .contact-title { color: #c76927; font-size: 20px; font-weight: bold; margin: 0 0 15px; }
                .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .details-table td { padding: 12px 0; border-bottom: 1px solid #e9ecef; }
                .details-label { font-weight: 600; color: #666; width: 140px; }
                .details-value { color: #333; }
                .message-box { background-color: #fff; border: 1px solid #e9ecef; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
                .footer-text { color: #666; font-size: 14px; margin: 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <h1 class="logo">Poppy Music</h1>
                    <p class="tagline">Nouveau message de contact</p>
                </div>

                <!-- Contenu principal -->
                <div class="content">
                    <h2>💬 Nouveau message de contact</h2>

                    <!-- Informations du contact -->
                    <div class="contact-box">
                        <h3 class="contact-title">Informations du contact</h3>
                        
                        <table class="details-table">
                            <tr>
                                <td class="details-label">Nom complet :</td>
                                <td class="details-value"><strong>${firstName} ${lastName}</strong></td>
                            </tr>
                            ${phone ? `
                            <tr>
                                <td class="details-label">Téléphone :</td>
                                <td class="details-value">${phone}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td class="details-label">Date :</td>
                                <td class="details-value">${new Date().toLocaleDateString('fr-FR', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Message -->
                    <div class="message-box">
                        <h4 style="color: #c76927; margin: 0 0 15px;">Message :</h4>
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>

                    <p style="color: #666; font-style: italic;">
                        Répondez directement à cet email ou contactez ${firstName} ${lastName}${phone ? ` au ${phone}` : ''}.
                    </p>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">© 2025 Poppy Music. Tous droits réservés.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Erreur envoi email contact:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Erreur lors de l\'envoi du message' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Email de contact envoyé:', data?.id);
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message envoyé avec succès',
      emailId: data?.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Erreur API contact:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Erreur serveur lors de l\'envoi du message' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
