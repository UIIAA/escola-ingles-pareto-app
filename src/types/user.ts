export type UserRole = 'student' | 'teacher' | 'master';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  created_at: string;
}

export interface Profile {
  user_id: string;
  phone?: string;
  timezone?: string;
  avatar_url?: string;
}