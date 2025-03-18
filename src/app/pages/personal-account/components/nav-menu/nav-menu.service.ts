import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {

  constructor() { }

  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();
  messages$ = this.messagesSubject.asObservable();

  
  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const url = `${environment.apiUrl}/api/Profile/HistoryUpdates?token=${token}&queueTag=menu`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messagesSubject.next(data);
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
