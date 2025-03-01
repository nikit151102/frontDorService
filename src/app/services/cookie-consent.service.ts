import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  private consentKey = 'Y29va2llQ29uc2VudA==';  
  private consentSubject = new BehaviorSubject<boolean>(this.hasConsented()); 

  constructor() { }

  hasConsented(): boolean {
    return localStorage.getItem(this.consentKey) === 'true';  
  }

  get consentStatus$() {
    return this.consentSubject.asObservable();
  }

  giveConsent(): void {
    localStorage.setItem(this.consentKey, 'true');
    this.consentSubject.next(true); 
  }

  revokeConsent(): void {
    localStorage.removeItem(this.consentKey);
    this.consentSubject.next(false);  
  }

  openConsent(){
    this.consentSubject.next(true); 
  }

  closeConsent(){
    this.consentSubject.next(false); 
  }
}