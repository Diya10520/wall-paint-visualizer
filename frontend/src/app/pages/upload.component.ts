import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../core/state.service';
import { StepsComponent } from '../shared/steps.component';
import { RoomArtComponent } from '../shared/room-art.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, StepsComponent, RoomArtComponent],
  template: `
    <app-steps [current]="0"></app-steps>

    <section class="hero-grid">
      <div>
        <h1>Start with a photo of your room</h1>
        <p class="muted">Daylight and a straight-on angle give the most accurate preview. Only upload photos you own.</p>
        <app-room-art></app-room-art>
      </div>

      <div>
        <label class="drop" [class.has]="preview" [class.dragging]="dragging" (dragover)="$event.preventDefault(); dragging = true" (dragleave)="dragging = false" (drop)="drop($event)">
          <input type="file" hidden accept="image/png,image/jpeg" (change)="pick($event)" />
          <ng-container *ngIf="!preview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/></svg>
            <strong>Drop your room photo here</strong>
            <span class="muted">or click to browse. JPG or PNG, up to 5 MB.</span>
          </ng-container>
          <img *ngIf="preview" [src]="preview" alt="Your room" />
        </label>
        <p class="error" *ngIf="error">{{ error }}</p>
        <div class="toolbar">
          <button class="primary" [disabled]="!preview" (click)="next()">Outline walls</button>
          <span class="muted" *ngIf="preview">Click the photo to choose a different one.</span>
        </div>
      </div>
    </section>

    <section class="how">
      <div class="card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 7l8-3 8 4-2 11-9 1z"/><circle cx="4" cy="7" r="1.5" fill="currentColor"/><circle cx="12" cy="4" r="1.5" fill="currentColor"/><circle cx="20" cy="8" r="1.5" fill="currentColor"/><circle cx="18" cy="19" r="1.5" fill="currentColor"/><circle cx="9" cy="20" r="1.5" fill="currentColor"/></svg>
        <h3>Outline each wall</h3>
        <p>Click the corners of a wall, then press Finish wall. Repeat for every wall you want to paint.</p>
      </div>
      <div class="card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 003-3c0-6-3.5-11-8-11z"/><circle cx="8" cy="11" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/><circle cx="16" cy="8" r="1.2" fill="currentColor"/></svg>
        <h3>Try colours and finishes</h3>
        <p>Pick a shade, set the opacity, switch between matte and glossy, and slide to compare with the original.</p>
      </div>
      <div class="card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0l-4-4m4 4l4-4"/><path d="M5 20h14"/></svg>
        <h3>Save or download</h3>
        <p>Keep your designs in your account or download the painted image. Results vary with lighting and screen.</p>
      </div>
    </section>
  `,
})
export class UploadComponent {
  preview = ''; error = ''; file: File | null = null; dragging = false;
  constructor(private state: StateService, private router: Router) {}

  pick(ev: Event) { const f = (ev.target as HTMLInputElement).files?.[0]; if (f) this.setFile(f); }
  drop(ev: DragEvent) { ev.preventDefault(); this.dragging = false; const f = ev.dataTransfer?.files?.[0]; if (f) this.setFile(f); }

  private setFile(f: File) {
    this.error = '';
    if (!['image/jpeg', 'image/png'].includes(f.type)) { this.error = 'Choose a JPG or PNG image.'; return; }
    if (f.size > 5 * 1024 * 1024) { this.error = 'The image is larger than 5 MB.'; return; }
    this.file = f;
    this.preview = URL.createObjectURL(f);
  }

  next() {
    this.state.reset();
    this.state.file = this.file;
    this.state.imageUrl = this.preview;
    this.router.navigate(['/select']);
  }
}