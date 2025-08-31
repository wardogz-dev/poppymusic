<?php
session_start();

// Configuration
$ADMIN_USERNAME = 'admin';
$ADMIN_PASSWORD = 'PoppyMusic2025!';

// Traitement du formulaire
if ($_POST) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === $ADMIN_USERNAME && $password === $ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        $_SESSION['login_time'] = time();
        
        header('Location: admin-dashboard.php');
        exit;
    } else {
        $error = 'Identifiants incorrects';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Connexion Admin - Poppy Music</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/icon-2025.svg" type="image/svg+xml">
    <meta name="robots" content="noindex, nofollow">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; }
        .title-artistic { font-family: 'Inter', sans-serif; font-weight: 700; }
    </style>
</head>
<body class="bg-black text-gray-100 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full mx-auto px-6">
        <!-- LOGO -->
        <div class="text-center mb-8">
            <h1 class="title-artistic text-4xl text-orange-500 mb-2">Poppy Music</h1>
            <p class="text-gray-400">Administration</p>
        </div>

        <!-- FORMULAIRE -->
        <div class="bg-gray-900 bg-opacity-50 rounded-lg p-8">
            <h2 class="text-2xl font-bold text-white mb-6 text-center">Connexion</h2>
            
            <?php if (isset($error)): ?>
                <div class="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-md mb-6">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-300 mb-2">Nom d'utilisateur</label>
                    <input type="text" id="username" name="username" required 
                        class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                    <input type="password" id="password" name="password" required 
                        class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                </div>

                <button type="submit" 
                    class="w-full bg-orange-500 text-black py-3 font-bold tracking-wide hover:bg-orange-600 transition-all duration-300 rounded-md">
                    SE CONNECTER
                </button>
            </form>
        </div>

        <!-- RETOUR ACCUEIL -->
        <div class="text-center mt-8">
            <a href="/" class="text-gray-400 hover:text-orange-500 transition-colors">
                ← Retour au site
            </a>
        </div>
    </div>
</body>
</html>
