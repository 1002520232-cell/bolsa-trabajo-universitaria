import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(email: string, password: string): Observable<any> {
    // Mock login implementation
    return of({ success: true, user: { id: '1', email } });
  }

  isAuthenticated(): boolean {
    // Mock authentication check
    return true;
  }

  getCurrentUserId(): string {
    // Mock current user ID
    return '1';
  }

  getCurrentUserData(): Promise<any> {
    // Mock user data
    return Promise.resolve({ id: '1', email: 'user@example.com' });
  }
}
