import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../../../../services/services';
import { OrderResponse, UserResponse } from '../../../../services/models';
import { TokenService } from '../../../../services/token/token.service';
import { Router } from '@angular/router';
import { KdsService } from '../../services/kds.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{

  orderList:OrderResponse[] = [];
  totalOrders:number = 0;
  itemFrqMap = new Map<string,number>();
  topItemNameList:string[] = [];
  itemNameList:string[] = [];

  constructor(
    private userService:UsersService,
    private tokenService:TokenService,
    private route:Router,
    private kdsService:KdsService
  ){}

  ngOnInit(): void {
    this.onOrderListUpdated();
    this.onSearchedItemNameChanged();
  }
  // on orderList changed
  onOrderListUpdated(){
    this.kdsService.orderList$.subscribe(orders => {
      this.orderList = orders;
      this.totalOrders = orders.length;
      this.fillItemFrequencyMap();
      this.sortItemFreqMap();
    })
  }

  // on searched item name chaged
  onSearchedItemNameChanged(){
    this.kdsService.searchedItemName$.subscribe(itemName =>{
      if(itemName.length >= 3){
        const itemNameList = Array.from(this.itemFrqMap.keys())
            .filter(name => name.startsWith(itemName));
        this.itemNameList = itemNameList;
      } else {
        this.itemNameList = this.topItemNameList;
      }
      
    })
  }


  // fill item frquency map
  fillItemFrequencyMap(){
    this.itemFrqMap = new Map<string,number>();
    this.orderList.forEach(order => {
      order.orderDetails?.forEach(detail =>{
        const itemName = detail.itemName as string;
          const prv = this.itemFrqMap.get(itemName);
        if(prv){
          this.itemFrqMap.set(itemName, Number(prv) + Number(detail.quantity));
        } else {
          this.itemFrqMap.set(itemName, Number(detail.quantity));
        }
      })
    })
  }

  // sort itme frequency map
  sortItemFreqMap(){
    const entries = Array.from(this.itemFrqMap.entries());
    entries.sort((a,b)=>b[1] - a[1]);
    this.itemFrqMap = new Map(entries);
    this.topItemNameList = Array.from(this.itemFrqMap.keys()).slice(0,5);
    this.itemNameList = this.topItemNameList;
  }

  logout(){
    this.tokenService.removeToken();
    this.route.navigate(['login']);
  }


}
