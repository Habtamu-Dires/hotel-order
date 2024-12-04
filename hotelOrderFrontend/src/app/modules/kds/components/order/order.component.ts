import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {formatDistanceToNow, differenceInMinutes} from 'date-fns';
import { OrderResponse } from '../../../../services/models';
import { OrderDetailsService, OrdersService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';
import  SockJS from 'sockjs-client';
import  Stomp from 'stompjs';
import { TokenService } from '../../../../services/token/token.service';
import { KdsService } from '../../services/kds.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  providers:[DatePipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy{
  
  orderList:OrderResponse[] = [];
  statusList:string[] =['READY','OnPROCESS', 'CANCELED'];
  currentOrderId?:string;
  socketClient:any = null;
  orderNotifSub:any;


  constructor(
    private orderService:OrdersService,
    private datePipe:DatePipe,
    private toastrService:ToastrService,
    private orderDetailService:OrderDetailsService,
    private tokenService:TokenService,
    private kdsService:KdsService
  ){}

  ngOnInit(): void {
    this.fetchVerfiedOrOnProcessOrders();
    this.onNewVerifiedOrderNotification();
  }

  // on order staus change
  onNewVerifiedOrderNotification(){
    let ws = new SockJS('http://localhost:8088/api/v1/ws');
    this.socketClient = Stomp.over(ws);
    this.socketClient.connect(
      {'Authorization:': `Bearer ${this.tokenService.token}`},
      ()=>{
        this.orderNotifSub = this.socketClient
        .subscribe('/user/chef/notification',
        (message:any)=>{
          const orderNotification:OrderResponse = JSON.parse(message.body);
          const status = orderNotification.orderStatus;
          this.fetchVerfiedOrOnProcessOrders();
        });
      }
    )
  }

  // fetch verified orders
  fetchVerfiedOrOnProcessOrders(){
    this.orderService.getVerifiedOrOnProcessOrders().subscribe({
      next:(res:OrderResponse[]) =>{
        this.orderList = res;
        this.kdsService.updateOrderList(res);
      },
      error:(err) =>{
        console.log(err);
        this.toastrService.error('Something Went Wrong', 'Oops');
      }
    })
  }

  // is checked
  isChecked(satus:any){
    return String(satus) === 'PROCESSED';
  }

  // on Status change 
  onStatusChange(orderId:any, status:string){
    this.orderService.updateOrderStatus({
      'order-id': orderId,
      'status': status
    }).subscribe({
      next:(res)=>{
        this.currentOrderId = undefined;
        this.fetchVerfiedOrOnProcessOrders();
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // hide drop down status list
  @HostListener('document:click', ['$event'])
  onClickOutSideDropdown(event:MouseEvent){
    const target = event.target as HTMLElement;
    if(!target.classList.contains('donthide')){
      this.currentOrderId = undefined;
    }
  }


  // change order status 
  toggleDetailStatus(detailId:any, status:any){
    let newStatus = '';
    if(status === 'PENDING') {
      newStatus = 'PROCESSED';
    } else if(status === 'PROCESSED'){
      newStatus = 'PENDING';
    }
    this.orderDetailService.updateOrderDetailStatus({
      'detail-id': detailId,
      'status': newStatus
    }).subscribe({
      next:(res) =>{
        this.fetchVerfiedOrOnProcessOrders();
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

   //transfrom date
  transformDate(dateString:any){
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'EEE, dd')
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
    const duration = formatDistanceToNow(date)
    return duration;
  }

  // difference in minute
  differenceInMinute(dateString:any){
    const date = new Date(dateString);
    const difference = differenceInMinutes(new Date(),date);
    return difference;
  }

  ngOnDestroy(): void {
    // disconnect the websocket
    if(this.socketClient && this.socketClient.connected){
      this.socketClient.disconnect();
    }
  }
}
