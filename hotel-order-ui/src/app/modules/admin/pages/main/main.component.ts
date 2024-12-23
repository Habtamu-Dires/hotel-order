import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {  Router, RouterOutlet } from '@angular/router';
import { SideBarItemComponent } from "../../components/side-bar-item/side-bar-item.component";
import { TokenService } from '../../../../services/token/token.service';
import { UserResponse } from '../../../../services/models';
import { UsersService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';

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

  hideSideBar = false;
  showHideButton = false;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private tokenService:TokenService,
    private userService:UsersService,
    private toastrService:ToastrService,
    private adminService:AdminService
  ){}

  ngOnInit(): void {
    const index = this.router.url.lastIndexOf('/');
    this.activeComponent = this.capitalize(this.router.url.slice(index+1));
    this.fetchAdminUser();
    //side bar
    this.checkScreenSzie(window.innerWidth);
    this.onHideSideBarStatusChange();
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

  // on sidebar status change
  onHideSideBarStatusChange(){
    this.adminService.hideSideBarStatus$.subscribe(status =>{
      this.hideSideBar = status;
    })
  }


  get currentDate(){
    const now = new Date();
    return this.datePipe.transform(now, 'EEE, MMM dd, y')
  }

  setComponent(name:string){
    this.activeComponent = name;
    if(this.showHideButton){
      this.adminService.updateHideSideBarStatus(true);
    }
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

  // Listen for window resize events
  @HostListener('window:resize',['$event'])
  onResize(event:any){
    this.checkScreenSzie(event.target.innerWidth);
  }

  // check screen size and set hideSideBar value
  private checkScreenSzie(width:number){
    if (width < 1008) { // Small screen threshold (can be adjusted)
      this.adminService.updateHideSideBarStatus(true);
      this.showHideButton = true;
    } else {
      this.adminService.updateHideSideBarStatus(false);
      this.showHideButton = false;
    }
  }

  // show hide button
  onShowHideButton(){
    this.hideSideBar = true;
    this.checkScreenSzie(window.innerWidth);
  }

  toggleSideBar(){
    this.hideSideBar = !this.hideSideBar;
    this.adminService.updateHideSideBarStatus(this.hideSideBar);
   }
 

}
