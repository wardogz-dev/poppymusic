import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ntvnhcpkzpovqgcaiawx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw'
);

export const GET: APIRoute = async () => {
  try {
    // Essayer de récupérer les exemples depuis Supabase
    const { data: examples, error } = await supabase
      .from('use_case_examples')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.log('Table use_case_examples pas encore créée, utilisation des données statiques');
      
      // Données statiques en fallback
      const staticExamples = [
        {
          tag: 'Club',
          title: 'Twende',
          short_description: 'Composition afro beat pour DJ professionnel',
          audio_url: '/music/twende.mp3',
          cover_image_url: '/images/covers/twende-closed.png',
          story_url: '/story/twende'
        },
        {
          tag: 'Anniversaire Adulte',
          title: 'C\'est Chez Moi',
          short_description: 'Déclaration d\'amour pour un anniversaire de mariage',
          audio_url: '/music/cest-chez-moi.mp3',
          cover_image_url: '/images/covers/cest-chez-moi-closed.png',
          story_url: '/story/cest-chez-moi'
        },
        {
          tag: 'Anniversaire Adulte',
          title: 'Funky Thierry',
          short_description: 'Hommage funk pour les 65 ans d\'un père',
          audio_url: '/music/funky-thierry.wav',
          cover_image_url: '/images/covers/funky-thierry-closed.png',
          story_url: '/story/funky-thierry'
        },
        {
          tag: 'Anniversaire Enfant',
          title: 'Raph King',
          short_description: 'Chanson rap personnalisée pour un enfant',
          audio_url: '/music/raph-king.mp3',
          cover_image_url: '/images/covers/raph-king-closed.png',
          story_url: '/story/raph-king'
        },
        {
          tag: 'Anniversaire Enfant',
          title: 'Aby Princess',
          short_description: 'Comptine personnalisée pour une petite fille',
          audio_url: '/music/aby-princess.mp3',
          cover_image_url: '/images/covers/aby-closed.png',
          story_url: '/story/aby-princess'
        },
        {
          tag: 'Entreprise',
          title: 'Titres Français',
          short_description: 'Rap corporate pour une entreprise',
          audio_url: '/music/titres-francais.mp3',
          cover_image_url: '/images/covers/titres-francais-closed.png',
          story_url: '/story/titres-francais'
        },
        {
          tag: 'Entreprise',
          title: 'Campus Des Écoles',
          short_description: 'Hymne éducatif pour une école',
          audio_url: '/music/campus-des-ecoles.mp3',
          cover_image_url: '/images/covers/campus-des-ecoles-closed.png',
          story_url: '/story/campus-des-ecoles'
        },
        {
          tag: 'Association',
          title: 'Levehad Am Ehad',
          short_description: 'Chanson traditionnelle pour une association',
          audio_url: '/music/levehad-am-ehad.mp3',
          cover_image_url: '/images/covers/levehad-am-ehad-closed.png',
          story_url: '/story/levehad-am-ehad'
        }
      ];

      return new Response(JSON.stringify({ 
        success: true, 
        examples: staticExamples 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Organiser les exemples par tag
    const examplesByTag = {};
    examples.forEach(example => {
      if (!examplesByTag[example.tag]) {
        examplesByTag[example.tag] = [];
      }
      examplesByTag[example.tag].push(example);
    });

    return new Response(JSON.stringify({ 
      success: true, 
      examples: examples,
      examplesByTag: examplesByTag
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur API examples:', error);
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
