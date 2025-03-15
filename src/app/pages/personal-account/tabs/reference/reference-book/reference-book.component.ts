import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { referenceConfig } from './conf';
import { ReferenceBookService } from './reference-book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../../../services/toast.service';


@Component({
  selector: 'app-reference-book',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reference-book.component.html',
  styleUrls: ['./reference-book.component.scss']
})
export class ReferenceBookComponent implements OnInit, OnChanges{
  currentConfig: any;
  data: any[] = []; // Данные для таблицы
  formFields: any; // Поля для создания и редактирования
  isModalOpen = false; // Флаг модального окна
  modalTitle = 'Создать запись'; // Заголовок модального окна
  modalAction = 'Создать'; // Действие в модальном окне
  modalData: any = {}; // Данные для модального окна

  @Input() typeId: any;
  
  constructor(
    private referenceBookService: ReferenceBookService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeId'] && changes['typeId'].currentValue !== changes['typeId'].previousValue) {
      this.updateConfig();
    }
  }

  updateConfig() {
    this.currentConfig = referenceConfig.find(config => config.typeId === this.typeId);

    if (this.currentConfig) {
      this.formFields = this.currentConfig.formFields;
    }

    this.loadData();
    this.cdr.detectChanges(); 
  }
  
  ngOnInit(): void {}

  // Загрузка данных
  loadData(): void {
    this.referenceBookService.getRecords(this.currentConfig.endpoint).subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.data = response.data;
          this.cdr.detectChanges();
        } else {
          this.toastService.showError('Ошибка', 'Данные не найдены в ответе.');
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  // Открытие модального окна для создания записи
  openCreateModal(currentEndpoint: string): void {
    if (this.currentConfig.connectionReference) this.loadConnectionReferenceData()
    this.modalTitle = 'Создать запись';
    this.modalAction = 'Создать';
    this.modalData = {};
    this.currentConfig = referenceConfig.find(config => config.endpoint === currentEndpoint);
    if (this.currentConfig) {
      this.formFields = this.currentConfig.formFields;
    }
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  // Открытие модального окна для редактирования записи
  async openEditModal(currentEndpoint: string, item: any): Promise<void> {

    if (this.currentConfig.connectionReference) {
      try {
        await this.loadConnectionReferenceData();

        const field = this.currentConfig.connectionReference.field;
        const positionField = this.currentConfig.connectionReference.fieldName;

        this.modalData = { ...item, [field]: item[positionField]?.id };

        const selectedItem = this.connectionReferenceData.find(referenceItem => referenceItem.id === item[positionField]?.id);
        this.selectedReference = selectedItem || null;

        this.modalTitle = 'Редактировать запись';
        this.modalAction = 'Обновить';
        this.isModalOpen = true;

        this.cdr.detectChanges();

      } catch (error) {
        console.error('Ошибка при загрузке данных для связи', error);
        this.toastService.showError('Ошибка', 'Ошибка при загрузке данных для связи');
      }
    } else {
      this.modalData = { ...item };
      this.modalTitle = 'Редактировать запись';
      this.modalAction = 'Обновить';
      this.isModalOpen = true;
      this.cdr.detectChanges();
    }
  }



  // Закрытие модального окна
  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  // Отправка формы (создание/редактирование)
  onSubmit(endpoint: string): void {
    if (this.modalAction === 'Создать') {
      const creatorId = localStorage.getItem('VXNlcklk');

      if (creatorId) {
        Object.assign(this.modalData, { creatorId });
      } else {
        this.toastService.showError('Ошибка', 'Не найден creatorId');
        return;
      }
      if (this.currentConfig.connectionReference) {
        const relatedField = this.currentConfig.connectionReference.field;

        if (!this.modalData[relatedField]) {
          this.toastService.showError('Ошибка', `Не выбрана ${this.currentConfig.connectionReference.label}`);
          return;
        }
      }

      this.createRecord(endpoint, this.modalData);
    } else {
      const allowedFields = this.formFields.map((field: any) => field.field);
      const idRecord = this.modalData.id;

      for (const key in this.modalData) {
        if (this.modalData.hasOwnProperty(key)) {
          if (!allowedFields.includes(key) && key !== this.currentConfig.connectionReference?.field) {
            delete this.modalData[key];
          }
        }
      }
      Object.assign(this.modalData, { id: idRecord });


      if (this.currentConfig.connectionReference) {
        const relatedField = this.currentConfig.connectionReference.field;
        if (!this.modalData[relatedField]) {
          this.toastService.showError('Ошибка', `Не выбран элемент для поля ${relatedField}`);
          return;
        }
      }

      this.updateRecord(endpoint, idRecord, this.modalData);

    }

    this.closeModal();
  }


  // Создание новой записи
  createRecord(currentEndpoint: string, newRecord: any): void {
    this.referenceBookService.newRecord(currentEndpoint, newRecord).subscribe(
      (response) => {
        this.data.push(response.data);
        this.toastService.showSuccess('Успех', 'Запись успешно создана');
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  // Обновление записи
  updateRecord(currentEndpoint: string, id: number, updatedRecord: any): void {
    this.referenceBookService.updateRecord(currentEndpoint, id, updatedRecord).subscribe(
      (response) => {
        const index = this.data.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.data[index] = response.data;
          this.toastService.showSuccess('Успех', 'Запись успешно обновлена');
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  // Удаление записи
  deleteRecord(currentEndpoint: string, id: number): void {
    this.referenceBookService.deleteRecord(currentEndpoint, id).subscribe(
      () => {
        this.data = this.data.filter((item) => item.id !== id);
        this.toastService.showSuccess('Успех', 'Запись успешно удалена');
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  getNestedValue(item: any, field: string): any {
    const fields = field.split('.');
    return fields.reduce((acc, key) => acc && acc[key], item);
  }



  connectionReferenceData: any[] = []; // Данные для связи
  connectionReferenceColumns: any[] = []; // Столбцы для отображения связи

  // Загрузка данных для связи (например, должности для сотрудников)
  loadConnectionReferenceData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectionConfig = referenceConfig.find(
        (config) => config.typeId === this.currentConfig.connectionReference.typeId
      );
      if (connectionConfig) {
        this.referenceBookService.getRecords(connectionConfig.endpoint).subscribe(
          (response: any) => {
            if (response && response.data) {
              this.connectionReferenceData = response.data;
              this.connectionReferenceColumns = connectionConfig.tableColumns.filter(column => column.field !== 'code');

              resolve();
            } else {
              reject('Данные не найдены');
            }
          },
          (error) => {
            const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
            this.toastService.showError('Ошибка', errorMessage);
            reject(error);
          }
        );
      } else {
        reject('Конфигурация для связи не найдена');
      }
    });
  }

  // Текущий выбранный элемент
  selectedReference: any;
  dropdownVisible: boolean = false;

  // Метод для закрытия выпадающего списка
  closeDropdown(): void {
    this.dropdownVisible = false;
    this.cdr.detectChanges();
  }

  // Метод для отображения или скрытия выпадающего списка
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
    setTimeout(() => this.checkDropdownPosition(), 0);
    this.cdr.detectChanges();
  }

  // Выбор элемента
  selectReference(item: any): void {
    const field = this.currentConfig.connectionReference.field;
    this.modalData[field] = item.id;
    this.selectedReference = item;
    this.dropdownVisible = false;
    this.cdr.detectChanges();
  }

  // Ловим клики вне выпадающего списка
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownElement = document.querySelector('.dropdown-container');
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  // Получение значения для отображения выбранного элемента
  getSelectedDisplayValue(): string {
    if (this.selectedReference) {
      return this.connectionReferenceColumns.map(column => {
        return this.getNestedValue(this.selectedReference, column.field);
      }).join(' - ');
    }
    return 'Не выбрано';
  }


  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  dropdownAbove: boolean = false;

  /** Проверяем, выходит ли список за границы экрана */
  checkDropdownPosition(): void {
    if (!this.dropdownContainer || !this.dropdown) return;

    const rect = this.dropdownContainer.nativeElement.getBoundingClientRect();
    const dropdownHeight = this.dropdown.nativeElement.offsetHeight;
    const windowHeight = window.innerHeight;

    this.dropdownAbove = rect.bottom + dropdownHeight > windowHeight;
  }

  /** Закрытие выпадающего списка при клике вне */
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.dropdownContainer?.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  /** Пересчитываем позицию при изменении размеров окна */
  @HostListener('window:resize')
  onResize(): void {
    if (this.dropdownVisible) {
      this.checkDropdownPosition();
    }
  }



}
