import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DateFilterSortComponent } from '../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { ProductsService } from '../products/products.service';
import { ConfirmPopupService } from '../../../../components/confirm-popup/confirm-popup.service';
import { ServicesContentService } from '../../tabs/services/services-content/services-content.service';
import { ServicesFormComponent } from './services-form/services-form.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-services',
  providers: [ProductsService, MessageService],
  imports: [CommonModule,
    TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    ServicesFormComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnChanges, OnInit {
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

  constructor(private servicesContentService: ServicesContentService,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    private toastService:ToastService,
    public productsService: ProductsService) { }

  ngOnInit() {


    this.productService.activData$.subscribe((data: any) => {
      this.invoices = data;
    })

    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
    this.loadInvoices();

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
    { label: 'Не отправлено', value: 0, id: 0 },
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
        // this.invoices = response.data; // Assuming response is the invoice array
        this.productService.setActiveData(response.data)
      },
      (error) => {
        this.toastService.showError('Ошибка', 'Не удалось загрузить счета!');
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
        this.servicesContentService.deleteInvoice(invoiceId).subscribe(
          () => {
            this.productService.productsService = this.productService.productsService.filter((inv: any) => inv.id !== invoiceId);

            this.toastService.showSuccess('Удалено', 'Счет-фактура удалена!');
          },
          (error) => {
            console.error('Error deleting invoice', error);
            this.toastService.showError('Ошибка', 'Не удалось удалить счет-фактуру!');
          }
        );
      }
    });
  }

  verificationInvoice(invoiceId: any) {
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение отправки на проверку',
      message: 'Вы уверены, что хотите отправить фактуру?',
      acceptLabel: 'Отправить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.servicesContentService.sendingVerification(invoiceId).subscribe(
          () => {

            this.toastService.showSuccess('Отправка', 'Счет-фактура успешно отправлена');
          },
          (error) => {
            console.error('Error deleting invoice', error);
            this.toastService.showError('Ошибка', 'Не удалось отправить счет-фактуру');
          }
        );
      }
    });
  }

  selectInvoiceId: any;
  isEditInvoice: boolean = false;
  getInvoiceById(invoiceId: any, isEdit: boolean) {
    this.selectInvoiceId = invoiceId;
    this.isEditInvoice = isEdit;
  }


  dropdownVisible: { [key: string]: boolean } = {};

  toggleDropdown(productId: string) {
    Object.keys(this.dropdownVisible).forEach(id => {
      if (id !== productId) this.dropdownVisible[id] = false;
    });

    this.dropdownVisible[productId] = !this.dropdownVisible[productId];
  }


}
