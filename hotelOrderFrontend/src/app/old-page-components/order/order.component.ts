// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { SharedService } from '../../services/shared/shared.service';
// import { OrderDetialService } from '../../services/old-services/orderDetail/order-detial.service';
// import { OrderDetail } from '../../services/old-services/models/orderDetail';
// import { OrderService } from '../../services/old-services/order/order.service';
// import { Order } from '../../services/old-services/models/order';
// import { CommonModule } from '@angular/common';
// import { ItemDetial } from '../../services/old-services/models/itemDetial';
// import { ItemService } from '../../services/old-services/item/item.service';
// import { FormsModule } from '@angular/forms';
// import { Subscription } from 'rxjs';
// import { Router } from '@angular/router';
// import { ApiResponse } from '../../services/old-services/models/api_response';
// import { OrderLocation } from '../../services/old-services/models/orderLocation';
// import { OrderLocationService } from '../../services/old-services/orderLocation/order-location.service';
// import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

// @Component({
//   selector: 'app-order',
//   standalone: true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './order.component.html',
//   styleUrl: './order.component.scss'
// })
// export class OrderComponent implements OnInit, OnDestroy {

//   orderType:string = 'DINE_IN';
//   orderDetailMap = new Map<string,OrderDetail>;
//   order?:Order;
//   itemDetails:ItemDetial[] = [];
//   locationType?:string;
//   locationNumber?:number;
//   isOrderBtnClicked:boolean = false;
//   orderNote?:string;
//   orderLocationList:OrderLocation[] = [];
//   orderLocation?:OrderLocation;
//   filteredLocations:OrderLocation[] = []
//   isNumberListOpen:boolean = false;
//   isNumberClicked:boolean = false;
//   showNotification:boolean = false;
//   notificationMessage:string = '';
//   orderSuccess?:boolean;

//   //subscription
//   orderSubscription?:Subscription;
//   orderDetialSubscription?:Subscription;

//   constructor(
//         private orderDetailService:OrderDetialService,
//         private orderService:OrderService,
//         private itemService:ItemService,
//         private sharedService:SharedService,
//         private router:Router,
//         private locationService:OrderLocationService,
//   ){}

//   ngOnInit(): void {
//     //order
//     this.orderSubscription = this.orderService.order$.subscribe(order =>{
//       this.order = order;
//       // if exists initial
//       this.orderNote = this.order.note;
//       if(this.order.locationId){
//         this.orderLocation = this.locationService.getLoactionById(this.order.locationId);
//         this.locationNumber = this.orderLocation?.number;
//         this.locationType = this.orderLocation?.type;
//       }

//       if(this.order.orderType && this.order.orderType.trim().length !== 0){
//         this.orderType = this.order.orderType;
//       }
      
//     });

//     //item
//     this.orderDetialSubscription = this.orderDetailService.itemMap$.subscribe(
//     orderDetailMap =>{
//       this.orderDetailMap = orderDetailMap;
//       this.processItemDetail();
//       this.orderService.processOrdetailMap(orderDetailMap);
//     });

//     //location
//     this.locationService.fetchLoacations().subscribe({
//       next:(response:ApiResponse<OrderLocation[]>)=>{
//         this.orderLocationList = response.data;
//         this.filteredLocations = response.data;
//         //set orderlocaiton list inside location service
//         this.locationService.setOrderLocations(response.data);
//       },
//       error:(error:HttpErrorResponse) =>{
//         console.error(error);
//       }
//     })

//     //initial
//     this.isOrderBtnClicked = false;
//   }

//   increment (itemDetail:ItemDetial){
//     const orderDetail = {
//       itemId:itemDetail.itemId,
//       quantity:itemDetail.itemQuantity +=1,
//       orderId:'',
//       selectedOption:this.orderType,
//       note:''
//     } 
//     this.orderDetailService.updateOrderDetail(itemDetail.itemId,orderDetail);
//   }

