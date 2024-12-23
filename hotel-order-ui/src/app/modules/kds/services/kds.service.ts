import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OrderResponse } from '../../../services/models';

@Injectable({
  providedIn: 'root'
})
export class KdsService {

  // order list 
  private orderListSubject = new BehaviorSubject<OrderResponse[]>([]);
  orderList$ = this.orderListSubject.asObservable();

  // searched item name
  private searchedItemNameSubject = new Subject<string>();
  searchedItemName$ = this.searchedItemNameSubject.asObservable();
  
  constructor() { }

  // update order list
  updateOrderList(orderList:OrderResponse[]){
    this.orderListSubject.next(orderList);
  }

  // update searched Item Name
  updateSearchedItemName(itemName:string){
    this.searchedItemNameSubject.next(itemName);
  }

}
