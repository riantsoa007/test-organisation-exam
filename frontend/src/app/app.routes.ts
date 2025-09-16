import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'exams', component: ExamListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];