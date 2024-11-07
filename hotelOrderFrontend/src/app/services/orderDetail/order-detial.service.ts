import { Injectable } from '@angular/core';
import { OrderDetail } from '../models/orderDetail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderDetialService {

  //
  private itemMap = new Map<string,OrderDetail>();
  private itemMapSubject = 
    new BehaviorSubject<Map<string,OrderDetail>>(new Map<string,OrderDetail>);  

  public itemMap$ = this.itemMapSubject.asObservable();

  constructor() {}

  updateOrderDetail(itemId:string, orderDetail:OrderDetail){
    this.itemMap.set(itemId,orderDetail);
    this.itemMapSubject.next(new Map(this.itemMap));
  }

  deleteOrderDetail(itemId:string){
   this.itemMap.delete(itemId);
   this.itemMapSubject.next(new Map(this.itemMap));  
  }

  resetOrderDetail(){
    this.itemMap = new Map<string,OrderDetail>();
    this.itemMapSubject.next(new Map(this.itemMap));
  }

}
