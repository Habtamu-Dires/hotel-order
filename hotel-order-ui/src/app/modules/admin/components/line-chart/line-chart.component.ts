import { Component, Input, OnInit } from '@angular/core';
import { NgxChartsModule,Color, ScaleType } from '@swimlane/ngx-charts';
import { AdminService } from '../../../../services/services';
import { LineChartData } from '../../services/model/line-chart-data';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnInit{

  @Input() monthlyTotalData:LineChartData[] = [];
  @Input() title:string = '';

  constructor(
    private adminService:AdminService
  ){}

  ngOnInit(): void {
    
  }
  
  // Chart options
  view: [number, number] = [1200, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Months';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Values';
  // colorScheme: string = 'fire'; // Use built-in color schemes
  colorScheme: Color = {
    domain: ['#5AA454', '#A10A28',], // Colors
    group: ScaleType.Ordinal, 
    selectable: true,
    name: 'Custom Scheme' // A unique name
  }
  tooltipFormatting = (data:any) => {
    if (data.series === "Sales (x100)") {
      return `${data.name}: ${data.value * 100} (Real: ${data.value * 100})`;
    }
    return `${data.name}: ${data.value}`;
  };

}
