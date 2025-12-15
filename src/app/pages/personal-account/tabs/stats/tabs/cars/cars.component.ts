import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { InvoicesService } from '../../../../components/invoices/invoices.service';
import { ProductsService } from '../../../../components/products/products.service';
import { CarsService } from './cars.service';
import { columns, oldTotalInfoColumn, totalInfoColumn, viewDataColumns } from './config';
import { FormatingDataService } from '../../../../../../services/formating-data.service';

@Component({
  selector: 'app-cars',
  providers: [],
  imports: [CommonModule, TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule
  ],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.scss'
})
export class CarsComponent implements OnInit {
  endpoint: string = 'api/Director/AnalyticsTransport';
  columns: any = columns;
  totalInfoColumn = totalInfoColumn;
  oldTotalInfoColumn = oldTotalInfoColumn;
  viewDataColumns: any = viewDataColumns;
  @Input() actions: { label: string, action: string }[] = [];
  @Input() productService!: any;
  @Input() selectedComponent: string = '';

  constructor(private invoicesService: InvoicesService,
    public productsServ: CarsService,
    public formatingDataService: FormatingDataService,
    private cdr: ChangeDetectorRef
  ) { }

  // Функция для проверки видимости группы
  isGroupVisible(group: any): boolean {
    return group.visible && group.columns.some((col: any) => this.isColumnVisible(col));
  }

  // Функция для проверки видимости колонки
  isColumnVisible(col: any): boolean {
    return col.visible;
  }

  selectedProduct: any;
  selectedColumns: string[] = [];
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLElement>;


  scrollToTop() {
    if (this.tableContainer && this.tableContainer.nativeElement) {
      this.tableContainer.nativeElement.scrollTop = 0;
    }
  }

  loadProducts(reset = false) {
    if (reset) {
      this.productsServ.currentPage = 0;
      this.productsServ.currentPage = 0
      this.selectedProduct = [];
    }

    if (this.productsServ.loading) return;

    this.productsServ.loading = true;

    this.productsServ.getProductsByCounterparty(
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
        if (response.documentMetadataTaxInclude && response.documentMetadataTaxInclude.data) {
          newInvoices = response.documentMetadataTaxInclude.data.map(mapInvoice);
        } else if (response.data) {
          newInvoices = response.data.map(mapInvoice);
        } ``

        if (response.totalInfoTaxInclude && response.totalInfoTaxInclude?.totalPagesCount) {
          this.productsServ.totalRecords = response.totalInfoTaxInclude?.totalPagesCount * this.productsServ.pageSize;
        }

        this.oldTotalInfoColumn = response.totalInfo;
        console.log('this.oldTotalInfoColumn ',this.oldTotalInfoColumn)
        this.cdr.detectChanges();
        if (reset || this.productsServ.currentPage === 0) {
          this.productsServ.products = newInvoices;
        } else {
          this.productsServ.products = [...this.productsServ.products, ...newInvoices];
        }
        this.productsServ.totalInfo = response.totalInfoTaxInclude;
        this.invoicesService.totalInfo = response.totalInfoTaxInclude;
        this
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
    this.productsServ.endpoint = this.endpoint;
    this.productsServ.products = [];
    this.productsServ.period$.subscribe(period => {
      this.loadProducts(true);
    });

    if (!this.productsServ.queryData.filters) {
      this.productsServ.queryData.filters = [];
    }

    this.productsServ.defaultFilters.forEach(filter => {
      const exists = this.productsServ.queryData.filters?.some(f =>
        f.field === filter.field
      );
      if (!exists) {
        if (!this.productsServ.queryData.filters) {
          this.productsServ.queryData.filters = [];
        }
        this.productsServ.queryData.filters.push(filter);
      }
    });

    this.loadProducts()
    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();

  }

  updateColumnVisibility() {
    this.columns.forEach((col: any) => {
      col.visible = this.selectedColumns.includes(col.field);
    });
  }


  getTotalValue(columnIndex: number): string | null {
    if (!this.invoicesService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.invoicesService.totalInfo?.[column.value] ?? 0 : null;

    if (value === null) return null;

    if (typeof value === 'number') {
      return value.toFixed(2).replace('.', ',');
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return numericValue.toFixed(2).replace('.', ',');
    }

    return value;
  }



  getOldTotalValue(columnIndex: number): string | null {
    if (!this.oldTotalInfoColumn) return null;

    const column = this.oldTotalInfoColumn.find((col: any) => col.columnNum === columnIndex);

    if (!column) return null;
    const value = column.value as any;

    if (value === null || value === undefined) return null;
    const numValue = Number(value);

    if (!isNaN(numValue) && typeof value !== 'boolean') {
      return numValue.toFixed(2).replace('.', ',');
    }
    return String(value);
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

  formatisNumber(value: any): string {
    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(',', '.'))
      : Number(value);

    if (isNaN(numericValue)) return '0';

    if (Number.isInteger(numericValue)) {
      return numericValue.toString();
    } else {
      const formatted = numericValue.toFixed(2);
      return formatted.endsWith('.00')
        ? formatted.replace('.00', '')
        : formatted.replace('.', ',');
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

}
