import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { KdsService } from '../../services/kds.service';
import { FormsModule } from '@angular/forms';
import { UserResponse } from '../../../../services/models';
import { UsersService } from '../../../../services/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  searchedText:string = '';
  loggedUser?:UserResponse;

  constructor(
    private kdsService:KdsService,
    private userService:UsersService
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
    if(this.searchedText.length >= 2){
      this.kdsService.updateSearchedItemName(this.searchedText);
    }
  }

  clearSearchArea(){
    this.searchedText = '';
  }
  
}
