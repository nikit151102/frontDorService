import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showSuccess(summary: string, detail: string): void {
    console.log("success")
    this.messageService.add({ severity: 'success', summary, detail });
  }

  showError(summary: string, detail: string): void {
    const formattedDetail = detail.replace(/\n/g, '<br>');
    this.messageService.add({ severity: 'error', summary, detail: formattedDetail });
  }
  

  showInfo(summary: string, detail: string): void {
    const formattedDetail = detail.replace(/\n/g, '<br>');
    this.messageService.add({ severity: 'info', summary, detail });
  }

  showWarn(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }
}
