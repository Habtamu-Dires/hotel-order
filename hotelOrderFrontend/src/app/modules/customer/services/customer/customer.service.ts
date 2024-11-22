import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CategoryResponse, ItemOrderRequest, OrderDetailRequest } from '../../../../services/models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  //selected category
  private selectedCategorySubject = new BehaviorSubject<CategoryResponse>({});
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  // selected main category
  private selectedMainCategorySubject = new BehaviorSubject<CategoryResponse>({});
  selectedMainCategory$ = this.selectedMainCategorySubject.asObservable();

  // item - orderdetail map
  private itemMap = new Map<string,OrderDetailRequest>();
  private itemMapSubject = 
    new BehaviorSubject<Map<string,OrderDetailRequest>>(new Map<string,OrderDetailRequest>);  
  public itemMap$ = this.itemMapSubject.asObservable();

  //total ordered Item
  private totalOrderedItemsSubject = new BehaviorSubject<number>(0);
  totalOrderedItems$ = this.totalOrderedItemsSubject.asObservable();

  // order request object
  private orderRequestObj:ItemOrderRequest = {
        orderType: '', 
        orderDetails:[],
        totalPrice: 0,
        locationId: ''
  }
  private orderRequestSubject = new BehaviorSubject<ItemOrderRequest>(this.orderRequestObj);
  orderRequest$ = this.orderRequestSubject.asObservable();

  //search text
  private searchedTextSubject = new Subject<string>();
  searchedText$ = this.searchedTextSubject.asObservable();
  
  constructor() { }

  /* ------------selected category tracker -------------- */

  // update selected categroy
  updateSelectedCategory(category:CategoryResponse){
    this.selectedCategorySubject.next(category);
  }

  // update selected main categroy
  updatedSelectedMainCategory(category:CategoryResponse){
    this.selectedMainCategorySubject.next(category);
  }

  /* ---------------------order detail collector--------------- */

  // update order detail
  updateItemOrderDetail(itemId:string, orderDetail:OrderDetailRequest){
    this.itemMap.set(itemId,orderDetail);
    // update order request
    this.updateOrderRequest(this.itemMap);
    this.itemMapSubject.next(new Map(this.itemMap));    
  }

  // delete order detail
  deleteItemOrderDetail(itemId:string){
   this.itemMap.delete(itemId);
   // update order request
   this.updateOrderRequest(this.itemMap);
   this.itemMapSubject.next(new Map(this.itemMap));
  }

  // resto order detail
  resetOrderDetailMap(){
    this.itemMap = new Map<string,OrderDetailRequest>();
    this.itemMapSubject.next(new Map(this.itemMap));
  }

  /*---------------------- order tracker --------------------- */

  // updated total ordered items number
  updateTotalOrderedItems(totalItems:number){
    this.totalOrderedItemsSubject.next(totalItems);
  }

  resetTotalOrderedItems(){
    this.totalOrderedItemsSubject.next(0);
  }

  updateOrder(orderRequest:ItemOrderRequest){
    this.orderRequestSubject.next(orderRequest)
  }
    
  resetOrderRequest(orderRequest:ItemOrderRequest){
    this.orderRequestObj = orderRequest;
    this.resetTotalOrderedItems();
    this.orderRequestSubject.next(orderRequest);
  }

  // update order reqeust
  updateOrderRequest(orderDetailMap:Map<string,OrderDetailRequest>){
    let totalItems = 0;
    let totalPrice = 0;
    orderDetailMap.forEach(orderDetail =>{
      totalItems +=1;
      totalPrice += orderDetail.quantity as number * (orderDetail.price as number | 1)
    });

    this.orderRequestObj= {...this.orderRequestObj, totalPrice:totalPrice}
    // update total items
    this.updateTotalOrderedItems(totalItems);
    // update order
    this.updateOrder(this.orderRequestObj);
    
  }

  /* -------------------searched text --------------------*/
  updateSearchedText(text:string){
    this.searchedTextSubject.next(text);
  }


}
