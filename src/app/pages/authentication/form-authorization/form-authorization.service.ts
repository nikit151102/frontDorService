import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class FormAuthorizationService {

  constructor(private http: HttpClient) { }

  signIn(formData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/authentication`, formData);
  }


  
  
}
