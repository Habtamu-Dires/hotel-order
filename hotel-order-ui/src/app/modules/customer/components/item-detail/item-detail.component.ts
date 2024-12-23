import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { ItemResponse, OrderDetailRequest } from '../../../../services/models';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit, OnDestroy {

  itemCounter:number = 0;
  isFooterExpanded:boolean = false;
  orderDetailRequest?:OrderDetailRequest;
  @Input() selectedItem:ItemResponse | undefined;
  @Output() backToItmes:EventEmitter<boolean> = new EventEmitter<boolean>();
  //subscription
  itemDetailMapSub?:Subscription;

  constructor(
    private customerSevice:CustomerService
  ){}

  ngOnInit(): void {
    //order-detail-service
    this.onItemDetailMapChange();
  };

  // item detail map listner
  onItemDetailMapChange(){
    this.itemDetailMapSub = this.customerSevice.itemMap$
    .subscribe(itemMap => {
      this.orderDetailRequest = itemMap.get(this.selectedItem?.id as string);
      if(this.orderDetailRequest){
        this.itemCounter = this.orderDetailRequest.quantity as number;        
      } else {
        this.itemCounter = 0;
        //initialize order detail request
        this.orderDetailRequest = {
            itemId: this.selectedItem?.id, 
            quantity: 0, 
            price: this.selectedItem?.price as number,
            itemName: this.selectedItem?.name as string
        }
      }
    })
  }
  // cancel item
  cancelItem(){
    this.customerSevice.deleteItemOrderDetail(this.selectedItem?.id as string);
    this.navigateToItems();
  }


  increment(){
    this.itemCounter += 1;
    if(this.orderDetailRequest){
      this.orderDetailRequest.quantity = this.itemCounter;
      this.customerSevice.updateItemOrderDetail(this.selectedItem?.id as string, this.orderDetailRequest);
    }

  }

  decrement(){
    this.itemCounter -= 1;
    if(this.orderDetailRequest){
      if(this.itemCounter === 0){
        this.customerSevice.deleteItemOrderDetail(this.selectedItem?.id as string);
      } else{
        this.orderDetailRequest.quantity = this.itemCounter;
        this.customerSevice.updateItemOrderDetail(this.selectedItem?.id as string,this.orderDetailRequest);
      }
    }
   
  }

  navigateToItems(){
    this.backToItmes.emit(true);
  }

  ngOnDestroy(): void {
    this.itemDetailMapSub?.unsubscribe;
  }
}
