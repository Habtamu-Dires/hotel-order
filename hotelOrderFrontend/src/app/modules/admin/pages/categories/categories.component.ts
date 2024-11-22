import { Component, Input, OnInit, Output } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../../services/services';
import { CategoryResponse, PageResponseCategoryResponse } from '../../../../services/models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { PageNavigationComponent } from "../../components/page-navigation/page-navigation.component";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MenuComponent, CommonModule, PageNavigationComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categoryList:CategoryResponse[] = [];
  filter:string = 'All';
  //pagination
  page:number = 0;
  size:number = 5;
  isEmptyPage: boolean = true;
  isFirstPage: boolean |undefined; 
  isLastPage: boolean |undefined;
  totalPages: number | undefined;
  totalElements: number | undefined;
  numberOfElements: number | undefined;
  

  constructor(
    private categoryService:CategoriesService,
    private router:Router,
    private toastrService:ToastrService,
    private dialog:MatDialog
  ){}

  ngOnInit(): void {
    this.fetchPagesOfCategories();
  }

  // fetch pages categories
  fetchPagesOfCategories(){
    this.categoryService.getPageOfCategories({
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseCategoryResponse) =>{
        this.categoryList = res.content as CategoryResponse[];
        this.categoryList = this.categoryList;
        // pagination data
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
        
      },
      error:(err) => {
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  //get pages of main categories
  fetchPagesOfMainCategories(){
    this.categoryService.getPagesOfMainCategories({
      page: 0,
      size: this.size
    }).subscribe({
      next:(res:PageResponseCategoryResponse) =>{
        this.categoryList = res.content as CategoryResponse[];
        this.categoryList = this.categoryList;
        // pagination data
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error(err.error.error, 'Ooops');
      }
    })
  }

  //fetch sub-categories
  fetchPagesOfSubCategories(){
    this.categoryService.getPagesOfSubCategories({
      page: 0,
      size: this.size
    }).subscribe({
      next:(res:PageResponseCategoryResponse) =>{
        this.categoryList = res.content as CategoryResponse[];
        // pagination data
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error(err.error.error, 'Ooops');
      }
    })
  }

  //filter changed
  onFilterChanged(filter:string){
    this.filter = filter;
    if(filter === 'Main'){
      this.fetchPagesOfMainCategories();
    } else if(filter == 'Sub'){
      this.fetchPagesOfSubCategories();
    } else{
      this.fetchPagesOfCategories();
    }
  }

  // on search.
  onSerchedTextChange(text: string){
    if(text.length >= 3){
      this.searchCategoryByName(text);
      this.isEmptyPage = true;
    } else{
      this.onFilterChanged(this.filter);
    }
    
  }

  // search category by name
  searchCategoryByName(text: string){
    this.categoryService.searchCategoryByName({
      'category-name' : text ,
      'filter': this.filter
    }).subscribe({
      next:(res:CategoryResponse[]) =>{
        this.categoryList = res;
      }
    })
  }

  // create new button 
  onCreateNewBtnClicked(){
    this.router.navigate(['admin','categories','manage']);
  }
  
  // edit
  onEdit(categoryId:any){
    this.router.navigate(['admin','categories','manage', categoryId as string])
  }

  // delete 
  onDelete(categoryId:any){
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.categoryService.deleteCategory({
          'category-id':categoryId as string
        }).subscribe({
          next:() =>{
            this.fetchPagesOfCategories();
            this.toastrService.success('Deleted ', 'Done!')
          },
          error:(err) => {
            console.log(err);
            this.toastrService.error('Something went wrong', 'Ooops');
          }
        })
      } else{
        console.log("Deletion canceled");
      }
    })
    
  
  }

  
  //pagination methods
  onSizeChanged(size:number){
    this.size = size;
    if(this.filter === 'Main'){
      this.fetchPagesOfMainCategories();
      return;
    }
    this.fetchPagesOfCategories();
  }

  onPageChanged(page:number){
    this.page = page;
    if(this.filter === 'Main'){
      this.fetchPagesOfMainCategories();
      return;
    }
    this.fetchPagesOfCategories();
  }
}
