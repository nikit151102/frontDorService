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
import { statuses, taxes, types, adjustmentOptions, columns, productColumns } from '../../../../../services/data';
import { ConfirmPopupService } from '../../../../../components/confirm-popup/confirm-popup.service';
import { InvoicesService } from '../invoices.service';
import { InvoicesContentService } from '../../../tabs/partners/invoices-content/invoices-content.service';
import { CustomDropdownComponent } from '../../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomInputNumberComponent } from '../../../../../ui-kit/custom-input-number/custom-input-number.component';
import { CustomInputComponent } from '../../../../../ui-kit/custom-input/custom-input.component';
import { JwtService } from '../../../../../services/jwt.service';

@Component({
  selector: 'app-invoices-form',
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
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class InvoicesFormComponent implements OnInit, OnChanges {
  @Input() invoiceId!: any;
  @Input() counterpartyId: any;
  @Input() isEditInvoice: any;
  visibleCheckPersonId: boolean = true;

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
  isEdit: any;
  constructor(
    private invoiceService: InvoicesContentService,
    private confirmPopupService: ConfirmPopupService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private productsService: InvoicesService,
    private jwtService: JwtService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyData']) {
      const currentCounterpartyId = changes['counterpartyData'].currentValue;
      const previousCounterpartyId = changes['counterpartyData'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId && this.invoiceId != undefined) {
        this.loadInvoice();
      }
    }
    if (changes['invoiceId']) {
      const currentCounterpartyId = changes['invoiceId'].currentValue;
      const previousCounterpartyId = changes['invoiceId'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
        console.log('this.invoiceId this.invoiceId ', this.invoiceId)
        if (this.invoiceId != null && this.invoiceId != undefined ) {
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
    let currentRole = this.jwtService.getDecodedToken().email;
    if (currentRole == '3') {
      this.visibleCheckPersonId = false;
    }
    this.invoiceService.getCheckers().subscribe((values: any) => {
      this.checkers = values.data;
  
      this.checkers.forEach((checker: any) => {
        const initialFirstName = checker.firstName ? checker.firstName.charAt(0).toUpperCase() + '.' : '';
        const initialPatronymic = checker.patronymic ? checker.patronymic.charAt(0).toUpperCase() + '.' : '';
        checker.fullName = `${checker.lastName} ${initialFirstName} ${initialPatronymic}`.trim();
      });
    })



    this.invoiceService.getMeasurementUnits$().subscribe(units => {
      if (units.length === 0) {
        this.invoiceService.getMeasurementUnit().subscribe(values => {
          this.invoiceService.setMeasurementUnits(values);
        });
      }

    });
    this.invoiceService.getProductTargetsUnits$().subscribe(units => {
      if (units.length === 0) {
        this.invoiceService.getProductTarget().subscribe(values => {
          this.invoiceService.setProductTargetsUnits(values);
        });
      }
    });


    this.invoiceService.measurementUnits$.subscribe((data: any) => {
      this.measurementUnits = data.data;
      console.log('measurementUnits', this.measurementUnits)
    })

    this.invoiceService.productTargets$.subscribe((data: any) => {
      this.productTargets = data.data;
      console.log('productTargets', this.productTargets)
    })
  }

  loadInvoice() {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe((value: any) => {

      this.selectedInvoice = value.data;
      this.type = value.data.type

      this.selectedInvoice.dateTime = new Date(value.data.dateTime);
      this.selectedInvoice.tax = taxes.find(tx => tx.value === value.data.tax);

      this.selectedInvoice.checkPersonId = value.data.checkPerson.id;

      if (this.selectedInvoice.expenseSum == 0 && this.selectedInvoice.incomeSum < 0) {
        this.selectedInvoice.adjustmentType = { label: '-', value: 2 };
      } else if (this.selectedInvoice.incomeSum == 0 && this.selectedInvoice.expenseSum < 0) {
        this.selectedInvoice.adjustmentType = { label: '+', value: 1 };
      }
      if (value.data.productList) {
        this.selectedInvoice.productList = value.data.productList.map((product:any) => ({
          ...product,
          measurementUnitId: product.measurementUnit ? product.measurementUnit.id : null,
          productTargetId: product.productTarget ? product.productTarget.id : null,
        }));
      }
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
      this.selectedInvoice.type = 1;
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
    this.invoiceService.getInvoiceById(id).subscribe(
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



  deleteInvoice(id: string) {

    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить счет-фактуру?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.invoiceService.deleteInvoice(id).subscribe(
          () => {
            let invoices = this.productsService.getActiveData()
            this.invoices = invoices.filter((inv: any) => inv.id !== id);
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


  saveInvoice(callback?: (invoice: any) => void) {
    let titlePopUp = '';
    let acceptLabel = '';
  
    if (this.selectedInvoice && this.selectedInvoice.id) {
      titlePopUp = 'Вы действительно хотите обновить данные?';
      acceptLabel = 'Обновить';
    } else {
      titlePopUp = 'Вы действительно хотите создать счет-фактуру?';
      acceptLabel = 'Создать';
    }
  
    this.confirmPopupService.openConfirmDialog({
      title: '',
      message: titlePopUp,
      acceptLabel: acceptLabel,
      rejectLabel: 'Отмена',
      onAccept: () => {
        if (!this.visibleCheckPersonId) {
          this.selectedInvoice = {
            ...this.selectedInvoice,
            checkPersonId: '00000000-0000-0000-0000-000000000000',
          };
        }
  
        console.log('this.selectedInvoice', this.selectedInvoice);
        this.selectedInvoice = {
          ...this.selectedInvoice,
          tax: this.selectedInvoice.tax.value,
          type: typeof this.selectedInvoice.type === 'object' ? this.selectedInvoice.type.value : this.selectedInvoice.type
        };
  
        this.invoiceService.saveInvoice(this.selectedInvoice).subscribe(
          (invoice) => {
            console.log('invoice.documentMetadata.data', invoice.documentMetadata.data);
            
            if (this.selectedInvoice.id) {
              this.productsService.updateActiveData(invoice.documentMetadata.data);
            } else {
              this.productsService.addItemToStart(invoice.documentMetadata.data);
            }
            this.productsService.totalInfo = invoice.totalInfo;
            this.messageService.add({
              severity: 'success',
              summary: 'Успех',
              detail: 'Счет сохранен'
            });
  
            const invoiceId = invoice.documentMetadata.data.id;
            this.selectedInvoice = null;
            this.cdr.detectChanges();
  
            if (callback && invoice.documentMetadata.data) {
              callback(invoice.documentMetadata.data);
            }
          },
          (error) => {
            console.error('Ошибка при сохранении счета', error);
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
  
  sendingInvoice(invoice: string, status:number) {
    this.invoiceService.sendingVerification(invoice, status).subscribe(
      (updatedInvoice: any) => {
        const index = this.invoices.findIndex(invoice => invoice.id === invoice.id);
        if (index !== -1) {
          this.invoices[index] = { ...this.invoices[index], ...updatedInvoice.data };
          console.log('this.invoices[index]', this.invoices[index]);
          this.invoices = [...this.invoices];
          this.cdr.detectChanges();
          this.onDialogClose();
        }
      },
      error => {
        console.error('Ошибка при отправке на проверку:', error);
      }
    );
  }
  
  

  saveAndSendInvoice() {
    this.saveInvoice((invoice: any) => {
      let currentRole = this.jwtService.getDecodedToken().email;
      if (currentRole == '3') {
        this.sendingInvoice(invoice, 2);
      }else if(currentRole == '2'){
        this.sendingInvoice(invoice, 1);
      }      
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


