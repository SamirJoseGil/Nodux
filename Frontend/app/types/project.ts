import { Schedule } from './schedule';

export interface Project {
  id: string;
  name: string;
  isActive: boolean;
  groups: ProjectGroup[];
}

export interface ProjectGroup {
  id: string;
  project: string;
  mentor: string;
  schedule?: Schedule;
  location: any;
  mode: any;
  startDate: any;
  endDate: any;
}