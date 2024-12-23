import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OrderResponse, ServiceRequestResponse } from '../../../services/models';

@Injectable({
  providedIn: 'root'
})
export class WaiterService {
  
  // hide side bar
  private hideSideBarSubject= new BehaviorSubject<boolean>(false);
  hideSideBarStatus$ = this.hideSideBarSubject.asObservable();

  // order notification
  private orderNotificationSubject = new Subject<OrderResponse>();
  orderNotification$ = this.orderNotificationSubject.asObservable();

  // request notification
  private requestNotificationSubject = new Subject<ServiceRequestResponse>();
  requestNotification$ = this.requestNotificationSubject.asObservable();

  // order notification counter
  private orderNotifCounterMap = new Map<string,number>();

  private orderNotifCounterSubject = new BehaviorSubject<Map<string,number>>(this.orderNotifCounterMap);
  orderNotifCounter$ = this.orderNotifCounterSubject.asObservable();


  // request notification counter
  private requestNotifCounterMap = new Map<string,number>();

  private requestNotifCounterSubject = new BehaviorSubject<Map<string,number>>(this.requestNotifCounterMap);
  requestNotifCounter$ = this.requestNotifCounterSubject.asObservable();
  

  constructor() { }

  // update side bar
  updateHideSideBarStatus(value:boolean){
    this.hideSideBarSubject.next(value);
  }

  // update order notification
  updateOrderNotification(order:OrderResponse){
    this.orderNotificationSubject.next(order);
  }

  // update request notification 
  updateRequestNotification(request:ServiceRequestResponse){
    console.log("inside update request notification")
    this.requestNotificationSubject.next(request);
  }

  // update order notif counter
  updateOrderNotifCounterMap(key:string, value:number){
    this.orderNotifCounterMap.set(key,value);
    this.orderNotifCounterSubject.next(this.orderNotifCounterMap);
  }

  // update request notif counter
  updateRequestNotifCounterMap(key:string, value:number){
    this.requestNotifCounterMap.set(key,value);
    this.requestNotifCounterSubject.next(this.requestNotifCounterMap);
  }

  
}
