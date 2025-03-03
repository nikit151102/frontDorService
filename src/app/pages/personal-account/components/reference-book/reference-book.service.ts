import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment';
import { ToastService } from '../../../../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceBookService {

  data: any;
  endpoints: any;
  tableColumns: any;
  columnBottomFix: any;
  formFields: any;

  constructor(private http: HttpClient,
    private toastService: ToastService,) { }


  getHeader() {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Получение всех записей
  functionGetRecords(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}${endpoint}`, { headers: this.getHeader() });
  }

  // Получение конкретной записи по ID
  functionGetRecord(endpoint: string, id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${endpoint}/${id}`, { headers: this.getHeader() });
  }

  // Создание новой записи
  functionNewRecord(endpoint: string, record: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${endpoint}`, record, { headers: this.getHeader() });
  }

  // Обновление существующей записи
  functionUpdateRecord(endpoint: string, id: string, record: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}${endpoint}/${id}`, record, { headers: this.getHeader() });
  }

  // Удаление записи
  functionDeleteRecord(endpoint: string, id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}${endpoint}/${id}`, { headers: this.getHeader() });
  }


  loadData(): void {
    this.functionGetRecords(this.endpoints.getAllItems).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.data = response.data;
          this.columnBottomFix = response.columnBottom;
        } else {
          this.toastService.showError('Ошибка', 'Данные не найдены в ответе.');
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }






  

  // Получаем данные записи
  setDetailsRecord(id: string): void {
    this.functionGetRecord(this.endpoints.getByIdItem, id).subscribe(
      (response) => {
        return response.data;
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
        return ;
      }
    );
  }

    // Получаем данные записи
    addDetailsRecord(values: any): void {
      this.functionNewRecord(this.endpoints.createItem, values).subscribe(
        (response) => {
          return response.data;
        },
        (error) => {
          const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
          this.toastService.showError('Ошибка', errorMessage);
          return ;
        }
      );
    }

  // Обновление записи
  updateDetailsRecord(id: string, updatedRecord: any): void {
    this.functionUpdateRecord(this.endpoints.updateItem, id, updatedRecord).subscribe(
      (response) => {
        const index = this.data.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          this.data[index] = response.data;
          this.toastService.showSuccess('Успех', 'Запись успешно обновлена');
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  // Удаление записи
  deleteDetailsRecord(currentEndpoint: string, id: number): void {
    this.functionDeleteRecord(currentEndpoint, id).subscribe(
      () => {
        this.data = this.data.filter((item: any) => item.id !== id);
        this.toastService.showSuccess('Успех', 'Запись успешно удалена');
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }



}
