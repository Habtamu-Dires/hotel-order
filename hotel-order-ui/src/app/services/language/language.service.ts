import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languagesObj: { [key: string]: string } = {
    'English': 'en',
    'አማርኛ': 'am'
  };
  private langauge:string = 'en';

  constructor(private http: HttpClient) {
    
  }

  loadLanguage(language: string): Observable<any> {
    const lang = this.languagesObj[language];
    return this.http.get(`assets/lang/${lang}.json`)
      
  }

  getLanguage() {
    return this.langauge;
  }
}

