import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-unsaved-changes-dialog',
  imports: [],
  standalone: true,
  templateUrl: './unsaved-changes-dialog.component.html',
  styleUrl: './unsaved-changes-dialog.component.scss'
})
export class UnsavedChangesDialogComponent {

  @Output() confirmClose = new EventEmitter<void>();
  @Output() cancelClose = new EventEmitter<void>();

  hideConfirmDialog() {
    this.cancelClose.emit(); 
  }

  confirmCloseDialog() {
    this.confirmClose.emit();
  }

}