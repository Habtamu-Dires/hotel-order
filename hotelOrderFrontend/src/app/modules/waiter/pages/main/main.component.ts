import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SideBarItemComponent } from "../../components/side-bar-item/side-bar-item.component";
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderResponse, UserResponse } from '../../../../services/models';
import { UsersService } from '../../../../services/services';
import { TokenService } from '../../../../services/token/token.service';
import { WaiterService } from '../../services/waiter.service';
import  SockJS from 'sockjs-client';
import  Stomp from 'stompjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SideBarItemComponent,RouterOutlet,CommonModule],
  providers:[DatePipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {

  activeComponent:string = 'Orders';
  waiterUser:UserResponse | undefined;
  hideSideBar:boolean = true;
  showHideButton:boolean = false;
  socketClient:any = null;
  orderNotifSub:any;
  mainNotifCounterMap = new Map<string,number>();
  orderNotifCounterMap = new Map<string,number>();
  reqNotifCounterMap = new Map<string,number>();
  

  constructor(
    private datePipe:DatePipe,
    private userService:UsersService,
    private tokenService:TokenService,
    private router:Router,
    private waiterService:WaiterService,
    private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    this.fetchLoggedUser();
    this.setComponent(this.activeComponent);
    this.checkScreenSzie(window.innerWidth);
    this.onHideSideBarStatusChange();
    
    // socket 
    this.onNotification();
    this.onNotifCounterMapChange(); 
    
  }

  //  notification listener
  onNotification(){
    // const roles = this.tokenService.getUserRole();
    let ws = new SockJS('http://localhost:8088/api/v1/ws');
    this.socketClient = Stomp.over(ws);
    this.socketClient.connect(
      {'Authorization:': `Bearer ${this.tokenService.token}`},
      ()=>{
        this.orderNotifSub = this.socketClient.subscribe(
          '/user/waiter/notification',
          (message:any)=>{
            const notification = JSON.parse(message.body);
            
            // notification is OrderResponse
            if('orderDetails' in notification){ 
              const status = notification.orderStatus;
              console.log("status");
              // display message
              this.displayOrderNotifMsg(status);
              // update notif cunter for each status
              const stausList = ['READY', 'BillREADY', 'PENDING'];
              if(stausList.includes(status)){
                if(this.orderNotifCounterMap.get(status)){
                  const value = Number(this.orderNotifCounterMap.get(status)) + 1;
                  this.waiterService.updateOrderNotifCounterMap(status,value);
                } else {
                  this.waiterService.updateOrderNotifCounterMap(status, 1);
                }
              }
              //update order notification
              this.waiterService.updateOrderNotification(notification);
              
            }  // service request notification
            else if('serviceType' in notification && 'serviceStatus' in notification){
              const type = notification.serviceType;
              // display message
              this.toastrService.info(`New ${type} Request`);
              // update notification counter for call and bill
              if(this.reqNotifCounterMap.get(type)){
                const value = Number(this.reqNotifCounterMap.get(type)) + 1;
                this.waiterService.updateRequestNotifCounterMap(type,value);
              } else {
                this.waiterService.updateRequestNotifCounterMap(type, 1);
              }
              // update request notification
              this.waiterService.updateRequestNotification(notification);
            }
          }
        )
      }
    );
  }

  // notifCounterMap
  onNotifCounterMapChange(){
    // on order notification counter change
    this.waiterService.orderNotifCounter$.subscribe(map =>{
      this.orderNotifCounterMap = map;
      const orderNotifCount = this.calulateTotalNotif(map);
      this.mainNotifCounterMap.set('Orders', orderNotifCount);
    });

    // on request notification counter change
    this.waiterService.requestNotifCounter$.subscribe(map =>{
      this.reqNotifCounterMap = map;
      const reqNotifCount = this.calulateTotalNotif(map);
      this.mainNotifCounterMap.set('Request', reqNotifCount);
    })
  }

  // calulate total notif for a component
  calulateTotalNotif(map:Map<string,number>){
    let total = 0;
    map.forEach(val => {total += val;})
    return total;
  }
  // display order message based on status
  displayOrderNotifMsg(status:any){
    if(status && status === 'PENDING'){
      this.toastrService.info('New Order Request');
    } else if(status && status === 'READY') {
      this.toastrService.info('Order Ready');
    } else if(status && status === 'BillREADY'){
      this.toastrService.info('Bill Ready');
    } 
  }

  // fetch currrent waiter
  fetchLoggedUser(){
    this.userService.getLoggedUser().subscribe({
      next:(res:UserResponse) =>{
        this.waiterUser = res;
      },
      error:(err)=> {console.log(err);}
    })
  }
  // on sidebar status change
  onHideSideBarStatusChange(){
    this.waiterService.hideSideBarStatus$.subscribe(status =>{
      this.hideSideBar = status;
    })
  }


  get currentDate(){
    const now = new Date();
    return this.datePipe.transform(now, 'EEE, MMM dd, y');
  }


  setComponent(component:string){
    this.activeComponent = component;
    if(this.showHideButton){
      this.waiterService.updateHideSideBarStatus(true);
    }
    this.router.navigate(['waiter', component.toLocaleLowerCase()])
  }

  logout(){
    this.tokenService.removeToken();
    this.router.navigate(['login']);
  }

  // Listen for window resize events
  @HostListener('window:resize',['$event'])
  onResize(event:any){
    this.checkScreenSzie(event.target.innerWidth);
  }

  // check screen size and set hideSideBar value
  private checkScreenSzie(width:number){
    if (width < 768) { // Small screen threshold (can be adjusted)
      this.waiterService.updateHideSideBarStatus(true);
      this.showHideButton = true;
    } else {
      this.waiterService.updateHideSideBarStatus(false);
      this.showHideButton = false;
    }
  }

  // show hide button
  onShowHideButton(){
    this.hideSideBar = true;
    this.checkScreenSzie(window.innerWidth);
  }


  toggleSideBar(){
    this.hideSideBar = !this.hideSideBar;
    this.waiterService.updateHideSideBarStatus(this.hideSideBar);
   }

   ngOnDestroy(): void {
    // disconnect the websocket s
    if(this.socketClient && this.socketClient.connected){
      this.socketClient.disconnect();
    }
  }

}
