import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductsService } from './products.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DateFilterSortComponent } from '../../../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';

import { InvoiceService } from '../invoices-table.service';
import { ConfirmPopupService } from '../../../../../../../components/confirm-popup/confirm-popup.service';
import { InvoicesFormComponent } from '../invoices-form/invoices.component';

@Component({
  selector: 'app-invoices-data',
  providers: [ProductsService, MessageService],
  imports: [CommonModule, TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    InvoicesFormComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})

export class InvoicesDataComponent implements OnChanges, OnInit {
  @Input() counterpartyId!: any;
  @Input() endpoint: any;
  @Input() columns: any;
  @Input() totalInfoColumn: any;
  @Input() actions: { label: string, action: string }[] = []; // изменено на строку (название метода)
  @Input() productService!: any;
  selectInvoice: any;
  items: MenuItem[] | undefined;
  invoices: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyId']) {
      this.productsService.counterpartyId = this.counterpartyId;
      this.productsService.endpoint = this.endpoint;
      this.productsService.loadProducts();
    }
  }

  selectedProduct: any;
  selectedColumns: string[] = [];

  constructor(private invoiceService: InvoiceService,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    public productsService: ProductsService) { }

  ngOnInit() {
    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
    this.loadInvoices();

    // Adjusting the context menu to pass data correctly
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Изменить',
            command: (event) => this.updateInvoice(event)  // Pass the entire event, which includes the invoice data
          },
          {
            label: 'удалить',
            command: (event) => this.deleteInvoice(event)  // Pass the entire event, which includes the invoice data
          }
        ]
      }
    ];
  }


  updateColumnVisibility() {
    this.columns.forEach((col: any) => {
      col.visible = this.selectedColumns.includes(col.field);
    });
  }

  isColumnVisible(column: any): boolean {
    return column.visible;
  }


  getTotalValue(columnIndex: number): any {
    if (!this.productsService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    return column ? this.productsService.totalInfo?.[column.value] ?? 0 : null;
  }

  statuses = [
    { label: 'Не отправлено', value: 0, id:0 },
    { label: 'Проверка Механик', value: 1, id: 1 },
    { label: 'Проверка Директор', value: 2, id: 2 },
    { label: 'Отклонено Механик', value: 3, id: 3 },
    { label: 'Отклонено Директор', value: 4, id: 4 },
    { label: 'Подписано', value: 5, id: 5 },
    { label: 'Удалено', value: 6, id: 6 }
  ];


  getStatusLabel(value: number): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }

  getStatusClass(value: number): string {
    switch (value) {
      case 0: return 'status-not-checked';
      case 1:
      case 2: return 'status-sent-for-check';
      case 3:
      case 4: return 'status-rejected';
      case 5: return 'status-approved';
      case 6: return 'status-deleted';
      default: return '';
    }
  }
  

  onActionClick(actionName: string, product: any) {
    if (this.productService && typeof this.productService[actionName] === 'function') {
      this.productService[actionName](product);
    } else {
      console.error(`Method ${actionName} does not exist on ProductsService`);
    }
  }


  updateInvoice(invoice: any) {
    this.selectInvoice = invoice;
  }

  loadInvoices() {
    this.productsService.getProductsByCounterparty(this.counterpartyId).subscribe(
      (response) => {
        console.log('response', response)
        this.invoices = response.data; // Assuming response is the invoice array
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить счета' });
      }
    );
  }

  deleteInvoice(invoiceId: any) {
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить счет-фактуру?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.invoiceService.deleteInvoice(invoiceId).subscribe(
          () => {
            this.productService.productsService = this.productService.productsService.filter((inv: any) => inv.id !== invoiceId);

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

  verificationInvoice(invoiceId: any){
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение отправки на проверку',
      message: 'Вы уверены, что хотите отправить фактуру механику?',
      acceptLabel: 'Отправить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.invoiceService.sendingVerification(invoiceId).subscribe(
          () => {
        
            this.messageService.add({
              severity: 'success',
              summary: 'Отправка',
              detail: 'Счет-фактура успешно отправлена'
            });
          },
          (error) => {
            console.error('Error deleting invoice', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось отправить фактуру'
            });
          }
        );
      }
    });
  }

  selectInvoiceId: any;
  getInvoiceById(invoiceId: any) {
    this.selectInvoiceId = invoiceId;
  }


  dropdownVisible: { [key: string]: boolean } = {}; 

  toggleDropdown(productId: string) {
      Object.keys(this.dropdownVisible).forEach(id => {
          if (id !== productId) this.dropdownVisible[id] = false;
      });
  
      this.dropdownVisible[productId] = !this.dropdownVisible[productId];
  }
  

}
