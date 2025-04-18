import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { ServicesService } from '../services.service';
import { ConfirmPopupService } from '../../../../../components/confirm-popup/confirm-popup.service';
import { adjustmentOptions, columns, types, taxes, productColumns, statuses } from '../../../../../services/data';
import { ServicesContentService } from '../../../tabs/services/services-content/services-content.service';

@Component({
  selector: 'app-services-form',
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
    ReactiveFormsModule
  ],
  templateUrl: './services-form.component.html',
  styleUrl: './services-form.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ServicesFormComponent implements OnInit, OnChanges {
  @Input() invoiceId!: any;
  @Input() counterpartyId: any;
  @Input() isEditInvoice :any;

  measurementUnits: any[] = [];
  productTargets: any[] = [];

  adjustmentOptions = adjustmentOptions;
  columns = columns;
  types = types;
  taxes = taxes;
  productColumns = productColumns;
  invoices: any[] = [];
  selectedInvoice: any;
  checkers: any;
  isEdit:any;
  constructor(
    private servicesContentService: ServicesContentService,
    private confirmPopupService: ConfirmPopupService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
     private productsService:ServicesService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyData']) {
      const currentCounterpartyId = changes['counterpartyData'].currentValue;
      const previousCounterpartyId = changes['counterpartyData'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
        this.loadInvoice();
      }
    }
    if (changes['invoiceId']) {
      const currentCounterpartyId = changes['invoiceId'].currentValue;
      const previousCounterpartyId = changes['invoiceId'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
        if(this.invoiceId != null){
          this.loadInvoice();
        }
      }
    }
    if (changes['isEditInvoice']) {
      const currentCounterpartyId = changes['isEditInvoice'].currentValue;
      const previousCounterpartyId = changes['isEditInvoice'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
      this.isEdit = this.isEditInvoice;
      this.cdr.detectChanges();
      }
    }
    
  }

  ngOnInit() {
    this.servicesContentService.getCheckers().subscribe((values: any) => {
      this.checkers = values.data;
      this.checkers.forEach((checker: any) => {
        const initialFirstName = checker.firstName ? checker.firstName.charAt(0).toUpperCase() + '.' : '';
        const initialPatronymic = checker.patronymic ? checker.patronymic.charAt(0).toUpperCase() + '.' : '';
        checker.fullName = `${checker.lastName} ${initialFirstName} ${initialPatronymic}`.trim();
      });
    })


    
    this.servicesContentService.getMeasurementUnits$().subscribe(units => {
      if (units.length === 0) {
        this.servicesContentService.getMeasurementUnit().subscribe(values => {
          this.servicesContentService.setMeasurementUnits(values); 
        });
      }

    });
    this.servicesContentService.getProductTargetsUnits$().subscribe(units => {
      if (units.length === 0) {
        this.servicesContentService.getProductTarget().subscribe(values => {
          this.servicesContentService.setProductTargetsUnits(values); 
        });
      }
    });


    this.servicesContentService.measurementUnits$.subscribe((data:any)=>{
      this.measurementUnits = data.data;
      console.log('measurementUnits',this.measurementUnits)
    })

    this.servicesContentService.productTargets$.subscribe((data:any)=>{
      this.productTargets = data.data;
      console.log('productTargets',this.productTargets)
    })
  }

  loadInvoice() {
    this.servicesContentService.getInvoiceById(this.invoiceId).subscribe((value: any) => {
      console.log("selectedInvoice", value.data);
      this.selectedInvoice = value.data;
      
    })

  }

  getStatusLabel(value: number): string {
    const status = statuses.find(status => status.value === value);
    return status ? status.label : 'Неизвестный статус';
  }

  getStatusClass(statusValue: number): string {
    switch (statusValue) {
      case 0: return 'status-not-checked';
      case 1: return 'status-sent-for-check';
      case 2: return 'status-sent-for-check';
      case 3: return 'status-rejected';
      case 4: return 'status-rejected';
      case 5: return 'status-approved';
      case 6: return 'status-deleted';
      default: return '';
    }
  }




  adjustmentType: number | null = null;
  type: number | null = null;

  onTypeChange() {
    if (this.type === 0) {
      this.adjustmentType = 1;
      this.onAdjustmentChange()
    } else {
      this.adjustmentType = null;
      this.selectedInvoice.productList.forEach((product: any) => {
        product.amount = Math.abs(product.amount);
      });
      this.selectedInvoice.type = 0;
    }
  }

  onAdjustmentChange() {
    if (this.selectedInvoice.productList) {
      this.selectedInvoice.productList.forEach((product: any) => {

        if (this.type === 0) {
          product.amount = Math.abs(product.amount) * (this.adjustmentType === 2 ? -1 : -1);
        } else {
          product.amount = Math.abs(product.amount);
        }
      });

      // Если "+" то type = 1, если "-" то type = 0
      if (this.adjustmentType === 1) {
        this.selectedInvoice.type = 1; // Приход
      } else if (this.adjustmentType === 2) {
        this.selectedInvoice.type = 0; // Расход
      }
    }
  }







  editInvoice(id: string) {
    this.servicesContentService.getInvoiceById(id).subscribe(
      (invoice) => {
        this.selectedInvoice = invoice.data;
        const typeObj = types.find(t => t.value === invoice.data.type);

        const taxObj = taxes.find(t => t.value === invoice.data.tax);
        const formattedDate = invoice.data.dateTime ? new Date(invoice.data.dateTime) : null;

        this.selectedInvoice = {
          ...invoice.data,
          type: typeObj || null,
          tax: taxObj || null,
          dateTime: formattedDate || null
        };
        this.type = invoice.data.type;
        delete this.selectedInvoice.expenseSum;
        delete this.selectedInvoice.incomeSum;
        if (this.selectedInvoice.productList.length === 0) {
          this.addProduct();
        }

        if (this.selectedInvoice.productList && this.selectedInvoice.productList.length > 0) {
          const hasNegative = this.selectedInvoice.productList.some((product: any) => product.amount < 0);


          if (this.type === 0) {
            this.adjustmentType = null; //  "Приход", 
            this.type = 0;
          } else if (this.type === 1) {
            this.adjustmentType = 1; // "Коррекция" и "+"
            this.type = 1;
          } else if (this.type === 2) {
            this.adjustmentType = 2; // "Коррекция" и "-"
            this.type = 1;
          }
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching invoice details', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось загрузить счет'
        });
      }
    );
  }

  saveInvoice() {
    let titlePopUp = '';
    let acceptLabel = '';
    if (this.selectedInvoice && this.selectedInvoice.id) {
      titlePopUp = 'Вы действительно хотите обновить данные?';
      acceptLabel = 'Обновить';
    } else {
      titlePopUp = 'Вы действительно хотите создать счет-фактуру?';
      acceptLabel = 'Создать'
    }

    this.confirmPopupService.openConfirmDialog({
      title: '',
      message: titlePopUp,
      acceptLabel: acceptLabel,
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.selectedInvoice = {
          ...this.selectedInvoice,
          tax: this.selectedInvoice.tax.value,
          type: typeof this.selectedInvoice.type === 'object' ? this.selectedInvoice.type.value : this.selectedInvoice.type
        };

        this.servicesContentService.saveInvoice(this.selectedInvoice).subscribe(
          (invoice) => {
            if (this.selectedInvoice.id) {
              const index = this.invoices.findIndex(inv => inv.id === this.selectedInvoice.id);
              if (index > -1) {
                this.invoices[index] = { ...this.selectedInvoice };
              }
            } else {
              this.invoices.push(invoice.data);
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Успех',
              detail: 'Счет сохранен'
            });

            this.selectedInvoice = null;
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error saving invoice', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось сохранить счет'
            });
          }
        );
      }
    });

  }

  deleteInvoice(id: string) {

    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить счет-фактуру?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.servicesContentService.deleteInvoice(id).subscribe(
          () => {
            let invoices = this.productsService.getActiveData()
            this.invoices = invoices.filter((inv:any) => inv.id !== id);
;
            this.messageService.add({
              severity: 'success',
              summary: 'Удалено',
              detail: 'Счет-фактура удалена'
            });
          },
          (error) => {
            console.error('Error deleting invoice', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось удалить счет'
            });
          }
        );
      }
    });
  }

  addProduct() {
    if (!this.selectedInvoice) {
      this.createNewInvoice();
    }

    if (!this.selectedInvoice.productList) {
      this.selectedInvoice.productList = [];
    }

    this.selectedInvoice.productList.push({
      name: '',
      quantity: 0,
      amount: 0,
      measurementUnitId: '',
      productTargetId: '',
      date: new Date().toISOString()
    });
  }


  removeProduct(index: number) {
    if (this.selectedInvoice) {
      this.selectedInvoice.productList.splice(index, 1);
    }
  }


  sendingInvoice(id: string) {
    this.servicesContentService.sendingVerification(id).subscribe((updatedInvoice: any) => {
      const index = this.invoices.findIndex(invoice => invoice.id === id);
      if (index !== -1) {
        this.invoices[index] = { ...this.invoices[index], ...updatedInvoice.data };
        console.log('this.invoices[index]', this.invoices[index])
        this.invoices = [...this.invoices];
        this.cdr.detectChanges();
        this.onDialogClose();
      }
    }, error => {
      console.error('Ошибка при отправке на проверку:', error);
    });
  }


  createNewInvoice() {
    this.selectedInvoice = {
      dateTime: new Date().toISOString(),
      number: '',
      status: 0,
      // stateNumberCar: '',
      tax: 0,
      partnerId: this.counterpartyId,
      checkPersonId: '',
      productList: []
    };

    this.isEdit = true;

    this.addProduct();

  }


  onDialogClose() {
    this.selectedInvoice = null;
  }

  calculatingAmount(): number {
    if (this.selectedInvoice && this.selectedInvoice.productList.length > 0) {
      let totalAmount = this.selectedInvoice.productList.reduce((sum: number, product: any) => {
        return sum + (product.quantity * product.amount);
      }, 0);
      return totalAmount
    } else {

      return 0;
    }
  }



}


