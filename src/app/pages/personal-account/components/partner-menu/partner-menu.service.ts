import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

export class PartnerMenuService {
  private apiUrl = `${environment.apiUrl}/`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(environment.token) || '';
    return new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  queryData: any = { filters: [], sorts: [] }

  constructor(private http: HttpClient, private router: Router) { }

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

    return this.http.post<Counterparty[]>(`${this.apiUrl}api/CommercialWork/Partner/Filter`, this.queryData, 
      { headers: this.getHeaders() })
  }

  // Добавить контрагента
  addCounterparty(counterparty: Counterparty): Observable<Counterparty> {
    return this.http.post<Counterparty>(`${this.apiUrl}api/CommercialWork/Partner`, counterparty, { headers: this.getHeaders() });
  }

  // Удалить контрагента
  deleteCounterparty(id: string): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.delete<void>(`${this.apiUrl}api/CommercialWork/Partner/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Редактировать контрагента
  editCounterparty(id: string, updatedCounterparty: Counterparty): Observable<Counterparty> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.put<Counterparty>(`${this.apiUrl}api/CommercialWork/Partner/${id}`, updatedCounterparty,
      { headers: this.getHeaders() });
  }
}
