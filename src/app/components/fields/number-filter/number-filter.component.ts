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
  selector: 'app-number-filter',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './number-filter.component.html',
  styleUrl: './number-filter.component.scss'
})
export class NumberFilterComponent {
  @Input() filterField: string = ''; // Название поля для фильтрации
  selectedFilter: string = '';  // Выбранный тип фильтра (например, "Равно")
  selectedNumber: string = '';  // Основное поле для отображения числа/диапазона
  numberValue: number = 0;      // Храним одно число (для "Равно", "Меньше", "Больше")
  startNumber: number = 0;      // Начало диапазона для "Между"
  endNumber: number = 0;        // Конец диапазона для "Между"
  showNumberInput: boolean = false; // Показать поля для ввода чисел
  isFilterOpen: boolean = false;
  isOpen: boolean = false
  sortOrder: 'asc' | 'desc' = 'asc'; // Направление сортировки

  @Output() filterChange = new EventEmitter<FilterDto>();
  @Output() sortChange = new EventEmitter<SortDto>();

  constructor(private elementRef: ElementRef) { }

  visibleModal() {
    this.isOpen = !this.isOpen;
  }

  toggleSort(type: 'asc' | 'desc') {
    this.sortOrder = type;
    const sortDto: SortDto = {
      field: this.filterField,
      sortType: this.sortOrder === 'asc' ? 0 : 1
    };
    this.sortChange.emit(sortDto);
  }


  onFilterChange(filter: string) {
    this.selectedFilter = filter;
    this.selectedNumber = '';
    this.numberValue = 0;
    this.startNumber = 0;
    this.endNumber = 0;
    this.showNumberInput = true;
    this.emitFilterChange();
  }

  onSearchChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: [Number(this.selectedNumber)],
      type: 2
    };

    this.filterChange.emit(filterDto);
  }

  onNumberChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: [],
      type: this.getNumberFilterType()
    };

    if (this.selectedFilter === 'Между') {
      filterDto.values = [this.startNumber, this.endNumber];
    } else {
      filterDto.values = [this.numberValue];
    }

    this.filterChange.emit(filterDto);
    this.selectedNumber = this.formatNumberDisplay();
  }

  getNumberFilterType(): number {
    switch (this.selectedFilter) {
      case 'Равно': return 2;
      case 'Меньше': return 3;
      case 'Больше': return 4;
      case 'Между': return 5;
      default: return 2;
    }
  }

  formatNumberDisplay(): string {
    if (this.selectedFilter === 'Между') {
      return `${this.startNumber} - ${this.endNumber}`;
    }
    return this.numberValue.toString();
  }

  emitFilterChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: this.selectedFilter === 'Между' ? [this.startNumber, this.endNumber] : [this.numberValue],
      type: this.getNumberFilterType()
    };
    this.filterChange.emit(filterDto);
  }

  openNumberPicker(input: HTMLInputElement) {
    // You can add logic to open number picker if needed
    input.focus();
  }

  resetFilter() {
    // Сбрасываем все значения фильтра
    this.selectedFilter = ''; // Сбрасываем выбранный фильтр
    this.selectedNumber = '';  // Сбрасываем отображаемое число/диапазон
    this.numberValue = 0;      // Сбрасываем число
    this.startNumber = 0;      // Сбрасываем начало диапазона
    this.endNumber = 0;        // Сбрасываем конец диапазона
    this.showNumberInput = false; // Скрываем поля ввода
    this.isOpen = false;
    this.emitFilterChange();   // Эмитируем сброс фильтра
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }


}