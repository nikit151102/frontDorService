import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environment';

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
  constructor(private http: HttpClient) {}

  // Получить всех контрагентов
  getCounterparties(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
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
