import { Mentor as MentorType } from './mentor';

export interface Attendance {
  id: string;
  mentor: MentorType;
  hours: number;
  isConfirmed: boolean;
  startDatetime: string;
  endDatetime: string;
  confirmedBy?: string;
}

export interface AttendanceUpdateData {
  startDatetime?: string;
  endDatetime?: string;
  isConfirmed?: boolean;
}

export interface AttendanceCreateData {
  mentorId: string;
  startDatetime: string;
  endDatetime: string;
}
