import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  set token(token:string){
    localStorage.setItem('token', token);
  }

  get token(){
    return localStorage.getItem('token') as string;
  }

  isTokenValid(){
    const token = this.token;
    if(!token){
      return false;
    }
    // token decoder
    const jwtHelper = new JwtHelperService();

    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if(isTokenExpired){
      localStorage.clear();
      return false;
    }

    return true;
  }

  isTokenNotValid(){
    return !this.isTokenValid();
  }

  // decode the users role
  getUserRole():string[]{
    const token = this.token;
    if(!token){
      return [];
    }
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    return decodedToken.authorities;
  }

  removeToken(){
    localStorage.clear();
  }
}
