// src/app/components/circular-progress/circular-progress.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  template: `
    <div class="progress-container">
      <svg viewBox="0 0 36 36" class="circular-chart">
        <path class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path class="circle"
          [attr.stroke]="color"
          [style.strokeDasharray]="progress + ', 100'"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" class="percentage">{{ value }}</text>
      </svg>
      <span class="label">{{ label }}</span>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100px;
      text-align: center;
    }
    .circular-chart {
      display: block;
      margin: 10px auto;
      max-width: 80%;
    }
    .circle-bg {
      fill: none;
      stroke: #eee;
      stroke-width: 3.8;
    }
    .circle {
      fill: none;
      stroke-width: 2.8;
      stroke-linecap: round;
      animation: progress 1s ease-out forwards;
    }
    @keyframes progress {
      0% {
        stroke-dasharray: 0 100;
      }
    }
    .percentage {
      fill: #666;
      font-size: 0.5em;
      text-anchor: middle;
    }
    .label {
      font-size: 14px;
      color: var(--ion-color-medium);
    }
  `]
})
export class CircularProgressComponent {
  @Input() progress: number = 0;
  @Input() value: string = '0';
  @Input() label: string = '';
  @Input() color: string = '#2196F3';
}