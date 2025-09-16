import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Authentication service handling JWT tokens and user session
 * Manages login/logout state with reactive signals
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginApiRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8000';
  private readonly authTokenKey = 'authToken';

  private isAuthenticatedSignal = signal<boolean>(this.hasValidToken());
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Check if stored token is valid and not expired
   */
  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.authTokenKey);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp ? payload.exp > currentTime : true;
    } catch {
      return false;
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Transform email to username for API
    const apiCredentials: LoginApiRequest = {
      username: credentials.email,
      password: credentials.password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/api/login_check`, apiCredentials, { headers })
      .pipe(
        tap(response => {
          this.setAuthToken(response.token);
          this.isAuthenticatedSignal.set(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
    this.isAuthenticatedSignal.set(true);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * mock login
   */
  mockLogin(): void {
    const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJleGFtLWFwcCIsImF1ZCI6ImV4YW0tYXBwIiwiaWF0IjoxNjkwMDAwMDAwLCJleHAiOjE2OTAwMDA2MDAsInVzZXJfaWQiOjEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20ifQ.mock-signature';
    this.setAuthToken(mockToken);
  }
}