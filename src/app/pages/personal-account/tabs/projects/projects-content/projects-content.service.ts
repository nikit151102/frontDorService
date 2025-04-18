import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../../../../environment';

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
export class ProjectsContentService {

  constructor(private http: HttpClient) { }

  getInvoices(): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<any>(`${environment.apiUrl}/api/CommercialWork/DocInvoice`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  getInvoicesByIdCounterparty(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<any>(`${environment.apiUrl}/api/CommercialWork/DocInvoice${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }
  getInvoiceById(id: string): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.get<any>(`${environment.apiUrl}/api/CommercialWork/DocInvoice/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  saveInvoice(invoice: any): Observable<any> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (invoice.id) {
      return this.http.put<any>(`${environment.apiUrl}/api/CommercialWork/DocInvoice/${invoice.id}`, invoice, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      });
    } else {
      return this.http.post<any>(`${environment.apiUrl}/api/CommercialWork/DocInvoice`, invoice, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }),
      });
    }
  }

  deleteInvoice(id: string): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return this.http.delete<void>(`${environment.apiUrl}/api/CommercialWork/DocInvoice/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    });
  }

  sendingVerification(invoice: any, status: any): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if(status){
      invoice.status = status;
    }

    return this.http.patch<void>(`${environment.apiUrl}/api/CommercialWork/DocInvoice/SendToCheck/${invoice.id}`, invoice, { headers });
  }

  getCheckers() {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<void>(`${environment.apiUrl}/api/Supplier/GetCheckers`, { headers });
  }


  measurementUnits$ = new BehaviorSubject<any[]>([]);

 /** ✅ Получаем поток данных */
 getMeasurementUnits$(): Observable<any[]> {
  return this.measurementUnits$.asObservable();
}

/** ✅ Устанавливаем данные */
setMeasurementUnits(values: any[]) {
  this.measurementUnits$.next(values);
}

/** ✅ Проверяем, есть ли данные */
hasMeasurementUnits(): boolean {
  return this.measurementUnits$.value.length > 0;
}

/** ✅ Загружаем данные с бэка */
getMeasurementUnit(): Observable<any[]> {
  if (this.hasMeasurementUnits()) {
    return this.getMeasurementUnits$(); // Если уже есть данные, не запрашиваем бэкенд
  }

  const token = localStorage.getItem('YXV0aFRva2Vu');
  const headers = new HttpHeaders({
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  });
  
  return this.http.post<any[]>(`${environment.apiUrl}/api/Entities/MeasurementUnit/Filter`, { filters: [], sorts: [] }, { headers })
    .pipe(
      tap(response => this.setMeasurementUnits(response)) // ✅ Сохраняем данные в BehaviorSubject
    );
}




  productTargets$ = new BehaviorSubject<any[]>([]);

 /** ✅ Получаем поток данных */
 getProductTargetsUnits$(): Observable<any[]> {
  return this.productTargets$.asObservable();
}

/** ✅ Устанавливаем данные */
setProductTargetsUnits(values: any[]) {
  this.productTargets$.next(values);
}

/** ✅ Проверяем, есть ли данные */
hasProductTargetsUnits(): boolean {
  return this.productTargets$.value.length > 0;
}
  getProductTarget(): Observable<any[]> {
    if (this.hasProductTargetsUnits()) {
      return this.getProductTargetsUnits$(); // Если уже есть данные, не запрашиваем бэкенд
    }
  
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any[]>(`${environment.apiUrl}/api/Entities/ProductTarget/Filter`, { filters: [], sorts: [] }, { headers })
      .pipe(
        tap(response => this.setProductTargetsUnits(response))// ✅ Сохраняем данные в BehaviorSubject
      );
  }

  


  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();
  messages$ = this.messagesSubject.asObservable();

  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const url = `${environment.apiUrl}/auth/WebsocketConnect?token=${token}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messagesSubject.next(data);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };


    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
    };
  }

  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.close();
    }
  }




}
