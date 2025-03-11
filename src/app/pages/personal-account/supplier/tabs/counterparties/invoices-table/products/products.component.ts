import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, OnInit, EventEmitter, Output } from '@angular/core';
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
  @Input() endpoint: any;
  @Input() columns: any;
  @Input() totalInfoColumn: any;
  @Input() actions: { label: string, action: (product: any) => void }[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyId']) {
      this.productsService.counterpartyId = this.counterpartyId;
      this.productsService.endpoint = this.endpoint;
      this.productsService.loadProducts();
    }
  }

  selectedProduct: any;

  selectedColumns: string[] = [];

  ngOnInit() {
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
    if (!this.productsService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col:any) => col.columnNum === columnIndex);
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

  constructor(public productsService: ProductsService) { }


  getStatusLabel(value: number): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }
  
}
