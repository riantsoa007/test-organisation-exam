import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { AuthService } from '../../services/auth.service';
import { Exam, ExamStatus } from '../../models/exam.model';


@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {
  showAddForm = signal(false);
  examForm: FormGroup;
  availableStatuses = this.examService.getAvailableStatuses();
  isLoading = false;
  submissionError = '';

  constructor(
    public examService: ExamService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.examForm = this.formBuilder.group({
      studentName: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.maxLength(255)]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.examService.loadExams();
  }

  toggleAddForm(): void {
    this.showAddForm.update(value => !value);
    if (!this.showAddForm()) {
      this.examForm.reset();
    }
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      this.submissionError = '';
      this.isLoading = true;
      const examData = this.examForm.value;

      this.examService.createExam(examData).subscribe({
        next: (newExam) => {
          this.examService.loadExams();
          this.examForm.reset();
          this.showAddForm.set(false);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'examen:', error);
          this.submissionError = this.getErrorMessage(error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case ExamStatus.CONFIRMED:
        return 'bg-green-100 text-green-700 border border-green-200';
      case ExamStatus.TO_ORGANIZE:
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case ExamStatus.CANCELLED:
        return 'bg-red-100 text-red-700 border border-red-200';
      case ExamStatus.SEARCHING_LOCATION:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case ExamStatus.CONFIRMED:
        return '✓';
      case ExamStatus.TO_ORGANIZE:
        return '📋';
      case ExamStatus.CANCELLED:
        return '✗';
      case ExamStatus.SEARCHING_LOCATION:
        return '🔍';
      default:
        return '?';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'En attente';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'En attente';
    }

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short'
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';

    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }

    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return timeString.substring(0, 5);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  get studentName() { return this.examForm.get('studentName'); }
  get location() { return this.examForm.get('location'); }
  get date() { return this.examForm.get('date'); }
  get time() { return this.examForm.get('time'); }
  get status() { return this.examForm.get('status'); }

  private markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach(key => {
      const control = this.examForm.get(key);
      control?.markAsTouched();
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error && error.error.violations) {
      return error.error.violations.map((v: any) => v.message).join(', ');
    }
    if (error.error && error.error.message) {
      return error.error.message;
    }
    if (error.status === 422) {
      return 'Les données fournies ne respectent pas les contraintes requises.';
    }
    if (error.status === 400) {
      return 'Données invalides. Veuillez vérifier tous les champs.';
    }
    return 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.examForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        const fieldLabels: {[key: string]: string} = {
          'studentName': 'Le nom de l\'étudiant',
          'date': 'La date',
          'time': 'L\'heure',
          'status': 'Le statut'
        };
        return `${fieldLabels[fieldName] || 'Ce champ'} est requis`;
      }
      if (field.errors['maxlength']) {
        return `Ce champ ne peut pas dépasser ${field.errors['maxlength'].requiredLength} caractères`;
      }
      if (field.errors['pattern'] && fieldName === 'time') {
        return 'L\'heure doit être au format HH:MM (ex: 14:30)';
      }
    }
    return '';
  }
}