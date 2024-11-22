// import { Injectable, OnInit } from '@angular/core';
// import { Category } from '../models/category';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { SharedService } from '../../shared/shared.service';
// import { ApiResponse } from '../models/api_response';
// import { map, tap, retryWhen, delayWhen, retry, catchError } from 'rxjs/operators';
// import { BehaviorSubject, Observable, throwError } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })
// export class CategoryService {
  
//   private base_url:string;
//   private categoryList:Array<Category> = [];

//   private categoryMap = new Map<string,Category>;
//   //current category
//   private selectedCategorySubject = new BehaviorSubject<string>('');
//   selectedCategory$ = this.selectedCategorySubject.asObservable();
//   //current main Category
//   private selectedMainCategorySubject = new BehaviorSubject<string>('');
//   selectedMainCategory$ = this.selectedMainCategorySubject.asObservable();


//   constructor(private http:HttpClient,
//         private sharedService:SharedService
//   ) {
//     this.base_url = sharedService.getBaseUrl();
//   }
  
//   fillCategoryMap(map:Map<string,Category>, list:Array<Category>){
//     list.forEach(category =>{
//       map.set(category.id, category)
//     });
//   }

//   fetchCategories(): Observable<ApiResponse<Category[]>>{
//      return this.http.get<ApiResponse<Category[]>>(`${this.base_url}/categories/main`)
//      .pipe(
//       retry({ count: 10, delay: 5000 , resetOnSuccess: true}),  
//       catchError((error) => {
//         console.error('Initial attempt failed', error);
//         return throwError(() => new Error(error));
//       })
//     );
//   }

//   setCategories(categories:Array<Category>){
//     this.categoryList = [];
//     this.categoryMap =  new Map<string,Category>;
//     this.categoryList = categories;
//     this.addDefaultAllCategory();
//     this.fillCategoryMap(this.categoryMap,this.categoryList);
//   }

//   addDefaultAllCategory(){
//     this.categoryList.forEach(category =>{
//       if(category.subCategories?.length !== 0){
//         category.subCategories?.unshift({
//           id:category.id,
//           name: "All"
//         });
//       }
//     })
//   }

//   getCategories():Array<Category>{
//     return this.categoryList;
//   }

//   getCategoryById(categoryId:string) {
//     return this.categoryMap.get(categoryId);
//   }

//   //selected categroy
//   updateCategory(categoryId:string){
//     this.selectedCategorySubject.next(categoryId);
//   }

//   //selected main category
//   updateMainCategory(categoryId:string){
//     this.selectedMainCategorySubject.next(categoryId);
//   }

// }
