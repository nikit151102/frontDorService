import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { InvoiceConfig } from '../../../../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class GeneralFormService {
  private configSubject: BehaviorSubject<InvoiceConfig> = new BehaviorSubject<InvoiceConfig>(this.getInitialConfig());
  private modelSubject: BehaviorSubject<Record<string, any>> = new BehaviorSubject<Record<string, any>>({});
  private selectedInvoiceSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private service: any;

  constructor() { }

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

}
