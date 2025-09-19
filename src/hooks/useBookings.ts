import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Booking, LessonSlot } from '../types/lesson';
import { useToast } from '@/hooks/use-toast';

export const useBookings = (userId: string, userRole: 'student' | 'teacher' | 'master') => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<LessonSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId && supabase) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userId, userRole, fetchBookings]);

  const fetchBookings = React.useCallback(async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured');
      }
      
      setLoading(true);
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          lesson_slots (
            id, teacher_id, datetime, duration, status, google_event_id
          )
        `);
      
      // Filtra por usuário dependendo do papel
      if (userRole === 'student') {
        query = query.eq('student_id', userId);
      } else if (userRole === 'teacher') {
        query = query.eq('lesson_slots.teacher_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const bookingsData = data || [];
      setBookings(bookingsData);
      
      // Extrai os slots únicos
      const uniqueSlots = bookingsData
        .map((b: Booking & { lesson_slots: LessonSlot }) => b.lesson_slots)
        .filter((slot: LessonSlot, index: number, self: LessonSlot[]) =>
          index === self.findIndex((s: LessonSlot) => s.id === slot.id)
        );
      
      setSlots(uniqueSlots);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agendamentos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, toast]);

  const createBooking = async (slotId: string): Promise<boolean> => {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured');
      }
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            student_id: userId,
            slot_id: slotId,
            status: 'confirmed'
          }
        ])
        .select();

      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Aula agendada com sucesso!'
      });
      
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível agendar a aula',
        variant: 'destructive'
      });
      return false;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      if (!supabase) {
        throw new Error('Supabase client is not configured');
      }
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Agendamento cancelado com sucesso!'
      });
      
      await fetchBookings();
      return true;
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar o agendamento',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    bookings,
    slots,
    loading,
    createBooking,
    cancelBooking,
    refresh: fetchBookings
  };
};