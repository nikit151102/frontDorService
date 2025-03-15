import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { Router } from '@angular/router';

interface Counterparty {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CounterpartiesService {
  private apiUrl = `${environment.apiUrl}/`;
  queryData: any = { filters: [], sorts: [] }
  constructor(private http: HttpClient, private router:Router) {}

  // Получить всех контрагентов
  getCounterparties(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    this.queryData.filters = this.queryData.filters || [];

    const currentUrl = this.router.url;

    const typeValue = currentUrl.includes('/services') ? 1 : 0;

    const hasTypeFilter = this.queryData.filters.some((filter:any) => filter.field === 'type');

    if (!hasTypeFilter) {
      this.queryData.filters = [
        { field: 'type', values: [typeValue], type: 1 },
        ...this.queryData.filters
      ];
    }
    console.log('this.queryData:', this.queryData)

    return this.http.post<Counterparty[]>(`${this.apiUrl}api/CommercialWork/Partner/Filter`, this.queryData  , {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  // Добавить контрагента
  addCounterparty(counterparty: Counterparty): Observable<Counterparty> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post<Counterparty>(`${this.apiUrl}api/CommercialWork/Partner`, counterparty, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  // Удалить контрагента
  deleteCounterparty(id: string): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.delete<void>(`${this.apiUrl}api/CommercialWork/Partner/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  // Редактировать контрагента
  editCounterparty(id: string, updatedCounterparty: Counterparty): Observable<Counterparty> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.put<Counterparty>(`${this.apiUrl}api/CommercialWork/Partner/${id}`, updatedCounterparty,
      {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }
}
