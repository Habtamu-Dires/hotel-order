import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderedItemsFrequencyResponse } from '../../../../services/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-all-freq',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './view-all-freq.component.html',
  styleUrl: './view-all-freq.component.scss'
})
export class ViewAllFreqComponent implements OnInit {

  @Input() itemList:OrderedItemsFrequencyResponse[] = [];
  @Input() tableTitle:string = '';
  @Output() onHideViewAll:EventEmitter<{}> = new EventEmitter<{}>();

  filteredItemList:OrderedItemsFrequencyResponse[] = [];
  searchText:string = '';

  constructor(){}

  ngOnInit(): void {
    this.filteredItemList = this.itemList;
  }

  toggleDetail(){
    this.onHideViewAll.emit();
  }

  onSearch(){
    if(this.searchText.length >= 3){
      this.filteredItemList = this.itemList.filter(item => 
        item.itemName?.startsWith(this.searchText));
    } else {
      this.filteredItemList = this.itemList;
    }   
  }

}
