import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { IdResponse, OrderResponse } from '../../../../services/models';
import { OrdersService } from '../../../../services/services';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatDistanceToNow } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { CashierService } from '../../services/cashier.service';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { TokenService } from '../../../../services/token/token.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,FormsModule],
  providers:[DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{
  

  orderList:OrderResponse[] = [];
  filteredOrderList:OrderResponse[]=[];
  selectedOrder?:OrderResponse;
  currentOrderId?:string;
  isDetailClicked:boolean = false;
  statusList = ['BillREADY'];
  socketClient:any = null;

  constructor(
    private orderService:OrdersService,
    private datePipe:DatePipe,
    private toastrService:ToastrService,
    private cashierService:CashierService,
    private tokenService:TokenService
  ){}

  ngOnInit(): void {
    this.fetchBillRequestOrders();
    this.onSearchedNameChanged();
    this.onBillRquestNotification();
  }

  //on bill request notification
  onBillRquestNotification(){
    let ws = new SockJS('http://localhost:8088/api/v1/ws');
    this.socketClient = Stomp.over(ws);
    this.socketClient.connect(
      {'Authorization:': `Bearer ${this.tokenService.token}`},
      ()=> {
        this.socketClient.subscribe(
         '/user/cashier/notification',
          (message:any) => {
            const notification:OrderResponse = JSON.parse(message.body);
            this.orderList.push(notification);
            this.filteredOrderList = this.orderList;
          }
        )
      }
    )
  }

  // fetch Bill Request orders
  fetchBillRequestOrders(){
    this.orderService.getOrdersByStatus({
      'status': 'BillREQUEST'
    }).subscribe({
      next:(res:OrderResponse[]) => {
        this.orderList = res;
        this.filteredOrderList = res;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Somehting went wrong', 'Ooops');
      }
    })
  }

  //on seach
  onSearchedNameChanged(){
    this.cashierService.searchedItemName$.subscribe(searchedName =>{
      if(searchedName.length > 2){
        this.filteredOrderList = this.orderList.filter(order =>{
          if(order.location?.number && order.location.type){
            return String(order.location.number).includes(searchedName) || 
            order.location.type.toLocaleLowerCase().startsWith(searchedName.toLocaleLowerCase())
          }
          return false;
        }) 
      } else {
        this.fetchBillRequestOrders();
      }
    })
  }

   //click listener to hide drop down menu of staus list
   @HostListener('document:click',['$event'])
   onClickOutSideDropDown(event: MouseEvent){
     const target = event.target as HTMLElement;
     if(!target.classList.contains('donthide')){
       this.currentOrderId = undefined;
     }
   }

  // toggle detail
  toggleDetail(){
    this.isDetailClicked = !this.isDetailClicked;
  }

  // open order detail
  openOrderedDetail(selectedOrder:any){
    this.selectedOrder = selectedOrder;
    this.isDetailClicked = !this.isDetailClicked;
  }


  // change order detail status
  changeStatus(orderId:any,status:any, totalPrice:any){
    this.currentOrderId = undefined;
    this.orderService.updateOrderStatus({
      'order-id': orderId as string,
      'status': status
    }).subscribe({
      next:(res:IdResponse)=>{
       this.fetchBillRequestOrders();
       this.cashierService.updateInfoMap(totalPrice);
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

  // on destroy
  ngOnDestroy(): void {
    if(this.socketClient && this.socketClient.connected){
      this.socketClient.disconnect();
    }
  }

}
