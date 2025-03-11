import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../../../../components/fields/date-filter/date-filter.component';
import { SearchFilterSortComponent } from '../../../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { NumberFilterComponent } from '../../../../../../../components/fields/number-filter/number-filter.component';
import { UuidSearchFilterSortComponent } from '../../../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';

@Component({
  selector: 'app-products',
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

  selectedProduct: any;

  columns = [
    { field: 'productTarget.name', header: 'Назначение', type: 'uuid', visible: true, width: '200px' },
    { field: 'name', header: 'Товар', type: 'string', visible: true, width: '300px' },
    { field: 'quantity', header: 'Количество', type: 'number', visible: true, width: '300px' },
    { field: 'measurementUnit.shortName', header: 'Ед.изм', type: 'number', visible: true, width: '300px' },
    { field: 'amount', header: 'Сумма', type: 'number', visible: true, width: '300px' },
    { field: 'docInvoice', header: 'Номер фактуры', type: 'string', visible: true, width: '300px' },
    { field: 'dateTime', header: 'Дата фактуры', type: 'date', visible: true, width: '300px' },
    { field: 'docInvoiceStatus', header: 'Статус фактуры', type: 'enam', visible: true, width: '300px' }
  ];

  selectedColumns: string[] = [];  

  ngOnInit() {
    this.selectedColumns = this.columns.map(col => col.field);
    this.updateColumnVisibility(); 
  }

  updateColumnVisibility() {
    this.columns.forEach(col => {
      col.visible = this.selectedColumns.includes(col.field);
    });
  }

  isColumnVisible(column: any): boolean {
    return column.visible;
  }


  totalInfoColumn = [
    { columnNum: 2, value: 'totalExpenseSum' },
    { columnNum: 4, value: 'totalIncomeSum' }
  ];

  getTotalValue(columnIndex: number): any {
    if (!this.productsService.totalInfo) return null;

    const column = this.totalInfoColumn.find(col => col.columnNum === columnIndex);
    return column ? this.productsService.totalInfo?.[column.value] ?? 0 : null;
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

  constructor(public productsService: ProductsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyId']) {
      this.productsService.counterpartyId = this.counterpartyId;
      this.productsService.loadProducts();
    }
  }



  getStatusLabel(value: number): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }
}
