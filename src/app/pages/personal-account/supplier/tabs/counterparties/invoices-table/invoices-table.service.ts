import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environment';

interface Product {
  productName: string;
  quantity: number;
  amount: number;
  date: string;
}

interface DocInvoice {
  id: number;
  date: string;
  numberInvoice: string;
  status: number;
  stateNumberCar: string;
  incomeSum: number;
  expenseSum: number;
  type: number;
  tax: number;
  productList: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  getInvoices(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<any>(`${environment.apiUrl}/api/Supplier/DocInvoices`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  getInvoicesByIdCounterparty(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<any>(`${environment.apiUrl}/api/Supplier/DocInvoicesByPartner/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }
  getInvoiceById(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<any>(`${environment.apiUrl}/api/Supplier/DocInvoices/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  saveInvoice(invoice: any): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (invoice.id) {
      return this.http.put<any>(`${environment.apiUrl}/api/Supplier/DocInvoices/${invoice.id}`, invoice, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      });
    } else {
      return this.http.post<any>(`${environment.apiUrl}/api/Supplier/DocInvoices`, invoice, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      });
    }
  }

  deleteInvoice(id: string): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.delete<void>(`${environment.apiUrl}/api/Supplier/DocInvoices/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  sendingVerification(id: string): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
  
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.patch<void>(`${environment.apiUrl}/api/Supplier/DocInvoices/${id}`, {}, { headers });
  }
  
}
