import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { AdditionalDataService } from './additional-data.service';

@Component({
  selector: 'app-additional-data',
  providers: [AdditionalDataService],
  imports: [CommonModule, TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule],
  templateUrl: './additional-data.component.html',
  styleUrl: './additional-data.component.scss'
})
export class AdditionalDataComponent implements OnChanges, OnInit {
  @Input() config: any;
  endpoint: any;
  columns: any;
  totalInfoColumn: any;
  @Input() actions: { label: string, action: string }[] = []; 
  @Input() productService!: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.additionalDataService.endpoint = this.config.endpoint;
      this.endpoint = this.config.endpoint;
      this.columns = this.config.columns;
      this.totalInfoColumn = this.config.totalInfoColumn;
      this.additionalDataService.queryData.filters = [this.config.defaultFilter]
      this.additionalDataService.defaultFilters = this.config.defaultFilter;
      console.log('this.config.defaultFilter',this.config.defaultFilter)
      this.additionalDataService.loadProducts();
    }
  }

  selectedProduct: any;
  selectedColumns: string[] = [];

  ngOnInit() {
    this.additionalDataService.endpoint = this.config.endpoint;
    this.endpoint = this.config.endpoint;
    this.columns = this.config.columns;
    this.totalInfoColumn = this.config.totalInfoColumn;
    console.log('this.config.defaultFilter',this.config.defaultFilter)
    this.additionalDataService.queryData.filters = [this.config.defaultFilter]
    this.additionalDataService.defaultFilters = this.config.defaultFilter;
    this.additionalDataService.loadProducts();
    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
  }

  updateColumnVisibility() {
    this.columns.forEach((col:any) => {
      col.visible = this.selectedColumns.includes(col.field);
    });
  }

  isColumnVisible(column: any): boolean {
    return column.visible;
  }


  getTotalValue(columnIndex: number): any {
    if (!this.additionalDataService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col:any) => col.columnNum === columnIndex);
    const value = column ? this.additionalDataService.totalInfo?.[column.value] ?? 0 : null;

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

  private paymentTypes = [
    { label: 'Нал', value: 0 },
    { label: 'НДС', value: 1 },
    { label: 'Без НДС', value: 2 }
  ];

  transformPaymentTypes(value: number): string {
    const found = this.paymentTypes.find(pt => pt.value === value);
    return found ? found.label : '';
  }

  constructor(public additionalDataService: AdditionalDataService) { }


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


  isEditInvoice:boolean = false;
  selectInvoiceId: string = '';

  onRowDblClick(event: MouseEvent, product: any, field: string) {

    if (field == 'docInvoice') {
      console.log('field',field)
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
  

  verificationInvoice(id:string, status:number){}
  
}
