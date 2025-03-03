import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReferenceBookService } from '../reference-book.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  imports: [CommonModule, DialogModule, DropdownModule, DatePickerModule, FormsModule],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.scss'
})
export class ModalFormComponent implements OnInit {
  @Input() id: string | null = null;
  @Output() close = new EventEmitter<void>();

  modalTitle = 'Детали записи';
  modalData: any = {};
  currentRecord: any;

  constructor(public referenceBookService: ReferenceBookService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (this.id) {
      this.currentRecord = this.referenceBookService.setDetailsRecord(this.id);
    } else {
      this.currentRecord = {};
    }
  }

  onSubmit(): void {
    if (this.id) {
      this.referenceBookService.updateDetailsRecord(this.id, this.modalData);
      this.closeModal();

    } else {
      this.referenceBookService.addDetailsRecord(this.modalData);
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit();
  }
}