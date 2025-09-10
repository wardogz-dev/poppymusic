import { Resend } from 'resend';

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export interface BriefData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  songTitle?: string;
  targetFirstName?: string;
  targetLastName?: string;
  targetRelation?: string;
  purposeTag?: string;
  amountPaid?: number;
  stripeSessionId?: string;
}

export class EmailService {
  static async sendPaymentConfirmation(briefData: BriefData) {
    try {
      // Vérifier que Resend est configuré
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY non définie');
        return { success: false, error: 'Configuration email manquante' };
      }

      const targetName = briefData.targetFirstName && briefData.targetLastName 
        ? `${briefData.targetFirstName} ${briefData.targetLastName}`
        : 'votre proche';

      const songTitle = briefData.songTitle || 'votre chanson personnalisée';
      const amountFormatted = briefData.amountPaid 
        ? `${(briefData.amountPaid / 100).toFixed(0)}€`
        : '199€';

      const emailHtml = this.generateConfirmationEmailHtml({
        clientName: `${briefData.firstName} ${briefData.lastName}`,
        songTitle,
        targetName,
        targetRelation: briefData.targetRelation || 'cette personne',
        purposeTag: briefData.purposeTag || 'projet personnel',
        amountPaid: amountFormatted,
        briefId: briefData.id
      });

      console.log('📧 Tentative d\'envoi email à:', briefData.email);
      console.log('📧 Données brief:', {
        id: briefData.id,
        firstName: briefData.firstName,
        lastName: briefData.lastName,
        songTitle: briefData.songTitle
      });

      const { data, error } = await resend.emails.send({
        from: 'Poppy Music <hello@poppymusic.fr>', // Utiliser votre domaine vérifié
        to: [briefData.email],
        subject: `🎵 Confirmation de commande - ${songTitle}`,
        html: emailHtml,
        headers: {
          'X-Entity-Ref-ID': briefData.stripeSessionId || briefData.id,
        },
      });

      if (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Email de confirmation envoyé:', data?.id);
      return { success: true, emailId: data?.id };

    } catch (error) {
      console.error('❌ Erreur EmailService:', error);
      return { success: false, error: error.message };
    }
  }

  private static generateConfirmationEmailHtml(data: {
    clientName: string;
    songTitle: string;
    targetName: string;
    targetRelation: string;
    purposeTag: string;
    amountPaid: string;
    briefId: string;
  }) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande - Poppy Music</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0B0B; color: #ffffff;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #c76927, #a85520); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #000000;">
                🎵 Poppy Music
            </h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #000000; opacity: 0.8;">
                Votre message en musique
            </p>
        </div>

        <!-- Contenu principal -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #c76927; font-size: 24px; margin-bottom: 20px;">
                🎉 Commande confirmée !
            </h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #e5e5e5;">
                Bonjour <strong>${data.clientName}</strong>,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #e5e5e5;">
                Merci pour votre confiance ! Votre commande a été confirmée et notre équipe va commencer 
                la création de <strong style="color: #c76927;">${data.songTitle}</strong> 
                pour <strong>${data.targetName}</strong> (${data.targetRelation}).
            </p>

            <!-- Détails de la commande -->
            <div style="background-color: #2a2a2a; border-radius: 8px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #c76927; margin: 0 0 15px; font-size: 18px;">
                    📋 Détails de votre commande
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #b0b0b0;">Projet :</td>
                        <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">${data.songTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #b0b0b0;">Destinataire :</td>
                        <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">${data.targetName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #b0b0b0;">Catégorie :</td>
                        <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">${data.purposeTag}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #b0b0b0;">Montant payé :</td>
                        <td style="padding: 8px 0; color: #c76927; font-weight: bold; font-size: 18px;">${data.amountPaid}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #b0b0b0;">Référence :</td>
                        <td style="padding: 8px 0; color: #888; font-family: monospace; font-size: 12px;">${data.briefId}</td>
                    </tr>
                </table>
            </div>

            <!-- Prochaines étapes -->
            <div style="background-color: #1e3a8a; background: linear-gradient(135deg, #1e3a8a, #3730a3); border-radius: 8px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #ffffff; margin: 0 0 15px; font-size: 18px;">
                    ⏰ Prochaines étapes
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #e5e5e5;">
                    <li style="margin-bottom: 8px;">
                        <strong>48h :</strong> Validation du concept et des paroles
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>5 jours :</strong> Composition et arrangement
                    </li>
                    <li style="margin-bottom: 8px;">
                        <strong>7 jours :</strong> Livraison de votre chanson finale
                    </li>
                </ul>
            </div>

            <!-- Contact -->
            <div style="text-align: center; margin-top: 40px;">
                <p style="color: #b0b0b0; margin-bottom: 20px;">
                    Une question ? Notre équipe est là pour vous accompagner.
                </p>
                <a href="mailto:hello@poppymusic.fr" 
                   style="display: inline-block; background-color: #c76927; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Nous contacter
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="margin: 0; color: #666; font-size: 14px;">
                © 2025 Wardogz - Poppy Music. Tous droits réservés.
            </p>
            <p style="margin: 10px 0 0; color: #666; font-size: 12px;">
                73 boulevard Victor Hugo, 92200 Neuilly-sur-Seine
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  static async sendTeamNotification(briefData: BriefData) {
    try {
      if (!process.env.RESEND_API_KEY) {
        return { success: false, error: 'Configuration email manquante' };
      }

      const targetName = briefData.targetFirstName && briefData.targetLastName 
        ? `${briefData.targetFirstName} ${briefData.targetLastName}`
        : 'Non spécifié';

      console.log('📧 Envoi notification équipe pour:', briefData.id);

      const { data, error } = await resend.emails.send({
        from: 'Poppy Music <hello@poppymusic.fr>', // Utiliser votre domaine vérifié
        to: ['hello@poppymusic.fr'], // Email de l'équipe
        subject: `🔔 Nouvelle commande payée - ${briefData.firstName} ${briefData.lastName}`,
        html: `
          <h2>💰 Nouvelle commande confirmée !</h2>
          <p><strong>Client :</strong> ${briefData.firstName} ${briefData.lastName} (${briefData.email})</p>
          <p><strong>Chanson :</strong> ${briefData.songTitle || 'Sans titre'}</p>
          <p><strong>Pour :</strong> ${targetName} (${briefData.targetRelation || 'N/A'})</p>
          <p><strong>Catégorie :</strong> ${briefData.purposeTag || 'N/A'}</p>
          <p><strong>Montant :</strong> ${briefData.amountPaid ? (briefData.amountPaid / 100).toFixed(0) + '€' : '199€'}</p>
          <p><strong>Référence :</strong> ${briefData.id}</p>
          
          <p style="margin-top: 20px;">
            <a href="https://poppymusic.fr/admin/brief-detail?id=${briefData.id}" 
               style="background: #c76927; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Voir le brief complet
            </a>
          </p>
        `,
      });

      if (error) {
        console.error('❌ Erreur notification équipe:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Notification équipe envoyée:', data?.id);
      return { success: true, emailId: data?.id };

    } catch (error) {
      console.error('❌ Erreur notification équipe:', error);
      return { success: false, error: error.message };
    }
  }
}
