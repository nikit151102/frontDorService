import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
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
  imports: [CommonModule,
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
    CustomDropdownComponent,
    CustomInputNumberComponent,
    UnsavedChangesDialogComponent],
  templateUrl: './driver-salary-form.component.html',
  styleUrl: './driver-salary-form.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class DriverSalaryFormComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() label: string = 'Создать';
  @Input() employeeType: Number = 0;
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
      console.log('this.areOptionsLoaded', this.selectedInvoice)
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
     console.log('employeeType before request:', this.employeeType);
    this.currentRole = this.jwtService.getDecodedToken().email;
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
        console.log('employeeType',this.employeeType)
        const data = response.data;
       this.driverOptions = data;
      }
    );


  
  }
  generateYears() {
    const currentYear = new Date().getFullYear();
    // Generate years from current year - 2 to current year + 2
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  updateDateTime() {
    // Получаем значения из формы
    const selectedMonth = this.invoiceForm.get('selectedMonth')?.value;
    const selectedYear = this.invoiceForm.get('selectedYear')?.value;

    if (selectedMonth === null || selectedYear === null) return;

    // Создаем дату для первого дня выбранного месяца
    const dateTime = new Date(selectedYear, selectedMonth, 1, 0, 0, 0, 0);

    const formattedDateTime = this.formatDateToISO(dateTime);

    this.invoiceForm.patchValue({
      dateTime: formattedDateTime
    });
  }

  onMonthYearChange() {
    this.updateDateTime();
  }


  // Format date to ISO string without timezone shift
  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  }


  initForm(): void {
    this.invoiceForm = this.fb.group({
      // Добавьте эти контролы
      selectedMonth: [new Date().getMonth(), Validators.required],
      selectedYear: [new Date().getFullYear(), Validators.required],
      dateTime: ['', Validators.required],
      directorType: [2],
      amount: ['', Validators.required],
      driverEmployeeId: ['', Validators.required]
    }, { validators: dateRangeValidator() });

    // Подписка на изменения для вычисляемых полей
    this.setupCalculations();

    // Инициализация дат при создании формы
    this.updateDateTime();
  }


  positiveOdometerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value < 0 ? { negativeOdometer: true } : null;
  }

  fillFormWithInvoiceData(): void {
    if (!this.selectedInvoice) {
      console.warn('selectedInvoice is null or undefined');
      return;
    }

    const odometerValue = this.selectedInvoice.endOdometer != null && this.selectedInvoice.beginOdometer != null
      ? this.selectedInvoice.endOdometer - this.selectedInvoice.beginOdometer
      : 0;

    // Заполняем форму данными из selectedInvoice
    // this.invoiceForm.patchValue({
    //   productTargetId: this.selectedInvoice.productTargetId || '',
    //   beginDateTime: this.selectedInvoice.beginDateTime ? new Date(this.selectedInvoice.beginDateTime) : null,
    //   endDateTime: this.selectedInvoice.endDateTime ? new Date(this.selectedInvoice.endDateTime) : null,
    //   workDays: this.selectedInvoice.workDays ?? 0,
    //   beginOdometer: this.selectedInvoice.beginOdometer ?? 0,
    //   endOdometer: this.selectedInvoice.endOdometer ?? 0,
    //   odometer: odometerValue,
    //   loadedOdometer: this.selectedInvoice.loadedOdometer ?? 0,
    //   emptyOdometer: this.selectedInvoice.emptyOdometer ?? 0,
    //   grossCash: this.selectedInvoice.grossCash ?? 0,
    //   grossNoNds: this.selectedInvoice.grossNoNds ?? 0,
    //   grossNds: this.selectedInvoice.grossNds ?? 0,
    //   // driverSalary: this.selectedInvoice.driverSalary ?? 0,
    //   // officeSalary: this.selectedInvoice.officeSalary ?? 0,
    //   fuelBegin: this.selectedInvoice.fuelBegin ?? 0,
    //   fuelEnd: this.selectedInvoice.fuelEnd ?? 0,
    //   fuelCount: this.selectedInvoice.fuelCount ?? 0,
    //   fuelCost: this.selectedInvoice.fuelCost ?? 0,
    //   fuelTotalCost: this.selectedInvoice.fuelTotalCost ?? 0,
    //   driverEmployeeId: this.selectedInvoice.driver || ''
    // });

    console.log('Form filled with invoice data:', this.selectedInvoice);
  }


  setupCalculations(): void {
    // Получаем контролы один раз
    const beginOdometerControl = this.invoiceForm.get('beginOdometer');
    const endOdometerControl = this.invoiceForm.get('endOdometer');
    const fuelCountControl = this.invoiceForm.get('fuelCount');
    const fuelCostControl = this.invoiceForm.get('fuelCost');
    const odometerControl = this.invoiceForm.get('odometer');
    const loadedOdometerControl = this.invoiceForm.get('loadedOdometer');
    const emptyOdometerControl = this.invoiceForm.get('emptyOdometer');

    // Проверяем существование контролов перед подпиской
    if (beginOdometerControl && endOdometerControl) {
      beginOdometerControl.valueChanges.subscribe(() => this.calculateOdometer());
      endOdometerControl.valueChanges.subscribe(() => this.calculateOdometer());
    }

    if (fuelCountControl && fuelCostControl) {
      fuelCountControl.valueChanges.subscribe(() => this.calculateFuelTotal());
      fuelCostControl.valueChanges.subscribe(() => this.calculateFuelTotal());
    }

    if (odometerControl && loadedOdometerControl && emptyOdometerControl) {
      odometerControl.valueChanges.subscribe(() => {
        this.lastChangedField = 'odometer';
        this.calculateOdometerParts();
      });
      loadedOdometerControl.valueChanges.subscribe(() => {
        this.lastChangedField = 'loadedOdometer';
        this.calculateOdometerParts();
      });
      emptyOdometerControl.valueChanges.subscribe(() => {
        this.lastChangedField = 'emptyOdometer';
        this.calculateOdometerParts();
      });
    }
  }

  calculateOdometer(): void {
    const beginControl = this.invoiceForm.get('beginOdometer');
    const endControl = this.invoiceForm.get('endOdometer');
    const odometerControl = this.invoiceForm.get('odometer');

    if (beginControl && endControl && odometerControl) {
      const begin = beginControl.value || 0;
      const end = endControl.value || 0;
      odometerControl.setValue(end - begin, { emitEvent: false });
      odometerControl.updateValueAndValidity();
    }
  }


  private calculateOdometerParts(): void {
    const odometer = this.invoiceForm.get('odometer')?.value;
    const loadedOdometer = this.invoiceForm.get('loadedOdometer')?.value;
    const emptyOdometer = this.invoiceForm.get('emptyOdometer')?.value;

    // Если пробег невалидный (0, отрицательный или не число) - очищаем зависимые поля
    if (odometer === null || odometer === undefined || odometer <= 0) {
      this.invoiceForm.get('loadedOdometer')?.setValue(null, { emitEvent: false });
      this.invoiceForm.get('emptyOdometer')?.setValue(null, { emitEvent: false });
      return;
    }

    // Определяем, какое поле было изменено последним
    const lastChangedField = this.getLastChangedField();

    // Если изменили груженный пробег - пересчитываем пустой
    if (lastChangedField === 'loadedOdometer' && loadedOdometer !== null) {
      this.invoiceForm.get('emptyOdometer')?.setValue(odometer - loadedOdometer, { emitEvent: false });
    }
    // Если изменили пустой пробег - пересчитываем груженный
    else if (lastChangedField === 'emptyOdometer' && emptyOdometer !== null) {
      this.invoiceForm.get('loadedOdometer')?.setValue(odometer - emptyOdometer, { emitEvent: false });
    }
    // Проверяем корректность суммы
    else if (loadedOdometer !== null && emptyOdometer !== null &&
      (loadedOdometer + emptyOdometer) !== odometer) {
      console.warn('Сумма груженного и пустого пробега не равна общему пробегу');
    }
  }

  private lastChangedField: string | null = null;

  // Метод для отслеживания последнего измененного поля
  private getLastChangedField(): string | null {
    return this.lastChangedField;
  }


  private calculateFuelTotal() {
    const fuelBegin = this.invoiceForm.get('fuelBegin')?.value || 0;
    const fuelEnd = this.invoiceForm.get('fuelEnd')?.value || 0;
    const fuelCount = this.invoiceForm.get('fuelCount')?.value || 0;
    const fuelCost = this.invoiceForm.get('fuelCost')?.value || 0;

    // Формула: (Начало + Заправки - Конец) * Цена
    const total = (fuelBegin + fuelCount - fuelEnd) * fuelCost;

    // Устанавливаем рассчитанное значение
    this.invoiceForm.get('fuelTotalCost')?.setValue(total, { emitEvent: false });
  }

  onVehicleChange(selectedValue: any): void {
    console.log('Выбрано значение:', selectedValue);
    this.invoiceForm.get('driverEmployeeId')?.setValue(selectedValue);
  }

  onDriverChange(selectedValue: any): void {
    console.log('Выбрано значение:', selectedValue);
    this.invoiceForm.get('driverEmployeeId')?.setValue(selectedValue);
  }


  saveData(callback?: (invoice: any) => void) {
    console.log('this.invoiceForm.value', this.invoiceForm.value)
    if (this.invoiceForm.valid) {

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
          console.log('Сохранение данных:', this.invoiceForm.value);
          let data = this.invoiceForm.value;
          if (this.data && this.data.id) {
            data.id = this.data.id
          }
          delete data.selectedMonth
          delete data.selectedYear
          data.directorType = 2;
          data.status = 7;
          // data.creatorId = localStorage.getItem('VXNlcklk')
          this.driverSalaryService.setDriverSalary(data).subscribe({
            next: (response) => {
              console.log('Документ успешно сохранен', response);
              this.toastService.showSuccess('Успешно', response.documentMetadata.message)
              this.dialogVisible = false;
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


  markAllAsTouched(): void {
    Object.values(this.invoiceForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }


  onDialogClose(event: any = null) {
    this.selectedInvoice = null;
    this.showConfirmDialog = false;
    this.dialogVisible = false;
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
    this.dialogVisible = true;
  }



}
