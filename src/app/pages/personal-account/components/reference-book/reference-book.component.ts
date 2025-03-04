import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { referenceConfig } from './conf';
import { ReferenceBookService } from './reference-book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../services/toast.service';
import { TableModule } from 'primeng/table';
import { ModalFormComponent } from './modal-form/modal-form.component';

@Component({
  selector: 'app-reference-book',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ModalFormComponent],
  templateUrl: './reference-book.component.html',
  styleUrls: ['./reference-book.component.scss']
})
export class ReferenceBookComponent implements OnInit {
  currentConfig: any;
  data: any[] = []; // Данные для таблицы
  formFields: any; // Поля для создания и редактирования
  isModalOpen = false; // Флаг модального окна
  modalData: any = {}; // Данные для модального окна
  columnBottomFix: any


  constructor(
    private route: ActivatedRoute,
    public referenceBookService: ReferenceBookService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const typeId = params.get('configType');
      this.currentConfig = referenceConfig.find(config => config.typeId === typeId);

      if (this.currentConfig) {
        this.formFields = this.currentConfig.formFields;
        this.referenceBookService.setConfigsData(this.currentConfig);
      }
      this.referenceBookService.loadData();
    });
  }

  selectRecordId: string = '';


  openEditModal(id: string) {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  // Открытие модального окна для создания записи
  openCreateModal(currentEndpoint: string): void {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }


  getFixedColumnValue(field: string): any {
    return this.data.reduce((sum, row) => sum + (row[field] || 0), 0);
  }

  viewDetails(rowData: any): void {
    this.modalData = { ...rowData };
    this.isModalOpen = true;
  }

  // Закрытие модального окна
  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  deleteRecord(id: string) {

  }



}
