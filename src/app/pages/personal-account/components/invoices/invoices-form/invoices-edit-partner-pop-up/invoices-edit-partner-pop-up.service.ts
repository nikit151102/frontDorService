import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesEditPartnerPopUpService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  visible$ = this.visibleSubject.asObservable();

  private isPopupOpen = false;

  openConfirmDialog() {
    if (this.isPopupOpen) {
      return;
    }
    this.isPopupOpen = true;
    this.visibleSubject.next(true);
  }

  closeConfirmDialog() {
    this.isPopupOpen = false;
    this.visibleSubject.next(false);
  }
}
