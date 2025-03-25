import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
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

  constructor(private elementRef: ElementRef){}
  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }
  inputWidth: string = '30px';
  bgColor: string = 'transparent';
  borderStyle: string = 'none';
  isSearchOpen: boolean = false;
  
  toggleSearch(isFocused: boolean) {
    if (isFocused) {
      this.inputWidth = '200px';
      this.bgColor = '#ffffff';
      this.borderStyle = '1px solid #007BFF';
      this.isSearchOpen = true;
    } else {
      setTimeout(() => {  // Добавляем небольшую задержку, чтобы не схлопывалось резко
        this.inputWidth = '30px';
        this.bgColor = 'transparent';
        this.borderStyle = 'none';
        this.isSearchOpen = false;
      }, 200);
    }
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

  resetFilter() {
    this.selectedFilter = ''; // Сбрасываем выбранный фильтр
    this.selectedDate = '';    // Сбрасываем выбранную дату
    this.dateValue = '';       // Сбрасываем значение даты
    this.startDate = '';       // Сбрасываем начальную дату диапазона
    this.endDate = '';         // Сбрасываем конечную дату диапазона
    this.showCalendar = false; // Скрываем календарь
    this.emitFilterChange();   // Эмитируем изменение фильтра (передаем пустой фильтр)
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.inputWidth != '30px') {
      this.isFilterOpen = false;
      this.inputWidth = '30px';
      this.bgColor = 'transparent';
      this.borderStyle = 'none';
      this.isSearchOpen = false;
    }
  }
  

}