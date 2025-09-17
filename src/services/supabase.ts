import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
} else {
  console.log('✅ Supabase configured:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length
  });
}

// Criação do cliente Supabase
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Tipos das tabelas do Supabase
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'student' | 'teacher' | 'master';
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'student' | 'teacher' | 'master';
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'student' | 'teacher' | 'master';
          name?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          user_id: string;
          phone: string | null;
          timezone: string | null;
          avatar_url: string | null;
        };
        Insert: {
          user_id: string;
          phone?: string | null;
          timezone?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          user_id?: string;
          phone?: string | null;
          timezone?: string | null;
          avatar_url?: string | null;
        };
      };
      lesson_slots: {
        Row: {
          id: string;
          teacher_id: string;
          datetime: string;
          duration: number;
          status: 'available' | 'booked' | 'completed' | 'cancelled';
          google_event_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          datetime: string;
          duration?: number;
          status?: 'available' | 'booked' | 'completed' | 'cancelled';
          google_event_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          datetime?: string;
          duration?: number;
          status?: 'available' | 'booked' | 'completed' | 'cancelled';
          google_event_id?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          student_id: string;
          slot_id: string;
          status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          slot_id: string;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          slot_id?: string;
          status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
          created_at?: string;
        };
      };
      credit_packages: {
        Row: {
          id: string;
          student_id: string;
          credits_purchased: number;
          credits_remaining: number;
          expiry_date: string;
          discount_applied: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          credits_purchased: number;
          credits_remaining: number;
          expiry_date: string;
          discount_applied: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          credits_purchased?: number;
          credits_remaining?: number;
          expiry_date?: string;
          discount_applied?: number;
          created_at?: string;
        };
      };
      payment_history: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          credits_purchased: number;
          payment_method: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          amount: number;
          credits_purchased: number;
          payment_method: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          amount?: number;
          credits_purchased?: number;
          payment_method?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
        };
      };
    };
  };
}