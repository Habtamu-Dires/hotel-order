import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryResponse, ItemResponse, OrderDetailRequest } from '../../../../../../services/models';
import { ItemsService } from '../../../../../../services/services';
import { CustomerService } from '../../service/customer/customer.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit, OnDestroy {
   
  orderQuantityList:[] = [];
  category:CategoryResponse = {};
  itemDetailMap = new Map<string,OrderDetailRequest>();
  @Input() itemList:ItemResponse[] = [];
  @Input() fromItemDetail:boolean = false;
  @Input() isOnSearchMode:boolean = false;
  @Output() onItemSelected:EventEmitter<any[]> = new EventEmitter<any[]>();
  //subscription
  selectedCategorySub?:Subscription;
  itemDetailMapSub?:Subscription;
  searchSub?:Subscription;

   
  constructor(
    private itemService:ItemsService,
    private customerService:CustomerService
  ){}

  ngOnInit(): void {
    // listen selected categry changes
    this.onSelectedCategoryChanged();
    // listen to item order detail changes  // to calcualt ordered quantity of items
    this.onItemDetailMapChanges();
    // on search text changed
    this.onSearchedTextChange();
  }

  // calculate order quantity for items
  calcualteOrderQuantity(itemId:any){
    return this.itemDetailMap.get(itemId)?.quantity;
  } 


  // selected category tracker
  onSelectedCategoryChanged(){
    this.selectedCategorySub = this.customerService.selectedCategory$
    // .pipe(debounceTime(200)) 
    .subscribe((category)=>{
      this.category = category;
      if(category.id && !this.fromItemDetail)  {
        this.itemList= [];
        this.fetchItemByCategory(category);
      } // this is to avoid request to the server from item detail
       else if(this.fromItemDetail){  
        this.fromItemDetail = false;
      }
    }) 
  }
  
  // fetch items by id
  fetchItemByCategory(category:CategoryResponse){
    this.itemService.getItemsByCategory({
        'category-id' : category.id as string
    }).subscribe({
        next:(res:ItemResponse[])=>{
            this.itemList.push(...res);
            // fetch subcategory items
            if(category.subCategories && category.subCategories.length !== 0){          
              category.subCategories.forEach(cat => {
                this.fetchItemByCategory(cat);
              })
            }            
        },
        error:(err) =>{console.log(err)}
    })
  } 

  // listen on item detail changes
  onItemDetailMapChanges(){
    this.itemDetailMapSub = this.customerService.itemMap$
    .subscribe(itemMap =>{
      this.itemDetailMap = itemMap;
    })
  }

  // on search text changed
  onSearchedTextChange(){
    this.searchSub = this.customerService.searchedText$
    .subscribe((text:string)=>{
      const name = text.trim();
      if(name.length >= 3){
        this.itemService.searchItemsByName({
          'category-id' : '',
          'item-name': name
        }).subscribe({
          next:(res:ItemResponse[]) => {
            this.itemList = res;
          },
          error:(err) => {
            console.log(err);
          }
        })
      } else if(!this.fromItemDetail){
        this.itemList = [];
        this.fetchItemByCategory(this.category);
      }
    })
  }

  // show item detail
  showItemDetail(item:any){
    this.onItemSelected.emit([item,this.itemList]);
  }

  ngOnDestroy(): void {
    this.selectedCategorySub?.unsubscribe;
    this.searchSub?.unsubscribe;
    this.itemDetailMapSub?.unsubscribe;
  }

}
