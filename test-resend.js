#!/usr/bin/env node

/**
 * Script de test CLI pour valider l'intégration Resend
 * Usage: node test-resend.js [email] [type]
 *
 * Exemples:
 * node test-resend.js hello@poppymusic.fr client
 * node test-resend.js hello@poppymusic.fr team
 * node test-resend.js (test par défaut)
 */

const { Resend } = require('resend');
require('dotenv').config();

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://poppymusic.fr';

// Couleurs pour les logs
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Données de test
const testData = {
  id: `test-${Date.now()}`,
  firstName: 'Test',
  lastName: 'CLI',
  email: 'hello@poppymusic.fr',
  songTitle: 'Test CLI - Ma Chanson Personnalisée',
  targetFirstName: 'Marie',
  targetLastName: 'Dupont',
  targetRelation: 'ma sœur',
  purposeTag: 'Anniversaire',
  amountPaid: 19900, // 199€ en centimes
  stripeSessionId: `cs_test_cli_${Date.now()}`
};

// Template HTML simplifié pour le test
function generateTestEmailHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Email - Poppy Music</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #c76927, #a85520); padding: 30px; text-align: center; color: white;">
    <h1>🎵 Poppy Music - Test CLI</h1>
    <p>Test d'envoi d'email depuis le script CLI</p>
  </div>

  <div style="padding: 30px;">
    <h2 style="color: #c76927;">Test de confirmation de commande</h2>

    <p>Bonjour <strong>${data.firstName} ${data.lastName}</strong>,</p>

    <p>Ceci est un email de test envoyé depuis le script CLI pour valider l'intégration Resend.</p>

    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Détails du test:</h3>
      <ul>
        <li><strong>Chanson:</strong> ${data.songTitle}</li>
        <li><strong>Pour:</strong> ${data.targetFirstName} ${data.targetLastName} (${data.targetRelation})</li>
        <li><strong>Montant:</strong> ${(data.amountPaid / 100).toFixed(0)}€</li>
        <li><strong>Référence:</strong> ${data.id}</li>
        <li><strong>Envoyé le:</strong> ${new Date().toLocaleString('fr-FR')}</li>
      </ul>
    </div>

    <p style="color: #666; font-size: 14px;">
      Si vous recevez cet email, l'intégration Resend fonctionne correctement !
    </p>
  </div>

  <div style="background: #333; color: white; padding: 20px; text-align: center;">
    <p>© 2025 Poppy Music - Test CLI</p>
  </div>
</body>
</html>`;
}

// Template pour notification équipe
function generateTeamNotificationHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nouvelle commande test - Poppy Music</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e40af, #3730a3); padding: 30px; text-align: center; color: white;">
    <h1>🔔 Test CLI - Nouvelle commande !</h1>
  </div>

  <div style="padding: 30px;">
    <h2 style="color: #1e40af;">Commande de test reçue</h2>

    <div style="background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Informations client:</h3>
      <p><strong>Client:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Chanson:</strong> ${data.songTitle}</p>
      <p><strong>Destinataire:</strong> ${data.targetFirstName} ${data.targetLastName} (${data.targetRelation})</p>
      <p><strong>Montant:</strong> ${(data.amountPaid / 100).toFixed(0)}€</p>
      <p><strong>Référence:</strong> ${data.id}</p>
      <p><strong>Test envoyé le:</strong> ${new Date().toLocaleString('fr-FR')}</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${SITE_URL}/admin/brief-detail?id=${data.id}"
         style="background: #c76927; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Voir le brief de test
      </a>
    </div>

    <p style="color: #666; font-size: 14px; text-align: center;">
      Email envoyé depuis le script CLI de test
    </p>
  </div>
</body>
</html>`;
}

// Fonction principale de test
async function testEmail(emailType = 'client') {
  logInfo(`Début du test ${emailType}...`);

  // Vérifier la configuration
  if (!RESEND_API_KEY) {
    logError('RESEND_API_KEY non trouvée dans les variables d\'environnement');
    logError('Assurez-vous que le fichier .env existe et contient RESEND_API_KEY');
    process.exit(1);
  }

  logSuccess('RESEND_API_KEY trouvée');

  // Initialiser Resend
  const resend = new Resend(RESEND_API_KEY);
  logInfo('Client Resend initialisé');

  try {
    let result;

    if (emailType === 'team') {
      // Test notification équipe
      logInfo('Envoi de notification équipe...');

      result = await resend.emails.send({
        from: 'Poppy Music <hello@poppymusic.fr>',
        to: [testData.email],
        subject: `🔔 Test CLI - Nouvelle commande - ${testData.firstName} ${testData.lastName}`,
        html: generateTeamNotificationHtml(testData),
        headers: {
          'X-Entity-Ref-ID': testData.id,
        },
      });
    } else {
      // Test email client
      logInfo('Envoi d\'email de confirmation client...');

      result = await resend.emails.send({
        from: 'Poppy Music <hello@poppymusic.fr>',
        to: [testData.email],
        subject: `🎵 Test CLI - Confirmation de commande - ${testData.songTitle}`,
        html: generateTestEmailHtml(testData),
        headers: {
          'X-Entity-Ref-ID': testData.id,
        },
      });
    }

    if (result.error) {
      logError(`Erreur lors de l'envoi: ${result.error.message}`);
      return false;
    }

    logSuccess(`Email envoyé avec succès !`);
    logSuccess(`ID de l'email: ${result.data.id}`);
    logInfo(`Destinataire: ${testData.email}`);
    logInfo(`Type: ${emailType}`);
    logInfo(`Sujet: ${result.data.subject || 'N/A'}`);

    return true;

  } catch (error) {
    logError(`Exception lors du test: ${error.message}`);
    if (error.response) {
      logError(`Détails erreur: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || testData.email;
  const emailType = args[1] || 'client';

  log(`🚀 Script de test Resend CLI`, 'cyan');
  log(`================================`, 'cyan');

  logInfo(`Configuration:`);
  console.log(`  - Email destinataire: ${email}`);
  console.log(`  - Type de test: ${emailType}`);
  console.log(`  - Site URL: ${SITE_URL}`);
  console.log(`  - API Key présente: ${!!RESEND_API_KEY}`);

  console.log();

  if (!['client', 'team'].includes(emailType)) {
    logError(`Type d'email invalide: ${emailType}`);
    logError(`Types valides: client, team`);
    process.exit(1);
  }

  const success = await testEmail(emailType);

  console.log();
  if (success) {
    logSuccess(`Test ${emailType} réussi ! 🎉`);
    logInfo(`Vérifiez votre boîte mail: ${email}`);
  } else {
    logError(`Test ${emailType} échoué`);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logError(`Exception non capturée: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Promesse rejetée: ${reason}`);
  process.exit(1);
});

// Lancer le script
if (require.main === module) {
  main().catch((error) => {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { testEmail, generateTestEmailHtml, generateTeamNotificationHtml };
