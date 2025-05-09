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

@Component({
  selector: 'app-products',
  providers: [ProductsService],
  imports: [CommonModule, TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule,
    InvoicesFormComponent
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyId']) {
      this.productsService.counterpartyId = this.counterpartyId;
      this.productsService.endpoint = this.endpoint;
      this.loadProducts();
    }
  }

  selectedProduct: any;
  selectedColumns: string[] = [];



  loadProducts(reset = false) {
    if (reset) {
      this.productsService.currentPage = 0;
      this.productsService.currentPage = 0
      this.selectedProduct = [];
    }

    if (this.productsService.loading) return;

    this.productsService.loading = true;

    this.productsService.getProductsByCounterparty(
      this.counterpartyId,
      this.productsService.currentPage,
      this.productsService.pageSize
    ).subscribe(
      (response) => {
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
        }``

        if (response.totalInfo && response.totalInfo?.totalPagesCount) {
          this.productsService.totalRecords = response.totalInfo?.totalPagesCount * this.productsService.pageSize;
        }

        if (reset || this.productsService.currentPage === 0) {
          this.selectedProduct = newInvoices;
        } else {
          this.selectedProduct = [...this.selectedProduct, ...newInvoices];
        }

        this.productsService.totalPages = response.totalPages;
        this.productsService.currentPage++;
        this.productsService.currentPage++
        this.productsService.loading = false;
      },
      (error) => {
        this.productsService.loading = false;
      }
    );
  }


  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom && this.productsService.totalPages && this.productsService.currentPage < this.productsService.totalPages) {
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
    if (!this.productsService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.productsService.totalInfo?.[column.value] ?? 0 : null;

    return typeof value === 'number' ? value.toString().replace('.', ',') : value;
  }

  statuses = [
    { label: 'Не отправлено', value: 0 },
    { label: 'Проверка Механик', value: 1 },
    { label: 'Проверка Директор', value: 2 },
    { label: 'Отклонено Механик', value: 3 },
    { label: 'Отклонено Директор', value: 4 },
    { label: 'Подписано', value: 5 },
    { label: 'Удалено', value: 6 }
  ];

  constructor(public productsService: ProductsService) { }


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
