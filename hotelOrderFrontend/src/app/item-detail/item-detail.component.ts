import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { SharedService } from '../services/shared/shared.service';
import { Item } from '../services/models/item';
import { ItemService } from '../services/item/item.service';
import { OrderService } from '../services/order/order.service';
import { OrderDetialService } from '../services/orderDetail/order-detial.service';
import { OrderDetail } from '../services/models/orderDetail';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [RouterModule, FooterComponent,CommonModule],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent implements OnInit, OnDestroy {

  selectedItemId:string = '';
  item?:Item;
  itemCounter:number = 0;
  isFooterExpanded:boolean = false;
  orderDetail?:OrderDetail;
  orderDetialServiceSub?:Subscription; 
  private totalOrderItems?:number; 

  constructor(
    private itemService:ItemService,
    private location:Location,
    private sharedService:SharedService,
    private orderDetailService:OrderDetialService,
    private orderService:OrderService
  ){}

  ngOnInit(): void {
    // selected item.
    const selectedItemId = this.itemService.getSelectedItemId()
    if(selectedItemId){
      this.selectedItemId= selectedItemId;
      this.item = this.itemService.getItemByItemId(this.selectedItemId);

      //order-detail
      this.orderDetialServiceSub =
      this.orderDetailService.itemMap$.subscribe(orderDetailMap => {
        this.orderDetail = orderDetailMap.get(this.selectedItemId);
        if(this.orderDetail){
          this.itemCounter = this.orderDetail.quantity;
          this.orderService.processOrdetailMap(orderDetailMap);
       } else {
          // initial order detail
          this.itemCounter = 0;
          this.orderDetail = this.getInitialOrderDetail(this.selectedItemId);
       }
      });

      //total order items
      this.sharedService.totalOrderItems$.subscribe(totalOrderItems =>{
        this.totalOrderItems = totalOrderItems;
      });
       
    }

    //footer status
    this.sharedService.isFooterExpanded$.subscribe((isExpanded)=>{
      this.isFooterExpanded = isExpanded;
    })
  };

  getInitialOrderDetail(itemId:string){
    return { id:'',itemId:itemId,quantity:0, orderId:'',
       type:'', note:'', satus:''
    }
  }

  increment(){
    this.itemCounter += 1;
    if(this.orderDetail){
      this.orderDetail.quantity = this.itemCounter;
      this.orderDetailService.updateOrderDetail(this.selectedItemId,this.orderDetail);
    }
  }

  decrement(){
    this.itemCounter -= 1;
    if(this.orderDetail){
      if(this.itemCounter === 0){
        this.orderDetailService.deleteOrderDetail(this.selectedItemId);
        //reduce total item
        const totalItems = this.totalOrderItems;
        this.sharedService.updateTotalOrderItems(totalItems ? totalItems -1 : 0);
      } else{
        this.orderDetail.quantity = this.itemCounter;
        this.orderDetailService.updateOrderDetail(this.selectedItemId,this.orderDetail);
      }
    }
  }

  navigateToItems(){
     this.location.back();
    //this.router.navigate(['menu'])
  }

  //footer
  toggleFooter(){
    this.isFooterExpanded = !this.isFooterExpanded;
    this.sharedService.toggleFooter(this.isFooterExpanded);
  }

  shrinkFooter(){
    if(this.isFooterExpanded == true){
      this.isFooterExpanded = false;
    this.sharedService.toggleFooter(this.isFooterExpanded);
    
    }
  }

  ngOnDestroy(): void {
    this.orderDetialServiceSub?.unsubscribe();

  }
}
