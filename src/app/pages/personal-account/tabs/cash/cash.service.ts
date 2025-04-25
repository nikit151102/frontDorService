import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { InvoicesService } from '../../components/invoices/invoices.service';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  constructor(public invoicesService: InvoicesService) { }

  private socket!: WebSocket;

  selectAntonCashType: any;

  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    let apiUrl = environment.apiUrl.replace(/^https/, "wss");
    const url = `${apiUrl}/auth/WebsocketConnect?token=${token}&queueTag=cashTable`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("web-socket works:", data);
        console.log('data.antonCashType', data.antonCashType);
        console.log('this.selectAntonCashType', this.selectAntonCashType)
        if (this.selectAntonCashType === data.antonCashType) {
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

