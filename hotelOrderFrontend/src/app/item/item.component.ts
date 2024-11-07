import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemService } from '../services/item/item.service';
import { Item } from '../services/models/item';
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared/shared.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderDetialService } from '../services/orderDetail/order-detial.service';
import { CategoryService } from '../services/category/category.service';
import { ApiResponse } from '../services/models/api_response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit, OnDestroy {
   
  private categoryId?:string;
  itemList:Array<Item> = [];
  sharedServiceSub?:Subscription;
  orderDetailSub?:Subscription;
  orderQuantityList:number[]= [];
  private routeKey:string = 'menu';
   
  constructor(private itemService:ItemService,
              private categoryService:CategoryService,
              private router:Router,
              private orderDetailService:OrderDetialService,
              private sharedService:SharedService
  ){}

  ngOnInit(): void { 
    this.itemService.fetchAvailableItems().subscribe({
      next:(itemResponse:ApiResponse<Item[]>) =>{
        this.itemService.setItems(itemResponse.data);
        
        //category
        this.sharedServiceSub = 
        this.categoryService.selectedCategory$.subscribe((categoryId) => {
          this.categoryId = categoryId;
          this.itemList = this.getItemByCategoryId(this.categoryId);
          if(this.itemList){ 
            this.orderQuantityList = [];
            this.orderDetailSub  = this.orderDetailService.itemMap$.subscribe(orderDetail =>{
              this.itemList.forEach(item => {
                  const quantity = orderDetail.get(item.id)?.quantity;
                  this.orderQuantityList.push(quantity ? quantity : 0);
              })
            })
            
          }
        }); 
        
      },
      error:(error:HttpErrorResponse)=>{
        console.log(error);
      }
    });
  }

  getItemByCategoryId(categoryId:string){
    let items = this.itemService.getItemsbyCategoryId(categoryId);
    if(items === undefined) return [];
    return items;
  }

  navigateToItemDetail(itemId:string){
    this.itemService.setSelectedItemId(itemId);
    const currentPosition = window.scrollY;   //set scroll position
    this.sharedService.setScrollPosition(this.routeKey,currentPosition);
    this.router.navigate(['item-detail']);
  }

  ngOnDestroy(): void {
    this.sharedServiceSub?.unsubscribe();
    this.orderDetailSub?.unsubscribe();
  }



}
