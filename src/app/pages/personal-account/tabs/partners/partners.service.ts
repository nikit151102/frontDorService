import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class PartnersService {

  constructor() { }

  
    private socket!: WebSocket;
    private partnersSubject = new BehaviorSubject<any>(null);
    partner$ = this.partnersSubject.asObservable();
  
    private invoicesSubject = new BehaviorSubject<any>(null);
    invoices$ = this.invoicesSubject.asObservable();
  

    setPartners(valeu: any) {
      this.partnersSubject.next(valeu);
    }
  
    getPartners() {
      return this.partnersSubject.value
    }

    setInvoices(valeu: any) {
      this.invoicesSubject.next(valeu);
    }
  
    getInvoices() {
      return this.invoicesSubject.value
    }
  
    connectToWebSocket(): void {
      const token = localStorage.getItem('YXV0aFRva2Vu');
      const url = `${environment.apiUrl}/auth/WebsocketConnect?token=${token}&queueTag=docInvoicePartnerTable`;
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
      };
  
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.setPartners(data);
          this.setInvoices(data);
          console.log("web-socket works:", data);
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
