export interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  photo?: string;
  charge: string;
  knowledgeLevel: 'basico' | 'intermedio' | 'avanzado';
  certificate?: string;
}

export interface MentorHour {
  mentor: string;
  registeredBy: string;
  hours: number;
}
