import { Injectable } from '@angular/core';
import { OrderLocation } from '../models/orderLocation';
import { catchError, count, delay, Observable, retry, throwError } from 'rxjs';
import { ApiResponse } from '../models/api_response';
import { SharedService } from '../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderLocationService {

  locationMapById = new Map<string,OrderLocation>();
  private orderLocationList:OrderLocation[] = [];

  constructor(private sharedService:SharedService,
    private http:HttpClient
  ) {}


  //fetch locations
  fetchLoacations():Observable<ApiResponse<OrderLocation[]>>{
     return this.http.get<ApiResponse<OrderLocation[]>>(`${this.sharedService.getBaseUrl()}/locations`)
     .pipe(
      retry({count:10, delay: 2000}),
      catchError(error => {
        return throwError(()=> new Error(error));
      })
     )
  }
  
  setOrderLocations(orderLocations:OrderLocation[]){
    this.orderLocationList = orderLocations;
    this.locationMapById = new Map<string,OrderLocation>();
    this.fillOrderLocationMapById();
  }

  fillOrderLocationMapById(){
    this.orderLocationList.forEach(location =>{
      this.locationMapById.set(location.id,location);
    })
  }

  getLoactionById(id:string){
    return this.locationMapById.get(id);
  }
}
