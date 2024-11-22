import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { IdResponse, RegistrationRequest, UserResponse } from '../../../../services/models';
import { AuthenticationService, UsersService } from '../../../../services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent {

  userList:UserResponse[] = [];
  selectedUserImage:any;
  selectedPictureString:string | undefined;
  errMsgs:Array<string> = [];
  userRequest:RegistrationRequest = {
    username: '', 
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    email: '',
    roles: [],
  }
  filter:string = '';
  roleList:string[] = ['WAITER','CHEF','BARISTA','CASHIER','ADMIN'];
  showRoles:boolean = false;
  confirmPassword = new FormControl('');
  passwordControl = new FormControl('');
  showPassConfError:boolean = false;
  

  constructor(
    private userService:UsersService,
    private authService:AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private toastrService: ToastrService,
  ){}

  ngOnInit(): void {
    // edit
    const userId = this.activatedRoute.snapshot.params['userId'];
    if(userId){
      this.fetchUserById(userId);
    }
    // password form control
    this.confirmPasswordControl();
    this.passwordFormControl();
  }

  //confirm password form control
  confirmPasswordControl(){
    this.confirmPassword.valueChanges
    .pipe(
      debounceTime(1500)
    ).subscribe((value:any)=>{
      const password = value as string;
      if(password !== this.userRequest.password){
        this.showPassConfError = true;
      } else{
        this.showPassConfError = false;
      }
    })
  }

  // password form control
  passwordFormControl(){
    this.passwordControl.valueChanges
    .pipe(
      debounceTime(1000)
    ).subscribe((value:any)=>{
      const password = value as string;
      this.userRequest.password = password;
      if(this.confirmPassword.value?.length !== 0 && 
         password !== this.confirmPassword.value )
        {
          this.showPassConfError = true;
        } else {
          this.showPassConfError = false;
        }
    })
  }


  // search category by name
  searchUserByName(text:string){
    this.userService.searchByUsername({
      'user-name' : text,
      'role' : this.filter
    }).subscribe({
      next:(res:UserResponse[]) =>{
        this.userList = res;
      }
    })
  }

  //fetch user by id
  fetchUserById(itemId:string){
    this.userService.getUserById({
      'user-id': itemId
    }).subscribe({
      next:(res:UserResponse) =>{
        this.userRequest = {
          id: res.id as string,
          username: res.username as string, 
          firstName: res.firstName as string,
          lastName: res.lastName as string,
          password: res.password as string,
          phoneNumber: res.phoneNumber as string,
          email: res.email as string,
          roles: res.roles as string[],
        }
        this.passwordControl.setValue(this.userRequest.password);
        this.confirmPassword.setValue(this.userRequest.password);
        if(res.imageUrl != undefined && res.imageUrl.length > 0){ 
          this.selectedPictureString = res.imageUrl;
        }
        
      }
    })
  }
  

  //on role selected
  onRoleSelected(role:string){
    if(!this.userRequest.roles.includes(role)){
        this.userRequest.roles.push(role);
    }
  }
  // remove role
  removeRole(role:string){
    const roles = this.userRequest.roles;
    this.userRequest.roles = roles.filter(r=>r !== role);
  }

  // Track clicks to hide the dropdown 
  @HostListener('document:click', ['$event'])
  onClickOutSideDropdown(event: MouseEvent){
    const target = event.target as HTMLElement;
    // only hide if the click is outside the component
    if(!target.classList.contains('donthide')){
      this.showRoles = false;
    }
  }  

  // save
  onSave(){
    this.errMsgs = [];
    const userId = this.userRequest.id;
    if(userId && userId.length !== 0){
      this.updateProfile(userId);
    } else{
      console.log("register")
      this.registerUser();
    }
  }

  // register new user 
  registerUser(){
    this.authService.register({
      body: this.userRequest
    }).subscribe({
      next:(response:IdResponse)=>{
        //upload image
        if(this.selectedUserImage) {
          this.uploadImage(response.id as string);
        } else{
          this.router.navigate(['admin','users']);
          this.toastrService.success('User saved successfully ', 'Done!')
        }
      },
      error:(err) => {
        if(err.error.validationErrors){
          this.errMsgs = err.error.validationErrors;
        } else{
          console.log(err);
          this.toastrService.error(err.error.error, 'Ooops');
        }
      }
    })
  }

  // update profile 
  updateProfile(userId:string){
    this.userService.updateProfile({
      'user-id': userId,
      body: this.userRequest
    }).subscribe({
      next:(response:IdResponse)=>{
        //upload image
        if(this.selectedUserImage) {
          this.uploadImage(response.id as string);
        } else{
          this.router.navigate(['admin','users']);
          this.toastrService.success('User updated successfully ', 'Done!')
        }
      },
      error:(err) => {
        if(err.error.validationErrors){
          this.errMsgs = err.error.validationErrors;
        } else{
          console.log(err);
          this.toastrService.error(err.error.error, 'Ooops');
        }
      }
    })
  }
   
  // upload image
  uploadImage(id:string){
    this.userService.uploadProfilePicture({
      'user-id' : id,
      body : {
        file: this.selectedUserImage
      }
    }).subscribe({
      next:() => {
        this.toastrService.success('User saved successfully ', 'Done!')
        this.router.navigate(['admin','users']);
      },
      error:(err) => {
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');            
      }
    })
  }
  
  // file selected
  onFileSelected(event:any){
    this.selectedUserImage = event.target.files[0];
    if(this.selectedUserImage != null){
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPictureString = reader.result as string;
      }
      reader.readAsDataURL(this.selectedUserImage)
    }
  }

  //cancel selected picture
  cancelSelectedPicture(){
    this.selectedPictureString = undefined;
   // this.userRequest.imageUrl=undefined;
  }

  // cnacel
  onCancel(){
    this.router.navigate(['admin','users']);
  }
}
