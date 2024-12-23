import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  _rootUrl: string = '';

  constructor() { }

  set rootUrl(url:string){
    // this.rootUrlSubject.next(url);
    this._rootUrl = url;
    environment.apiUrl = url;
  }

}
