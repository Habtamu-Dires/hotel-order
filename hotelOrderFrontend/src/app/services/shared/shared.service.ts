import { HttpClient } from '@angular/common/http';
import { Injectable, numberAttribute } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiResponse } from '../models/api_response';
import { OrderLocation } from '../models/orderLocation';
import { ServiceRequest } from '../models/serviceRequest';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  //base url
  private base_url:string = 'http://localhost:8080/api/v1';

  //totalItem
  private totalOrderedItemsSubject = new BehaviorSubject<number>(0);
  totalOrderItems$ = this.totalOrderedItemsSubject.asObservable();

  //serach text
  private searchTextSubject = new Subject<string>();
  searchText$ = this.searchTextSubject.asObservable();

  //toggle footer
  private isFooterExpandedSubject = new BehaviorSubject<boolean>(false);
  isFooterExpanded$ = this.isFooterExpandedSubject.asObservable();

  //scroll position    e.g 'item',120 , 'item-detail', 0
  private scrollPositions: {[key: string]:number} = {} // an object the key are string ,value are number

  // constructor
  constructor(private http:HttpClient) {}


  // base_url
  getBaseUrl(){
    return this.base_url;
  }


  // total order items
  updateTotalOrderItems(totalItems:number){
    this.totalOrderedItemsSubject.next(totalItems);
  }

  //search text
  changeSearchText(searchText:string){
    this.searchTextSubject.next(searchText);
  }

  //footer
  toggleFooter(isExpanded:boolean){
    this.isFooterExpandedSubject.next(isExpanded);
  }

  //set scroll position
  setScrollPosition(route: string, position:number){
    this.scrollPositions[route] = position;
  }

  getScrollPosition(route: string){
    return this.scrollPositions[route] || 0;
  }

  //servicer request
  postServiceRequest(serviceRequest:ServiceRequest):Observable<ApiResponse<null>>{
    const url = `${this.base_url}/service-requests`
    return this.http.post<ApiResponse<null>>(url, serviceRequest);
  }

}
