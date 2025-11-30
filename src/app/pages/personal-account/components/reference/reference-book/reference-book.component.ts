import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ReferenceBookService } from './reference-book.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { CustomCheckboxComponent } from '../../../../../ui-kit/custom-checkbox/custom-checkbox.component';
import { CustomDropdownComponent } from '../../../../../ui-kit/custom-dropdown/custom-dropdown.component';

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
  @Input() referenceConfig: any;
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
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeId'] && changes['typeId'].currentValue !== changes['typeId'].previousValue) {
      this.updateConfig();
    }
  }

  dropdownsData: any = {};

  updateConfig() {
    // Находим конфигурацию по typeId
    this.currentConfig = this.referenceConfig.find((config: any) => config.typeId === this.typeId);

    // Если конфигурация не найдена, выходим
    if (!this.currentConfig) {
      console.warn('Конфигурация не найдена для typeId:', this.typeId);
      return;
    }

    // Устанавливаем основные свойства
    this.formFields = this.currentConfig.formFields || [];
    this.referenceBookService.endpoint = this.currentConfig.endpoint;
    this.columns = this.currentConfig.tableColumns || [];

    // Загружаем данные для dropdown полей
    this.loadDropdownsData();

    // Загружаем дополнительные данные если это страница "Сотрудники"
    if (this.currentConfig.pageTitle === 'Сотрудники') {
      this.referenceBookService.getPosition().subscribe((values: any) => {
        this.positions = values.data;
      });

      this.referenceBookService.getPermision().subscribe((values: any) => {
        this.permisions = values.data;
      });
    }

    // Загружаем основные данные
    this.referenceBookService.loadData();
    this.cdr.detectChanges();
  }

  // Получение данных для конкретного dropdown
  getDropdownData(fieldName: string): any[] {
    return this.dropdownsData[fieldName] || [];
  }




  // Переключение видимости dropdown
  toggleDropdown(fieldName: string) {
    // Закрываем все остальные dropdown
    Object.keys(this.dropdownVisible).forEach(key => {
      if (key !== fieldName) {
        this.dropdownVisible[key] = false;
      }
    });

    // Переключаем текущий dropdown
    this.dropdownVisible[fieldName] = !this.dropdownVisible[fieldName];

    if (this.dropdownVisible[fieldName]) {
      this.checkDropdownPosition();
    }

    this.cdr.detectChanges();
  }


  // Обработка кликов вне dropdown
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as Element).closest('.dropdown-container');
    if (!clickedInside) {
      this.closeAllDropdowns();
    }
  }

  loadDropdownsData() {

    const dropdownFields = this.currentConfig.formFields.filter((field: any) => field.type === 'Dropdown');
    console.log('dropdownFields', dropdownFields)
    dropdownFields.forEach((field: any) => {
      if (field.endpoint) {
        this.referenceBookService.getDropdownData(field.typeEndpoint, field.endpoint).subscribe((response: any) => {
          this.dropdownsData[field.field] = response.data;
        });
      }
    });
  }

  ngOnInit(): void {
    this.referenceBookService.activData$.subscribe((data: any) => {
      this.data = data;
    })
  }

  // Получение отображаемого значения для элемента
  getItemDisplayValue(field: any, item: any): string {
    // Если указаны displayFields (массив полей), объединяем их
    if (field.displayFields && Array.isArray(field.displayFields)) {
      const separator = field.separator || ', ';
      const displayValues = field.displayFields
        .map((displayField: string) => {
          // Поддерживаем вложенные свойства через точку
          const value = this.getNestedValue(item, displayField);
          return value !== null && value !== undefined ? value.toString() : '';
        })
        .filter((value: any) => value !== ''); // Убираем пустые значения

      return displayValues.join(separator);
    }

    // Если указано одиночное поле для отображения, используем его
    if (field.labelField && item[field.labelField]) {
      return item[field.labelField];
    }

    // Иначе пытаемся найти подходящее поле
    const possibleFields = ['name', 'title', 'label', 'value'];
    for (const possibleField of possibleFields) {
      if (item[possibleField]) {
        return item[possibleField];
      }
    }

    // Если ничего не найдено, возвращаем ID
    return item[field.valueField] || item.id || 'Неизвестно';
  }

  getSelectedDisplayValue(field: any): string {
    const selectedId = this.modalData[field.field];
    if (!selectedId) return '';

    const data = this.getDropdownData(field.field);
    const selectedItem = data.find(item => {
      // Используем valueField из конфигурации или по умолчанию 'id'
      const valueField = field.valueField || 'id';
      return item[valueField] === selectedId;
    });

    return selectedItem ? this.getItemDisplayValue(field, selectedItem) : '';
  }

  selectDropdownItem(field: any, item: any) {
    // Используем valueField из конфигурации или по умолчанию 'id'
    const valueField = field.valueField || 'id';
    this.modalData[field.field] = item[valueField];
    this.dropdownVisible[field.field] = false;
    this.cdr.detectChanges();
  }

  // Открытие модального окна для создания записи
  openCreateModal(currentEndpoint: any): void {
    console.log('currentEndpoint', currentEndpoint)
    this.modalTitle = 'Создать запись';
    this.modalAction = 'Создать';
    this.modalData = {};
    this.currentConfig = this.referenceConfig.find((config: any) => config.endpoint === currentEndpoint);
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
        // this.toastService.showError('Ошибка', 'Ошибка при загрузке данных для связи');
      }
    } else {
      this.modalData = { ...item };

      const field = 'positionId';
      const positionField = 'position';

      if (item.hasOwnProperty(positionField) && item[positionField]?.id !== undefined) {
        this.modalData[field] = item[positionField].id;
      }

      this.modalTitle = 'Редактировать запись';
      this.modalAction = 'Обновить';
      this.isModalOpen = true;
      this.cdr.detectChanges();
    }
  }


  // Закрытие всех dropdown
  closeAllDropdowns() {
    this.dropdownVisible = {};
    this.cdr.detectChanges();
  }

  // Проверка позиции dropdown
  checkDropdownPosition() {
    // Реализация проверки позиции (аналогично вашему существующему коду)
    const dropdownElements = document.querySelectorAll('.dropdown-list');
    dropdownElements.forEach((element: any) => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      this.dropdownAbove = rect.bottom > windowHeight;
    });
  }


  // Закрытие модального окна
  closeModal(): void {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }

  // Отправка формы (создание/редактирование)
  onSubmit(endpoint: string): void {
    if (this.modalAction === 'Создать') {
      // const creatorId = localStorage.getItem('VXNlcklk');

      // if (creatorId) {
      //   Object.assign(this.modalData, { creatorId });
      // } else {
      //   // this.toastService.showError('Ошибка', 'Не найден creatorId');
      //   return;
      // }

      if (this.currentConfig.connectionReference) {
        const relatedField = this.currentConfig.connectionReference.field;
        if (!this.modalData[relatedField]) {
          // this.toastService.showError('Ошибка', `Не выбрана ${this.currentConfig.connectionReference.label}`);
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

      const userNameField = this.formFields.find((field: any) => field.field === 'userName');
      if (userNameField) {
        const lastName = this.modalData.lastName?.trim() || '';
        const firstName = this.modalData.firstName?.trim() || '';
        const patronymic = this.modalData.patronymic?.trim() || '';

        if (lastName && firstName && patronymic) {
          this.modalData.userName =
            lastName.charAt(0).toUpperCase() + lastName.slice(1) +
            firstName.charAt(0).toUpperCase() +
            patronymic.charAt(0).toUpperCase();
        }
      }
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
          // this.toastService.showError('Ошибка', `Не выбран элемент для поля ${relatedField}`);
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
        // this.toastService.showSuccess('Успех', 'Запись успешно создана');
        if (this.currentConfig.pageTitle == 'Сотрудники' && response.data) {
          this.newUser = response.data;
          this.isModalUserCreateOpen = true;
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        // this.toastService.showError('Ошибка', errorMessage);
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
          // this.toastService.showSuccess('Успех', 'Запись успешно обновлена');
        }
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        // this.toastService.showError('Ошибка', errorMessage);
      }
    );
  }

  // Удаление записи
  deleteRecord(id: number): void {
    this.referenceBookService.deleteRecord(id).subscribe(
      () => {
        this.data = this.data.filter((item) => item.id !== id);
        // this.toastService.showSuccess('Успех', 'Запись успешно удалена');
      },
      (error) => {
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        // this.toastService.showError('Ошибка', errorMessage);
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


  // Выбор элемента
  selectReference(item: any): void {
    const field = this.currentConfig.connectionReference.field;
    this.modalData[field] = item.id;
    this.selectedReference = item;
    this.dropdownVisible = {};
    this.cdr.detectChanges();
  }



  @ViewChild('dropdown') dropdown!: ElementRef;
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  dropdownAbove: boolean = false;


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
  newUser: any;
}
