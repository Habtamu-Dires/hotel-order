import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
  
  currentOrder?:string;

  // statusList:string[] =[
  //   'READY','OnPROCESS', 'PENDING','VERIFIED','SERVED', 'BillREADY', 'COMPLETED', 'CANCELED',
  // ];
  statusList:string[] =['COMPLETED', 'CANCELED'];
  searchText:string = '';

  constructor(
    private orderService:OrdersService,
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
    this.waiterService.updateOrderNotifCounterMap(this.selectedStatus, 0);
  }

  //click listener to hide drop down menu of staus list
  @HostListener('document:click',['$event'])
  onClickOutSideDropDown(event: MouseEvent){
    const target = event.target as HTMLElement;
    if(!target.classList.contains('donthide')){
      this.currentOrder = undefined;
    }
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
      this.fetchOrdersByStatus('READY');
      this.statusList = ['SERVED', 'COMPLETED', 'CANCELED'];

    }else if(status === 'PENDING') {
      this.fetchOrdersByStatus('PENDING');
      this.statusList = ['VERIFIED', 'CANCELED'];

    }else if(status === 'VERIFIED') {
      this.fetchOrdersByStatus('VERIFIED');
      this.statusList = ['CANCELED'];

    }else if(status === 'SERVED') {
      this.fetchOrdersByStatus('SERVED');
      this.statusList = ['BillREQUEST','COMPLETED', 'CANCELED'];

    }else if(status === 'OnPROCESS') {
      this.fetchOrdersByStatus('OnPROCESS');
      this.statusList = ['COMPLETED', 'CANCELED'];

    } else if(status === 'BillREADY') {
      this.fetchOrdersByStatus('BillREADY');
      this.statusList = ['COMPLETED', 'CANCELED'];

    }
  }

  // fetch orders by status
  fetchOrdersByStatus(status:string){
    this.orderService.getOrdersByStatus({
      'status':status
    }).subscribe({
      next:(res:OrderResponse[]) =>{
        this.orderList = res;
        this.filteredOrderList = res;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // change order detail status
  changeStatus(orderId:any,status:any){
    this.currentOrder = undefined;
    this.orderService.updateOrderStatus({
      'order-id': orderId as string,
      'status': status
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

  //on seach
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

  // toggle detail
  toggleDetail(){
    this.isDetailClicked = !this.isDetailClicked;
  }

  // open order detail
  openOrderedDetail(selectedOrderedItem:any){
    this.selectedOrderedItem = selectedOrderedItem;
    this.isDetailClicked = !this.isDetailClicked;
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
