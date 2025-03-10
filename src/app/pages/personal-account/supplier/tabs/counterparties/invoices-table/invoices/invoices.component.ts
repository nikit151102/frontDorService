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
import { ConfirmPopupService } from '../../../../../../../components/confirm-popup/confirm-popup.service';
import { InvoiceService } from '../invoices-table.service';

@Component({
  selector: 'app-invoices',
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
    ReactiveFormsModule
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class InvoicesComponent implements OnInit, OnChanges {
  @Input() counterpartyId!: any;


  invoices: any[] = [];
  selectedInvoice: any;
  checkers: any;


  columns = [
    { field: 'number', header: 'Номер' },
    { field: 'expenseSum', header: 'Расход' },
    { field: 'incomeSum', header: 'Приход' },
    { field: 'dateTime', header: 'Дата' }
  ];

  statuses = [
    { label: 'Не отправлено', value: 0 },
    { label: 'Проверка Механик', value: 1 }, // голубой
    { label: 'Проверка Директор', value: 2 }, // голубой
    { label: 'Отклонено Механик', value: 3 }, // красный
    { label: 'Отклонено Директор', value: 4 }, // красный
    { label: 'Подписано', value: 5 }, // зеленый
    { label: 'Удалено', value: 6 } // серый
  ];

  getStatusLabel(value: number): string {
    const status = this.statuses.find(status => status.value === value);
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


  totalInfo: any;

  totalInfoColumn = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ]

  getTotalValue(columnIndex: number): any {
    if (!this.totalInfo) return null;

    const column = this.totalInfoColumn.find(col => col.columnNum === columnIndex);

    return column ? this.totalInfo?.[column.value] ?? 0 : null;
  }



  taxes = [
    { label: 'Без НДС', value: 0 },
    { label: 'НДС 5%', value: 1 },
    { label: 'НДС 20%', value: 2 }
  ];

  adjustmentType: number | null = null;
  type: number | null = null;

  adjustmentOptions = [
    { label: '+', value: 1 },
    { label: '-', value: 2 }
  ];

  types = [
    { label: 'Расход', value: 1 },
    { label: 'Коррекция', value: 0 }
  ];

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
  




  productColumns = [
    { header: 'Покупка', field: 'incomeSum' },
    { header: 'Оплата', field: 'expenseSum' },
    { header: 'Дата', field: 'dateTime' },
    { header: 'Номер', field: 'number' }
  ];

  constructor(
    private invoiceService: InvoiceService,
    private confirmPopupService: ConfirmPopupService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyId']) {
      const currentCounterpartyId = changes['counterpartyId'].currentValue;
      const previousCounterpartyId = changes['counterpartyId'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
        console.log('Counterparty ID изменился:', currentCounterpartyId);
        this.loadInvoices();
        this.selectedInvoice = null;
      }
    }
  }

  ngOnInit() {
    this.invoiceService.getCheckers().subscribe((values: any) => {
      this.checkers = values.data;
      this.checkers.forEach((checker: any) => {
        const initialFirstName = checker.firstName ? checker.firstName.charAt(0).toUpperCase() + '.' : '';
        const initialPatronymic = checker.patronymic ? checker.patronymic.charAt(0).toUpperCase() + '.' : '';

        checker.fullName = `${checker.lastName} ${initialFirstName} ${initialPatronymic}`.trim();
      });

    })

  }

  loadInvoices() {
    console.log('Загрузка счетов для:', this.counterpartyId);
    this.invoiceService.getInvoicesByIdCounterparty(this.counterpartyId).subscribe(
      (invoices) => {
        console.log('Ответ сервера:', invoices);
        this.invoices = invoices.documentMetadata.data;
        this.totalInfo = invoices.totalInfo;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Ошибка загрузки счетов:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось загрузить счета'
        });
      }
    );
  }


  editInvoice(id: string) {
    this.invoiceService.getInvoiceById(id).subscribe(
      (invoice) => {
        this.selectedInvoice = invoice.data;
        const typeObj = this.types.find(t => t.value === invoice.data.type);

        const taxObj = this.taxes.find(t => t.value === invoice.data.tax);
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

        this.invoiceService.saveInvoice(this.selectedInvoice).subscribe(
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
            this.totalInfo = invoice.totalInfo;
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
        this.invoiceService.deleteInvoice(id).subscribe(
          () => {
            this.invoices = this.invoices.filter((inv) => inv.id !== id);

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
      productName: '',
      quantity: 0,
      amount: 0,
      date: new Date().toISOString()
    });
  }


  removeProduct(index: number) {
    if (this.selectedInvoice) {
      this.selectedInvoice.productList.splice(index, 1);
    }
  }


  sendingInvoice(id: string) {
    this.invoiceService.sendingVerification(id).subscribe((updatedInvoice: any) => {
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
      stateNumberCar: '',
      tax: 0,
      partnerId: this.counterpartyId,
      checkPersonId: '',
      productList: []
    };

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


