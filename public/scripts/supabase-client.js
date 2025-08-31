// Client Supabase pour le navigateur
// Import via CDN pour éviter les problèmes de modules
const { createClient } = window.supabase || await import('https://cdn.skypack.dev/@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://ntvnhcpkzpovqgcaiawx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw';

// Client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service pour les briefs
export const BriefService = {
  // Récupérer tous les briefs avec pagination
  async getBriefs(page = 1, limit = 20, status = '') {
    let query = supabase
      .from('client_briefs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .limit(limit);
    
    if (error) throw error;
    return { data, total: count || 0 };
  },
  
  // Récupérer les statistiques du dashboard
  async getDashboardStats() {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();
    
    if (error) {
      // Si la vue n'existe pas, calculer manuellement
      const { data: briefs, error: briefsError } = await supabase
        .from('client_briefs')
        .select('status, payment_status, amount_paid');
      
      if (briefsError) throw briefsError;
      
      const stats = {
        total_briefs: briefs.length,
        pending_briefs: briefs.filter(b => b.status === 'pending').length,
        in_progress_briefs: briefs.filter(b => b.status === 'in_progress').length,
        completed_briefs: briefs.filter(b => b.status === 'completed').length,
        paid_briefs: briefs.filter(b => b.payment_status === 'paid').length,
        total_revenue: briefs
          .filter(b => b.payment_status === 'paid')
          .reduce((sum, b) => sum + (b.amount_paid || 0), 0)
      };
      
      return stats;
    }
    
    return data;
  }
};

// Service d'authentification
export const AuthService = {
  // Vérifier si l'utilisateur est connecté
  isAdminLoggedIn() {
    if (typeof window === 'undefined') return false;
    
    const session = localStorage.getItem('poppy_admin_session');
    if (!session) return false;
    
    try {
      const { loginTime } = JSON.parse(session);
      // Session expire après 24h
      return Date.now() - loginTime < 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  },
  
  // Déconnecter
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('poppy_admin_session');
    }
  }
};
