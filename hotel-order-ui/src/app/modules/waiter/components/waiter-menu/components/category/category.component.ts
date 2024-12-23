import { ChangeDetectorRef, Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CategoryResponse } from '../../../../../../services/models';
import { CustomerService } from '../../service/customer/customer.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})

export class CategoryComponent implements OnInit, OnDestroy {

  @Input() mainCategoryList:CategoryResponse[] = [];
  selectedCategoryId?:string; 
  selectedCategory?:CategoryResponse ;
  subcategoryId?:string;
  // subscription
  selectedCategorySub?:Subscription;
  mainCategorySub?:Subscription;

  constructor(
    private customerService:CustomerService
  ){}

  ngOnInit(): void {
    // subscribe and get currnt main category
    this.onMainCategoryChanges();
    // subscirbe current sub category
    this.onSelectedCategoryChanges();
  }

  // listen to main category chagne
  onMainCategoryChanges(){
    this.mainCategorySub = this.customerService.selectedMainCategory$
    .subscribe((category)=>{
      if(category.id){
        this.selectedCategory = category;
        this.selectedCategoryId = category.id;
      }
    })
  }
  // listen to slected category changes
   onSelectedCategoryChanges(){
    this.selectedCategorySub = this.customerService.selectedCategory$
    .subscribe((category)=>{
      if(category.id){
        this.subcategoryId = category.id;
      }
    })
  }
  // select catgory.
  selectCategory(category:CategoryResponse){
     this.selectedCategoryId = category.id;
     this.subcategoryId = category.id;
     this.selectedCategory = category;

     this.customerService.updateSelectedCategory(category);
     this.customerService.updatedSelectedMainCategory(category);
  }

  selectSubCategory(category:any){
    this.subcategoryId = category.id as string;
    this.customerService.updateSelectedCategory(category);
  }

  hasSubCategroy(category:any){
    if(!category) return false;
    return category.subCategories?.length !== 0;
  }

  ngOnDestroy(): void {
   this.selectedCategorySub?.unsubscribe;
   this.mainCategorySub?.unsubscribe;
  }

}
