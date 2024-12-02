import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { CategoryComponent } from "../../components/category/category.component";
import { ItemComponent } from "../../components/item/item.component";
import { ItemDetailComponent } from "../../components/item-detail/item-detail.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Subscription } from 'rxjs';
import { CategoryResponse, ItemResponse } from '../../../../../../services/models';
import { CategoriesService } from '../../../../../../services/services';
import { CustomerService } from '../../service/customer/customer.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CategoryComponent, ItemComponent, ItemDetailComponent, FooterComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  isFooterExpanded:boolean = false;
  isOnAnimation:boolean = false; 
  componentName='menu';  
  showSearchBar:boolean = false; 
  prvSearchedText:string = '';
  isOnItemDetail:boolean = false;
  selectedItem:ItemResponse | undefined;
  hideCategory:boolean = false;
  //category
  mainCategoryList:CategoryResponse[] = [];
  // item
  currentItemList:ItemResponse[] = [];
  fromItemDetail:boolean = false;
  
  // subscription
  searchSub?:Subscription;

  constructor(
    private categoryService:CategoriesService,
    private customerService:CustomerService
  ){}

  ngOnInit(): void {
    //fetch main categories
    this.fetchMainCategories();

    // on serach text change
    this.onSearchedTextChange();

  }
    
  //serached text
  onSearchedTextChange(){
    this.searchSub = this.customerService.searchedText$
    .subscribe((text:string)=>{
      const itemName = text.trim();
      if(itemName.length >= 3){
        //hide category
        this.hideCategory = true;
        this.showSearchBar = true;
        this.prvSearchedText = itemName;
      } else {
        // show category
        this.showSearchBar = false;
        this.prvSearchedText = '';
        this.hideCategory = false;
      }
    })
  }

  //fetch main categories categories.
  fetchMainCategories() {
    this.categoryService.getMainCategories().subscribe({
        next:(res:CategoryResponse[]) =>{
            this.mainCategoryList = res;
        
            //select the first category
            this.customerService.updateSelectedCategory(this.mainCategoryList[0]);
            this.customerService.updatedSelectedMainCategory(this.mainCategoryList[0]);

        },
        error:(err)=>{console.log(err)}
    })
  }

  // on item selected 
  onItemSelected(list:any[]){
    this.selectedItem = list[0];
    this.currentItemList = list[1] as ItemResponse[];
    this.isOnItemDetail = true;
  }

  // on navigate back to items
  onNavigateToItems(){
    this.isOnItemDetail = false;
    this.fromItemDetail = true;
    this.selectedItem = undefined;
  }

  toggleFooter(){
    this.isFooterExpanded = !this.isFooterExpanded;
  }


  ngOnDestroy(): void {
    // update selected category to {}, so, that item behavious normal when menu starts
    this.customerService.updateSelectedCategory({});

    this.searchSub?.unsubscribe;

  }
}

