import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/services';
import { AuthenticationRequest, AuthenticationResponse } from '../../services/models';
import { TokenService } from '../../services/token/token.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf,NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  authRequest:AuthenticationRequest = {username: '', password: ''}
  ereMsgs:string[] = []
  errMessage:string = '';
  reqdUrl?:string;


  constructor(
    private authService:AuthenticationService,
    private tokenService:TokenService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.reqdUrl = this.activatedRoute.snapshot.params['url'];
  }


  login(){
    this.ereMsgs = [];
    this.errMessage = '';
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next:(response:AuthenticationResponse) =>{
        this.tokenService.token = response.token as string;
        const roles = this.tokenService.getUserRole();
        if(this.reqdUrl){
          if(this.reqdUrl === 'admin' && roles.includes('ROLE_ADMIN')){
            this.router.navigate(['admin']);
          } else if(this.reqdUrl === 'waiter' && roles.includes('ROLE_WAITER')){
            this.router.navigate(['waiter'])
          } else if(this.reqdUrl === 'chef' && roles.includes('ROLE_CHEF')){
            this.router.navigate(['kds']);
          } else if(this.reqdUrl === 'chasier' && roles.includes('ROLE_CASHIER')){
            this.router.navigate(['cashier']);
          } else if(roles.includes('ROLE_ADMIN')){
            this.router.navigate([this.reqdUrl]);
          }
        } else {
          if(roles.includes('ROLE_ADMIN')){
            this.router.navigate(['admin']);
          } else if(roles.includes('ROLE_WAITER')){
            this.router.navigate(['waiter'])
          } else if(roles.includes('ROLE_CHEF')){
            this.router.navigate(['kds'])
          } else if(roles.includes('ROLE_CASHIER')){
            this.router.navigate(['cashier']);
          } 
        }
      },
      error: (err => {
        if(err.error.validationErrors){
          this.ereMsgs = err.error.validationErrors;
        } else{
          this.errMessage = err.error.error;
        }
      })
  })
};


}
