import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/api/Profile`;

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl, this.getHttpOptions());
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, profileData, this.getHttpOptions());
  }
}
