import { Injectable } from '@angular/core';
import { InvoicesService } from '../../components/invoices/invoices.service';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(public invoicesService: InvoicesService) { }

  private socket!: WebSocket;

  selectManagerDocType: any;

  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    let apiUrl = environment.apiUrl.replace(/^https/, "wss");
    const url = `${apiUrl}/auth/WebsocketConnect?token=${token}&queueTag=managerDocTable`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("web-socket works:", data);
        console.log('data.managerDocType', data.managerDocType);
        console.log('this.selectManagerDocType', this.selectManagerDocType)
        if (this.selectManagerDocType === data.managerDocType) {
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

