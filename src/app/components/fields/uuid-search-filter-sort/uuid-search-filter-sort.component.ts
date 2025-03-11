import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UuidSearchFilterSortService } from './uuid-search-filter-sort.service';

interface FilterDto {
  field?: string;
  values?: any[]; // Используем `any`, так как тип данных может варьироваться
  type?: number; // 0 - string, 1 - int, 2 - DateTime, 3 - Guid
}

interface SortDto {
  field?: string;
  sortType: number; // 0 - прямой, 1 - обратный
}

@Component({
  selector: 'app-uuid-search-filter-sort',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uuid-search-filter-sort.component.html',
  styleUrl: './uuid-search-filter-sort.component.scss'
})
export class UuidSearchFilterSortComponent {
  @Input() filterField: string = ''; // Название поля для фильтрации
  @Input() filterType: number = 0; // Тип фильтрации (0 - string, 1 - int и т.д.)
  @Input() apiEndpoint: string = ''; // Эндпоинт для запроса
  @Input() fieldNames: string[] = []; // Массив полей для отображения в выпадающем списке
  @Input() Field: string = ''; 
  @Input() enam: any;
  searchTerm: string = '';
  selectedFilters: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  isFilterOpen = false;

  @Output() filterChange = new EventEmitter<FilterDto>();
  @Output() sortChange = new EventEmitter<SortDto>();

  products: any[] = [];
  endpointDataLoaded = false;

  constructor(private uuidSearchFilterSortService: UuidSearchFilterSortService) { }

  ngOnChanges() {
    if (this.apiEndpoint && !this.endpointDataLoaded && this.enam == null) {
      this.loadData();
    }
    if (this.enam != null) {
      this.products = this.enam;
      this.endpointDataLoaded = true;
    }
  }

  loadData() {
    this.uuidSearchFilterSortService.getProductsByEndpoint(this.apiEndpoint).subscribe(
      (data) => {
        this.products = data;
        this.endpointDataLoaded = true;
        console.log('Данные получены с эндпоинта:', this.products);
      },
      (error) => {
        console.error('Ошибка загрузки данных с эндпоинта:', error);
      }
    );
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onSearchChange() {
    const filterDto: FilterDto = {
      field: this.Field,
      values: this.searchTerm ? [this.searchTerm] : [],
      type: 0
    };
    this.filterChange.emit(filterDto);
  }

  onFilterChange(value: string) {
    const product = this.products.find(prod => this.formatProduct(prod) === value);

    if (!product) return;

    if (this.selectedFilters.includes(product.id)) {
      this.selectedFilters = this.selectedFilters.filter(id => id !== product.id);
    } else {
      this.selectedFilters.push(product.id);
    }

    const filterDto: FilterDto = {
      field: this.Field,
      values: this.selectedFilters,
      type: this.filterType
    };

    this.filterChange.emit(filterDto);
  }

  formatProduct(product: any): string {
    return this.fieldNames
      .map(field => (product[field] !== undefined ? product[field] : field)) // Если это поле, берём его значение, иначе оставляем как есть
      .join(' ');
  }


  // Получаем список уникальных значений для выпадающего списка
  get uniqueFilterValues(): { id: string, text: string }[] {
    const valuesMap = new Map<string, string>();

    this.products.forEach(product => {
      const text = this.formatProduct(product);
      valuesMap.set(product.id, text);
    });

    return Array.from(valuesMap, ([id, text]) => ({ id, text }));
  }


  toggleSort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    const sortDto: SortDto = {
      field: this.Field,
      sortType: this.sortOrder === 'asc' ? 0 : 1
    };

    this.sortChange.emit(sortDto);
  }

  getDisplayText(field: string): string {
    // Функция для формирования строки для отображения на основе полей
    return field.split(',').join(' ');
  }
}