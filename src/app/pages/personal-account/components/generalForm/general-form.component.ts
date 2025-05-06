import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { JwtService } from '../../../../services/jwt.service';
import { CustomDropdownComponent } from '../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomInputComponent } from '../../../../ui-kit/custom-input-auth/custom-input.component';
import { CustomInputNumberComponent } from '../../../../ui-kit/custom-input-number/custom-input-number.component';
import { InvoiceConfig } from '../../../../interfaces/common.interface';
import { GeneralFormService } from './general-form.service';
import { ConfirmPopupService } from '../../../../components/confirm-popup/confirm-popup.service';
import { ToastService } from '../../../../services/toast.service';
import { ProductsService } from '../products/products.service';
import { InvoicesService } from '../invoices/invoices.service';
import { InvoicesContentService } from '../../tabs/partners/invoices-content/invoices-content.service';
import { Router } from '@angular/router';
import { UnsavedChangesDialogComponent } from '../unsaved-changes-dialog/unsaved-changes-dialog.component';

@Component({
  selector: 'general-form',
  standalone: true,
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
    CustomInputComponent,
    UnsavedChangesDialogComponent
  ],
  templateUrl: './general-form.component.html',
  styleUrl: './general-form.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class GeneralFormComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() label: string = 'Создать';
  config!: InvoiceConfig;
  service: any;
  model: Record<string, any> = {};
  selectedInvoice: any;
  isEdit: boolean = true;

  constructor(
    private generalFormService: GeneralFormService,
    private cdr: ChangeDetectorRef,
    private jwtService: JwtService,
    private confirmPopupService: ConfirmPopupService,
    private invoicesService: InvoicesService,
    private invoiceService: InvoicesContentService,
    private productsService: ProductsService,
    private messageService: MessageService,
    private toastService: ToastService,
    private router: Router,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.selectedInvoice = this.data;

      if (this.config && this.areOptionsLoaded()) {
        this.patchModelWithData(this.data);
      } else {
        const waitForConfig = setInterval(() => {
          if (this.config && this.areOptionsLoaded()) {
            clearInterval(waitForConfig);
            this.patchModelWithData(this.data);
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


  private patchModelWithData(data: any): void {
    if (!this.config?.fields) {
      console.warn('Конфигурация или поля не определены');
      return;
    }

    for (const field of this.config.fields) {
      console.log(`Обрабатываем поле: ${field.name}`);
      if (data.hasOwnProperty(field.name)) {
        if (field.name === 'id') {
          this.model['id'] = data['id'];
        } else {
          if (field.type === 'date') {
            const dateValue = data[field.name];
            if (dateValue) {
              if (typeof dateValue === 'string' || typeof dateValue === 'number') {
                this.model[field.name] = new Date(dateValue);
              } else {
                this.model[field.name] = dateValue;
              }
              console.log('Патчим поле dateTime со значением:', this.model[field.name]);
            }
          } else {
            this.model[field.name] = data[field.name];
          }
        }
        this.oldData = structuredClone(this.model);
        this.dialogVisible = true;
      } else {
        console.warn(`⚠️ Поле "${field.name}" отсутствует в данных`);
      }
    }


    const currentUrl = this.router.url;
    if (currentUrl.includes('/cash')) {
      // 🆕 Добавляем обработку productList
      if (Array.isArray(data.productList) && data.productList.length > 0) {
        const firstProduct = data.productList[0];
        console.log('🛒 Первый продукт:', firstProduct);

        this.model['productTarget.Id'] = firstProduct.productTarget.id || '';
        this.model['productName'] = firstProduct.name || '';
        console.log('this.model', this.model)
        // // Например: патчим в модель нужные поля
        // this.model['productName'] = firstProduct.name || '';
        // this.model['productAmount'] = firstProduct.amount || 0;
        // this.model['productQuantity'] = firstProduct.quantity || 0;
        // this.model['productDateTime'] = firstProduct.dateTime ? new Date(firstProduct.dateTime) : null;

        // Можно ещё что-то, в зависимости от полей
        // this.model['productTargetName'] = firstProduct.productTarget?.name || '';
      }
    }



    console.log('✅ Финальная модель после патча:', this.model);
  }




  groupedFields: any;
  groupFieldsByRow() {
    this.groupedFields = {};
    for (const field of this.config.fields) {
      const group = field.rowGroup || 'default';
      if (!this.groupedFields[group]) {
        this.groupedFields[group] = [];
      }
      this.groupedFields[group].push(field);
    }

  }
  ngOnInit(): void {

    this.generalFormService.getConfig().subscribe((config: any) => {
      this.config = config;
      this.initializeModel(config);
      this.groupFieldsByRow();
      console.log('config', config)
    });

    this.generalFormService.getModel().subscribe((model: any) => {
      this.model = model;
      console.log('model', model)
    });

    const currentRole = this.jwtService.getDecodedToken().email;

  }

  private initializeModel(config: InvoiceConfig): void {
    this.model = {};
    if (config?.fields) {
      config.fields.forEach(field => {
        this.model[field.name] = field.type === 'dropdown' ? field.options?.[0]?.value : '';
      });
    }
  }

  executeAction(label: string, action: (model: any, dependencies: any, sendClose: any) => void): void {
    if (typeof action === 'function') {
      const dependencies = {
        confirmPopupService: this.confirmPopupService,
        invoiceService: this.invoiceService,
        productsService: this.productsService,
        messageService: this.messageService,
        toastService: this.toastService,
        jwtService: this.jwtService,
        invoicesService: this.invoicesService
      };
      if (this.data && this.data.id) {
        this.model['id'] = this.data.id;
      };
      if (label != 'Отменить') {
        action(this.model, dependencies, this.onDialogClose.bind(this));
      } else {
        this.onDialogClose();
      }

    }
  }


  onDialogClose(event: any = null) {
    if (!this.deepEqual(this.selectedInvoice, this.oldData)) {
      this.dialogVisible = true;
      this.showConfirmDialog = true;
      if (event)
        event.preventDefault();
    } else {
      this.selectedInvoice = null;
      this.showConfirmDialog = false;
      this.dialogVisible = false;
    }
  }

  showConfirmDialog: boolean = false;
  dialogVisible: boolean = false;
  oldData: any;

  hideConfirmDialog() {
    this.showConfirmDialog = false;
  }

  confirmCloseDialog() {
    this.showConfirmDialog = false;
    this.selectedInvoice = null;
    this.dialogVisible = true;
  }

  deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }


  createNewInvoice(): void {
    this.selectedInvoice = {};
    console.log('model', this.model)
    if (this.model) {
      for (const key in this.model) {
        if (this.model.hasOwnProperty(key)) {
          this.model[key] = null;
        }
      }
      this.dialogVisible = true;
      this.oldData = structuredClone(this.model);
    }
  }


  onDateInput(event: any, fieldValue: any) {
    let value = event.target.value;
    value = value.replace(/[,\.]/g, '-');
    let date = this.parseDate(value);
    if (date) {
      this.model[fieldValue] = date;
    } else {
      fieldValue = null;
    }
  }

  parseDate(value: string): Date | null {
    const parts = value.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
    return null;
  }
}
