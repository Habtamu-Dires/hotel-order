import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../services/language/language.service';
import { debounceTime, throttleTime } from 'rxjs';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  hotelName?:String;
  @Input() componentName:string = 'home';
  @Input() showSearchBar:boolean = false;
  @Input() prvSearchedText:string = '';
  @ViewChild('searchInput') searchInput?:ElementRef;
  languages:Array<{}> = ['English', 'አማርኛ'];
  selectedLanguage: string = 'English';
  url?:string;
  searchForm = new FormControl('');

  constructor(
    private languageService:LanguageService,
    private router:Router,
    private customerService:CustomerService
  ){}

  ngOnInit(): void {
    this.loadLanguageData();
    //seach form
    this.searchFormControl();

    // set searched text if available 
    this.setSearchedText()
  }

  // searched form control
  searchFormControl(){
    this.searchForm.valueChanges
    .pipe(
      debounceTime(300),
      throttleTime(500)
    )
    .subscribe((text:any)=>{
      const serachedText = text as string;
      if(serachedText.length !== 0){
        this.customerService.updateSearchedText(serachedText);
      }
      
    })
  }

  // set searcht text if available
  setSearchedText(){
    this.searchForm.setValue(this.prvSearchedText);
  }

  // load language data
  loadLanguageData(){
    this.languageService.loadLanguage(this.selectedLanguage)
    .subscribe(data =>{
      this.hotelName = data['Hotel'];
    })
  }

  changeLanguage(event: any) {
    // const langauge = event.target.value;
    // this.selectedLanguage = langauge;
    this.loadLanguageData();
  }

  navigateToHome(){
    this.router.navigate(['customer', 'home']);
  }
  
  navigateToWaiter(){
    this.router.navigate(['/waiter'])
  }

  toggleSearchIcon(){
    this.showSearchBar = !this.showSearchBar;
  }

  shrinkSearchBar(){
    if(this.showSearchBar){
      this.showSearchBar = false;
    }
  }
  

  ngAfterViewChecked(): void {
    if(this.showSearchBar && this.searchInput){
      this.searchInput.nativeElement.focus();
    }
  }

  // clear serached text
  clearSearchText(){
    this.searchForm.setValue('');
    this.customerService.updateSearchedText('');
  }


}
