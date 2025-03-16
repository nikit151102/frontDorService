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
import { InvoicesFormComponent } from './invoices-form/invoices.component';
import { ConfirmPopupService } from '../../../../components/confirm-popup/confirm-popup.service';
import { InvoicesContentService } from '../../tabs/partners/invoices-content/invoices-content.service';
import { InvoicesService } from './invoices.service';
import { ButtonConfig, BUTTON_SETS } from './button-config';
import { JwtService } from '../../../../services/jwt.service';

@Component({
  selector: 'app-invoices',
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
    InvoicesFormComponent
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnChanges, OnInit {
  @Input() counterpartyId!: any;
  @Input() endpoint: any;
  @Input() columns: any;
  @Input() totalInfoColumn: any;
  buttonConfigs: Record<string, ButtonConfig[]> = BUTTON_SETS;

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
  currentRole: any;
  
  constructor(private invoiceService: InvoicesContentService,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    public productsService: ProductsService,
    private invoicesService: InvoicesService,
    private jwtService: JwtService) { }

  ngOnInit() {
    this.currentRole = this.jwtService.getDecodedToken().email; // 1- "Снабженец" 2- "Механик"  3-"Директор"
   
    this.invoicesService.activData$.subscribe((data: any) => {
      this.invoices = data;
    })

    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
    this.loadInvoices();

  }

  getButtonSet(): ButtonConfig[] {
    switch (this.currentRole) {
      case "Снабженец": 
        return this.buttonConfigs['supplier'];
      case "Механик": 
        return this.buttonConfigs['mechanic'];
      case "Директор": 
        return this.buttonConfigs['director'];
      default: 
        return this.buttonConfigs['default'];
    }
  }
  
  [key: string]: any;
  handleButtonClick(button: ButtonConfig, product: any) {
    if (button.action && typeof this[button.action] === 'function') {
      if (button.titlePopUp || button.messagePopUp || button.status !== undefined) {
        this[button.action](product, button.status, button.titlePopUp, button.messagePopUp);
      } else {
        this[button.action](product);
      }
    } else {
      console.error(`Action method '${button.action}' not found.`);
    }
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


  // onActionClick(actionName: string, product: any) {
  //   if (this.invoicesService && typeof this.productService[actionName] === 'function') {
  //     this.productService[actionName](product);
  //   } else {
  //     console.error(`Method ${actionName} does not exist on ProductsService`);
  //   }
  // }


  updateInvoice(invoice: any) {
    this.selectInvoice = invoice;
  }

  loadInvoices() {
    this.productsService.getProductsByCounterparty(this.counterpartyId).subscribe(
      (response) => {
        console.log('response', response)
        // this.invoices = response.data; // Assuming response is the invoice array
        this.invoicesService.setActiveData(response.data)
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
            this.invoicesService.setActiveData(this.invoicesService.getActiveData().productsService.filter((inv: any) => inv.id !== invoiceId))

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

  verificationInvoice(invoice: any, status: any, titlePopUp: any, messagePopUp: any) {
    this.confirmPopupService.openConfirmDialog({
      title: titlePopUp,
      message: messagePopUp,
      acceptLabel: 'Отправить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.invoiceService.sendingVerification(invoice, status).subscribe(
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
