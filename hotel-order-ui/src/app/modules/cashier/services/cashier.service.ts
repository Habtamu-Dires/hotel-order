import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OrderResponse } from '../../../services/models';

@Injectable({
  providedIn: 'root'
})
export class CashierService {

  // searched item name
  private searchedItemNameSubject = new Subject<string>();
  searchedItemName$ = this.searchedItemNameSubject.asObservable();

  // additional infos
  private infoMap:Map<string,number> = new Map([['totalTransaction', 0], ['totalOrders', 0]]);
  private infoMapSubject = new Subject<Map<string,number>>();
  infoMap$ = this.infoMapSubject.asObservable();
  
  constructor() { }

  // update searched item name
  updateSearchedItemName(name:string){
    this.searchedItemNameSubject.next(name);
  }

  // update infoMap 
  updateInfoMap(orderPrice:number){
    const tt = this.infoMap.get('totalTransaction')
    const to = this.infoMap.get('totalOrders');
    this.infoMap.set('totalTransaction',Number(tt) + orderPrice);
    this.infoMap.set('totalOrders', Number(to) + 1);
    this.infoMapSubject.next(this.infoMap);
  }
}
