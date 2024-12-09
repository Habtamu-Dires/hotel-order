import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric',
  standalone: true,
  imports: [NgIf],
  templateUrl: './metric.component.html',
  styleUrl: './metric.component.scss'
})
export class MetricComponent {
   
  @Input() metricName?:string;
  @Input() metricValue?:any;
  @Input() description?:string;
  @Input() isCurrency:boolean = false;
}
