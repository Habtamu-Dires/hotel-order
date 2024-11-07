import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderedItemService } from '../services/orderedItem/ordered-item.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../services/models/api_response';
import { Order } from '../../services/models/order';
import { OrderedItem } from '../services/model/ordered-item';
import { ItemService } from '../../services/item/item.service';
import { Item } from '../../services/models/item';

@Component({
  selector: 'app-ordered-item',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './ordered-item.component.html',
  styleUrl: './ordered-item.component.scss'
})
export class OrderedItemComponent implements OnInit{

  orderedItemList:OrderedItem[] = [];
  filteredOrderedItems:OrderedItem[] = [];
  selectedOrderedItem?:OrderedItem;
  isDetailClicked:boolean = false;
  selectedStatus:string = 'All';

  statusList:string[] =['PENDING','OnPROCESS', 'READY', 'SERVED', 'BILLED', 'COMPLATED',
      'CANCELED'
  ];
  searchText:string = '';

  constructor(private orderedItemService:OrderedItemService,
    private itemService:ItemService
  ){}

  ngOnInit(): void {
    //fetch active orders
    this.orderedItemService.fetchActiveOrders().subscribe({
      next:((response:ApiResponse<Order[]>) => {
          this.orderedItemService.fillOrderedList(response.data);
          this.orderedItemList = this.orderedItemService.getOrderedItemList();
          this.filteredOrderedItems = this.orderedItemList;
      }),
      error:((error:HttpErrorResponse) =>{
        console.log(error);
      })
    });
    //fetch items
    this.itemService.fetchAvailableItems().subscribe({
      next:(response:ApiResponse<Item[]>)=>{
        this.itemService.setItems(response.data);
      },
      error:(error:HttpErrorResponse)=>{
      console.log(error);
      }
    }
  )
    
  }

  //current 
  onSearch(){
    this.filteredOrderedItems = this.orderedItemList.filter(order =>
      order.locationNumber.includes(this.searchText) || 
      order.locationType.toLocaleLowerCase().startsWith(this.searchText.toLocaleLowerCase())
    )
  }

  toggleDetail(){
    this.isDetailClicked = !this.isDetailClicked;
  }

  openOrderedDetail(selectedOrderedItem:OrderedItem){
    this.selectedOrderedItem = selectedOrderedItem;
    this.isDetailClicked = !this.isDetailClicked;
  }

  changeStatus(orderId:string,event:any){
    const status = event.target.value;
    this.orderedItemService.updateOrderStatus(orderId,status).subscribe({
      next:(response)=>{
        console.log(response);
      }
    })
  }

  //item
  getItemName(itemId:string){
    return this.itemService.getItemByItemId(itemId)?.name;
  }

  getItemPrice(itemId: string) {
    return this.itemService.getItemByItemId(itemId)?.price;
  }

  //change 
  changeSelectedStatus(status:string){
    this.selectedStatus = status;
    if(this.selectedStatus !== 'All'){
      this.filteredOrderedItems = this.orderedItemList.filter(order =>
        order.orderStatus === this.selectedStatus
      );
    } else {
      this.filteredOrderedItems = this.orderedItemList;
    }
    
  }
  

} 
