import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { InvoiceConfig } from '../../../../../../interfaces/common.interface';
import { ToastService } from '../../../../../../services/toast.service';
import { CustomDropdownComponent } from '../../../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomInputNumberComponent } from '../../../../../../ui-kit/custom-input-number/custom-input-number.component';
import { UnsavedChangesDialogComponent } from '../../../../components/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { GeneralDocsFormService } from './general-docs-form.service';
import { CacheReferenceService } from '../../../../../../services/cache-reference.service';
import { Observable, of, tap, map, catchError, throwError } from 'rxjs';
import { dateRangeValidator } from './dateValidate';
import { JwtService } from '../../../../../../services/jwt.service';
import { ConfirmPopupService } from '../../../../../../components/confirm-popup/confirm-popup.service';
import { GeneralDocsService } from '../general-docs.service';

@Component({
  selector: 'app-general-docs-form',
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
    CustomDropdownComponent,
    CustomInputNumberComponent,
    UnsavedChangesDialogComponent
  ],
  templateUrl: './general-docs-form.component.html',
  styleUrl: './general-docs-form.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class GeneralDocsFormComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() label: string = 'Создать';
  config!: InvoiceConfig;
  service: any;
  selectedInvoice: any;
  isEdit: boolean = true;
  invoiceForm!: FormGroup;
  dialogVisible = false;
  newDoc: boolean = true;
  vehicleOptions = [];
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
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private cacheService: CacheReferenceService,
    private fb: FormBuilder,
    private jwtService: JwtService,
    public generalDocsService: GeneralDocsService,
    private confirmPopupService: ConfirmPopupService
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
    this.currentRole = this.jwtService.getDecodedToken().email;
  }
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  updateDateTime() {
    // Получаем значение месяца и года из формы
    const selectedYear = this.invoiceForm.get('selectedYear')?.value;
    const selectedMonth = this.invoiceForm.get('selectedMonth')?.value;

    if (selectedYear === null || selectedYear === undefined ||
      selectedMonth === null || selectedMonth === undefined) {
      console.log('Year or month is not selected');
      return;
    }

    // Создаем дату для последнего дня выбранного месяца текущего года
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    // Устанавливаем время на конец дня (23:59:59.999)
    lastDayOfMonth.setHours(0, 0, 0, 0);

    console.log('lastDayOfMonth:', lastDayOfMonth);

    const formattedDateTime = this.formatDateToISO(lastDayOfMonth);
    console.log('formattedDateTime', formattedDateTime);

    this.invoiceForm.patchValue({
      dateTime: formattedDateTime
    });
  }

  // Если вам нужно установить время на конец дня (23:59:59.999)
  private formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  onMonthYearChange() {
    this.updateDateTime();
  }

  initForm(): void {
    const currentYear = new Date().getFullYear();
    this.invoiceForm = this.fb.group({
      dateTime: ['', Validators.required],// дата и время 
      selectedYear: [currentYear, Validators.required],
      selectedMonth: [''],
      logisticsCash: [0, [Validators.required, Validators.max(1)]],// логист поле нал 
      logisticsNoNds: [0, [Validators.required, Validators.max(1)]],// логист поле без ндс
      repaitsCash: [0, [Validators.required, Validators.max(1)]],// ремонты : поле нал
      repaitsNoNds: [0, [Validators.required, Validators.max(1)]],// ремонты : поле без ндс
      garageCash: [0, [Validators.max(1)]],// гараж: поле нал
      garageNoNds: [0, [Validators.max(1)]],// гараж: поле без ндс
      officeSalaryCash: [0, [Validators.required, Validators.max(1)]],// зп офис: поле нал
      driversSalaryCash: [0, [Validators.required, Validators.max(1)]],// зп водители : поле нал
      platonNoNds: [0, [Validators.required, Validators.max(1)]],// Платон: поле без ндс
      taxesNoNds: [0, [Validators.required, Validators.max(1)]],// налоги:  поле без ндс
    }, { validators: dateRangeValidator() });

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
    this.invoiceForm.patchValue({
      dateTime: this.selectedInvoice.dateTime,
      logisticsCash: this.selectedInvoice.logisticsCash,
      logisticsNoNds: this.selectedInvoice.logisticsNoNds,
      repaitsCash: this.selectedInvoice.repaitsCash,
      repaitsNoNds: this.selectedInvoice.repaitsNoNds,
      garageCash: this.selectedInvoice.garageCash,
      garageNoNds: this.selectedInvoice.garageNoNds,
      officeSalaryCash: this.selectedInvoice.officeSalaryCash,
      driversSalaryCash: this.selectedInvoice.driversSalaryCash,
      platonNoNds: this.selectedInvoice.platonNoNds,
      taxesNoNds: this.selectedInvoice.taxesNoNds,
    });

    console.log('Form filled with invoice data:', this.selectedInvoice);
  }


  saveInvoice(callback?: (invoice: any) => void) {
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
            const selectedYear = this.invoiceForm.get('selectedYear')?.value;
            const selectedMonth = this.invoiceForm.get('selectedMonth')?.value;
            delete data.selectedMonth;
            delete data.dateTime;
            data.selectedMonth = selectedMonth + 1
            if (selectedYear && selectedMonth) {
              data.dateTime = new Date(selectedYear, selectedMonth - 1, 1);
            }

          }

          this.generalFormService.savedoc(data).subscribe({
            next: (response) => {
              console.log('Документ успешно сохранен', response);
              this.toastService.showSuccess('Успешно', 'Данные сохранены успешно')
              this.dialogVisible = false;
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

  saveAndSendInvoice() {

    this.saveInvoice((invoice: any) => {
      let currentRole = this.jwtService.getDecodedToken().email;
      if (currentRole == '7') {
        this.sendingInvoice(invoice, 2);
      } else if (currentRole == '1') {
        this.sendingInvoice(invoice, 5);
      }
    });
  }

  sendingInvoice(doc: string, status: number) {
    this.generalFormService.sendingVerification(doc, status).subscribe(
      (updatedInvoice: any) => {

      },
      error => {
        console.error('Ошибка при отправке на проверку:', error);
        this.toastService.showError('Ошибка', error.error.message);
      }
    );
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
