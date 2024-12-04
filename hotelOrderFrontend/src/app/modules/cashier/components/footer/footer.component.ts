import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../../services/token/token.service';
import { Router } from '@angular/router';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{

  infoMap:Map<string,number> = new Map([['totalTransaction', 0], ['totalOrders', 0]]);

  constructor(
    private tokenService:TokenService,
    private router:Router,
    private cashierService:CashierService
  ){}

  ngOnInit(): void {
    this.onOrderedBillReady();
  }

  onOrderedBillReady(){
    this.cashierService.infoMap$.subscribe(map => {
      this.infoMap = map;
    })
  }

  logout(){
    this.tokenService.removeToken();
    this.router.navigate(['login']);
  }
}
