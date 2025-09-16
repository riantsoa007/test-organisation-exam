export interface Exam {
  id?: number;
  studentName: string;
  location?: string;
  date: string;
  time: string;
  status: ExamStatus;
}

export enum ExamStatus {
  CONFIRMED = 'Confirmé',
  TO_ORGANIZE = 'À organiser',
  CANCELLED = 'Annulé',
  SEARCHING_LOCATION = 'En recherche de place'
}

export interface ExamStats {
  confirmed: number;
  toOrganize: number;
  cancelled: number;
  searchingLocation: number;
}