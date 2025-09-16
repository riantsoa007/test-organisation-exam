import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Exam, ExamStatus, ExamStats } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly apiUrl = 'http://localhost:8000/exams';

  private examsSubject = new BehaviorSubject<Exam[]>([]);
  public exams$ = this.examsSubject.asObservable();

  private examsSignal = signal<Exam[]>([]);
  public exams = this.examsSignal.asReadonly();

  public examStats = computed(() => {
    const exams = this.examsSignal();
    return {
      confirmed: exams.filter(exam => exam.status === ExamStatus.CONFIRMED).length,
      toOrganize: exams.filter(exam => exam.status === ExamStatus.TO_ORGANIZE).length,
      cancelled: exams.filter(exam => exam.status === ExamStatus.CANCELLED).length,
      searchingLocation: exams.filter(exam => exam.status === ExamStatus.SEARCHING_LOCATION).length
    };
  });

  constructor(private http: HttpClient) {}

  getExams(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  loadExams(): void {
    this.getExams().subscribe({
      next: (response) => {
        const exams = response['hydra:member'] || [];
        this.examsSignal.set(exams);
        this.examsSubject.next(exams);
      },
      error: (error) => {
        console.error('Error loading exams:', error);
      }
    });
  }

  createExam(exam: Omit<Exam, 'id'>): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam);
  }

  addExam(exam: Omit<Exam, 'id'>): void {
    this.createExam(exam).subscribe({
      next: (newExam) => {
        const currentExams = this.examsSignal();
        const updatedExams = [...currentExams, newExam];
        this.examsSignal.set(updatedExams);
        this.examsSubject.next(updatedExams);
      },
      error: (error) => {
        console.error('Error creating exam:', error);
      }
    });
  }

  getAvailableStatuses(): ExamStatus[] {
    return Object.values(ExamStatus);
  }
}