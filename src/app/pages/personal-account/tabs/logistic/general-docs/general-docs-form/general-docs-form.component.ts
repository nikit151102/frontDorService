import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

  // Mock data
  vehicleOptions = [];
  driverOptions = [];


  constructor(
    private generalFormService: GeneralDocsFormService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private cacheService: CacheReferenceService,
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {

      this.selectedInvoice = this.data;
      console.log('this.areOptionsLoaded', this.areOptionsLoaded())
      if (this.config && this.areOptionsLoaded()) {
      } else {
        const waitForConfig = setInterval(() => {
          if (this.config && this.areOptionsLoaded()) {
            clearInterval(waitForConfig);
            this.cdr.detectChanges();
          }
        }, 100);
      }
    }
    if (changes['config'] || changes['model']) {
      this.cdr.detectChanges();
    }
  }

  private areOptionsLoaded(): boolean {
    return this.config?.fields.every(field => {
      if (field.type === 'dropdown') {
        return Array.isArray(field.options) && field.options.length > 0;
      }
      return true;
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.vehicleOptions = this.loadDropdownData('/api/Entities/ProductTarget/Filter')
    this.driverOptions = this.loadDropdownData('/api/Entities/DriverEmployee')
  }


  initForm(): void {
    this.invoiceForm = this.fb.group({
      productTargetId: ['', Validators.required],
      beginDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      beginOdometer: [0, [Validators.required, Validators.min(0)]],
      endOdometer: [0, [Validators.required, Validators.min(0)]],
      odometer: [0, [Validators.required, Validators.min(0)]],
      grossCash: [0, [Validators.required, Validators.min(0)]],
      grossNoNds: [0, [Validators.required, Validators.min(0)]],
      grossNds: [0, [Validators.required, Validators.min(0)]],
      fuelCount: [0, [Validators.required, Validators.min(0)]],
      fuelCost: [0, [Validators.required, Validators.min(0)]],
      fuelTotalCost: [0, [Validators.required, Validators.min(0)]],
      driverSalary: [0, [Validators.required, Validators.min(0)]],
      driverId: ['']
    });

    // Подписка на изменения для вычисляемых полей
    this.setupCalculations();
  }


  setupCalculations(): void {
    // Получаем контролы один раз
    const beginOdometerControl = this.invoiceForm.get('beginOdometer');
    const endOdometerControl = this.invoiceForm.get('endOdometer');
    const fuelCountControl = this.invoiceForm.get('fuelCount');
    const fuelCostControl = this.invoiceForm.get('fuelCost');

    // Проверяем существование контролов перед подпиской
    if (beginOdometerControl && endOdometerControl) {
      beginOdometerControl.valueChanges.subscribe(() => this.calculateOdometer());
      endOdometerControl.valueChanges.subscribe(() => this.calculateOdometer());
    }

    if (fuelCountControl && fuelCostControl) {
      fuelCountControl.valueChanges.subscribe(() => this.calculateFuelTotal());
      fuelCostControl.valueChanges.subscribe(() => this.calculateFuelTotal());
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
    }
  }

  calculateFuelTotal(): void {
    const countControl = this.invoiceForm.get('fuelCount');
    const costControl = this.invoiceForm.get('fuelCost');
    const totalControl = this.invoiceForm.get('fuelTotalCost');

    if (countControl && costControl && totalControl) {
      const count = countControl.value || 0;
      const cost = costControl.value || 0;
      totalControl.setValue(count * cost, { emitEvent: false });
    }
  }

  onVehicleChange(selectedValue: any): void {
    console.log('Выбрано значение:', selectedValue);
    this.invoiceForm.get('productTargetId')?.setValue(selectedValue);
  }

  onDriverChange(selectedValue: any): void {
    console.log('Выбрано значение:', selectedValue);
    this.invoiceForm.get('driverId')?.setValue(selectedValue);
  }

  saveInvoice(): void {
    if (this.invoiceForm.valid) {
      console.log('Сохранение данных:', this.invoiceForm.value);
      this.generalFormService.savedoc(this.invoiceForm.value).subscribe({
        next: (response) => {
          console.log('Документ успешно сохранен', response);
          this.dialogVisible = false;
        },
        error: (err) => {
          console.error('Ошибка при сохранении документа', err);
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  markAllAsTouched(): void {
    Object.values(this.invoiceForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }


  loadDropdownData(apiEndpoint: string) {
    // 1. Проверяем кэш
    const cachedData = this.cacheService.get(apiEndpoint);

    if (cachedData) {
      return cachedData;
    }

    this.generalFormService.getProductsByEndpoint(apiEndpoint).subscribe({
      next: (data: any) => {
        console.log('Данные получены с сервера: loadData', data);

        // Сохраняем в кэш (5 минут TTL)
        this.cacheService.set(apiEndpoint, data.data);

        return data.data;

      },
      error: (error) => {
        console.error('Ошибка загрузки:', error);
        this.cacheService.setLoading(apiEndpoint, false);
      }
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
    this.selectedInvoice = {};
    this.data = null;
    this.dialogVisible = true;
  }


}
