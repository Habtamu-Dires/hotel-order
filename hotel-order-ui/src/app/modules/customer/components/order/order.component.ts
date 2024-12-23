import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdResponse, ItemResponse, LocationResponse, OrderDetailRequest, OrderRequest } from '../../../../services/models';
import { LocationsService,OrdersService } from '../../../../services/services';
import { CustomerService } from '../../services/customer/customer.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit, OnDestroy {

  // order request initial
  orderRequest:OrderRequest ={
    orderType: '', 
    orderDetails:[],
    totalPrice: 0,
    locationId: ''
  }
  orderType:string = 'DINE_IN';
  orderDetailMap = new Map<string,OrderDetailRequest>;
  itemDetails:ItemResponse[] = [];
  tempLocInfoHolder = {type:'', number: Number(undefined)}
  isOrderBtnClicked:boolean = false;
  orderNote?:string;
  locationList:LocationResponse[] = [];
  orderLocation?:LocationResponse;
  filteredLocations:LocationResponse[] = [];
  isLocNumFocused:boolean = false;
  isNumberInputOnFocus:boolean = false;
  isNumberMenuVisible:boolean = false;

  @Output() orderCompleted:EventEmitter<{}> = new EventEmitter<{}>();

  //subscription
  orderSub?:Subscription;
  itemDetialMapSub?:Subscription;

  constructor(
        private orderService:OrdersService,
        private locationService:LocationsService,
        private customerSevice:CustomerService,
        private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    // fetch location
    this.fetchLocations();

    // get item detail map
    this.getItemDetailMapChange();

    // order 
    this.getOrderChange();

  } 

  // truck order change
  getOrderChange(){
    this.orderSub = this.customerSevice.orderRequest$
    .pipe(debounceTime(200))  // to wait for a location to be fetched
    .subscribe(orderRequest => {
      this.orderRequest = orderRequest;
      // retain the location information
      if(this.orderRequest.locationId){
        this.orderLocation = this.locationList
          .find(loc => loc.id == this.orderRequest?.locationId);
        this.tempLocInfoHolder.number = this.orderLocation?.number as number;
        this.tempLocInfoHolder.type = this.orderLocation?.type as string;
      }
    })
  }

  // track item-detail-map change
  getItemDetailMapChange(){
    this.itemDetialMapSub = this.customerSevice.itemMap$
    .subscribe(itemMap =>{
      this.orderDetailMap = itemMap;
    })
  }

   // fetch location 
  fetchLocations(){
    this.locationService.getAllOrderLocations().subscribe({
      next:(res:LocationResponse[]) => {
        this.locationList = res;
        this.filteredLocations = res;
      },
      error:(err) => {
        console.log(err);
      }
    })
  }
  
  // increment 
  increment (orderDetail:OrderDetailRequest){
    orderDetail.quantity = Number(orderDetail.quantity) + 1;
    this.customerSevice.updateItemOrderDetail(orderDetail.itemId as string, orderDetail);
  }

  // decrement
  decrement(orderDetail:OrderDetailRequest) {
    if(orderDetail.quantity === 1){
      this.customerSevice.deleteItemOrderDetail(orderDetail.itemId as string);
    } else {
    orderDetail.quantity = Number(orderDetail.quantity) - 1;
      this.customerSevice.updateItemOrderDetail(orderDetail.itemId as string,orderDetail);
    }
  }

  // send order request
  handleOrderClick(){
    this.isOrderBtnClicked = true;
    if(this.orderLocation){
      this.orderRequest.orderDetails = [];
      this.orderRequest.locationId = this.orderLocation.id as string;
      this.orderRequest.orderType = this.orderType;
      this.orderRequest.note  = this.orderNote;
       
      // add order detail 
      this.orderDetailMap.forEach(orderDetail =>{
        console.log(orderDetail.itemName);
        this.orderRequest.orderDetails?.push(orderDetail);
      });

      console.log("The big order ", this.orderRequest);
      console.log(this.orderRequest.orderDetails?.length);

      // send  create order request
    this.orderService.createOrder({
      body: this.orderRequest as OrderRequest
    }).subscribe({
      next:(res:IdResponse) =>{
        this.toastrService.success('Order successfully send', 'Done!')
       
        //reset order
        this.customerSevice.resetOrderDetailMap();
        this.orderRequest.orderDetails = [];
        this.orderRequest.totalPrice = 0;
        this.customerSevice.resetOrderRequest(this.orderRequest);
        // emit order completed event
        this.orderCompleted.emit();
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error(err.error.error,'Oops');
      }
    })
    } 
   
  }

  // change order type
  changeOrderType(orderType:string){
    this.orderType = orderType;
  }

  //onLocation type change
  onLocationTypeChange(){
    if(this.tempLocInfoHolder.type) {
      this.tempLocInfoHolder.number = Number(undefined);
      this.isNumberInputOnFocus = false;
      this.orderLocation = undefined;
    }
  }
  //onLocation number clicked
  onNumberInputFocus(){
    this.isNumberInputOnFocus = true;
    this.isNumberMenuVisible = true;
  }
  //get filtered location
  getFilteredLocations(){
    const inputValue = this.tempLocInfoHolder.number?.toString();
    if(inputValue){
     this.filteredLocations = this.filteredLocations.filter((location) =>
      location.type === this.tempLocInfoHolder.type && location.number?.toString().startsWith(inputValue)
    );
    } else {
      this.filteredLocations = this.locationList;
      this.tempLocInfoHolder.number = Number(undefined);
      this.orderLocation = undefined;
    }
  }

  //set location number
  setLocationNumber(location:LocationResponse){
    this.tempLocInfoHolder.number = Number(location.number);
    this.orderLocation = location;
    this.isNumberMenuVisible = false;
  }

  // calculat total price
  calculateTotalPrice(quantity:any, price:any){
    return Number(quantity) * Number(price);
  }

  
  ngOnDestroy(): void {
    // save location,note datas for later use
     if(this.orderRequest){
       if(this.orderLocation) this.orderRequest.locationId = this.orderLocation.id as string;
       if(this.orderNote) this.orderRequest.note = this.orderNote;
       if(this.orderType) this.orderRequest.orderType = this.orderType;
       this.orderRequest.orderDetails = [];
       this.customerSevice.updateOrder(this.orderRequest);
     }

     this.orderSub?.unsubscribe;
     this.itemDetialMapSub?.unsubscribe;
  }

}
