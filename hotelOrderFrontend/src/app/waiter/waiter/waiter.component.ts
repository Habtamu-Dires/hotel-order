import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { OrderedItemComponent } from "../ordered-item/ordered-item.component";
import { MenuComponent } from "../../old-page-components/menu/menu.component";
import { TableComponent } from "../table/table.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiter',
  standalone: true,
  imports: [CommonModule,, TableComponent],
  providers:[DatePipe],
  templateUrl: './waiter.component.html',
  styleUrl: './waiter.component.scss'
})
export class WaiterComponent {

  currentComponent:string = 'Orders'
  currentDate:string | null | undefined;

  constructor(private datePipe:DatePipe,
    private router:Router
  ){
    this.updateDate();
  }

  updateDate(){
    const now = new Date();
    this.currentDate = this.datePipe.transform(now, 'EEE, MMM dd, y');
  }

  setComponent(component:string){
    this.currentComponent = component;

    if(this.currentComponent === 'Menu'){
      console.log("hello")
      this.router.navigate(['menu',{'from':'waiter'}]);
    }
  }

}
