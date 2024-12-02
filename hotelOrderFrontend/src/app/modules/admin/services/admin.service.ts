import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  
  private hideSideBarSubject= new BehaviorSubject<boolean>(false);
  hideSideBarStatus$ = this.hideSideBarSubject.asObservable();

  constructor() { }

  updateHideSideBarStatus(value:boolean){
    this.hideSideBarSubject.next(value);
  }

}
