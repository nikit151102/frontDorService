import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmPopupService } from './confirm-popup.service';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-confirm-popup',
  imports: [CommonModule],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.scss',
})
export class ConfirmPopupComponent implements OnInit {
  visible$!: Observable<boolean>;
  title: string = '';
  message: string = '';
  acceptLabel: string = 'Да';
  rejectLabel: string = 'Отмена';

  constructor(
    private confirmPopupService: ConfirmPopupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.visible$ = this.confirmPopupService.visible$;

    this.confirmPopupService.config$.subscribe((config) => {
      if (config) {
        this.title = config.title;
        console.log('title', this.title);
        this.message = config.message;
        this.acceptLabel = config.acceptLabel;
        this.rejectLabel = config.rejectLabel;
        this.cdr.detectChanges();
      }
    });
  }

  onAccept() {
    this.confirmPopupService.config$.pipe(take(1)).subscribe((config) => {
      if (config?.onAccept) {
        config.onAccept();
      }
      this.confirmPopupService.closeConfirmDialog();
    });
  }

  closePopup() {
    this.confirmPopupService.closeConfirmDialog();
  }
}
