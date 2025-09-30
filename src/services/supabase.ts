import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://agbrdfuelvvqbvcytqvc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYnJkZnVlbHZ2cWJ2Y3l0cXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI3NjcsImV4cCI6MjA3MzM3ODc2N30.kETaZM0nVnoOGEb_KbMadKVwv8gHRVsxXnnYvUWsdFw';

console.log('🔍 Using hardcoded credentials for testing');

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
          posts_count: number;
          reputation_score: number;
          badges: string[];
        };
        Insert: {
          user_id: string;
          phone?: string | null;
          timezone?: string | null;
          avatar_url?: string | null;
          posts_count?: number;
          reputation_score?: number;
          badges?: string[];
        };
        Update: {
          user_id?: string;
          phone?: string | null;
          timezone?: string | null;
          avatar_url?: string | null;
          posts_count?: number;
          reputation_score?: number;
          badges?: string[];
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
      forum_topics: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: 'grammar' | 'vocabulary' | 'conversation' | 'culture' | 'homework';
          status: 'open' | 'closed' | 'pinned' | 'resolved';
          author_id: string;
          created_at: string;
          updated_at: string;
          views_count: number;
          replies_count: number;
          last_reply_at: string | null;
          last_reply_by: string | null;
          tags: string[];
          is_pinned: boolean;
          is_locked: boolean;
          is_resolved: boolean;
          upvotes: number;
          downvotes: number;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: 'grammar' | 'vocabulary' | 'conversation' | 'culture' | 'homework';
          status?: 'open' | 'closed' | 'pinned' | 'resolved';
          author_id: string;
          created_at?: string;
          updated_at?: string;
          views_count?: number;
          replies_count?: number;
          last_reply_at?: string | null;
          last_reply_by?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
          is_resolved?: boolean;
          upvotes?: number;
          downvotes?: number;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: 'grammar' | 'vocabulary' | 'conversation' | 'culture' | 'homework';
          status?: 'open' | 'closed' | 'pinned' | 'resolved';
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          views_count?: number;
          replies_count?: number;
          last_reply_at?: string | null;
          last_reply_by?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
          is_resolved?: boolean;
          upvotes?: number;
          downvotes?: number;
        };
      };
      forum_replies: {
        Row: {
          id: string;
          content: string;
          topic_id: string;
          author_id: string;
          parent_reply_id: string | null;
          created_at: string;
          updated_at: string;
          is_edited: boolean;
          upvotes: number;
          downvotes: number;
          is_moderated: boolean;
          is_best_answer: boolean;
        };
        Insert: {
          id?: string;
          content: string;
          topic_id: string;
          author_id: string;
          parent_reply_id?: string | null;
          created_at?: string;
          updated_at?: string;
          is_edited?: boolean;
          upvotes?: number;
          downvotes?: number;
          is_moderated?: boolean;
          is_best_answer?: boolean;
        };
        Update: {
          id?: string;
          content?: string;
          topic_id?: string;
          author_id?: string;
          parent_reply_id?: string | null;
          created_at?: string;
          updated_at?: string;
          is_edited?: boolean;
          upvotes?: number;
          downvotes?: number;
          is_moderated?: boolean;
          is_best_answer?: boolean;
        };
      };
      forum_votes: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string | null;
          reply_id: string | null;
          vote_type: 'up' | 'down';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          topic_id?: string | null;
          reply_id?: string | null;
          vote_type: 'up' | 'down';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          topic_id?: string | null;
          reply_id?: string | null;
          vote_type?: 'up' | 'down';
          created_at?: string;
        };
      };
    };
  };
}