import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { StateService, Wall } from '../core/state.service';
import { StepsComponent } from '../shared/steps.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, StepsComponent],
  template: `
    <app-steps [current]="saved ? 3 : 2"></app-steps>
    <section class="card">
      <h1>Choose colours and preview</h1>
      <div class="layout">
        <div>
          <canvas #cv class="stage" style="cursor:default"></canvas>
          <label>Slide to compare with the original photo
            <input type="range" min="0" max="100" [(ngModel)]="compare" (input)="draw()" />
          </label>
        </div>

        <aside class="panel">
          <h3>Wall</h3>
          <div class="tabs">
            <button *ngFor="let w of state.walls; let i = index" [class.on]="i === active" (click)="active = i">
              <span class="dot" [style.background]="w.colorHex"></span> Wall {{ i + 1 }}
            </button>
          </div>

          <ng-container *ngIf="wall as w">
            <h3>Paint colour</h3>
            <div class="chips-grid">
              <button *ngFor="let c of colors" class="chip" [class.on]="c.hex === w.colorHex" (click)="setColor(c)" [title]="c.name">
                <span class="chip-color" [style.background]="c.hex"></span>
                <span class="chip-name">{{ c.name }}</span>
                <span class="chip-hex">{{ c.hex }}</span>
              </button>
            </div>

            <label>Opacity: {{ w.opacity | number: '1.2-2' }}
              <input type="range" min="0.1" max="1" step="0.05" [(ngModel)]="w.opacity" (input)="draw()" />
            </label>
            <label>Finish
              <select [(ngModel)]="w.finish" (change)="draw()">
                <option value="matte">Matte</option>
                <option value="glossy">Glossy</option>
              </select>
            </label>
          </ng-container>

          <label>Design name <input [(ngModel)]="state.projectName" /></label>
          <p class="error" *ngIf="error">{{ error }}</p>
          <p class="ok" *ngIf="message">{{ message }}</p>
          <div class="toolbar">
            <button class="primary" (click)="save()" [disabled]="busy">Save design</button>
            <button (click)="download()">Download PNG</button>
            <button (click)="router.navigate(['/select'])">Edit walls</button>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class PreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv') cv!: ElementRef<HTMLCanvasElement>;
  img!: HTMLImageElement;
  colors: any[] = [];
  active = 0; compare = 0; busy = false; error = ''; message = ''; saved = false;
  private shown = new Map<Wall, string>();   // colour currently shown while a change animates
  private raf = 0;

  constructor(public state: StateService, private api: ApiService, public router: Router) {}

  get wall(): Wall | undefined { return this.state.walls[this.active]; }

  async ngAfterViewInit() {
    if (!this.state.imageUrl) { this.router.navigate(['/upload']); return; }
    this.api.get('/colors').subscribe((c) => (this.colors = c));
    this.img = await this.state.loadImage(this.state.imageUrl);
    const { w, h } = this.state.size(this.img);
    this.cv.nativeElement.width = w;
    this.cv.nativeElement.height = h;
    this.draw();
  }

  setColor(c: any) {
    const w = this.wall;
    if (!w) return;
    const from = this.shown.get(w) || w.colorHex;
    w.colorHex = c.hex; w.colorName = c.name;
    this.tween(w, from, c.hex);
  }

  /** Fades the wall from its old colour to the new one in about 0.4 seconds. */
  private tween(w: Wall, from: string, to: string) {
    cancelAnimationFrame(this.raf);
    this.shown.clear();
    const start = performance.now(), dur = 400;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);            // ease-out
      this.shown.set(w, this.mix(from, to, e));
      this.draw();
      if (t < 1) this.raf = requestAnimationFrame(step); else this.shown.delete(w);
    };
    this.raf = requestAnimationFrame(step);
  }

  private rgb(h: string) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  private mix(a: string, b: string, t: number) {
    const x = this.rgb(a), y = this.rgb(b);
    return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }

  ngOnDestroy() { cancelAnimationFrame(this.raf); }

  draw() {
    const c = this.cv.nativeElement, ctx = c.getContext('2d')!, W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(this.img, 0, 0, W, H);

    for (const wall of this.state.walls) {
      ctx.save();
      ctx.beginPath();
      wall.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.clip();
      // 'multiply' keeps the shadows and texture of the real wall visible
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = wall.opacity;
      ctx.fillStyle = this.shown.get(wall) ?? wall.colorHex;
      ctx.fillRect(0, 0, W, H);
      if (wall.finish === 'glossy') {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    }

    const x = (W * this.compare) / 100;
    if (x > 0) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, x, H); ctx.clip();
      ctx.drawImage(this.img, 0, 0, W, H);
      ctx.restore();
      ctx.fillStyle = '#fff'; ctx.fillRect(x - 2, 0, 4, H);
    }
  }

  save() {
    this.error = ''; this.message = ''; this.busy = true;
    const done = (p: any) => { this.state.projectId = p._id; this.message = 'Design saved'; this.saved = true; this.busy = false; };
    const fail = (e: any) => { this.error = e.error?.message || 'Could not save'; this.busy = false; };

    if (this.state.projectId) {
      this.api.put(`/projects/${this.state.projectId}`, { name: this.state.projectName, walls: this.state.walls })
        .subscribe({ next: done, error: fail });
    } else {
      const fd = new FormData();
      fd.append('image', this.state.file!);
      fd.append('data', JSON.stringify({ name: this.state.projectName, walls: this.state.walls }));
      this.api.post('/projects', fd).subscribe({ next: done, error: fail });
    }
  }

  download() {
    const keep = this.compare;
    this.compare = 0; this.draw();
    this.cv.nativeElement.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob!);
      a.download = `${this.state.projectName || 'design'}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
      this.compare = keep; this.draw();
    }, 'image/png');
  }
}