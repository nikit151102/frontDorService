import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface FilterDto {
  field?: string;
  values?: any[];
  type?: number;
}

interface SortDto {
  field?: string;
  sortType: number; // 0 - прямой, 1 - обратный
}

@Component({
  selector: 'app-date-filter',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss'
})
export class DateFilterSortComponent {
  @Input() filterField: string = ''; // Название поля для фильтрации
  selectedFilter: string = '';  // Выбранный тип фильтра (например, "Равно")
  selectedDate: string = '';    // Основное поле для отображения даты/диапазона
  dateValue: string = '';       // Храним одну дату (для "Равно", "До даты", "После даты")
  startDate: string = '';       // Начало диапазона для "Между датами"
  endDate: string = '';         // Конец диапазона для "Между датами"
  showCalendar: boolean = false; // Показать календарь
  isFilterOpen: boolean = false;

  sortOrder: 'asc' | 'desc' = 'asc'; // Направление сортировки

  @Output() filterChange = new EventEmitter<FilterDto>();
  @Output() sortChange = new EventEmitter<SortDto>();

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  toggleSort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    const sortDto: SortDto = {
      field: this.filterField,
      sortType: this.sortOrder === 'asc' ? 0 : 1
    };
    this.sortChange.emit(sortDto);
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.selectedDate = '';
    this.dateValue = '';
    this.startDate = '';
    this.endDate = '';
    this.showCalendar = true;
    // this.emitFilterChange();
  }

  onDateChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: [],
      type: this.getDateFilterType()
    };

    if (this.selectedFilter === 'Между датами') {
      filterDto.values = [this.startDate, this.endDate];
    } else {
      filterDto.values = [this.dateValue];
    }

    this.filterChange.emit(filterDto);
    this.selectedDate = this.formatDateDisplay();
  }

  getDateFilterType(): number {
    switch (this.selectedFilter) {
      case 'Равно': return 6;
      case 'До даты': return 7;
      case 'После даты': return 8;
      case 'Между датами': return 9;
      default: return 6;
    }
  }

  formatDateDisplay(): string {
    if (this.selectedFilter === 'Между датами') {
      return `${this.startDate} - ${this.endDate}`;
    }
    return this.dateValue;
  }

  emitFilterChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: this.selectedFilter === 'Между датами' ? [this.startDate, this.endDate] : [this.dateValue],
      type: this.getDateFilterType()
    };
    this.filterChange.emit(filterDto);
  }

  openDatePicker(input: HTMLInputElement) {
    input.showPicker();
  }

}