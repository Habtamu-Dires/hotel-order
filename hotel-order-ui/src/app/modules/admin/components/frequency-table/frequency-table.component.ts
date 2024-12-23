import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderedItemsFrequencyResponse } from '../../../../services/models';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-frequency-table',
  standalone: true,
  imports: [NgIf],
  templateUrl: './frequency-table.component.html',
  styleUrl: './frequency-table.component.scss'
})
export class FrequencyTableComponent {

  @Input() tableTitle:string = '';
  @Input() itemList:OrderedItemsFrequencyResponse[] = [];

  @Output() onViewClicked:EventEmitter<{}> = new EventEmitter<{}>();


  onViewAll(){
    this.onViewClicked.emit();
  }

}
