import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupService } from '../../../../../../components/confirm-popup/confirm-popup.service';
import { InvoiceConfig } from '../../../../../../interfaces/common.interface';
import { CacheReferenceService } from '../../../../../../services/cache-reference.service';
import { JwtService } from '../../../../../../services/jwt.service';
import { ToastService } from '../../../../../../services/toast.service';
import { CustomDropdownComponent } from '../../../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomInputNumberComponent } from '../../../../../../ui-kit/custom-input-number/custom-input-number.component';
import { UnsavedChangesDialogComponent } from '../../../../components/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { dateRangeValidator } from '../../../logistic/general-docs/general-docs-form/dateValidate';
import { GeneralDocsFormService } from '../../../logistic/general-docs/general-docs-form/general-docs-form.service';
import { DriverSalaryService } from '../driver-salary.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../../environment';

@Component({
  selector: 'app-driver-salary-form',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    CustomDropdownComponent,
    CustomInputNumberComponent,
    UnsavedChangesDialogComponent
  ],
  templateUrl: './driver-salary-form.component.html',
  styleUrl: './driver-salary-form.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class DriverSalaryFormComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() label: string = 'Создать';
  @Input() employeeType: Number = 0;
  @Output() create = new EventEmitter<any>();

  config!: InvoiceConfig;
  service: any;
  selectedInvoice: any;
  isEdit: boolean = true;
  invoiceForm!: FormGroup;
  dialogVisible = false;
  newDoc: boolean = true;

  // Mock data
  staffsOptions = [];
  driverOptions = [];
  ProductTargetOptions = [];
  currentRole: any;

  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  months = [
    { value: 0, name: 'Январь' },
    { value: 1, name: 'Февраль' },
    { value: 2, name: 'Март' },
    { value: 3, name: 'Апрель' },
    { value: 4, name: 'Май' },
    { value: 5, name: 'Июнь' },
    { value: 6, name: 'Июль' },
    { value: 7, name: 'Август' },
    { value: 8, name: 'Сентябрь' },
    { value: 9, name: 'Октябрь' },
    { value: 10, name: 'Ноябрь' },
    { value: 11, name: 'Декабрь' }
  ];

  years: number[] = [];

  constructor(
    private generalFormService: GeneralDocsFormService,
    private driverSalaryService: DriverSalaryService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private cacheService: CacheReferenceService,
    private fb: FormBuilder,
    private jwtService: JwtService,
    private confirmPopupService: ConfirmPopupService,
    private http: HttpClient
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.selectedInvoice = this.data;
      this.fillFormWithInvoiceData();
      this.newDoc = false;
      this.dialogVisible = true;
    }
    if (changes['config'] || changes['model']) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.generateYears();
    this.initForm();
    this.loadDrivers();
    this.loadProductTargets();
    this.currentRole = this.jwtService.getDecodedToken().email;
  }

  // Геттер для удобного доступа к FormArray
  get driversArray(): FormArray {
    return this.invoiceForm.get('drivers') as FormArray;
  }

  initForm(): void {
    this.invoiceForm = this.fb.group({
      selectedMonth: [new Date().getMonth()],
      selectedYear: [new Date().getFullYear()],
      dateTime: ['', Validators.required],
      directorType: [2],
      productTargetId: [''],
      drivers: this.fb.array([
        this.createDriverFormGroup()
      ])
    }, { validators: dateRangeValidator() });

    this.updateDateTime();
  }

  // Создание формы для одной записи водителя
  createDriverFormGroup(): FormGroup {
    return this.fb.group({
      driverEmployeeId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Добавление новой строки водителя
  addDriverRow(): void {
    this.driversArray.push(this.createDriverFormGroup());
    this.cdr.detectChanges();
  }

  // Удаление строки водителя
  removeDriverRow(index: number): void {
    if (this.driversArray.length > 1) {
      this.driversArray.removeAt(index);
    }
  }

  // Расчет общей суммы
  calculateTotalAmount(): number {
    return this.driversArray.controls.reduce((total, control) => {
      const amount = control.get('amount')?.value || 0;
      return total + amount;
    }, 0);
  }

  // Проверка на дублирование водителей
  hasDuplicateDrivers(): boolean {
    const driverIds = this.driversArray.controls
      .map(control => control.get('driverEmployeeId')?.value)
      .filter(id => id);

    return new Set(driverIds).size !== driverIds.length;
  }

  loadDrivers(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    this.http.post<any[]>(`${environment.apiUrl}/api/Entities/DriverEmployee/Filter`, {
      filters: [{
        field: 'EmployeeType',
        values: [this.employeeType],
        type: 2
      }], sorts: []
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    }).subscribe(
      (response: any) => {
        const data = response.data;
        this.driverOptions = data.map((employee: any) => ({
          ...employee,
          fullName: `${employee.surname || ''} ${employee.name || ''} ${employee.patronymic || ''}`.trim()
        }));
      }
    );
  }

  loadProductTargets(): void {
    const token = localStorage.getItem('YXV0aFRva2Vu');
    this.http.post<any[]>(`${environment.apiUrl}/api/Entities/ProductTarget/Filter`, {
      filters: [{
        field: 'ProductTargetCategory.Code',
        values: [1],
        type: 2
      }], sorts: []
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
    }).subscribe(
      (response: any) => {
        const data = response.data;
        this.ProductTargetOptions = data;
      }
    );
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  @ViewChild('dateInput') dateInput!: ElementRef;

  showDatePickerWithMonth(event: Event) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const selectedMonth = this.invoiceForm.get('selectedMonth')?.value;
    const currentYear = new Date().getFullYear();

    if (selectedMonth) {
      const defaultDate = new Date(currentYear, selectedMonth, 15);
      const dateString = defaultDate.toISOString().split('T')[0];

      this.invoiceForm.get('selectedYear')?.setValue(dateString);

      setTimeout(() => {
        if (document.activeElement === input) {
          input.click();
        }
      }, 10);
    }
  }

  onMonthYearChange() {
    const selectedDate = this.invoiceForm.get('selectedYear')?.value;
    if (selectedDate) {
      const date = new Date(selectedDate);
      const month = date.getMonth();
      const year = date.getFullYear();

      this.invoiceForm.patchValue({
        selectedMonth: month,
        dateTime: selectedDate
      });
    }
  }

  showDatePicker(event: Event) {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      if ('showPicker' in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.focus();
        input.click();
      }
    }, 0);
  }


  onDriverChange(index: number, value: any): void {
    console.log('index', index, ":", value)
    const driverGroup = this.driversArray.at(index);
    driverGroup.get('driverEmployeeId')?.setValue(value);
  }

  updateDateTime() {
    const selectedMonth = this.invoiceForm.get('selectedMonth')?.value;
    const selectedYear = this.invoiceForm.get('selectedYear')?.value;

    if (selectedMonth === null || selectedYear === null) return;

    const dateTime = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);
    const formattedDateTime = this.formatDateToISO(dateTime);

    this.invoiceForm.patchValue({
      dateTime: formattedDateTime
    });
  }


  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  }

  fillFormWithInvoiceData(): void {
    if (!this.selectedInvoice) {
      console.warn('selectedInvoice is null or undefined');
      return;
    }

    // Очищаем существующие записи
    while (this.driversArray.length !== 0) {
      this.driversArray.removeAt(0);
    }

    // Заполняем форму данными из selectedInvoice
    if (this.selectedInvoice.drivers && Array.isArray(this.selectedInvoice.drivers)) {
      // Если данные приходят в виде массива водителей
      this.selectedInvoice.drivers.forEach((driver: any) => {
        this.driversArray.push(this.fb.group({
          driverEmployeeId: [driver.driverEmployeeId || '', Validators.required],
          amount: [driver.amount || 0, [Validators.required, Validators.min(0)]]
        }));
      });
    } else {
      // Для обратной совместимости с одиночной записью
      this.driversArray.push(this.fb.group({
        driverEmployeeId: [this.selectedInvoice.driverEmployeeId || '', Validators.required],
        amount: [this.selectedInvoice.amount || 0, [Validators.required, Validators.min(0)]]
      }));
    }

    // Обновляем общие поля
    this.invoiceForm.patchValue({
      productTargetId: this.selectedInvoice.productTargetId || '',
      selectedMonth: this.selectedInvoice.selectedMonth || new Date().getMonth(),
      selectedYear: this.selectedInvoice.selectedYear || new Date().getFullYear(),
      dateTime: this.selectedInvoice.dateTime || ''
    });
  }

  onProductTargetChange(selectedValue: any): void {
    this.invoiceForm.get('productTargetId')?.setValue(selectedValue);
  }

  saveData(callback?: (invoice: any) => void) {
    console.log('this.invoiceForm', this.invoiceForm)
    if (this.invoiceForm.valid && this.driversArray.length > 0) {

      // Проверка на дублирование водителей
      if (this.hasDuplicateDrivers()) {
        this.toastService.showError('Ошибка', 'Нельзя добавлять одного и того же водителя несколько раз');
        return;
      }

      let titlePopUp = '';
      let acceptLabel = '';

      if (this.selectedInvoice && this.selectedInvoice.id) {
        titlePopUp = 'Вы действительно хотите обновить данные?';
        acceptLabel = 'Обновить';
      } else {
        titlePopUp = 'Вы действительно хотите создать документ?';
        acceptLabel = 'Создать';
      }

      this.confirmPopupService.openConfirmDialog({
        title: '',
        message: titlePopUp,
        acceptLabel: acceptLabel,
        rejectLabel: 'Отмена',
        onAccept: () => {
          const formData = this.prepareFormData();

          this.driverSalaryService.setDriverSalary(formData).subscribe({
            next: (response) => {
              console.log('Документ успешно сохранен', response);
              this.toastService.showSuccess('Успешно', response.documentMetadata.message)
              this.dialogVisible = false;
              this.create.emit(response);
              if (callback && response.documentMetadata.data) {
                callback(response.documentMetadata.data);
              }
            },
            error: (err) => {
              console.error('Ошибка при сохранении документа', err);
              this.toastService.showError('Ошибка', err.error.Message)
            }
          });
        }
      });
    } else {
      this.markAllAsTouched();
      console.error('Ошибка при сохранении документа валидация');
    }
  }

  // Подготовка данных для отправки
  prepareFormData(): any {
    const formValue = this.invoiceForm.value;

    const driversWithQuantity = formValue.drivers.map((driver: any) => ({
      productTargetId: driver.driverEmployeeId,
      amount: driver.amount,
      quantity: 1
    }));

    const data: any = {
      dateTime: formValue.dateTime,
      directorType: this.employeeType,
      // productTargetId: formValue.productTargetId,
      productList: driversWithQuantity
    };

    if (this.data && this.data.id) {
      data.id = this.data.id;
    }

    if (this.employeeType == 2) {
      delete data.productTargetId;
    }

    return data;
  }

  markAllAsTouched(): void {
    // Помечаем как touched все контролы основной формы
    Object.values(this.invoiceForm.controls).forEach(control => {
      control.markAsTouched();
    });

    // Помечаем как touched все контролы в FormArray
    this.driversArray.controls.forEach((driverGroup: any) => {
      Object.values(driverGroup.controls).forEach((control: any) => {
        control.markAsTouched();
      });
    });
  }

  onDialogClose(event: any = null) {
    this.selectedInvoice = null;
    this.showConfirmDialog = false;
    this.dialogVisible = false;
    // Сбрасываем форму к одной строке при закрытии
    while (this.driversArray.length !== 0) {
      this.driversArray.removeAt(0);
    }
    this.driversArray.push(this.createDriverFormGroup());
  }

  showConfirmDialog: boolean = false;
  oldData: any;

  hideConfirmDialog() {
    this.showConfirmDialog = false;
  }

  confirmCloseDialog() {
    this.showConfirmDialog = false;
    this.selectedInvoice = null;
    this.dialogVisible = true;
  }

  createNewInvoice(): void {
    this.newDoc = true;
    this.selectedInvoice = {};
    this.data = null;
    this.invoiceForm.reset();

    // Сбрасываем FormArray к одной строке
    while (this.driversArray.length !== 0) {
      this.driversArray.removeAt(0);
    }
    this.driversArray.push(this.createDriverFormGroup());

    // Устанавливаем значения по умолчанию
    this.invoiceForm.patchValue({
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      directorType: 2
    });

    this.dialogVisible = true;
  }
}