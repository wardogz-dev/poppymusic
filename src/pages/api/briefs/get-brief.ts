import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ntvnhcpkzpovqgcaiawx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw'
);

export const GET: APIRoute = async ({ url }) => {
  try {
    const briefId = url.searchParams.get('briefId');
    const sessionId = url.searchParams.get('sessionId');
    
    if (!briefId && !sessionId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brief ID ou Session ID requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let query = supabase.from('client_briefs_steps').select('*');
    
    if (briefId) {
      query = query.eq('id', briefId);
    } else {
      query = query.eq('session_id', sessionId);
    }

    const { data: briefs, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Erreur lors de la récupération du brief',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!briefs || briefs.length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Brief non trouvé' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prendre le premier brief (ou le plus récent)
    const brief = briefs[0];

    return new Response(JSON.stringify({ 
      success: true, 
      brief: brief
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur API get-brief:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
