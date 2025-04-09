import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ScoreFormService {

  constructor(private http: HttpClient) { }

  private visibleSubject = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSubject.asObservable();
  selectInvoiceId:string = '';
  selectInvoiceFullName:string = '';
  selectInvoiceShortName:string = '';

  visibleModal(isVisble: boolean) {
    this.visibleSubject.next(isVisble);
  }

  getProductsByEndpoint(endpoint: string): Observable<any[]> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post<any[]>(`${environment.apiUrl}${endpoint}`, { filters: [], sorts: [] }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }


  setCreate(data:any): Observable<any[]> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post<any[]>(`${environment.apiUrl}/api/CommercialWork/DocInvoice/Account`, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  sendingVerification(invoice: any, status: any, endpoint: string = 'api/CommercialWork/DocInvoice'): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if(status){
      invoice.status = status;
    }

    return this.http.patch<void>(`${environment.apiUrl}/${endpoint}/SendToCheck/${invoice.id}`, invoice, { headers });
  }
}
