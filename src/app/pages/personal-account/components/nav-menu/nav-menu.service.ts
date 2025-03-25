import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {

  constructor() { }

  private socket!: WebSocket;
  private notificationsSubject = new BehaviorSubject<any>(null);
  notifications$ = this.notificationsSubject.asObservable();

  setNotifications(valeu: any) {
    this.notificationsSubject.next(valeu);
  }

  getNotifications() {
    return this.notificationsSubject.value
  }

  connectToWebSocket(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    const url = `${environment.apiUrl}/auth/WebsocketConnect?token=${token}&queueTag=menu`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notificationsSubject.next(data);
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
