import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from "../order/order.component";
import { OrderRequest } from '../../../../../../services/models';
import { CustomerService } from '../../service/customer/customer.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, OrderComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{
  
   orderRequest?:OrderRequest;
   shouldBounce:boolean = false;
   totalItems:number = 0;
   previousTotalItems:number = 0;
   @Input() isFooterExpanded:boolean = false;
   @Output() footerToggled:EventEmitter<{}> = new EventEmitter<{}>();
   @Output() orderCompleted:EventEmitter<{}> = new EventEmitter<{}>();

  constructor(
    private customerService:CustomerService
  ){}

  ngOnInit(): void {

    // track  order request chnage
    this.orderReqeustChange();
    
    // total ordered items
    this.totalOrderedItemsChange();
  }

  // listent order request update
  orderReqeustChange(){
    this.customerService.orderRequest$.subscribe(orderRequest =>{
      if(this.orderRequest && this.previousTotalItems < this.totalItems) {
        this.triggerBounce();
      }
      this.orderRequest = orderRequest;
      this.previousTotalItems = this.totalItems;
    })
  }

  // track total ordered items
  totalOrderedItemsChange(){
    this.customerService.totalOrderedItems$.subscribe(totalItems =>{
      this.totalItems = totalItems;
    })
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
    this.footerToggled.emit();
  }

  // on order completed
  onOrderCompleted(){
    this.toggleFooter();
    this.orderCompleted.emit();
  }

 }
