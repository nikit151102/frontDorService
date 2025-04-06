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

  partnersData: any;

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

    const typeValue = currentUrl.includes('/services') ? 1 : (currentUrl.includes('/project') ? 2 : 0);
 
  this.queryData.filters = this.queryData.filters.filter((filter: any) => filter.field !== 'type');

  this.queryData.filters.unshift({ field: 'type', values: [typeValue], type: 1 });


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

  getCounterpartyItem(id:string){
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<void>(`${this.apiUrl}api/CommercialWork/Partner/${id}`,
      { headers: this.getHeaders() }
    );
    
  }

  // Редактировать контрагента
  editCounterparty(id: string, updatedCounterparty: Counterparty): Observable<Counterparty> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.put<Counterparty>(`${this.apiUrl}api/CommercialWork/Partner/${id}`, updatedCounterparty,
      { headers: this.getHeaders() });
  }

  
  sendingVerification(invoice: any, status: any): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if(status){
      status.editStatus = invoice
    }

    return this.http.put<void>(`${environment.apiUrl}/api/CommercialWork/Partner/${status.id}`, status, { headers });
  }

}
