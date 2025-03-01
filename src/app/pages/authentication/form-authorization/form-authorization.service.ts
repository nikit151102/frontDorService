import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormAuthorizationService {

  constructor(private http: HttpClient) { }

  signIn(formData: {
    UserName: string;
    TgId?: string;
    Email: string;
    Password: string;
  }): Observable<any> {
    console.log('apiUrl', environment.apiUrl)
    return this.http.post(`${environment.apiUrl}/auth/authentication`, formData);
  }

}
