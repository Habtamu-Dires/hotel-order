// import { AfterViewChecked, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
// import { LanguageService } from '../services/language/language.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { SharedService } from '../services/shared/shared.service';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule,FormsModule],
//   templateUrl: './header.component.html',
//   styleUrl: './header.component.scss'
// })
// export class HeaderComponent implements OnInit, AfterViewChecked{

//   hotelName?:String;
//   @Input() componentName:string = 'home';
//   serachText?:string;
//   searchIconClicked:boolean = false;
//   searchResultList:[] = [];
//   @ViewChild('searchInput') searchInput?:ElementRef;

//   constructor(
//     private languageService:LanguageService,
//     private router:Router,
//     private sharedService:SharedService,
//   ){}

//   public languages:Array<{}> = ['English', 'አማርኛ'];
//   public selectedLanguage: string = 'English';
//   public url?:string;

//   ngOnInit(): void {
//     this.loadLanguageData();
//     this.url = this.router.url;
//     console.log("current url ", this.url)
//   }

//   loadLanguageData(){
    
//     this.languageService.loadLanguage(this.selectedLanguage)
//     .subscribe(data =>{
//       this.hotelName = data['Hotel'];
//     })
//   }

//   changeLanguage(event: any) {
//     // const langauge = event.target.value;
//     // this.selectedLanguage = langauge;
//     this.loadLanguageData();
//   }

//   navigateToHome(){
//     this.router.navigate(['/home'])
//   }
  
//   navigateToWaiter(){
//     this.router.navigate(['/waiter'])
//   }

//   toggleSearchIcon(){
//     this.searchIconClicked = !this.searchIconClicked;
//   }

//   shrinkSearchBar(){
//     if(this.searchIconClicked){
//       this.searchIconClicked = false;
//       this.serachText = '';
//       this.sharedService.changeSearchText('');
//     }
//   }

//   onSearch(){
//     // this.itemService.
//     const text = this.serachText?.trim();
//     if(text && text.length > 0){
//       this.sharedService.changeSearchText(text);
//     }    
//   }

//   ngAfterViewChecked(): void {
//     if(this.searchIconClicked && this.searchInput){
//       this.searchInput.nativeElement.focus();
//     }
//   }

// }
