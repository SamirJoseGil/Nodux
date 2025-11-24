import { User } from './auth';

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  specialty: string;
  profileImage?: string;
  bio?: string;
  hourlyRate?: number;
  status: 'active' | 'inactive';
  totalHours?: number;
  projectCount?: number;
  user?: User;
  expertise?: string[];
  createdAt?: string; // Añadido para resolver error
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  totalHours?: number;
  mentorCount?: number;
  studentCount?: number;
  groups?: Group[];
  mentors?: Mentor[];
  createdAt?: string; // Añadido para resolver error
}

export interface Group {
  id: string;
  name: string;
  projectId: string;
  mentorId: string;
  students: Student[];
  schedule?: Schedule[];
  projectName?: string;
  mentorName?: string;
  description?: string; // Añadido para resolver error
  createdAt?: string; // Añadido para resolver error
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  profileImage?: string;
  groups?: Group[];
  user?: User;
  createdAt?: string; // Añadido para consistencia
}

export interface Schedule {
  id: string;
  groupId: string;
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export interface HourRecord {
  id: string;
  mentorId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  mentorName?: string;
  projectName?: string;
  duration?: string; // Añadido para resolver error
}

export interface Metric {
  id: string;
  name: string;
  value: number | string;
  type: 'count' | 'percentage' | 'currency' | 'time';
  period?: string;
  category: string;
}
