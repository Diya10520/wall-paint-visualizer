import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: any = JSON.parse(localStorage.getItem('user') || 'null');

  constructor(private api: ApiService, private router: Router) {}

  get isLoggedIn() { return !!localStorage.getItem('token'); }
  get isAdmin() { return this.user?.role === 'admin'; }

  login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password }).pipe(tap((r) => this.save(r)));
  }
  register(name: string, email: string, password: string) {
    return this.api.post('/auth/register', { name, email, password }).pipe(tap((r) => this.save(r)));
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['/login']);
  }
  private save(r: any) {
    localStorage.setItem('token', r.token);
    localStorage.setItem('user', JSON.stringify(r.user));
    this.user = r.user;
  }
}
