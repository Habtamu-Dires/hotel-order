import { Component } from '@angular/core';
import { UserResponse } from '../../../../services/models';
import { UsersService } from '../../../../services/services';
import { FormsModule } from '@angular/forms';
import { CashierService } from '../../services/cashier.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchedText:string = '';
  loggedUser?:UserResponse;

  constructor(
    private userService:UsersService,
    private cashierService:CashierService
  ){}

  ngOnInit(): void {
    this.fetchLoggedUser();
  }

  // fetch looged user
  fetchLoggedUser(){
    this.userService.getLoggedUser().subscribe({
      next:(res:UserResponse)=>{
        this.loggedUser = res;
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }

  // on search text change
  onSearchTextChange(){
    this.cashierService.updateSearchedItemName(this.searchedText);
  }

  clearSearchArea(){
    this.searchedText = '';
  }
  
}
