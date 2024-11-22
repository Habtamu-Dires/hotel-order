import { Component } from '@angular/core';
import { CategoryResponse, IdResponse, ItemRequest, ItemResponse } from '../../../../services/models';
import { CategoriesService, ItemsService } from '../../../../services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, throttleTime } from 'rxjs';

@Component({
  selector: 'app-manage-items',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './manage-items.component.html',
  styleUrl: './manage-items.component.scss'
})
export class ManageItemsComponent {
  selectedItemImage:any;
  selectedPicture:string | undefined;
  errMsgs:Array<string> = [];
  categories:CategoryResponse[] = [];
  itemRequest:ItemRequest = {
    name:'',
    price: Number(undefined),
    categoryId: '',
    description:'',
    isAvailable: true,
    stockQuantity: Number(undefined),
  }
  searchControl = new FormControl('');
  showCategories:boolean = false;
  categoryName:string = '';

  constructor(
    private itemsService:ItemsService,
    private categoryService:CategoriesService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toastrService: ToastrService
  ){}

  ngOnInit(): void {
    // edit
    const itemId = this.activatedRoute.snapshot.params['itemId'];
    if(itemId){
      this.fetchItemsById(itemId);
    }
    // form control
     this.categorySearchFormControl();
  }

  categorySearchFormControl(){
    this.searchControl.valueChanges
     .pipe(
        debounceTime(300),  // wait 300ms after user stop writing
        throttleTime(1000) // one request per second
     ).subscribe((value:any)=>{
       const text = value as string;
       if(text.length >= 3){
          this.searchCategoryByName(text);
          if(this.categoryName !== text){
            this.showCategories = true;
          }
       }
     })
  }

  // search category by name
  searchCategoryByName(text:string){
    this.categoryService.searchCategoryByName({
      'category-name' : text,
      'filter' : 'All'
    }).subscribe({
      next:(res:CategoryResponse[]) =>{
        this.categories = res;
      }
    })
  }

  onCategorySelected(category:CategoryResponse){
    this.categoryName = category.name as string;
    this.searchControl.setValue(this.categoryName);
    this.itemRequest.categoryId = category.id as string;
    this.showCategories = false;
  }

  //fetch item by id
  fetchItemsById(itemId:string){
    this.itemsService.getItemById({
      'item-id': itemId
    }).subscribe({
      next:(res:ItemResponse) =>{
        this.itemRequest = {
          id: res.id,
          name:res.name as string,
          price: res.price as number,
          categoryId: res.category?.id as string,
          description: res.description as string,
          isAvailable: res.isAvailable as boolean,
          stockQuantity: res.stockQuantity as number,
          imageUrl: res.imageUrl 
        }
        if(res.imageUrl != undefined && res.imageUrl.length > 0){ 
          this.selectedPicture = res.imageUrl;
        }
        // update searchControll
        this.fetchCategoryById(this.itemRequest.categoryId);
      }
    })
  }
  
  // fetch category by id
  fetchCategoryById(categoryId:string){
    this.categoryService.getCategoryById({
      'category-id': categoryId
    }).subscribe({
      next:(res:CategoryResponse) =>{
        this.categoryName = res.name as string;
        this.searchControl.setValue(this.categoryName);
      }
    })
  }

  // save
  onSave(){
    this.errMsgs = [];
    this.itemsService.saveItem({
      body: this.itemRequest
    }).subscribe({
      next:(response:IdResponse)=>{
        //upload image
        if(this.selectedItemImage) {
          this.itemsService.uploadCoverPicture({
            'item-id' : response.id as string,
            body : {
              file: this.selectedItemImage
            }
          }).subscribe({
            next:() => {
              this.toastrService.success('Category saved successfully ', 'Done!')
              this.router.navigate(['admin','items']);
            },
            error:(err) => {
              console.log(err);
              this.toastrService.error('Something went wrong', 'Ooops');            
            }
          })
        } else{
          this.router.navigate(['admin','items']);
          this.toastrService.success('Item saved successfully ', 'Done!')
        }
      },
      error:(err) => {
        if(err.error.validationErrors){
          this.errMsgs = err.error.validationErrors;
        } else{
          console.log(err);
          this.toastrService.error('Something went wrong', 'Ooops');
        }
      }
    })
  }
  

  onFileSelected(event:any){
    this.selectedItemImage = event.target.files[0];
    if(this.selectedItemImage != null){
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      }
      reader.readAsDataURL(this.selectedItemImage)
    }
  }

  //cancel selected picture
  cancelSelectedPicture(){
    this.selectedPicture = undefined;
    this.itemRequest.imageUrl=undefined;
  }

  // cnacel
  onCancel(){
    this.router.navigate(['admin','items']);
  }
}
