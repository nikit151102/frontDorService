import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private authTokenSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.authTokenSubject.asObservable();

  constructor() { }

  hasToken(): boolean {
    return !!localStorage.getItem('YXV0aFRva2Vu');
  }

  getToken(): boolean {
    return this.authTokenSubject.value;
  }

  setToken(token:string): void {
    localStorage.setItem('YXV0aFRva2Vu', token);
    this.authTokenSubject.next(true);
  }

  clearToken(): void {
    localStorage.removeItem('YXV0aFRva2Vu');
    this.authTokenSubject.next(false);
  }
  

}
