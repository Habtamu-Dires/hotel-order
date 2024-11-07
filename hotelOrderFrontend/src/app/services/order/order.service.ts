import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderDetail } from '../models/orderDetail';
import { ItemService } from '../item/item.service';
import { SharedService } from '../shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/api_response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private initialOrderObject:Order = {
    id:'',totalPrice:0,orderType:'', note:'', orderDetails:[], locationId:'',createdAt:'',
    orderStatus:''
  }

  private orderObject:Order = {
    id:'',totalPrice:0,orderType:'',note: '', orderDetails:[], locationId: '',createdAt:'',
    orderStatus: ''
  }

  private orderSubject = new BehaviorSubject<Order>(this.initialOrderObject);
  order$ = this.orderSubject.asObservable();

  constructor(private itemService:ItemService,
    private sharedService:SharedService,
    private http:HttpClient
  ) { }

  updateOrder(order:Order){
    this.orderSubject.next(order);
  }

  resetOrder(){
    this.orderSubject.next(this.initialOrderObject);
    this.orderObject = this.initialOrderObject;
  }

  processOrdetailMap(orderDetailMap:Map<string,OrderDetail>){
      let totalItem = 0;
      let totalPrice = 0;
      orderDetailMap.forEach(orderDetail =>{
        const item = this.itemService.getItemByItemId(orderDetail.itemId);
        if(item){
          totalItem += orderDetail.quantity;
          totalPrice += orderDetail.quantity * item.price;
        }
      });
      this.orderObject = { ...this.orderObject, totalPrice:totalPrice}
      this.sharedService.updateTotalOrderItems(totalItem);

      this.updateOrder(this.orderObject);
  }

  //send 
  sendOrder(order:Order):Observable<ApiResponse<null>>{
    const url = `${this.sharedService.getBaseUrl()}/orders`
    return this.http.post<ApiResponse<null>>(url, order);
  }


}
