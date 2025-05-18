import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductsService } from './products.service';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../components/fields/date-filter/date-filter.component';
import { SearchFilterSortComponent } from '../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { NumberFilterComponent } from '../../../../components/fields/number-filter/number-filter.component';
import { UuidSearchFilterSortComponent } from '../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { InvoicesFormComponent } from '../invoices/invoices-form/invoices.component';
import { InvoicesService } from '../invoices/invoices.service';

@Component({
  selector: 'app-products',
  providers: [ProductsService],
  imports: [CommonModule, TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent implements OnChanges, OnInit {
  @Input() counterpartyId!: any;
  @Input() endpoint: any;
  @Input() columns: any;
  @Input() totalInfoColumn: any;
  @Input() actions: { label: string, action: string }[] = []; // изменено на строку (название метода)
  @Input() productService!: any;
  @Input() productsServ: any
  @Input() selectedComponent: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyId']) {
      this.productsServ.counterpartyId = this.counterpartyId;
      this.productsServ.endpoint = this.endpoint;

      if (changes['selectedComponent']) {
        this.loadProducts(true);
      }

      if (this.productsServ) {
        this.loadProducts();
      }
    }
  }

  selectedProduct: any;
  selectedColumns: string[] = [];



  loadProducts(reset = false) {
    if (reset) {
      this.productsServ.currentPage = 0;
      this.productsServ.currentPage = 0
      this.selectedProduct = [];
    }

    if (this.productsServ.loading) return;

    this.productsServ.loading = true;

    this.productsServ.getProductsByCounterparty(
      this.counterpartyId,
      this.productsServ.currentPage,
      this.productsServ.pageSize
    ).subscribe(
      (response: any) => {
        const mapInvoice = (invoice: any) => {
          const transformed = {
            ...invoice,
            expenseSum: invoice.expenseSum?.toString().replace('.', ','),
            incomeSum: invoice.incomeSum?.toString().replace('.', ',')
          };

          return transformed;
        };

        let newInvoices = [];
        if (response.documentMetadata && response.documentMetadata.data) {
          newInvoices = response.documentMetadata.data.map(mapInvoice);
        } else if (response.data) {
          newInvoices = response.data.map(mapInvoice);
        } ``

        if (response.totalInfo && response.totalInfo?.totalPagesCount) {
          this.productsServ.totalRecords = response.totalInfo?.totalPagesCount * this.productsServ.pageSize;
        }

        if (reset || this.productsServ.currentPage === 0) {
          this.productsServ.products = newInvoices;
        } else {
          this.productsServ.products = [...this.productsServ.products, ...newInvoices];
        }
        this.productsServ.totalInfo = response.totalInfo;
        this.invoicesService.totalInfo = response.totalInfo;
        this.productsServ.totalPages = response.totalPages;
        this.productsServ.currentPage++;
        this.productsServ.loading = false;
      },
      (error: any) => {
        this.productsServ.loading = false;
      }
    );
  }


  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom && this.productsServ.totalPages && this.productsServ.currentPage < this.productsServ.totalPages) {
      this.loadProducts();
    }
  }


  ngOnInit() {
    this.selectedColumns = this.columns.map((col: any) => col.field);
    console.log('this.columns', this.columns)
    this.updateColumnVisibility();

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
    if (!this.productsServ.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.productsServ.totalInfo?.[column.value] ?? 0 : null;

    return typeof value === 'number' ? value.toString().replace('.', ',') : value;
  }

  statuses = [
    { label: 'Черновик', value: 0, id: 0 },
    { label: 'Проверка Механик', value: 1, id: 1 },
    { label: 'Проверка Директор', value: 2, id: 2 },
    { label: 'Отклонено Механик', value: 3, id: 3 },
    { label: 'Отклонено Директор', value: 4, id: 4 },
    { label: 'Подписано', value: 5, id: 5 },
    { label: 'Удалено', value: 6, id: 6 },
    { label: 'Проведено', value: 7, id: 7 }
  ];
  getStatusClass(value: number): string {
    switch (value) {
      case 0: return 'status-not-checked';
      case 1:
      case 2: return 'status-sent-for-check';
      case 3:
      case 4: return 'status-rejected';
      case 5: return 'status-approved';
      case 6: return 'status-deleted';
      case 7: return 'status-completed';
      default: return '';
    }
  }

  constructor(private invoicesService:InvoicesService) { }


  getStatusLabel(value: number): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }



  onActionClick(actionName: string, product: any) {
    if (this.productService && typeof this.productService[actionName] === 'function') {
      this.productService[actionName](product);
    } else {
      console.error(`Method ${actionName} does not exist on ProductsService`);
    }
  }


  isEditInvoice: boolean = false;
  selectInvoiceId: string = '';

  onRowDblClick(event: MouseEvent, product: any, field: string) {

    if (field == 'docInvoice') {
      console.log('field', field)
      this.isEditInvoice = false;
      this.selectInvoiceId = product.docInvoiceId;
    }
  }



  dropdownVisible: { [key: string]: boolean } = {};

  toggleDropdown(productId: string) {
    Object.keys(this.dropdownVisible).forEach(id => {
      if (id !== productId) this.dropdownVisible[id] = false;
    });

    this.dropdownVisible[productId] = !this.dropdownVisible[productId];
  }


  verificationInvoice(id: string, status: number) { }

}
