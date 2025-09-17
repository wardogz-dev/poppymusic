import type { APIRoute } from 'astro';
import { BriefService } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const briefData = await request.json();
    
    // Validation des champs obligatoires
    const requiredFields = [
      'firstName', 'lastName', 'email', 'musicStyle', 
      'projectPurpose', 'targetAudience', 'mainMessage', 
      'personalStory', 'deadline', 'package'
    ];
    
    const missingFields = requiredFields.filter(field => !briefData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        message: `Champs manquants: ${missingFields.join(', ')}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ajouter les métadonnées
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Préparer les données pour Supabase
    const briefToSave = {
      // Informations client
      first_name: briefData.firstName,
      last_name: briefData.lastName,
      email: briefData.email,
      phone: briefData.phone || null,
      
      // Projet musical
      project_title: briefData.projectTitle || null,
      music_style: briefData.musicStyle,
      project_purpose: briefData.projectPurpose,
      target_audience: briefData.targetAudience,
      
      // Message et contenu
      main_message: briefData.mainMessage,
      emotions: briefData.emotions || [],
      key_words: briefData.keyWords || null,
      personal_story: briefData.personalStory,
      
      // Références
      reference_artists: briefData.referenceArtists || null,
      musical_references: briefData.musicalReferences || null,
      avoid_elements: briefData.avoidElements || null,
      
      // Délais et budget
      deadline: briefData.deadline,
      package: briefData.package,
      additional_notes: briefData.additionalNotes || null,
      
      // Métadonnées
      ip_address: clientIP,
      user_agent: userAgent
    };

    // Sauvegarder dans Supabase
    const savedBrief = await BriefService.createBrief(briefToSave);
    
    // Calculer le montant selon la formule - Nouveau pricing premium
    const amount = 50000; // 500€ en centimes - Prix unique premium
    
    // TODO: Créer la session Stripe ici
    // const stripeSession = await createStripeSession(savedBrief.id, amount, briefData);
    
    return new Response(JSON.stringify({
      success: true,
      briefId: savedBrief.id,
      message: 'Brief enregistré avec succès',
      // stripeUrl: stripeSession.url // À ajouter avec Stripe
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du brief:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Erreur lors de l\'enregistrement du brief'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
