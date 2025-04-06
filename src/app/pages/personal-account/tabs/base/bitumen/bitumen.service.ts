import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class BitumenService {

  constructor(private http: HttpClient) {}

  getProductsByEndpoint(endpoint: string): Observable<any[]> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post<any[]>(`${environment.apiUrl}${endpoint}`, {filters: [], sorts: []}, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }
  
}
