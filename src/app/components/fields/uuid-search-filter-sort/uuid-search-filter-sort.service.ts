import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UuidSearchFilterSortService {
  private cache = new Map<string, any[]>(); 
  constructor(private http: HttpClient) {}

  getProductsByEndpoint(endpoint: string): Observable<any[]> {
    const cached = this.cache.get(endpoint);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    const token = localStorage.getItem('YXV0aFRva2Vu');
    return new Observable(observer => {
      this.http.post<any[]>(`${environment.apiUrl}${endpoint}`, { filters: [], sorts: [] }, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      }).subscribe(
        (response: any) => {
          const data = response.data;
          this.cache.set(endpoint, data); 
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  clearCacheForEndpoint(endpoint: string) {
    this.cache.delete(endpoint);
  }

  clearAllCache() {
    this.cache.clear();
  }
}
