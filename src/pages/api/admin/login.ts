import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();
    
    // Récupérer les identifiants depuis les variables d'environnement
    const adminUsername = import.meta.env.ADMIN_USERNAME || 'admin';
    const adminPassword = import.meta.env.ADMIN_PASSWORD || 'PoppyMusic2025!';
    
    // Vérification simple (à améliorer avec bcrypt plus tard)
    if (username === adminUsername && password === adminPassword) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Connexion réussie' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Identifiants incorrects' 
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Erreur serveur' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
