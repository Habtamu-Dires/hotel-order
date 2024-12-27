import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-navigation',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './page-navigation.component.html',
  styleUrl: './page-navigation.component.scss'
})
export class PageNavigationComponent {
  
  // input
  @Input() page:number = 0;
  @Input() size:number | undefined;
  @Input() isFirstPage:boolean | undefined;
  @Input() isLastPage:boolean | undefined;
  @Input() numberOfElements: number | undefined;
  @Input() totalPages: number | undefined;
  @Input() totalElements: number | undefined;

  //output
  @Output() sizeChanged:EventEmitter<number> = new EventEmitter<number>();
  @Output() pageChanged:EventEmitter<number> = new EventEmitter<number>();




  //local var
  rowSizes:number[] = [1,2, 5,10,15,20]


  setNoOfRow(){
    this.sizeChanged.emit(this.size);
  }

  goToNextPage(){
    if(this.page == Number(this.totalPages) -1) return;
    this.pageChanged.emit(this.page + 1);
  }

  goToPreviousPage(){
    if(this.page == 0) return;
    this.pageChanged.emit(this.page - 1);
  }

  goToFirstPage(){
    if(this.page == 0) return;
    this.pageChanged.emit(0);
  }

  goToLastPage(){
    if(this.page == Number(this.totalPages) -1) return;
    this.pageChanged.emit(Number(this.totalPages) -1)
  }


  //calcualte range
  calculateRange(){
   if(this.size != undefined ) {
    const initVal = (this.page * this.size) + 1;
    const endVal = Number(initVal) + Number(this.numberOfElements) -1;
    return `${initVal} - ${endVal}  of  ${this.totalElements}`;
   }
   return '';
    
  }
}
