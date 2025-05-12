import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

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
  selector: 'app-search-filter-sort',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './search-filter-sort.component.html',
  styleUrl: './search-filter-sort.component.scss'
})
export class SearchFilterSortComponent {
  @Input() filterField: string = ''; // Название поля для фильтрации
  @Input() filterType: number = 0; // Тип фильтрации (0 - string, 1 - int и т.д.)
  @Input() isVisibleFilter: boolean = true;
  searchTerm: string = '';
  selectedFilters: any[] = []; // Используем any, так как фильтры могут быть разных типов
  sortOrder: 'asc' | 'desc' = 'asc';
  isOpen: boolean = false


  @Output() filterChange = new EventEmitter<FilterDto>();
  @Output() sortChange = new EventEmitter<SortDto>();

  constructor(private elementRef: ElementRef) { }

  visibleModal() {
    this.isOpen = !this.isOpen;
  }

  inputWidth: string = '30px';
  bgColor: string = 'transparent';
  borderStyle: string = 'none';
  isSearchOpen: boolean = false;


  onSearchChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: this.searchTerm ? [this.searchTerm] : [],
      type: 0
    };
    this.filterChange.emit(filterDto);
  }

  onFilterChange(value: any) {
    if (this.selectedFilters.includes(value)) {
      this.selectedFilters = this.selectedFilters.filter(f => f !== value);
    } else {
      this.selectedFilters.push(value);
    }

    const filterDto: FilterDto = {
      field: this.filterField,
      values: this.selectedFilters,
      type: this.filterType
    };

    this.filterChange.emit(filterDto);
  }

  toggleSort(type: 'asc' | 'desc') {
    this.sortOrder = type;
    const sortDto: SortDto = {
      field: this.filterField,
      sortType: this.sortOrder === 'asc' ? 0 : 1
    };
    this.sortChange.emit(sortDto);
  }


  resetFilter() {
    this.selectedFilters = []; // Очищаем выбранные фильтры
    const filterDto: FilterDto = {
      field: this.filterField,
      values: [],
      type: this.filterType
    };
    this.filterChange.emit(filterDto);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

}
