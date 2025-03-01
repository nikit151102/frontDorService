import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
import { UserData, UserUpdateRequest } from '../interfaces/user';
import { Response } from '../interfaces/common'
import { ToastService } from './toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private readonly storageKey = 'currentUser';

  constructor(private http: HttpClient,
    private toastService: ToastService,
    private router: Router) { }

  /**
   * Сохраняет объект пользователя в sessionStorage.
   * @param user Объект пользователя для сохранения.
   */
  saveUser(user: any): void {
    if (user) {
      sessionStorage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  /**
   * Извлекает объект пользователя из sessionStorage.
   * @returns Объект пользователя или `null`, если его нет.
   */
  getUser(): any | null {
    const userData = sessionStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Проверяет, существует ли объект пользователя в sessionStorage.
   * @returns `true`, если объект существует, иначе `false`.
   */
  hasUser(): boolean {
    return sessionStorage.getItem(this.storageKey) !== null;
  }

  /**
   * Удаляет объект пользователя из sessionStorage.
   */
  removeUser(): void {
    sessionStorage.removeItem(this.storageKey);
  }


  /**
 * Обновляет баланс пользователя в sessionStorage.
 * @param newBalance Новый баланс пользователя.
 */
  updateUserBalance(newBalance: string): void {
    const user = this.getUser();
    if (user) {
      user.balance = newBalance; // Обновляем баланс в объекте пользователя.
      this.saveUser(user); // Сохраняем обновленного пользователя обратно в sessionStorage.
    }
  }


  // Получение заголовков с токеном
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  // Общая обработка ошибок
  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }

getDataUser(){
  return this.http
  .get<Response<UserData>>(`${environment.apiUrl}/api/Profile`, {
    headers: this.getAuthHeaders(),
  })
}
  // Получение данных пользователя
  getUserData(): Observable<Response<UserData>> {
    return this.http
      .get<Response<UserData>>(`${environment.apiUrl}/api/Profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          localStorage.setItem('VXNlcklk', response.data.id);
          this.saveUser(response.data)
          return response;
        }),
        catchError((error) => {
          this.toastService.showError('Сеанс истёк', 'Пожалуйста, выполните повторный вход');
          localStorage.removeItem('YXV0aFRva2Vu');
          this.router.navigate(['/login']);
          return this.handleError(error);
        })
      );
  }
 
  // Обновление данных пользователя
  updateUserData(user: UserUpdateRequest): Observable<any> {
    return this.http
      .put<any>(`${environment.apiUrl}/api/Profile`, user, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError))
  }

  // Удаление пользователя
  deleteUser(): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiUrl}/api/Profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public clearAuthData(): void {
    localStorage.removeItem('YXV0aFRva2Vu');
    localStorage.removeItem('Y29va2llQ29uc2VudA==');
    localStorage.removeItem('VXNlcklk');
  }

}
