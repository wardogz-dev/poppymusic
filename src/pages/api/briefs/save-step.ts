import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ntvnhcpkzpovqgcaiawx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw'
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validation des données essentielles
    if (!data.sessionId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Session ID manquant' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Préparer les données pour Supabase (seulement les champs existants)
    const briefData = {
      session_id: data.sessionId,
      first_name: data.firstName || null,
      last_name: data.lastName || null,
      email: data.email || null,
      phone: data.phone || null,
      purpose_tag: data.purposeTag || null,
      // target_first_name: data.targetFirstName || null, // Temporairement désactivé
      // target_last_name: data.targetLastName || null, // Temporairement désactivé
      // target_birth_date: data.targetBirthDate || null, // Temporairement désactivé
      // target_gender: data.targetGender || null, // Temporairement désactivé
      // target_relation: data.targetRelation || null, // Temporairement désactivé
      target_audience: (data.targetRelation || '') + ' - ' + (data.targetFirstName || '') + ' ' + (data.targetLastName || ''), // Temporaire
      emotions: data.emotions || [],
      about_subject: data.aboutSubject || null,
      main_message: data.mainMessage || null,
      keywords_anecdotes: data.keywordsAnecdotes || null,
      music_style: data.musicStyle || null,
      artist_inspirations: data.artistInspirations || [],
      song_title: data.songTitle || null,
      current_step: data.currentStep || 1,
      is_completed: data.currentStep === 12,
      updated_at: new Date().toISOString()
    };

    // Vérifier si un brief existe déjà pour cette session
    const { data: existingBriefs, error: selectError } = await supabase
      .from('client_briefs_steps')
      .select('id')
      .eq('session_id', data.sessionId);

    let result;

    if (selectError) {
      console.error('Erreur lors de la vérification:', selectError);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Erreur lors de la vérification de session',
        error: selectError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingBriefs && existingBriefs.length > 0) {
      // Mettre à jour le brief existant (prendre le premier si plusieurs)
      const existingId = existingBriefs[0].id;
      result = await supabase
        .from('client_briefs_steps')
        .update(briefData)
        .eq('id', existingId)
        .select()
        .single();
    } else {
      // Créer un nouveau brief
      result = await supabase
        .from('client_briefs_steps')
        .insert([briefData])
        .select()
        .single();
    }

    if (result.error) {
      console.error('Erreur Supabase:', result.error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Erreur lors de la sauvegarde',
        error: result.error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      briefId: result.data.id,
      message: 'Brief sauvegardé avec succès'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur API:', error);
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
