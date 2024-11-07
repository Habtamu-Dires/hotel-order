import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../services/shared/shared.service';
import { OrderComponent } from "../order/order.component";
import { OrderDetialService } from '../services/orderDetail/order-detial.service';
import { OrderService } from '../services/order/order.service';
import { Order } from '../services/models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,OrderComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  
   isExpanded?:boolean;
   order?:Order;
   shouldBounce:boolean = false;
   totalItems:number = 0;
   previousTotalItems:number = 0;

  constructor(
    private sharedService:SharedService,
    private orderService:OrderService
  ){}

  ngOnInit(): void {
    //order
    this.orderService.order$.subscribe(order => {
      if(this.order && this.previousTotalItems < this.totalItems){
        this.triggerBounce();
        this.order = order;
        this.previousTotalItems = this.totalItems;
      } else{
        this.order = order;
        this.previousTotalItems = this.totalItems;
      }
    });
    this.sharedService.totalOrderItems$.subscribe(totalItems =>{
      this.totalItems = totalItems;
    })
    //footer
    this.sharedService.isFooterExpanded$.subscribe((isExpanded)=>{
      this.isExpanded = isExpanded;
    });
  }

  //trigger bounce
  triggerBounce(){
    setTimeout(()=>{
      this.shouldBounce = true;
      setTimeout(()=>{
        this.shouldBounce =false;
      },500);
    },0);
  }
  //toogle footer
  toggleFooter(){
    this.sharedService.toggleFooter(!this.isExpanded);
  }

}
