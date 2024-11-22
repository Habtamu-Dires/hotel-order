// import { CommonModule } from '@angular/common';
// import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { SharedService } from '../../services/shared/shared.service';
// import { ItemsService } from '../../services/services';
// import { ItemResponse } from '../../services/models';
// import { HeaderComponent } from "../../modules/customer/components/header/header.component";
// import { CategoriesComponent } from "../../modules/admin/pages/categories/categories.component";
// import { CategoryComponent } from "../../modules/customer/components/category/category.component";

// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   imports: [CommonModule, HeaderComponent, CategoryComponent],
//   templateUrl: './menu.component.html',
//   styleUrl: './menu.component.scss'
// })
// export class MenuComponent implements OnInit,OnDestroy ,AfterViewInit{

//   isFooterExpanded:boolean = false;
//   isOnAnimation:boolean = false;
//   searchText?:string;
//   isModalVisible:boolean = false;
//   searchedItemsList:ItemResponse[] = [];
//   componentName='menu';
//   sharedServiceSub?:Subscription;
//   private routeKey = 'menu';
//   @ViewChild('scrolling') scrollingRef!: HTMLElement

//   constructor(private sharedService:SharedService,
//     private itemService:ItemsService,
//     private router:Router,
//   ){}

//   ngOnInit(): void { 
//     //footer
//     this.sharedService.isFooterExpanded$.subscribe((isExpanded)=>{
//       this.isFooterExpanded = isExpanded;
//       this.isOnAnimation = true;
//         setTimeout(()=>{
//           this.isOnAnimation = false;
//         }, 200)
//     });
//     // //serach text
//     // this.sharedServiceSub = this.sharedService.searchText$.subscribe(searchText => {
//     //   this.searchText = searchText;
//     //   this.searchedItemsList = [];
//     //   const text = this.searchText;
//     //   if(text && text.length > 2){
//     //     this.itemService.getAllItems().filter(item =>{
//     //       if(item.name.includes(text)){
//     //         this.searchedItemsList.push(item);
//     //         this.isModalVisible = true;
//     //       } 
//     //     });
//     //     if(this.searchedItemsList.length === 0){
//     //       this.closeModal();
//     //     }
//     //   } else if(text.length <= 2){
//     //     this.closeModal();
//     //   }
//     // });
    
//   }

//   //scroll
//   ngAfterViewInit(){
//     const scrollPosition = this.sharedService.getScrollPosition(this.routeKey);
  
//     // If you're scrolling a specific container instead of the window
//     const scrollableElement = document.getElementById('menu-id');
//     if (scrollableElement) {
//       scrollableElement.scrollTo(0, scrollPosition);
//     } else {
//       window.scrollTo(0, scrollPosition); // For normal window scrolling
//     }
//   }

//   toggleFooter(){
//     this.isFooterExpanded = !this.isFooterExpanded;
//     this.sharedService.toggleFooter(this.isFooterExpanded);
//   }

//   shrinkFooter(){
//     if(this.isFooterExpanded == true){
//       this.isFooterExpanded = false;
//       this.sharedService.toggleFooter(this.isFooterExpanded);
//     }
//   }

//   closeModal(){
//     this.isModalVisible = false;
//     this.searchedItemsList = [];
//   }

//   navigateToItemDetail(itemId:any){
//     // this.itemService.setSelectedItemId(itemId);
//     // this.isModalVisible = false;
//     // this.searchedItemsList = [];
//     // this.router.navigate(['item-detail']);
//   }


//   ngOnDestroy(): void {
//     this.sharedServiceSub?.unsubscribe();
//   }
// }
