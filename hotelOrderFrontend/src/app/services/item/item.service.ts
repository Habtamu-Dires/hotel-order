import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { catchError, count, delay, Observable, retry, throwError } from 'rxjs';
import { ApiResponse } from '../models/api_response';
import { CategoryService } from '../category/category.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemsList:Array<Item> = [];  

  private baseurl:string;
  private itemMapByCategory = new Map<string,Item[]>;
  private itemMapById = new Map<string,Item>;
  selectedItemId?:string;

  constructor(private http:HttpClient,
    private sharedService:SharedService,
    private categorySerivice:CategoryService
  ) { 
    this.baseurl = sharedService.getBaseUrl();
  }

  fillItemListMapByCategory(map:Map<string,Item[]>,itemList:Item[]){
    itemList.forEach(item =>{
     if(this.itemMapByCategory.get(item.categoryId) === undefined) {
       this.itemMapByCategory.set(item.categoryId, [item]);
     } else {
        const tempList = this.itemMapByCategory.get(item.categoryId);
        if(tempList !== undefined) {
          tempList?.push(item)
          this.itemMapByCategory.set(item.categoryId, tempList)
        }
     }
    })
  };

  fillItemMabById(itemList:Item[]){
    itemList.forEach(item =>{
      this.itemMapById.set(item.id, item);
    });
  }

  getItemsbyCategoryId(categoryId:string){
    const category = this.categorySerivice.getCategoryById(categoryId);
    //check if it has sub-categories
    if(category && category.subCategories?.length !== 0){
      const itemList:Item[] = [];
      category.subCategories?.forEach((subCategory,i) =>{
         if(i !== 0){
          const subItems = this.itemMapByCategory.get(subCategory.id);
          if(subItems){
            itemList.push(...subItems);
          }
         }
      });
      return itemList;
    } 
    return this.itemMapByCategory.get(categoryId);
  }

  getItemByItemId(itemId:string){
    return this.itemMapById.get(itemId);
  }

  getAllItems(){
    return this.itemsList;
  }
  //fetch items
  fetchAvailableItems():Observable<ApiResponse<Item[]>>{
    return this.http.get<ApiResponse<Item[]>>(`${this.baseurl}/items/available`)
    .pipe(
      retry({count: 10, delay: 5000}),
      catchError(error => {
        console.log(error);
        return throwError(()=> new Error(error));
      })
    )
  }

  setItems(items:Array<Item>){
    this.itemsList.length = 0;
    this.itemMapByCategory.clear()
    this.itemMapById.clear();
    this.itemsList = items;
    this.fillItemListMapByCategory(this.itemMapByCategory,items);
    this.fillItemMabById(items);
  }

  //selected item
  setSelectedItemId(itemId:string){
    this.selectedItemId = itemId;
  }

  getSelectedItemId(){
    return this.selectedItemId;
  }
}