//   decrement(itemDetail:ItemDetial) {
//     if(itemDetail.itemQuantity === 1){
//       this.orderDetailService.deleteOrderDetail(itemDetail.itemId);
//     } else {
//       const orderDetail = {
//         itemId:itemDetail.itemId,
//         quantity:itemDetail.itemQuantity -=1,
//         orderId:'',
//         selectedOption:this.orderType,
//         note:''
//       } 
//       this.orderDetailService.updateOrderDetail(itemDetail.itemId,orderDetail);
//     }
//   }
//   // calculate totalPrice and total number of items
//   processItemDetail(){
//     this.itemDetails.length = 0;
//     this.orderDetailMap.forEach(detail => {
//      const itemDetailsObj = {
//         itemId:'',
//         itemName:'',
//         itemQuantity:0,
//         price:0,
//         totalPrice:0
//       };
      
//       itemDetailsObj.itemId = detail.itemId;
//       itemDetailsObj.itemQuantity = detail.quantity;
//       const item = this.itemService.getItemByItemId(detail.itemId);
//       if(item){
//         itemDetailsObj.itemName = item.name;
//         itemDetailsObj.price = item.price;
//         itemDetailsObj.totalPrice = item.price * detail.quantity;
//         this.itemDetails.push(itemDetailsObj);
//       }
//     })
//   }
//   // chnage order type
//   changeOrderType(orderType:string){
//     this.orderType = orderType;
//   }

//   // order button click
//   handleOrderClick(){
//     this.isOrderBtnClicked = true;
//     if(this.orderLocation && this.order){
//       this.order.orderDetails = [];
//       this.order.locationId = this.orderLocation.id;
//       this.order.orderType = this.orderType;
//       this.order.note  = this.orderNote;
//       this.order.orderStatus = 'PENDING';

//       this.orderDetailMap.forEach(orderDetail =>{
//         this.order?.orderDetails.push(orderDetail);
//       });

//       // console.log("The big order ", this.order)

//       //send order
//       this.orderService.sendOrder(this.order).subscribe({
//         next: response => {
//         if(response.success){
//           this.orderSuccess = true;
//           this.showNotification = true;
//           this.notificationMessage = 'Order placed successfully';
//           setTimeout(()=>{
//             this.showNotification = false;
//             this.router.navigate(['menu']);
//             //reset orderDetail
//             this.orderDetailService.resetOrderDetail();
//             //reset order
//             this.orderService.resetOrder();
//             this.sharedService.toggleFooter(false);
//           }, 4000);
          
//         } 
        
//       }, 
//       error:(error:HttpErrorResponse)=>{
//           this.orderSuccess = false;
//           this.showNotification = true;
//           this.notificationMessage = 'Error: Please try again';
//           setTimeout(()=>{
//             this.showNotification = false;
//             this.orderSuccess = undefined;
//           }, 5000);
//       }
//     })
//     }
//   }
//   // make locaiotn undefined when locaiton type is changed.
//   onLocationTypeChange(){
//     this.isNumberClicked = false;
//     if(this.order && this.locationType){
//       this.locationNumber = undefined;
//     }
//   }
//   //location number clikced 
//   onLocationNumberClicked(){
//     this.isNumberClicked = true;
//     if(this.order && this.locationType){
//       this.isNumberListOpen = true;
//     }
//   }
//   // set location
//   setLocationNumber(location:OrderLocation){
//     this.isNumberListOpen = false;
//     this.locationNumber = location.number;
//     this.orderLocation = location;
//   }

//   getFilterLocations(){
//      const inputValue = this.locationNumber?.toString();
//      if(inputValue){
//       this.filteredLocations = this.filteredLocations.filter((location)=>
//         location.type === this.locationType && location.number.toString().startsWith(inputValue)
//       );    
//      } else{
//       this.filteredLocations = this.orderLocationList;
//      }
//   }

//   //close notification
//   closeNotification(){
//     this.showNotification = false;
    
//   }
  
//   ngOnDestroy(): void {
//      if(this.order){
//        if(this.orderLocation) this.order.locationId = this.orderLocation.id;
//        if(this.orderNote) this.order.note = this.orderNote;
//        if(this.orderType) this.order.orderType = this.orderType;
//        this.orderService.updateOrder(this.order);
//      }

//      this.orderSubscription?.unsubscribe();
//      this.orderDetialSubscription?.unsubscribe();
//   }

// }
