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

  columns = [
    { field: 'number', header: 'Номер' },
    { field: 'incomeSum', header: 'Сумма' },
    { field: 'dateTime', header: 'Дата' }
  ];

  statuses = [
    { label: 'Не проверено', value: 0 },
    { label: 'Отправлено на проверку', value: 1 },
    { label: 'Проверено', value: 2 },
    { label: 'Отклонено', value: 3 },
    { label: 'Удалена', value: 4 },
  ];

  getStatusLabel(value: number): string {
    const status = this.statuses.find(status => status.value === value);
    return status ? status.label : 'Неизвестный статус';
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
    private confirmationService: ConfirmationService,
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

  ngOnInit() { }

  loadInvoices() {
    console.log('Загрузка счетов для:', this.counterpartyId);
    this.invoiceService.getInvoicesByIdCounterparty(this.counterpartyId).subscribe(
      (invoices) => {
        console.log('Ответ сервера:', invoices);
        this.invoices = invoices.data;
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
    if (this.selectedInvoice) {
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

  }



  deleteInvoice(id: string) {
    this.confirmationService.confirm({
      message: 'Вы уверены, что хотите удалить этот счет-фактуру?',
      header: 'Подтвердите удаление',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      accept: () => {
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


  sendingInvoice(id: string) {
    this.invoiceService.sendingVerification(id).subscribe((updatedInvoice: any) => {
      const index = this.invoices.findIndex(invoice => invoice.id === id);
      if (index !== -1) {
        this.invoices[index] = { ...this.invoices[index], ...updatedInvoice };
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
      checkPersonId: '032b6da4-249c-49c1-8fe8-f3ab1498a1bd',
      productList: []
    };

  }


  onDialogClose() {
    this.selectedInvoice = null;
  }

}
