import { ChangeDetectorRef, Component, ComponentRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../services/models/category';
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../services/models/api_response';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})

export class CategoryComponent implements OnInit, OnDestroy {

  @Output() categoryIdEmitter = new EventEmitter<number>();

  categoryList?:Array<Category>;
  selectedCategoryId?:string; 
  selectedCategory?:Category ;
  subcategoryId?:string;
  
  selectedCategorySub?:Subscription;
  selectedMainCategorySub?:Subscription;

  constructor(private categoryService:CategoryService){}

  ngOnInit(): void {

    this.categoryService.fetchCategories().subscribe({
      next:(category:ApiResponse<Category[]>)=>{
         this.categoryService.setCategories(category.data);
         this.categoryList = category.data;  
        //tracking selected main/sub category
        this.selectedCategorySub = this.categoryService
        .selectedCategory$.subscribe(categoryId=> {
          if(categoryId === '' && this.categoryList){
              this.selectedCategory = this.categoryList[0];
              
              this.selectedCategoryId = this.categoryList[0].id;
              this.subcategoryId = this.categoryList[0].id;
              this.categoryService.updateCategory(this.subcategoryId);
              this.categoryService.updateMainCategory(this.selectedCategoryId);
          } 
          else {
              this.subcategoryId = categoryId;
          } 
        }); 
        
      },
      error:(error:HttpErrorResponse)=>{
        console.log(error);
      }
    });

    //track main category
    this.selectedMainCategorySub = this.categoryService
    .selectedMainCategory$.subscribe(mainCategoryId => { 
      if(this.selectedCategoryId === undefined && mainCategoryId !== ''){
        this.selectedCategoryId = mainCategoryId;
        this.selectedCategory = this.categoryService.getCategoryById(mainCategoryId);
      }}
    );

  }

  selectCategory(categoryId:string){
    this.selectedCategoryId = categoryId;
    this.categoryService.updateCategory(categoryId);
    this.categoryService.updateMainCategory(categoryId);
  }

  selectSubCategory(subCategoryId:string){
    this.subcategoryId = subCategoryId;
    this.categoryService.updateCategory(subCategoryId);
  }

  hasSubCategroy(categoryId:string):boolean{
    this.selectedCategory = this.categoryService.getCategoryById(categoryId);
    if(this.selectedCategory === undefined) return false;
    return this.selectedCategory.subCategories?.length !== 0;
  }

  ngOnDestroy(): void {
    this.selectedCategorySub?.unsubscribe;
    this.selectedMainCategorySub?.unsubscribe;
  }

}
