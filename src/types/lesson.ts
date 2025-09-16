export type LessonSlotStatus = 'available' | 'booked' | 'completed' | 'cancelled';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface LessonSlot {
  id: string;
  teacher_id: string;
  datetime: string;
  duration: number; // em minutos
  status: LessonSlotStatus;
  google_event_id?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  student_id: string;
  slot_id: string;
  status: BookingStatus;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  teacher_id: string;
  created_at: string;
}

export interface LessonMaterial {
  id: string;
  lesson_id: string;
  file_url: string;
  type: 'pdf' | 'video' | 'audio' | 'document';
  title: string;
}