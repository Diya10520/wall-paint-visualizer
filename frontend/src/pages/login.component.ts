import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { RoomArtComponent } from '../shared/room-art.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RoomArtComponent],
  template: `
    <div class="auth">
      <section class="auth-hero">
        <h1>Try the colour on your own wall</h1>
        <p>Upload a photo, outline a wall and compare paint shades in your own lighting before you buy a single tin.</p>
        <app-room-art></app-room-art>
        <div class="swatch-strip"><span *ngFor="let c of strip" [style.background]="c"></span></div>
      </section>

      <section class="auth-form">
        <h1>{{ register ? 'Create your account' : 'Welcome back' }}</h1>
        <p class="muted">{{ register ? 'It takes less than a minute.' : 'Log in to open your saved designs.' }}</p>
        <label *ngIf="register">Name <input [(ngModel)]="name" autocomplete="name" /></label>
        <label>Email <input type="email" [(ngModel)]="email" autocomplete="email" /></label>
        <label>Password <input type="password" [(ngModel)]="password" (keyup.enter)="submit()" autocomplete="current-password" /></label>
        <p class="error" *ngIf="error">{{ error }}</p>
        <button class="primary" (click)="submit()" [disabled]="busy">{{ register ? 'Create account' : 'Log in' }}</button>
        <button class="link" (click)="register = !register; error = ''">
          {{ register ? 'I already have an account' : 'Create a new account' }}
        </button>
      </section>
    </div>
  `,
})
export class LoginComponent {
  register = false; name = ''; email = ''; password = ''; error = ''; busy = false;
  strip = ['#4a90b8', '#a8b8a0', '#c86b4b', '#d9c3a0', '#e8b4b8', '#d8a82f', '#2b3a55', '#b9a9d6', '#b8e0cf', '#5a6169'];
  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = ''; this.busy = true;
    const req = this.register
      ? this.auth.register(this.name, this.email, this.password)
      : this.auth.login(this.email, this.password);
    req.subscribe({
      next: () => this.router.navigate(['/upload']),
      error: (e) => { this.error = e.error?.message || 'Cannot reach the server'; this.busy = false; },
    });
  }
}
