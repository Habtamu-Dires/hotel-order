import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { CategoryResponse, ItemResponse, PageResponseItemResponse } from '../../../../services/models';
import { ItemsService } from '../../../../services/services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PageNavigationComponent } from "../../components/page-navigation/page-navigation.component";

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [MenuComponent, CommonModule, PageNavigationComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit{

  itemList:ItemResponse[] = [];
  // pagination
  page:number = 0;
  size:number = 5;
  isEmptyPage: boolean = true;
  isFirstPage: boolean |undefined; 
  isLastPage: boolean |undefined;
  totalPages: number | undefined;
  totalElements: number | undefined;
  numberOfElements: number | undefined;
  filter:string = '';
  
  constructor(
    private itemsService:ItemsService,
    private router:Router,
    private dialog: MatDialog,
    private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    this.fetchPagesOfItems();
  }

  // filter by category
  onCategoryFilterChange(categoryId:string){
    if(categoryId.length !== 0){
      this.filter = categoryId;
      this.page = 0;
      this.fetchPageOfItemsByCatId();
    } else {
      this.fetchPagesOfItems();
    }
  }

  // on search 
  onSerchedTextChange(text:string) {
    if(text.length >= 3){
      this.searchItemsByName(text);
    } else{
     this.fetchPagesOfItems();
    }
  }
  
  // search items by name
  searchItemsByName(text:string){
    this.itemsService.searchItemsByName({
      'item-name' : text,
      'category-id' : this.filter
    }).subscribe({
      next:(res:ItemResponse[]) =>{
        this.itemList = res;
        this.isEmptyPage = true;
      },
      error:(err) => {console.log(err)}
    })
  }

  // fetch pages of items 
  fetchPagesOfItems(){
    this.itemsService.getPageOfItems({
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseItemResponse)=>{
        this.itemList = res.content as ItemResponse[];
        console.log("The item list ", this.itemList)
        //pagination
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err) =>{console.log(err)}
    })
  }

  // fetch pages of itmes by category id
  fetchPageOfItemsByCatId(){
    this.itemsService.getPageOfItemsByCategory({
      'category-id' :this.filter,
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseItemResponse)=>{
        this.itemList = res.content as ItemResponse[];
        ///pagination
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err) => {console.log(err)}
    })
  } 


  // create new item
  onCreateNewBtnClicked() {
    this.router.navigate(['admin','items', 'manage'])
  }

  // edit
  onEdit(itemId:any) {
    this.router.navigate(['admin', 'items', 'manage', itemId as string]);
  }

  // delete
  onDelete(itemId:any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.itemsService.deleteItem({
          'item-id' : itemId as string
        }).subscribe({
          next:()=>{
            this.page = 0;
            this.fetchPagesOfItems();
            this.toastrService.success('Item deleted successfully', 'Done!');
          },
          error:(err) => {
            console.log(err);
            this.toastrService.error('Something went wrong', 'Ooops');
          }
        })
      } else{
        console.log("Deletion canceled")
      }
    })
  }
  // get category name
  getCategoryName(categories:CategoryResponse[] | undefined){
    if(categories){
      return categories.map(cat => cat.name).join(', ');
    }
    return '';
  }

  // pagination methods
  onSizeChanged(size:number){
    this.size = size;
    if(this.filter.length !== 0){
      this.fetchPageOfItemsByCatId();
    } else {
      this.fetchPagesOfItems();
    }
  }

  onPageChanged(page:number){
    this.page = page;
    if(this.filter.length !== 0){
      this.fetchPageOfItemsByCatId();
    } else {
      this.fetchPagesOfItems();
    }
  }

}
