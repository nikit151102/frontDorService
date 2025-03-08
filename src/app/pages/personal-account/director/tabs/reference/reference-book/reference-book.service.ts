import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceBookService {

  constructor(private http: HttpClient) { }

  getHeader() {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // Получение всех записей
  getRecords(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/Director/Entities/${endpoint}`, { headers: this.getHeader() });
  }

  // Получение конкретной записи по ID
  getRecord(endpoint: string, id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Director/Entities/${endpoint}/${id}`, { headers: this.getHeader() });
  }

  // Создание новой записи
  newRecord(endpoint: string, record: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Director/Entities/${endpoint}`, record, { headers: this.getHeader() });
  }

  // Обновление существующей записи
  updateRecord(endpoint: string, id: number, record: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/Director/Entities/${endpoint}/${id}`, record, { headers: this.getHeader() });
  }

  // Удаление записи
  deleteRecord(endpoint: string, id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Director/Entities/${endpoint}/${id}`, { headers: this.getHeader() });
  }
}
