import { Component, OnInit } from '@angular/core';
import { MetricComponent } from "../../components/metric/metric.component";
import { OrdersAdminService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';
import { DailyAverageOrderResponse, DayOfTheWeekAnalysisResponse, MonthlyOrderDataResponse, OrderedItemsFrequencyResponse } from '../../../../services/models';
import { FrequencyTableComponent } from "../../components/frequency-table/frequency-table.component";
import { ViewAllFreqComponent } from "../../components/view-all-freq/view-all-freq.component";
import { BarChartComponent } from "../../components/bar-chart/bar-chart.component";
import { BarChartData } from '../../services/model/bar-chart-data';
import { AdminService } from '../../services/admin.service';
import { LineChartData } from '../../services/model/line-chart-data';
import { LineChartComponent } from "../../components/line-chart/line-chart.component";

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [MetricComponent, FrequencyTableComponent, ViewAllFreqComponent, BarChartComponent, LineChartComponent],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.scss'
})
export class DashbordComponent implements OnInit{

  totalOrdersOfToday:number = 0;
  totalTransactionOfToday:number = 0;
  dailyAverageOrder:DailyAverageOrderResponse = {'averageOrder': 0, 'averageTransaction': 0};
  itemsOrderFrqyOfToday:OrderedItemsFrequencyResponse[] = [];
  itemsOrderFrqyOf30Days:OrderedItemsFrequencyResponse[] = [];
  // monthlyAvgResponse:MonthlyOrderDataResponse[] = [];
  onViewAll:boolean = false;
  year:number = 2024;
  dayOfTheWeekAvgOrder:BarChartData[] = [];
  dayOfTheWeekAvgIncome:BarChartData[] = [];
  monthlyTotalData:LineChartData[] = [];

  

  constructor(
    private orderAdminService:OrdersAdminService,
    private toastrService:ToastrService,
    private adminService:AdminService

  ){}

  ngOnInit(): void {
    // fetch
    this.fetchTotalNumberOfOrdersOfToday();
    this.fetchTotalTransactionOfToday();
    this.fetchDailyAverageData();
    this.fetchTopOrderedItemsOfToday();
    this.fetchTopItemsOfThePast30Days();
    this.fetchDayOfTheWeekAverages();
    this.fetchMonthlyOrderData();
   
  }

  // fetch total number of orders of a day
  fetchTotalNumberOfOrdersOfToday(){
    this.orderAdminService.getTotalNumberOfOrdersOfToday().subscribe({
      next:(res:number)=>{
        this.totalOrdersOfToday = res;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch total transaction of today
  fetchTotalTransactionOfToday(){
    this.orderAdminService.getTotalTransactionOfToday().subscribe({
      next:(res:number)=>{
        this.totalTransactionOfToday = res;
      }
    })
  }

  // fetch daily average data
  fetchDailyAverageData(){
    this.orderAdminService.getDailyAverageOrders().subscribe({
     next:(res:DailyAverageOrderResponse) => {
      this.dailyAverageOrder = res;
     },
     error:(err) => {
      console.log(err);
     } 
    })
  }

  // fetch top ordered items of today
  fetchTopOrderedItemsOfToday(){
    this.orderAdminService.getTopOrderedItemsOfToday().subscribe({
      next:(res:OrderedItemsFrequencyResponse[]) =>{
        this.itemsOrderFrqyOfToday = res;
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  // fetch top ordered items of the past 30 days
  fetchTopItemsOfThePast30Days(){
    this.orderAdminService.getFrequentlyOrderedItemsOfPast30Days().subscribe({
      next:(res:OrderedItemsFrequencyResponse[]) =>{
        this.itemsOrderFrqyOf30Days = res;
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  // fetch day of the week analysis data
  fetchDayOfTheWeekAverages(){
    this.orderAdminService.getDayOfTheWeekAverages().subscribe({
      next:(res:DayOfTheWeekAnalysisResponse[])=>{
  
        const avgOrderMap = new Map<string | undefined,number | undefined>();
        const avgIncomeMap = new Map<string | undefined,number | undefined>();
        res.forEach(data =>{
          avgOrderMap.set(data.dayOfTheWeek, data.averageOrder);
          avgIncomeMap.set(data.dayOfTheWeek, data.averageTransaction);
        });

         //initialize day of the week avg order
        this.dayOfTheWeekAvgOrder =JSON.parse(JSON.stringify(this.adminService.dayOfTheWeekAvgInit));
        this.dayOfTheWeekAvgOrder.forEach(data => {
          if(avgOrderMap.get(data.name)){
            data.value = avgOrderMap.get(data.name) as number;
          }
        });

        // day of the week avg income
        this.dayOfTheWeekAvgIncome = JSON.parse(JSON.stringify(this.adminService.dayOfTheWeekAvgInit));
        this.dayOfTheWeekAvgIncome.forEach(data => {
          if(avgIncomeMap.get(data.name)){
            data.value = avgIncomeMap.get(data.name) as number;
          }
        });
        
      }, 
      error:(err)=>{
        console.log(err);
      }
    })
  }

  // fetch monthly order data
  fetchMonthlyOrderData(){
    this.orderAdminService.getMonthlyOrderData({
      'year': this.year
    }).subscribe({
      next:(res:MonthlyOrderDataResponse[]) =>{
        console.log("Monthly order data");
        console.log(res);
        // this.monthlyAvgResponse = res;
        this.monthlyTotalData = JSON.parse(JSON.stringify(this.adminService.monthlyTotalDataInit));
        
        const totalOrderMap = new Map<string | undefined,number | undefined>();
        const totalIncomeMap = new Map<string | undefined,number | undefined>();
        
        res.forEach(data => {
          totalOrderMap.set(data.month, data.totalOrder);
          totalIncomeMap.set(data.month, data.totalTransaction);    
        });

        // total order
        this.monthlyTotalData[0].series.forEach(data => {
          if(totalOrderMap.get(data.name)){
            data.value = totalOrderMap.get(data.name) as number;
          }
        });
        console.log(this.monthlyTotalData);
        // total income
        this.monthlyTotalData[1].series.forEach(data => {
          if(totalOrderMap.get(data.name)){
            data.value = Number(totalIncomeMap.get(data.name)) / 100;
          }
        })
      }
    })
  }

  // on view all clicked
  toggleViewAll(){
    this.onViewAll = !this.onViewAll;
  }


 
}
