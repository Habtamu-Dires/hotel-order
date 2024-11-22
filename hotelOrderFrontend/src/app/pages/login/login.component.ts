import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/services';
import { AuthenticationRequest, AuthenticationResponse } from '../../services/models';
import { TokenService } from '../../services/token/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf,NgFor],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authRequest:AuthenticationRequest = {username: '', password: ''}
  ereMsgs:string[] = []
  errMessage:string = '';


  constructor(
    private authService:AuthenticationService,
    private tokenService:TokenService,
    private router:Router
  ){}


  login(){
    this.ereMsgs = [];
    this.errMessage = '';
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next:(response:AuthenticationResponse) =>{
        this.tokenService.token = response.token as string;
        console.log(response.token as string);
        this.router.navigate(['admin']);
      },
      error: (err =>{
        if(err.error.validationErrors){
          this.ereMsgs = err.error.validationErrors;
        } else{
          this.errMessage = err.error.error;
        }
      })
  })
}
}
