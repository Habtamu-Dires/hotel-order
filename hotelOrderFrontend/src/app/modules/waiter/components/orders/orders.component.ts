import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemsService, OrdersService } from '../../../../services/services';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatDistanceToNow } from 'date-fns';
import { OrderResponse } from '../../../../services/models';
import { ToastrService } from 'ngx-toastr';
import { WaiterService } from '../../services/waiter.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-orders',
  standalone: true,
  providers:[DatePipe],
  imports: [CommonModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  orderList:OrderResponse[] = [];
  filteredOrderList:OrderResponse[] = [];
  selectedOrderedItem?:OrderResponse;
  isDetailClicked:boolean = false;
  selectedStatus:string = 'READY';
  notificationSub?:Subscription;
  //counters map
  notifCounterMap = new Map<string,number>();


  statusList:string[] =[
    'READY', 'PENDING','VERIFIED','OnPROCESS', 
    'SERVED', 'BillREADY', 'COMPLETED', 'CANCELED'
  ];
  searchText:string = '';

  constructor(
    private ordereService:OrdersService,
    private datePipe:DatePipe,
    private toastrService:ToastrService,
    private waiterService:WaiterService
  ){}

  ngOnInit(): void {
    this.fetchBySatus(this.selectedStatus);
    this.OnOrderNotification();
    this.onOrderNotifCounterChange();
    this.resetNotifCounter();
  } 

  // order notification 
  OnOrderNotification(){
    this.notificationSub = this.waiterService.orderNotification$
    .subscribe(orderNotification => {
      const status = orderNotification.orderStatus;
      if(this.orderList && this.selectedStatus === status){
        this.orderList.push(orderNotification);
        this.filteredOrderList = this.orderList;
        this.resetNotifCounter();
      } 
    })
  }

  // order notification counter listener 
  onOrderNotifCounterChange(){
    this.waiterService.orderNotifCounter$.subscribe(map => {
      this.notifCounterMap = map;
    })
  }

  // reset counter to zero
  resetNotifCounter(){
    console.log("reseting ", this.selectedStatus);
    this.waiterService.updateOrderNotifCounterMap(this.selectedStatus, 0);
  }

  //select  status
  changeSelectedStatus(status:string){
    this.selectedStatus = status;
    this.fetchBySatus(status);
    this.resetNotifCounter();
  }

  //fetch by status type
  fetchBySatus(status:string){
    this.orderList = [];
    this.filteredOrderList = [];
    if(status === 'READY'){
      this.fetchReadyOrders();
    }else if(status === 'PENDING') {
      this.fetchPendingOrders();
    }else if(status === 'SERVED') {
      this.fetchServedOrders();
    }else if(status === 'OnPROCESS') {
      this.fetchOnProcessOrders();
    } else if(status === 'BillREADY') {
      this.fetchBillReadyOrders();
    }
  }

  // fetch pending orders
  fetchPendingOrders(){
    this.ordereService.getPendingOrders().subscribe({
      next:(res:OrderResponse[]) =>{
        this.orderList = res;
        this.filteredOrderList = res;
      },
      error:(err)=>{
        console.log(err)
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch ready orders
  fetchReadyOrders(){
    this.ordereService.getReadyOrders().subscribe({
      next:(res:OrderResponse[]) =>{
        this.orderList = res;
        this.filteredOrderList = res;
      },
      error:(err)=>{
        console.log(err)
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch served orders
  fetchServedOrders(){
    this.ordereService.getServedOrders().subscribe({
      next:(res:OrderResponse[]) =>{
        this.orderList = res;
        this.filteredOrderList = res;
      },
      error:(err)=>{
        console.log(err)
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch bill ready orders
  fetchBillReadyOrders(){
    this.ordereService.getBillReadyOrders().subscribe({
      next:(res:OrderResponse[])=>{
        this.orderList = res;
        this.filteredOrderList =res;
      },
      error:(err)=>{
        console.log(err)
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch On process orders
  fetchOnProcessOrders(){
    this.ordereService.getOnProcessOrders().subscribe({
      next:(res:OrderResponse[]) => {
        this.orderList =res;
        this.filteredOrderList = res;
      },
      error:(err)=>{
        console.log(err)
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }



  //current 
  onSearch(){
    if(this.searchText.length !== 0){
      this.filteredOrderList = this.orderList.filter(order =>{
        if(order.location?.number && order.location.type){
          return String(order.location.number).includes(this.searchText) || 
          order.location.type.toLocaleLowerCase().startsWith(this.searchText.toLocaleLowerCase())
        }
        return false;
      }) 
    } else {
      this.fetchBySatus(this.selectedStatus);
    }
  }

  toggleDetail(){
    this.isDetailClicked = !this.isDetailClicked;
  }

  openOrderedDetail(selectedOrderedItem:any){
    this.selectedOrderedItem = selectedOrderedItem;
    this.isDetailClicked = !this.isDetailClicked;
  }

  changeStatus(orderId:any,event:any){
    const status = event.target.value;
    this.ordereService.updateOrderStatus({
      'order-id': orderId as string,
      'newStatus': status
    }).subscribe({
      next:(res)=>{
        this.fetchBySatus(this.selectedStatus);
      },
      error:(err)=>{
        console.log(err)
        this.toastrService.error('Something went wrong', 'Ooops');
      }

    });
  }

 

  //transfrom date
  transformDate(dateString:any){
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'EEE, dd , y')
    return formattedDate;
  }

  //transfrom time
  transfromTime(dateString:any){
    const date = new Date(dateString);
    const fromattedTime = this.datePipe.transform(date, 'hh:mm a');
    return fromattedTime;
  }

  //transfrom  duaration
  transfromDuration(dateString:any){
    const date = new Date(dateString);
    const duration = formatDistanceToNow(date, {addSuffix: true})
    return duration;
  }

  // onDestory
  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
  }
  
}
