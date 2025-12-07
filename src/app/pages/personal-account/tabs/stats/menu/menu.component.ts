import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { DirectorService } from '../director.service';
import { FormsModule } from '@angular/forms';

export interface Period {
  startDate: Date;
  endDate: Date;
  type: 'year' | 'quarter' | 'month';
  year: number;
  quarter?: number;
  month?: number;
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  @Output() selectTab = new EventEmitter<any>();
  selectedName: string = '';
  items: any[] = [
    { code: '349143', name: 'Машины', access: '', managerDocType: 0, navigate: ['cars'] },
    // { code: '349143', name: 'Битум', access: '', managerDocType: 0, navigate: ['bitumen'] },
    // { code: '810632', name: 'Ячейки', access: '', managerDocType: 2, navigate: ['cells'] },
  ];

  constructor(private jwtService: JwtService, private directorService: DirectorService) {
    // Устанавливаем текущий год по умолчанию
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
  }

  decodedRole: any[] = [];
  isVisible = true;

  toggleVisibility() {
    this.directorService.setSomeVariable(!this.isVisible);
  }


  ngOnInit(): void {
    this.generateYears();
    this.updatePeriod();
    this.directorService.someVariable$.subscribe((value: any) => {
      this.isVisible = value
    })

    const decodedToken = this.jwtService.getDecodedToken();

    if (decodedToken && decodedToken.role) {
      if (Array.isArray(decodedToken.role)) {
        this.decodedRole = decodedToken.role;
      } else {
        console.error('Ошибка: role не массив!', decodedToken.role);
      }
    } else {
      console.error('Ошибка: Токен не содержит role!', decodedToken);
    }

  }

  hasAccess(access: string): boolean {
    return !access || this.decodedRole.includes(access);
  }

  select(item: any): void {
    this.selectedName = item.name;
    this.selectTab.emit(item);
  }

  @Output() periodChanged = new EventEmitter<Period>();

  // Доступные годы (например, последние 10 лет)
  years: number[] = [];

  // Данные для месяцев
  months = [
    { value: 1, label: 'Январь' },
    { value: 2, label: 'Февраль' },
    { value: 3, label: 'Март' },
    { value: 4, label: 'Апрель' },
    { value: 5, label: 'Май' },
    { value: 6, label: 'Июнь' },
    { value: 7, label: 'Июль' },
    { value: 8, label: 'Август' },
    { value: 9, label: 'Сентябрь' },
    { value: 10, label: 'Октябрь' },
    { value: 11, label: 'Ноябрь' },
    { value: 12, label: 'Декабрь' }
  ];

  // Данные для кварталов
  quarters = [
    { value: 1, label: '1 квартал (Янв-Мар)' },
    { value: 2, label: '2 квартал (Апр-Июн)' },
    { value: 3, label: '3 квартал (Июл-Сен)' },
    { value: 4, label: '4 квартал (Окт-Дек)' }
  ];

  // Текущие значения
  selectedYear: number;
  selectedPeriodType: 'year' | 'quarter' | 'month' = 'year';
  selectedQuarter?: number;
  selectedMonth?: number;

  // Текущий период
  currentPeriod?: Period;


  // Генерация списка лет (текущий год и 9 предыдущих)
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push(currentYear - i);
    }
  }

  // Обработчики изменений
  onYearChange() {
    this.updatePeriod();
  }

  onPeriodTypeChange() {
    // Сбрасываем значения при смене типа периода
    if (this.selectedPeriodType !== 'quarter') {
      this.selectedQuarter = undefined;
    }
    if (this.selectedPeriodType !== 'month') {
      this.selectedMonth = undefined;
    }
    this.updatePeriod();
  }

  onQuarterChange() {
    this.updatePeriod();
  }

  onMonthChange() {
    this.updatePeriod();
  }

  // Обновление периода на основе выбранных значений
  updatePeriod() {
    let startDate: Date;
    let endDate: Date;

    switch (this.selectedPeriodType) {
      case 'year':
        // Весь год
        startDate = new Date(this.selectedYear, 0, 1);
        endDate = new Date(this.selectedYear, 11, 31, 23, 59, 59, 999);
        break;

      case 'quarter':
        if (!this.selectedQuarter) {
          this.selectedQuarter = 1;
        }
        // Определяем квартал
        const quarterStartMonth = (this.selectedQuarter - 1) * 3;
        startDate = new Date(this.selectedYear, quarterStartMonth, 1);

        // Конец квартала - последний день последнего месяца квартала
        const quarterEndMonth = quarterStartMonth + 2;
        endDate = new Date(this.selectedYear, quarterEndMonth + 1, 0, 23, 59, 59, 999);
        break;

      case 'month':
        if (!this.selectedMonth) {
          this.selectedMonth = 1;
        }
        // Конкретный месяц
        startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
        endDate = new Date(this.selectedYear, this.selectedMonth, 0, 23, 59, 59, 999);
        break;

      default:
        return;
    }

    // Создаем объект периода
    this.currentPeriod = {
      startDate,
      endDate,
      type: this.selectedPeriodType,
      year: this.selectedYear,
      quarter: this.selectedQuarter,
      month: this.selectedMonth
    };

    // Эмитируем событие
    this.periodChanged.emit(this.currentPeriod);
  }

  // Вспомогательные методы для отображения
  getPeriodTypeLabel(): string {
    switch (this.selectedPeriodType) {
      case 'year': return 'Год';
      case 'quarter': return 'Квартал';
      case 'month': return 'Месяц';
      default: return '';
    }
  }

  getPeriodDisplayString(): string {
    if (!this.currentPeriod) return '';

    switch (this.currentPeriod.type) {
      case 'year':
        return `Год ${this.currentPeriod.year}`;

      case 'quarter':
        const quarterLabel = this.quarters.find(q => q.value === this.currentPeriod?.quarter)?.label;
        return `${quarterLabel} ${this.currentPeriod.year}`;

      case 'month':
        const monthLabel = this.months.find(m => m.value === this.currentPeriod?.month)?.label;
        return `${monthLabel} ${this.currentPeriod.year}`;

      default:
        return '';
    }
  }

  // Метод для получения текущего периода (может быть использован родительским компонентом)
  getPeriod(): Period | undefined {
    return this.currentPeriod;
  }

}
