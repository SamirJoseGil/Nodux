export interface Schedule {
  id: string;
  day: number; // 0 = Monday, 6 = Sunday
  startTime: string; // HH:MM:SS
  endTime: string;   // HH:MM:SS
}
