import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../../services/old-services/models/api_response';
import { Order } from '../../../services/old-services/models/order';
import { SharedService } from '../../../modules/customer/services/shared/shared.service';
import { catchError, count, delay, Observable, retry, throwError } from 'rxjs';
import { OrderedItem } from '../model/ordered-item';
import { DatePipe } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class OrderedItemService {

  private orderedItemList:OrderedItem[] = [];

  constructor(private http:HttpClient,
    private sharedService:SharedService,
    private datePipe:DatePipe
  ) {}

  //fetch acitve orders
  fetchActiveOrders():Observable<ApiResponse<Order[]>>{
    const url = `${this.sharedService.getBaseUrl()}/orders/active`;
    return this.http.get<ApiResponse<Order[]>>(url)
    .pipe(
      retry({count:5 , delay:3000}),
      catchError(error=>{
        console.log(error);
        return throwError(()=> new Error(error));
      })
    )
  }

  //update status of orders
  updateOrderStatus(orderId:string,status:string):Observable<ApiResponse<null>>{
    const url = `${this.sharedService.getBaseUrl()}/orders/status`;
    return this.http.put<ApiResponse<null>>(url,{"id":orderId,"status":status});
  }

  fillOrderedList(orderList:Order[]){
    this.orderedItemList = [];
    orderList.forEach(order => {
      //initialize
      const orderedItemObject:OrderedItem = {
        id:'',
        locationType:'',
        locationNumber: '',
        locationAddress:'',
        orderType:'',
        orderStatus: '', 
        orderDate: '',
        orderTime:'',
        timeDuration:'',
        orderDetails: [],
        totalPrice: 0, 
        note:'',
        orderDateTime: new Date()
      };
      //id
      orderedItemObject.id = order.id;
      //order detail
      orderedItemObject.orderDetails = order.orderDetails;
      //price, note type , status
      orderedItemObject.totalPrice = order.totalPrice;
      orderedItemObject.note = order.note;
      orderedItemObject.orderType = order.orderType;
      orderedItemObject.orderStatus = order.orderStatus ;
      //location
      const locationAddress = order.location?.address;
      orderedItemObject.locationAddress = locationAddress ? locationAddress : '';
      const locationType = order.location?.type;
      const locationNumber = order.location?.number;
      orderedItemObject.locationType = locationType ? locationType : '';
      orderedItemObject.locationNumber = locationNumber ? locationNumber.toString() : '';
      //date and time
      const orderDate = this.transformDate(order.createdAt);
      const orderTime = this.transfromTime(order.createdAt);
      orderedItemObject.orderTime = orderTime ? orderTime : '';
      orderedItemObject.orderDate = orderDate ? orderDate : '';
      //temp
      const orderDateTime = new Date(order.createdAt);
      orderedItemObject.orderDateTime = orderDateTime;
      //duration
      const duration = this.transfromDuration(order.createdAt);
      orderedItemObject.timeDuration = duration;
      //push
      this.orderedItemList.push(orderedItemObject);
    })
    //sort
    this.orderedItemList.sort((b,a)=>{
      return a.orderDateTime.getTime() - b.orderDateTime.getTime();
    })
   
  }

  //transfrom date
  transformDate(dateString:string){
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'EEE, dd , y')
    return formattedDate;
  }

  //transfrom time
  transfromTime(dateString:string){
    const date = new Date(dateString);
    const fromattedTime = this.datePipe.transform(date, 'hh:mm a');
    return fromattedTime;
  }

  //transfrom  duaration
  transfromDuration(dateString:string){
    const date = new Date(dateString);
    const duration = formatDistanceToNow(date, {addSuffix: true})
    return duration;
  }

  getOrderedItemList():OrderedItem[]{
    // console.log(this.orderedItemList)
    return this.orderedItemList;
  }  
}
