import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {

  @Input() list:any[] = [];
  @Input() xAxisLabel:string = '';
  @Input() yAxisLabel:string = '';
  @Input() title:string = '';

  // Chart options
  view: [number, number] = [520, 400]; // Width and height of the chart

  // Options for customization
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  colorScheme: string = 'vivid'; // Use built-in color schemes
 
}
