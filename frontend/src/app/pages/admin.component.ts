import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card">
      <h1>Admin panel</h1>
      <div class="stats">
        <div><b>{{ stats.users }}</b> users</div>
        <div><b>{{ stats.projects }}</b> designs saved</div>
        <div><b>{{ stats.colors }}</b> colours</div>
      </div>
    </section>

    <section class="card">
      <h2>Paint colours</h2>
      <div class="toolbar">
        <input placeholder="Name" [(ngModel)]="form.name" />
        <input type="color" [(ngModel)]="form.hex" />
        <input placeholder="Brand" [(ngModel)]="form.brand" />
        <input placeholder="Tag (e.g. Bedroom)" [(ngModel)]="form.tag" />
        <button class="primary" (click)="add()">Add colour</button>
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
      <table>
        <tr><th></th><th>Name</th><th>Hex</th><th>Brand</th><th>Tags</th><th></th></tr>
        <tr *ngFor="let c of colors">
          <td><span class="dot big" [style.background]="c.hex"></span></td>
          <td>{{ c.name }}</td><td>{{ c.hex }}</td><td>{{ c.brand }}</td><td>{{ c.tags?.join(', ') }}</td>
          <td><button (click)="remove(c)">Remove</button></td>
        </tr>
      </table>
    </section>

    <section class="card">
      <h2>Recent user designs</h2>
      <table>
        <tr><th>Design</th><th>User</th><th>Updated</th></tr>
        <tr *ngFor="let p of projects">
          <td>{{ p.name }}</td><td>{{ p.user?.name }} ({{ p.user?.email }})</td><td>{{ p.updatedAt | date: 'short' }}</td>
        </tr>
      </table>
    </section>
  `,
})
export class AdminComponent implements OnInit {
  stats: any = {}; colors: any[] = []; projects: any[] = []; error = '';
  form = { name: '', hex: '#4a90b8', brand: '', tag: '' };
  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get('/admin/stats').subscribe((s) => (this.stats = s));
    this.api.get('/admin/projects').subscribe((p) => (this.projects = p));
    this.loadColors();
  }
  loadColors() { this.api.get('/colors').subscribe((c) => (this.colors = c)); }

  add() {
    this.error = '';
    if (!this.form.name) { this.error = 'Enter a colour name.'; return; }
    const body = { name: this.form.name, hex: this.form.hex, brand: this.form.brand || 'Generic', tags: this.form.tag ? [this.form.tag] : [] };
    this.api.post('/colors', body).subscribe({
      next: () => { this.form.name = ''; this.loadColors(); },
      error: (e) => (this.error = e.error?.message || 'Could not add colour'),
    });
  }
  remove(c: any) { this.api.del(`/colors/${c._id}`).subscribe(() => this.loadColors()); }
}
