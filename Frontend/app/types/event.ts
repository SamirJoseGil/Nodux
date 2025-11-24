export interface Event {
  id: string;
  group: string;
  location: string;
  date: string;
  startDate: string;
  endDate: string;
  schedule: string;
}

export interface EventCreateData {
  group: string;
  location: string;
  date: string;
  startDate: string;
  endDate: string;
  schedule: string;
}
