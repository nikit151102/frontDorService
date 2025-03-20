import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  summary: string;
  detail: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messages: ToastMessage[] = [];
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private idCounter = 0;

  private showMessage(type: 'success' | 'error' | 'info' | 'warning', summary: string, detail: string, duration: number = 3000) {
    const id = this.idCounter++;
    const formattedDetail = detail.replace(/\n/g, '<br>'); // Форматируем переносы строк
    const toast: ToastMessage = { id, type, summary, detail: formattedDetail, duration };
    this.messages.push(toast);
    this.messagesSubject.next([...this.messages]);

    setTimeout(() => this.remove(id), duration);
  }

  showSuccess(summary: string, detail: string) {
    this.showMessage('success', summary, detail);
  }

  showError(summary: string, detail: string) {
    this.showMessage('error', summary, detail);
  }

  showInfo(summary: string, detail: string) {
    this.showMessage('info', summary, detail);
  }

  showWarn(summary: string, detail: string) {
    this.showMessage('warning', summary, detail);
  }

  remove(id: number) {
    this.messages = this.messages.filter(msg => msg.id !== id);
    this.messagesSubject.next([...this.messages]);
  }
}
