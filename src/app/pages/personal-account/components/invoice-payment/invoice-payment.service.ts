import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class InvoicePaymentService {

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


  setPayment(data:any): Observable<any[]> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.post<any[]>(`${environment.apiUrl}/api/CommercialWork/DocInvoice/Payment`, data, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

}