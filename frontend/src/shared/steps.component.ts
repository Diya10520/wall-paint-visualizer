import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ol class="steps">
      <li *ngFor="let s of labels; let i = index" [class.done]="i < current" [class.on]="i === current">
        <span class="n">{{ i < current ? '✓' : i + 1 }}</span>{{ s }}
      </li>
    </ol>
  `,
})
export class StepsComponent {
  @Input() current = 0;
  labels = ['Upload photo', 'Outline walls', 'Choose colours', 'Save'];
}
