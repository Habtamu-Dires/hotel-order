import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';
import { SideBarItemComponent } from "../../components/side-bar-item/side-bar-item.component";
import { TokenService } from '../../../../services/token/token.service';
import { UserResponse } from '../../../../services/models';
import { UsersService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SideBarItemComponent],
  providers:[DatePipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  activeComponent = '';
  adminUser:UserResponse | undefined;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private tokenService:TokenService,
    private userService:UsersService,
    private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    const index = this.router.url.lastIndexOf('/');
    this.activeComponent = this.capitalize(this.router.url.slice(index+1));
    this.fetchAdminUser();
  }

  //fetch admin user
  fetchAdminUser(){
    this.userService.getLoggedUser().subscribe({
      next:(res:UserResponse) =>{
        this.adminUser = res;
      },
      error:(err) => {
        console.log(err);
        this.toastrService.error(err.error.error, 'Oops');
      }
    })
  }

  get currentDate(){
    const now = new Date();
    return this.datePipe.transform(now, 'EEE, MMM dd, y')
  }

  setComponent(name:string){
    this.activeComponent = name;
   this.router.navigate(['admin',name.toLowerCase()])
  }

  capitalize(str:string){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // logout
  logout(){
    this.tokenService.removeToken();
    this.router.navigate(['login']);
  }

}
