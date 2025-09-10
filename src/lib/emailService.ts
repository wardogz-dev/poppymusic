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
        subject: `Confirmation de commande - ${songTitle}`,
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
    <title>Accusé de réception - Poppy Music</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: bold; margin: 0; letter-spacing: -1px; }
        .tagline { font-size: 16px; opacity: 0.9; margin: 8px 0 0; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .greeting { font-size: 18px; margin-bottom: 30px; }
        .confirmation-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0; }
        .confirmation-title { color: #667eea; font-size: 20px; font-weight: bold; margin: 0 0 15px; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table td { padding: 12px 0; border-bottom: 1px solid #e9ecef; }
        .details-label { font-weight: 600; color: #666; width: 140px; }
        .details-value { color: #333; }
        .timeline { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; margin: 30px 0; border-radius: 8px; }
        .timeline-title { font-size: 18px; font-weight: bold; margin: 0 0 15px; }
        .timeline-item { margin-bottom: 10px; display: flex; align-items: center; }
        .timeline-icon { width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 12px; }
        .contact-section { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e9ecef; }
        .contact-text { color: #666; margin-bottom: 20px; font-size: 16px; }
        .contact-button { display: inline-block; background-color: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: background-color 0.3s; }
        .contact-button:hover { background-color: #5a67d8; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer-text { color: #666; font-size: 14px; margin: 0; }
        .footer-address { color: #999; font-size: 12px; margin: 8px 0 0; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">Poppy Music</h1>
            <p class="tagline">Votre message en musique</p>
        </div>

        <!-- Contenu principal -->
        <div class="content">
            <p class="greeting">Bonjour ${data.clientName},</p>

            <p>Nous avons bien reçu votre commande et nous vous en remercions. Votre paiement de ${data.amountPaid} a été traité avec succès.</p>

            <!-- Accusé de réception -->
            <div class="confirmation-box">
                <h2 class="confirmation-title">Accusé de réception</h2>
                <p>Votre commande pour <strong>"${data.songTitle}"</strong> a été enregistrée sous la référence <strong>${data.briefId}</strong>.</p>

                <table class="details-table">
                    <tr>
                        <td class="details-label">Chanson personnalisée :</td>
                        <td class="details-value">${data.songTitle}</td>
                    </tr>
                    <tr>
                        <td class="details-label">Destinataire :</td>
                        <td class="details-value">${data.targetName} (${data.targetRelation})</td>
                    </tr>
                    <tr>
                        <td class="details-label">Catégorie :</td>
                        <td class="details-value">${data.purposeTag}</td>
                    </tr>
                    <tr>
                        <td class="details-label">Montant :</td>
                        <td class="details-value"><strong>${data.amountPaid}</strong></td>
                    </tr>
                </table>
            </div>

            <!-- Prochaines étapes -->
            <div class="timeline">
                <h3 class="timeline-title">Prochaines étapes</h3>
                <div class="timeline-item">
                    <span class="timeline-icon">1</span>
                    <strong>48h :</strong> Validation du concept et des paroles
                </div>
                <div class="timeline-item">
                    <span class="timeline-icon">2</span>
                    <strong>5 jours :</strong> Composition et arrangement musical
                </div>
                <div class="timeline-item">
                    <span class="timeline-icon">3</span>
                    <strong>7 jours :</strong> Livraison de votre chanson finale
                </div>
            </div>

            <p>Notre équipe va commencer immédiatement le travail sur votre projet. Vous recevrez des mises à jour régulières sur l'avancement de votre chanson personnalisée.</p>

            <!-- Contact -->
            <div class="contact-section">
                <p class="contact-text">Des questions ? N'hésitez pas à nous contacter</p>
                <a href="mailto:hello@poppymusic.fr" class="contact-button">
                    Nous contacter
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">© 2025 Poppy Music. Tous droits réservés.</p>
            <p class="footer-address">73 boulevard Victor Hugo, 92200 Neuilly-sur-Seine</p>
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
