import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { InvoiceConfig } from '../../../../../../interfaces/common.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../../environment';

import { CurrentUserService } from '../../../../../../services/current-user.service';
import { GeneralDocsService } from '../../../logistic/general-docs/general-docs.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralDocsFormService {
  private configSubject: BehaviorSubject<InvoiceConfig> = new BehaviorSubject<InvoiceConfig>(this.getInitialConfig());
  private modelSubject: BehaviorSubject<Record<string, any>> = new BehaviorSubject<Record<string, any>>({});
  private selectedInvoiceSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private service: any;

  constructor(private http: HttpClient,
    private generalDocsService: GeneralDocsService,
    private currentUserService: CurrentUserService
  ) { }

  // Инициализируем конфигурацию
  private getInitialConfig(): InvoiceConfig {
    return {
      fields: [],
      buttons: []
    };
  }

  // Получение текущей конфигурации
  getConfig(): Observable<InvoiceConfig> {
    return this.configSubject.asObservable();
  }

  // Запись новой конфигурации
  setConfig(config: InvoiceConfig): void {
    this.configSubject.next(config);
  }

  // Получение модели
  getModel(): Observable<Record<string, any>> {
    return this.modelSubject.asObservable();
  }


  getDataModel() {
    return this.modelSubject.getValue();
  }

  // Запись модель
  setModel(model: Record<string, any>): void {
    this.modelSubject.next(model);
  }

  // Получение выбранной фактуры
  getSelectedInvoice(): Observable<any> {
    return this.selectedInvoiceSubject.asObservable();
  }

  // Запись выбранной фактуры
  setSelectedInvoice(invoice: any): void {
    this.selectedInvoiceSubject.next(invoice);
  }

  // Получение сервиса
  getService() {
    return this.service;
  }

  // Запись сервиса
  setService(data: any) {
    this.service = data;
  }

  private cache = new Map<string, any[]>();
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


  add7Hours(dateTime: Date | string): Date {
    const date = new Date(dateTime);
    const hoursOffset = Number(this.currentUserService.getUser().hoursOffset);
    date.setHours(date.getHours() + hoursOffset);  // Добавляем 7 часов
    return date;
  }


  savedoc(item: any): Observable<any> {
    if (!item) {
      return throwError(() => new Error('Item cannot be null or undefined'));
    }

    const token = localStorage.getItem('YXV0aFRva2Vu');

    ['beginDateTime', 'endDateTime'].forEach(prop => {
      if (item[prop]) {
        item[prop] = this.add7Hours(new Date(item[prop]).toISOString());
      }
    });

    const body = {
      entityDto: item,
      queryDto: this.generalDocsService.queryData || {}
    };

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${environment.apiUrl}/api/CommercialWork/DocLogisticShift`;

    return (item?.id ? this.http.put(`${url}/${item.id}`, body, { headers }) : this.http.post(url, body, { headers }))
      .pipe(
        tap((response: any) => this.generalDocsService.addOrUpdateItem(response.documentMetadata.data)),
        catchError(err => {
          console.error('API Error:', err);
          return throwError(() => err);
        })
      );
  }

  
  sendingVerification(invoice: any, status: any, endpoint: string = 'api/CommercialWork/DocInvoice'): Observable<void> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    if (status) {
      invoice.status = status;
    }

    return this.http.patch<void>(`${environment.apiUrl}/api/CommercialWork/DocLogisticShift/SendToCheck/${invoice.id}`, invoice, { headers });
  }
  
}
