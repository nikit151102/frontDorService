import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceService } from './invoices-table.service';
import { ConfirmPopupService } from '../../../../../../components/confirm-popup/confirm-popup.service';

interface Product {
  productName: string;
  quantity: number;
  amount: number;
  date: string;
}

interface DocInvoice {
  id: number;
  date: string;
  numberInvoice: string;
  status: number;
  stateNumberCar: string;
  incomeSum: number;
  expenseSum: number;
  type: number;
  tax: number;
  productList: Product[];
}

@Component({
  selector: 'app-invoices-table',
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
  standalone: true,
  templateUrl: './invoices-table.component.html',
  styleUrl: './invoices-table.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class InvoicesTableComponent implements OnInit, OnChanges {
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

    console.log(`columnIndex: ${columnIndex}, найдено:`, column);
    console.log('totalInfo:', column ? this.totalInfo?.[column.value] ?? 0 : null);

    return column ? this.totalInfo?.[column.value] ?? 0 : null;
  }



  taxes = [
    { label: 'Без НДС', value: 0 },
    { label: 'НДС 5%', value: 1 },
    { label: 'НДС 20%', value: 2 }
  ];

  types = [
    { label: 'Приход', value: 0 },
    { label: 'Расход', value: 1 }
  ];

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
        checker.fullName = `${checker.firstName} ${checker.lastName} ${checker.patronymic}`;
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
        delete this.selectedInvoice.expenseSum;
        delete this.selectedInvoice.incomeSum;
        
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
          type: this.selectedInvoice.type.value
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
            this.cdr.detectChanges();
            this.messageService.add({
              severity: 'success',
              summary: 'Успех',
              detail: 'Счет сохранен'
            });

            this.selectedInvoice = null;
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



  addProduct() {
    if (!this.selectedInvoice) {
      this.createNewInvoice();
    }

    if (!this.selectedInvoice.productList) {
      this.selectedInvoice.productList = [];
    }

    this.selectedInvoice.productList.push({
      productName: '',
      quantity: 1,
      amount: 0,
      date: new Date().toISOString()
    });
  }


  removeProduct(index: number) {
    if (this.selectedInvoice) {
      this.selectedInvoice.productList.splice(index, 1);
    }
  }


  sendingInvoice(id: string, status: number) {
    this.invoiceService.sendingVerification(id,status).subscribe((updatedInvoice: any) => {
      const index = this.invoices.findIndex(invoice => invoice.id === id);
      if (index !== -1) {
        this.invoices[index] = { ...this.invoices[index], ...updatedInvoice.data };
        this.invoices = [...this.invoices];
        
        this.cdr.detectChanges();
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
