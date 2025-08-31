<?php
// Script de déploiement webhook simple pour Poppy Music
// URL: https://poppymusic.fr/webhook-deploy.php?secret=VOTRE_SECRET

$secret = "poppymusic2025"; // Changez ce secret
$provided_secret = $_GET['secret'] ?? '';

if ($provided_secret !== $secret) {
    http_response_code(403);
    die("Accès refusé");
}

// Logs
$log_file = '/var/www/poppymusic/deploy.log';
function log_message($message) {
    global $log_file;
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . $message . "\n", FILE_APPEND);
}

log_message("🚀 Début du déploiement webhook");

// Changer de répertoire
chdir('/var/www/poppymusic');

// Commandes de déploiement
$commands = [
    'git pull origin main 2>&1',
    'npm ci 2>&1', 
    'npm run build 2>&1'
];

$output = [];
$success = true;

foreach ($commands as $cmd) {
    log_message("Exécution: $cmd");
    exec($cmd, $cmd_output, $return_code);
    
    if ($return_code !== 0) {
        $success = false;
        log_message("❌ Erreur dans: $cmd");
        break;
    }
    
    $output[] = implode("\n", $cmd_output);
    $cmd_output = [];
}

if ($success) {
    log_message("✅ Déploiement réussi");
    echo "✅ Déploiement réussi !";
} else {
    log_message("❌ Déploiement échoué");
    echo "❌ Déploiement échoué";
}

echo "\n\nLogs:\n" . implode("\n", $output);
?>
