import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { PageResponseUserResponse, UserResponse } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../services/services';
import { Router } from '@angular/router';
import { PageNavigationComponent } from "../../components/page-navigation/page-navigation.component";
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MenuComponent, CommonModule, FormsModule, PageNavigationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  userList:UserResponse[] = [];
  filter:string = '';
  // pagination
  page:number = 0;
  size:number = 5;
  isEmptyPage: boolean = true;
  isFirstPage: boolean |undefined; 
  isLastPage: boolean |undefined;
  totalPages: number | undefined;
  totalElements: number | undefined;
  numberOfElements: number | undefined;

  constructor(
    private userService:UsersService,
    private router:Router,
    private toastService:ToastrService,
    private matDialog:MatDialog
  ){}
  
  
  ngOnInit(): void {
    this.fetchPagesOfUsers();
  }


  // filter changed
  onRoleFilterChange(filter: string) {
    this.filter = filter;
    this.page = 0;
    this.fetchPagesOfUsersByRole();
  }

  //search
  onSerchedTextChange(text: string) {
    if(text.length >= 2){
      this.searchUserByName(text);
    } else {
      this.fetchPagesOfUsersByRole();
    }
  }

  //search user by name
  searchUserByName(text:string){
    this.userService.searchByUsername({
      'user-name' : text,
      'role' : this.filter
    }).subscribe({
      next:(res:UserResponse[]) =>{
        this.userList = res;
        this.isEmptyPage = true;
      }, 
      error:(err)=>{
        console.log(err);
        this.toastService.error(err.error.error, 'Ooops'); 
      }
    })
  }

  // fetch pages of Users
  fetchPagesOfUsers(){
    this.userService.getPageOfUsers({
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseUserResponse) => {
        this.userList = res.content as UserResponse[];
        // pagination
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err) => {
        console.log(err);
        this.toastService.error(err.error.error, 'Ooops');
      }
    })
  }

  fetchPagesOfUsersByRole(){
    this.userService.getPageOfUsersByRole({
      'role': this.filter,
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseUserResponse) =>{
        this.userList = res.content as UserResponse[];
        // pagination
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err) => {
        console.log(err);
        this.toastService.error(err.error.error, 'Ooops');
      }
    })
  }

  // create new 
  onCreateNewBtnClicked() {
    this.router.navigate(['admin', 'users', 'manage']);
  }

  // edit
  onEdit(userId:any){
      this.router.navigate(['admin','users','manage', userId as string]);
  }

  // delete
  onDelete(userId:any){
    const dialog = this.matDialog.open(ConfirmDialogComponent);

    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.userService.deleteUser({
          'user-id': userId
        }).subscribe({
          next:()=>{
            this.fetchPagesOfUsers();
            this.toastService.success('User deleted successfully','Done');
          },
          error:(err)=>{
            console.log(err);
            this.toastService.error('Something went wrong', 'oops')
          }
        })
      }
    })


  }

  //pagination methods
  onPageChanged(page:number){
      this.page = page;
      this.fetchPagesOfUsersByRole();
  }

  onSizeChanged(size:number){
    this.size = size;
    this.fetchPagesOfUsersByRole();
  }
  

}
