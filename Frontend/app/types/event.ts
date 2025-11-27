export interface Event {
  id: string;
  group: string;
  location: string;
  date: string;
  startDate: string;
  endDate: string;
  // Schedule info (from optimized endpoint)
  scheduleId: string | null;
  scheduleDay: number | null;
  scheduleDayName: string | null;
  startTime: string | null;
  endTime: string | null;
  startHour: number;
  endHour: number;
  duration: number;
  // Group info
  groupInfo: {
    id: string;
    location: string;
    mode: string;
    project: string | null;
    mentor: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export interface EventCreateData {
  group: string;
  location: string;
  date: string;
  startDate: string;
  endDate: string;
  scheduleId: string | null;
}
