import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environment';
import { InvoicesService } from '../../components/invoices/invoices.service';

@Injectable({
  providedIn: 'root'
})
export class AccountantService {

  constructor(public invoicesService: InvoicesService) { }


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

  selectCounterpartyId: any;

  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    let apiUrl = environment.apiUrl.replace(/^https/, "wss");
    const url = `${apiUrl}/auth/WebsocketConnect?token=${token}&queueTag=accountantPartnerTable`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.setPartners(data);
        this.setInvoices(data);
        console.log("web-socket works:", data);
        console.log('data.partner.id', data.partner.id);
        console.log('this.selectCounterpartyId', this.selectCounterpartyId)
        if (this.selectCounterpartyId === data.partner.id) {
          console.log('current')
          this.invoicesService.addOrUpdateItem(data);
        }
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
