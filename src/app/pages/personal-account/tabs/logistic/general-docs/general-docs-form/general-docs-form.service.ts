import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InvoiceConfig } from '../../../../../../interfaces/common.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../../environment';
import { GeneralDocsService } from '../general-docs.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralDocsFormService {
  private configSubject: BehaviorSubject<InvoiceConfig> = new BehaviorSubject<InvoiceConfig>(this.getInitialConfig());
  private modelSubject: BehaviorSubject<Record<string, any>> = new BehaviorSubject<Record<string, any>>({});
  private selectedInvoiceSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private service: any;

  constructor(private http: HttpClient,
    private generalDocsService: GeneralDocsService
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



  savedoc(item: any): Observable<any[]> {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    if (item.beginDateTime) {
      item.beginDateTime = new Date(item.beginDateTime).toISOString();
    }
    if (item.endDateTime) {
      item.endDateTime = new Date(item.endDateTime).toISOString();
    }

    return new Observable(observer => {
      this.http.post<any[]>(`${environment.apiUrl}/api/CommercialWork/DocLogisticShift`,
        {
          'entityDto': item,
          'queryDto': this.generalDocsService.queryData
        }
        , {
          headers: new HttpHeaders({
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }),
        }).subscribe(
          (response: any) => {
            const data = response.data;
            this.generalDocsService.addOrUpdateItem(data)
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

}
