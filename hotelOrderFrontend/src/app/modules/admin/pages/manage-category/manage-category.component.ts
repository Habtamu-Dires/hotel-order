import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CategoryRequest, CategoryResponse, IdResponse, PageResponseCategoryResponse } from '../../../../services/models';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesService, FilesService } from '../../../../services/services';
import { nextDay } from 'date-fns';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, throttle, throttleTime } from 'rxjs';

@Component({
  selector: 'app-manage-category',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './manage-category.component.html',
  styleUrl: './manage-category.component.scss'
})
export class ManageCategoryComponent implements OnInit {

  selectedCategoryImage:any;
  selectedPicture:string | undefined;
  categoryRequest:CategoryRequest = {name: '', parentCategoryId: '',description: ''}
  parentCategories:CategoryResponse[] = [];
  errMsgs:Array<string> = [];
  parentCategoryName:string = '';
  showCategories:boolean = false;
  searchControl = new FormControl('');

  constructor(
    private categoryService:CategoriesService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toastrService: ToastrService
  ){}

  ngOnInit(): void {
    // edit
    const categoryId = this.activatedRoute.snapshot.params['categoryId'];
    if(categoryId){
      this.fetchCategoryById(categoryId);
    } 

    //search controll
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), // wait 300ms after the user stops typing
      throttleTime(1000) // limit to one search per second
    )
    .subscribe((value:any)=>{
       const text = value as string;
      if(text.length >= 2){
        this.searchCategoryByName(text);
        if(this.parentCategoryName !== text){
          this.showCategories=true;
        }
      } 
    })
  }

  //search category by Name
  searchCategoryByName(text:string){
    this.categoryService.searchCategoryByName({
      'category-name' : text,
      'filter' : 'All'
    }).subscribe({
        next:(res:CategoryResponse[])=>{
          this.parentCategories = res;
        },
        error:(err) =>{
          console.log(err);
        }
    })
  }

  // set parent category
  setParentCategoryId(category:CategoryResponse){
    this.categoryRequest.parentCategoryId = category.id;
    this.parentCategoryName = category.name as string;
    this.searchControl.setValue(category.name as string);
    this.showCategories = false;
  }

  //fetch category by id
  fetchCategoryById(categoryId:string){
    this.categoryService.getCategoryById({
      'category-id': categoryId
    }).subscribe({
      next:(res:CategoryResponse) =>{
        this.categoryRequest = {
          id: res.id,
          name: res.name as string,
          parentCategoryId: res.parentCategory?.id,
          popularityIndex: res.popularityIndex,
          imageUrl: res.imageUrl
        }
        if(res.imageUrl){ 
          this.selectedPicture = res.imageUrl;
        }
        // update searchControl
        const paretnId = this.categoryRequest.parentCategoryId;
        if(paretnId){
          this.fetchCategoryNameById(paretnId);
        }
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }

  // fetch category name by id 
  fetchCategoryNameById(categoryId:string){
    this.categoryService.getCategoryById({
      'category-id': categoryId
    }).subscribe({
      next:(res:CategoryResponse) =>{
        this.parentCategoryName = res.name as string;
        this.searchControl.setValue(this.parentCategoryName);
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }

  // Track clicks to hide the dropdown 
  @HostListener('document:click', ['$event'])
  onClickOutSideDropdown(event: MouseEvent){
    const target = event.target as HTMLElement;
    // only hide if the click is outside the component
    if(!target.classList.contains('donthide')){
      this.showCategories = false;
    }
  }  



  // save
  onSave(){
    this.errMsgs = [];
    this.categoryService.saveCategory({
      body: this.categoryRequest
    }).subscribe({
      next:(response:IdResponse)=>{
        //upload image
        if(this.selectedCategoryImage) {
          this.categoryService.uploadCoverPicture1({
            'category-id' : response.id as string,
            body : {
              file: this.selectedCategoryImage
            }
          }).subscribe({
            next:() => {
              this.toastrService.success('Category saved successfully ', 'Done!')
              this.router.navigate(['admin','categories']);
            },
            error:(err) => {
              console.log(err);
            this.toastrService.error('Something went wrong', 'Ooops');
            }
          })
        } else{
          this.router.navigate(['admin','categories']);
          this.toastrService.success('Category saved successfully ', 'Done!')
        }
      },
      error:(err) => {
        if(err.error.validationErrors){
          this.errMsgs = err.error.validationErrors;
        } else{
          console.log(err);
          this.toastrService.error(err.error.error, 'Ooops');
        }
      }
    })
  }

  // when cancel button is clicked
  onCancel(){
    this.router.navigate(['admin','categories']);
  }

  // when file is selected
  onFileSelected(event:any){
    this.selectedCategoryImage = event.target.files[0];
    if(this.selectedCategoryImage != null){
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedCategoryImage)
    }
  }
  // cancel selected picture
  cancelSelectedPicture(){
    this.selectedPicture = undefined;
    this.categoryRequest.imageUrl=undefined;
  }

}
