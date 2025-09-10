import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ntvnhcpkzpovqgcaiawx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw'
);

export const GET: APIRoute = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status') || '';
    
    const offset = (page - 1) * limit;

    // Requête pour récupérer les briefs depuis la nouvelle table
    let query = supabase
      .from('client_briefs_steps')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtrer par statut si spécifié
    if (status) {
      if (status === 'completed') {
        query = query.eq('is_completed', true);
      } else if (status === 'in_progress') {
        query = query.eq('is_completed', false);
      } else if (status === 'paid') {
        query = query.eq('is_paid', true);
      } else if (status === 'unpaid') {
        query = query.eq('is_paid', false);
      }
    }

    const { data: briefs, error, count } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Erreur lors de la récupération des briefs',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Transformer les données pour l'admin
    const transformedBriefs = briefs?.map(brief => ({
      ...brief,
      // Compatibilité avec l'ancien format
      project_title: brief.song_title,
      project_purpose: brief.purpose_tag,
      deadline: brief.created_at, // Utiliser created_at comme date de référence
      status: brief.is_completed ? (brief.is_paid ? 'completed' : 'pending_payment') : 'in_progress',
      payment_status: brief.is_paid ? 'paid' : 'unpaid'
    })) || [];

    return new Response(JSON.stringify({ 
      success: true, 
      data: transformedBriefs,
      total: count || 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur API admin briefs:', error);
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
