import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { referenceConfig } from './conf';
import { ReferenceBookService } from './reference-book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../../../../services/toast.service';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { CustomDropdownComponent } from '../../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomCheckboxComponent } from '../../../../../ui-kit/custom-checkbox/custom-checkbox.component';


@Component({
  selector: 'app-reference-book',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    CustomDropdownComponent,
    CustomCheckboxComponent
  ],
  templateUrl: './reference-book.component.html',
  styleUrls: ['./reference-book.component.scss']
})
export class ReferenceBookComponent implements OnInit, OnChanges {
  currentConfig: any;
  data: any[] = []; // Данные для таблицы
  formFields: any; // Поля для создания и редактирования
  isModalOpen = false; // Флаг модального окна
  modalTitle = 'Создать запись'; // Заголовок модального окна
  modalAction = 'Создать'; // Действие в модальном окне
  modalData: any = {}; // Данные для модального окна
  columns: any;

  positions: any;
  permisions: any;

  @Input() typeId: any;

  constructor(
    public referenceBookService: ReferenceBookService,
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
      this.referenceBookService.endpoint = this.currentConfig.endpoint;
      this.columns = this.currentConfig.tableColumns;
      if (this.currentConfig.pageTitle == 'Сотрудники') {
        this.referenceBookService.getPosition().subscribe((values: any) => {
          this.positions = values.data;
        })

        this.referenceBookService.getPermision().subscribe((values: any) => {
          this.permisions = values.data;
        })
      }
    }

    this.referenceBookService.loadData();
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.referenceBookService.activData$.subscribe((data: any) => {
      this.data = data;
    })
  }


  // Открытие модального окна для создания записи
  openCreateModal(currentEndpoint: string): void {
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
  async openEditModal(item: any): Promise<void> {

    if (this.currentConfig.connectionReference) {
      try {

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

      this.formFields.forEach((field: any) => {
        if (field.visible === false && !this.modalData.hasOwnProperty(field.field)) {
          if (field.type == 'boolean') {
            this.modalData[field.field] = true;
          } else {
            this.modalData[field.field] = '';
          }
        }
      });

      this.createRecord(this.modalData);
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

      //  this.formFields.forEach((field: any) => {
      //   if (field.visible === false && !this.modalData.hasOwnProperty(field.field)) {
      //    if(field.type == 'boolean'){
      //     this.modalData[field.field] = true; 
      //    }else{
      //     this.modalData[field.field] = '';  
      //    }
      //   }
      // });

      // Дополнительно добавляем id в modalData
      Object.assign(this.modalData, { id: idRecord });

      if (this.currentConfig.connectionReference) {
        const relatedField = this.currentConfig.connectionReference.field;
        if (!this.modalData[relatedField]) {
          this.toastService.showError('Ошибка', `Не выбран элемент для поля ${relatedField}`);
          return;
        }
      }

      this.updateRecord(idRecord, this.modalData);
    }

    this.closeModal();
  }





  // Создание новой записи
  createRecord(newRecord: any): void {
    this.referenceBookService.newRecord(newRecord).subscribe(
      (response) => {
        this.data.push(response.data);
        this.toastService.showSuccess('Успех', 'Запись успешно создана');
        if (this.currentConfig.pageTitle == 'Сотрудники' && response.data) {
          this.newUserCode = response.data.initialPassCode;
          this.isModalUserCreateOpen = true;
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  // Обновление записи
  updateRecord(id: number, updatedRecord: any): void {
    this.referenceBookService.updateRecord(id, updatedRecord).subscribe(
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
  deleteRecord(id: number): void {
    this.referenceBookService.deleteRecord(id).subscribe(
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


  // Текущий выбранный элемент
  selectedReference: any;

  // Метод для закрытия выпадающего списка
  closeDropdown(): void {
    this.dropdownVisible = {};
    this.cdr.detectChanges();
  }

  dropdownVisible: { [key: string]: boolean } = {};

  toggleDropdown(productId: string) {
    console.log('Before:', this.dropdownVisible);
    Object.keys(this.dropdownVisible).forEach(id => {
      if (id !== productId) this.dropdownVisible[id] = false;
    });

    this.dropdownVisible[productId] = !this.dropdownVisible[productId];
    console.log('After:', this.dropdownVisible);

    this.cdr.detectChanges();
  }


  // Выбор элемента
  selectReference(item: any): void {
    const field = this.currentConfig.connectionReference.field;
    this.modalData[field] = item.id;
    this.selectedReference = item;
    this.dropdownVisible = {};
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
      this.dropdownVisible = {};
    }
  }

  /** Пересчитываем позицию при изменении размеров окна */
  @HostListener('window:resize')
  onResize(): void {
    if (this.dropdownVisible) {
      this.checkDropdownPosition();
    }
  }



  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;

  onRightClick(event: MouseEvent, product: any) {
    event.preventDefault(); // Отключаем стандартное меню

    this.modalData = product;
    this.contextMenuVisible = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
  }



  isModalUserCreateOpen: boolean = false;
  newUserCode: any;
}
