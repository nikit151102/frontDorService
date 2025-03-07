import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmPopupService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSubject.asObservable();

  private configSubject = new BehaviorSubject<{
    title: string;
    message: string;
    acceptLabel: string;
    rejectLabel: string;
    onAccept: () => void;
  } | null>(null);
  
  config$ = this.configSubject.asObservable();

  private isPopupOpen = false; 

  openConfirmDialog(config: {
    title: string;
    message: string;
    acceptLabel?: string;
    rejectLabel?: string;
    onAccept: () => void;
  }) {
    if (this.isPopupOpen) {
      return;
    }

    this.isPopupOpen = true;
    this.configSubject.next({
      title: config.title,
      message: config.message,
      acceptLabel: config.acceptLabel || 'Да',
      rejectLabel: config.rejectLabel || 'Отмена',
      onAccept: config.onAccept,
    });
    this.visibleSubject.next(true);
  }

  closeConfirmDialog() {
    this.isPopupOpen = false;
    this.visibleSubject.next(false);
  }
}
