import { Mentor } from './mentor';

export interface Attendance {
  id: string;
  mentor: Mentor;
  hours: number;
  isConfirmed: boolean;
  startDatetime: string;
  endDatetime: string;
  confirmedBy?: string;
}

export interface AttendanceUpdateData {
  mentorId?: string;
  startDatetime?: string;
  endDatetime?: string;
  isConfirmed?: boolean;
}

export interface AttendanceCreateData {
  mentorId: string;
  startDatetime: string;
  endDatetime: string;
}
