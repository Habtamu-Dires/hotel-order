import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, throttleTime } from 'rxjs';
import { CategoriesService } from '../../../../services/services';
import { CategoryResponse } from '../../../../services/models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  
  searchControl = new FormControl('');

  //only for itme page
  categorySearchControl = new FormControl('');
  categories:CategoryResponse[] = [];
  showCategories:boolean = false;
  categoryName:string = '';


  @Input() componentName:string | undefined;
  @Output() searchedTextChange:EventEmitter<string> = new EventEmitter<string>();
  @Output() isCreateNewBtnClicked:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() filterChanged:EventEmitter<string> = new EventEmitter<string>();
  // for itme page only
  @Output() selectedCategoryId:EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private categoryService:CategoriesService
  ){}


  ngOnInit(): void {
    // search control
    this.searcFormControl();

    // category search for items
    this.categorySearchFormControl();
  }

  // search form control set up
  searcFormControl(){
    this.searchControl.valueChanges
    .pipe(
      debounceTime(300), 
      throttleTime(1000)  
    )
    .subscribe((value:any)=>{
      const text = value as string;
      this.searchedTextChange.emit(text.trim());
    });
  }

  // create new button
  onCreateNew(){
    this.isCreateNewBtnClicked.emit(true);
  }
  // fileter
  onFilterChanged(event:any){
    this.filterChanged.emit(event.target.value);
  }

  //cear search area
  clearSearchArea(){
    this.searchControl.setValue('');
  }

  // for items only
  categorySearchFormControl(){
    // only for item page only, category search control
    this.categorySearchControl.valueChanges
    .pipe(
      debounceTime(300), 
      throttleTime(1000)  
    )
    .subscribe((value:any)=>{
      const text = (value as string).trim();
      if(text.length >= 2){
        this.searchCategoryByName(text);
        if(this.categoryName !== text){
          this.showCategories = true;
        }
      } else if(text.length === 0){
        this.selectedCategoryId.emit('');
      }
    })
  }

  // on category selected
  onCategorySelected(category:CategoryResponse){
    this.selectedCategoryId.emit(category.id);
    this.categoryName = category.name as string;
    this.categorySearchControl.setValue(this.categoryName);
    this.showCategories = false;
  }
  
  // search category by name
  searchCategoryByName(text:string){
    this.categoryService.searchCategoryByName({
      'category-name' : text,
      'filter' : 'All'
    }).subscribe({
      next:(res:CategoryResponse[]) =>{
        this.categories = res; 
      },
      error:(err) => {
        console.log(err);
      }
    })
  }

  //cear category search
  clearCategorySearch(){
    this.categoryName = '';
    this.categorySearchControl.setValue(this.categoryName);
  }
}
