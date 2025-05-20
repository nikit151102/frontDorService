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
  @Input() filterField: string = '';
  selectedFilter: string = '';
  selectedDate: string = '';
  dateValue: string = '';
  startDate: string = '';
  endDate: string = '';
  showCalendar: boolean = false;
  isFilterOpen: boolean = false;
  isTest: boolean = false

  sortOrder: 'asc' | 'desc' = 'asc';

  @Output() filterChange = new EventEmitter<FilterDto>();
  @Output() sortChange = new EventEmitter<SortDto>();

  constructor(private elementRef: ElementRef) { }

  visibleModal() {
    this.isTest = !this.isTest;
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
    this.selectedDate = '';
    this.dateValue = '';
    this.startDate = '';
    this.endDate = '';
    this.showCalendar = true;
  }

  onDateChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: [],
      type: this.getDateFilterType()
    };

    if (this.selectedFilter === 'Между датами') {
      if (this.startDate && this.endDate) {
        filterDto.values = [
          this.convertToDate(this.startDate)?.toISOString(),
          this.convertToDate(this.endDate)?.toISOString()
        ].filter(v => v !== undefined);
      }
    } else if (this.dateValue) {
      const isoDate = this.convertToDate(this.dateValue)?.toISOString();
      if (isoDate) {
        filterDto.values = [isoDate];
      }
    }

    this.filterChange.emit(filterDto);
    this.selectedDate = this.formatDateDisplay();
  }

  private convertToDate(dateString: string): Date | null {
    if (!dateString) return null;
    try {
      return new Date(dateString);
    } catch (e) {
      console.error('Error converting string to Date', e);
      return null;
    }
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

  private formatDateDisplay(): string {
    if (this.selectedFilter === 'Между датами') {
      return this.startDate && this.endDate
        ? `${this.formatDateString(this.startDate)} - ${this.formatDateString(this.endDate)}`
        : '';
    }
    return this.dateValue ? this.formatDateString(this.dateValue) : '';
  }

  private formatDateString(dateString: string): string {
    const date = this.convertToDate(dateString);
    return date ? date.toLocaleDateString() : dateString;
  }

  emitFilterChange() {
    const filterDto: FilterDto = {
      field: this.filterField,
      values: this.selectedFilter === 'Между датами'
        ? [
          this.convertToDate(this.startDate)?.toISOString(),
          this.convertToDate(this.endDate)?.toISOString()
        ].filter(v => v !== undefined)
        : this.dateValue
          ? [this.convertToDate(this.dateValue)?.toISOString()].filter(v => v !== undefined)
          : [],
      type: this.getDateFilterType()
    };
    this.filterChange.emit(filterDto);
  }

  openDatePicker(input: HTMLInputElement) {
    input.showPicker();
  }

  resetFilter() {
    this.selectedFilter = '';
    this.selectedDate = '';
    this.dateValue = '';
    this.startDate = '';
    this.endDate = '';
    this.showCalendar = false;
    this.isTest = false;
    const filterDto: FilterDto = {
      field: this.filterField,
      values: [],
      type: this.getDateFilterType()
    };
    this.filterChange.emit(filterDto);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isTest = false;
    }
  }
}