import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <a routerLink="/upload" class="brand">
        <span class="logo">
          <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="16" height="6" rx="2" fill="#fff"/>
            <path d="M19 6h2v6H11v3" stroke="#fff" stroke-width="2" stroke-linecap="round"/><rect x="9" y="15" width="4" height="7" rx="1.5" fill="#fff"/></svg>
        </span>
        Paint Visualizer
      </a>
      <nav *ngIf="auth.isLoggedIn">
        <a routerLink="/upload" routerLinkActive="on">New room</a>
        <a routerLink="/saved" routerLinkActive="on">Saved designs</a>
        <a routerLink="/admin" routerLinkActive="on" *ngIf="auth.isAdmin">Admin</a>
        <button class="link" (click)="auth.logout()">Log out</button>
        <span class="avatar" [title]="auth.user?.name">{{ (auth.user?.name || '?').charAt(0) | uppercase }}</span>
      </nav>
    </header>
    <main><router-outlet></router-outlet></main>
  `,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
