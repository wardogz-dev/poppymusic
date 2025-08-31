import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://ntvnhcpkzpovqgcaiawx.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dm5oY3BrenBvdnFnY2FpYXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTg5OTgsImV4cCI6MjA3MjIzNDk5OH0.GQfgar4VTEz3H73usQRb9Vqa3gBfOfomZgXjPlasTSw';

// Client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types TypeScript pour les données
export interface ClientBrief {
  id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Informations client
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  
  // Projet musical
  project_title?: string;
  music_style: string;
  project_purpose: string;
  target_audience: string;
  
  // Message et contenu
  main_message: string;
  emotions: string[];
  key_words?: string;
  personal_story: string;
  
  // Références
  reference_artists?: string;
  musical_references?: string;
  avoid_elements?: string;
  
  // Délais et budget
  deadline: string;
  package: 'standard' | 'premium';
  additional_notes?: string;
  
  // Statut
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes?: string;
  
  // Paiement
  payment_status?: 'unpaid' | 'paid' | 'refunded';
  stripe_session_id?: string;
  amount_paid?: number;
  
  // Métadonnées
  ip_address?: string;
  user_agent?: string;
}

export interface AdminUser {
  id?: string;
  username: string;
  email?: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
}

export interface DashboardStats {
  total_briefs: number;
  pending_briefs: number;
  in_progress_briefs: number;
  completed_briefs: number;
  paid_briefs: number;
  total_revenue: number;
}

// Fonctions utilitaires
export class BriefService {
  // Créer un nouveau brief
  static async createBrief(briefData: Omit<ClientBrief, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('client_briefs')
      .insert([briefData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Récupérer tous les briefs avec pagination
  static async getBriefs(page = 1, limit = 20, status?: string) {
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
  }
  
  // Mettre à jour un brief
  static async updateBrief(id: string, updates: Partial<ClientBrief>) {
    const { data, error } = await supabase
      .from('client_briefs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Récupérer les statistiques du dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }
}

export class AuthService {
  // Vérifier les identifiants admin (simple pour commencer)
  static async verifyAdmin(username: string, password: string): Promise<boolean> {
    // Pour l'instant, vérification simple
    // Plus tard, on utilisera bcrypt et la table admin_users
    const adminUsername = import.meta.env.ADMIN_USERNAME || 'admin';
    const adminPassword = import.meta.env.ADMIN_PASSWORD || 'PoppyMusic2025!';
    
    return username === adminUsername && password === adminPassword;
  }
  
  // Créer une session admin (localStorage pour commencer)
  static createAdminSession(username: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('poppy_admin_session', JSON.stringify({
        username,
        loginTime: Date.now()
      }));
    }
  }
  
  // Vérifier si l'utilisateur est connecté
  static isAdminLoggedIn(): boolean {
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
  }
  
  // Déconnecter
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('poppy_admin_session');
    }
  }
}
