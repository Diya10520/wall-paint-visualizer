import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { API, ApiService } from '../core/api.service';
import { StateService } from '../core/state.service';

@Component({
  selector: 'app-saved',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <h1>Saved designs</h1>
      <p *ngIf="loaded && !projects.length">Nothing saved yet. Upload a room photo to create your first design.</p>
      <div class="grid">
        <article *ngFor="let p of projects" class="tile">
          <img [src]="api_url + p.originalImage" alt="" />
          <h3>{{ p.name }}</h3>
          <p class="muted">{{ p.updatedAt | date: 'medium' }} · {{ p.walls?.length || 0 }} wall(s)</p>
          <div class="toolbar">
            <button class="primary" (click)="open(p)">Open</button>
            <button (click)="remove(p)">Delete</button>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class SavedComponent implements OnInit {
  projects: any[] = []; loaded = false; api_url = API;
  constructor(private api: ApiService, private state: StateService, private router: Router) {}

  ngOnInit() {
    this.api.get('/projects').subscribe((p) => { this.projects = p; this.loaded = true; });
  }

  open(p: any) {
    this.state.reset();
    this.state.projectId = p._id;
    this.state.projectName = p.name;
    this.state.walls = p.walls || [];
    this.state.imageUrl = API + p.originalImage;
    this.router.navigate(['/preview']);
  }

  remove(p: any) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    this.api.del(`/projects/${p._id}`).subscribe(() => (this.projects = this.projects.filter((x) => x._id !== p._id)));
  }
}
