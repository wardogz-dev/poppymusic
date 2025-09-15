import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const GET: APIRoute = async () => {
  try {
    console.log('🔍 Debug Resend - Clé API:', process.env.RESEND_API_KEY ? 'PRÉSENTE' : 'ABSENTE');
    console.log('🔍 Clé commence par:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
    
    if (!process.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'RESEND_API_KEY non définie',
        env: Object.keys(process.env).filter(key => key.includes('RESEND'))
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test simple avec l'API Resend
    const { data, error } = await resend.emails.send({
      from: 'Poppy Music <hello@poppymusic.fr>',
      to: ['hello@poppymusic.fr'],
      subject: '🔍 Test Debug Resend API',
      html: '<p>Test de la clé API Resend</p>',
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error,
        keyLength: process.env.RESEND_API_KEY?.length,
        keyStart: process.env.RESEND_API_KEY?.substring(0, 10)
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Test Resend réussi:', data?.id);
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Clé Resend fonctionnelle',
      emailId: data?.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Erreur debug Resend:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
