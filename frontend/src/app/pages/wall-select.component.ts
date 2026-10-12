import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pt, StateService } from '../core/state.service';
import { StepsComponent } from '../shared/steps.component';

@Component({
  selector: 'app-wall-select',
  standalone: true,
  imports: [CommonModule, StepsComponent],
  template: `
    <app-steps [current]="1"></app-steps>
    <section class="card">
      <h1>Outline the wall</h1>
      <div class="hint">Click to place corner points around a wall. Press <b>Finish wall</b> when you have at least 3 points, then repeat for other walls.</div>
      <div class="toolbar">
        <button class="primary" (click)="finish()" [disabled]="current.length < 3">Finish wall</button>
        <button (click)="undo()">Undo</button>
        <button (click)="clearAll()">Clear all</button>
        <span class="muted">{{ state.walls.length }} wall(s) outlined</span>
        <button class="primary" style="margin-left:auto" (click)="next()" [disabled]="!state.walls.length">Choose colours</button>
      </div>
      <canvas #cv (click)="add($event)" class="stage"></canvas>
    </section>
  `,
})
export class WallSelectComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv') cv!: ElementRef<HTMLCanvasElement>;
  img!: HTMLImageElement;
  current: Pt[] = [];
  dash = 0; private raf = 0; private last = 0;

  constructor(public state: StateService, private router: Router) {}

  async ngAfterViewInit() {
    if (!this.state.imageUrl) { this.router.navigate(['/upload']); return; }
    this.img = await this.state.loadImage(this.state.imageUrl);
    const { w, h } = this.state.size(this.img);
    this.cv.nativeElement.width = w;
    this.cv.nativeElement.height = h;
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  }

  // animated 'marching ants' outline, ~25 frames per second
  private loop = (now: number) => {
    if (now - this.last > 40) { this.last = now; this.dash = (this.dash + 1.5) % 20; this.draw(); }
    this.raf = requestAnimationFrame(this.loop);
  };

  ngOnDestroy() { cancelAnimationFrame(this.raf); }

  add(e: MouseEvent) {
    const c = this.cv.nativeElement, r = c.getBoundingClientRect();
    this.current.push({
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
    });
    this.draw();
  }

  finish() {
    if (this.current.length < 3) return;
    this.state.walls.push({ points: [...this.current], colorHex: '#4A90B8', colorName: 'Ocean Breeze Blue', opacity: 0.75, finish: 'matte' });
    this.current = [];
    this.draw();
  }

  undo() {
    if (this.current.length) this.current.pop();
    else this.state.walls.pop();
    this.draw();
  }

  clearAll() { this.current = []; this.state.walls = []; this.draw(); }
  next() { this.router.navigate(['/preview']); }

  private path(ctx: CanvasRenderingContext2D, pts: Pt[], close: boolean) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    if (close) ctx.closePath();
  }

  draw() {
    const c = this.cv.nativeElement, ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(this.img, 0, 0, c.width, c.height);
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.setLineDash([12, 8]);
    ctx.lineDashOffset = -this.dash;
    for (const w of this.state.walls) {
      this.path(ctx, w.points, true);
      ctx.fillStyle = 'rgba(47,75,255,0.22)'; ctx.fill();
      ctx.strokeStyle = '#2f4bff'; ctx.stroke();
    }
    this.path(ctx, this.current, false);
    ctx.strokeStyle = '#ff3d71'; ctx.stroke();
    ctx.setLineDash([]);
    for (const p of this.current) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#ff3d71'; ctx.stroke();
    }
  }
}