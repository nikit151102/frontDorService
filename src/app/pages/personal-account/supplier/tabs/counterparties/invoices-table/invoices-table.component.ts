import { Component, Input, OnInit } from '@angular/core';
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
export class InvoicesTableComponent implements OnInit {
  @Input() counterpartyId!: any;

  invoices: any[] = [];
  selectedInvoice: any;

  columns = [
    { field: 'numberInvoice', header: 'Номер' },
    { field: 'incomeSum', header: 'Сумма' },
    { field: 'date', header: 'Дата' }
  ];

  statuses = [
    { label: 'Не проверено', value: 0 },
    { label: 'Проверен механиком', value: 1 }
  ];

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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadInvoices(); 
  }

  loadInvoices() {
    this.invoiceService.getInvoices().subscribe(
      (invoices) => {
        this.invoices = invoices.data;
      },
      (error) => {
        this.invoices = []
        console.error('Error loading invoices', error);
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
        this.selectedInvoice = invoice;
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
            this.invoices.push(invoice);
          }
  
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
      this.createNewInvoice(); // Ensure an invoice is created if it's undefined
    }
    
    if (!this.selectedInvoice.productList) {
      this.selectedInvoice.productList = [];  // Ensure productList exists
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

  createNewInvoice() {
    this.selectedInvoice = {
      id: null, 
      date: new Date().toISOString(), 
      numberInvoice: '', 
      status: 0,  
      stateNumberCar: '', 
      tax: 0, 
      partnerId: this.counterpartyId,
      productList: []  
    };

  }

}
