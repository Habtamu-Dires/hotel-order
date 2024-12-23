import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BarChartData } from './model/bar-chart-data';
import { MonthlyOrderDataResponse } from '../../../services/models';
import { LineChartData } from './model/line-chart-data';

@Injectable({
  providedIn: 'root'
})
export class AdminService {



  // hide side bar
  private hideSideBarSubject= new BehaviorSubject<boolean>(false);
  hideSideBarStatus$ = this.hideSideBarSubject.asObservable();

  constructor() { }

  updateHideSideBarStatus(value:boolean){
    this.hideSideBarSubject.next(value);
  }

  // bar chart data initilize
  dayOfTheWeekAvgInit:BarChartData[] = [
    {
      "name": "MONDAY",
      "value": 0
    },
    {
      "name": "TUESDAY",
      "value": 0
    },
    {
      "name": "WEDNESDAY",
      "value": 0
    },
    {
      "name": "THURSDAY",
      "value": 0
    },
    {
      "name": "FRIDAY",
      "value": 0
    },
    { 
      "name": "SATURDAY",
      "value": 0
    },
    {
      "name": "SUNDAY",
      "value": 0
    }

]

// monthly data initialization
monthlyTotalDataInit:LineChartData[] = [
  {
    'name':'Average Order',
    'series':[
      { "name": "JANUARY", "value": 0 },
      { "name": "FEBRUARY", "value": 0 },
      { "name": "MARCH", "value": 0 },
      { "name": "APRIL", "value": 0 },
      { "name": "MAY", "value": 0 },
      { "name": "JUNE", "value": 0 },
      { "name": "JULY", "value": 0 },
      { "name": "AUGUST", "value": 0 },
      { "name": "SEPTEMBER", "value": 0 },
      { "name": "OCTOBER", "value": 0 },
      { "name": "NOVEMBER", "value": 0 },
      { "name": "DECEMBER", "value": 0 }
    ]
  },
  {
    'name':'Average Income',
    'series':[
      { "name": "JANUARY", "value": 0 },
      { "name": "FEBRUARY", "value": 0 },
      { "name": "MARCH", "value": 0 },
      { "name": "APRIL", "value": 0 },
      { "name": "MAY", "value": 0 },
      { "name": "JUNE", "value": 0 },
      { "name": "JULY", "value": 0 },
      { "name": "AUGUST", "value": 0 },
      { "name": "SEPTEMBER", "value": 0 },
      { "name": "OCTOBER", "value": 0 },
      { "name": "NOVEMBER", "value": 0 },
      { "name": "DECEMBER", "value": 0 }
    ]
  }
]

}
