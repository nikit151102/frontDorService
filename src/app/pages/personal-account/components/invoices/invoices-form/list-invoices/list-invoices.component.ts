import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-invoices.component.html',
  styleUrl: './list-invoices.component.scss'
})
export class ListInvoicesComponent implements OnInit {

  @Output() itemSelected = new EventEmitter<any>();

  selectedName: string = '';

  @Input() drafts: any[] = [];
  // @Input() sumAmountDelta: any;
  sumAmountDelta: any = 124;

  constructor() { }

  decodedRole: any[] = [];

  ngOnInit(): void { }

  select(item: any): void {
    this.selectedName = item.name;
    this.itemSelected.emit(item);
  }

  getFormattedDelta(): string {
    const delta = parseFloat(this.sumAmountDelta?.toString().replace(',', '.') || '0');
  
    if (delta > 0) {
      return `Остаток: ${delta.toFixed(2)} ₽`;
    } else {
      return 'Полностью оплачено';
    }
  }

  statuses = [
    { label: 'Черновик', value: 0, id: 0 },
    { label: 'Проверка Механик', value: 1, id: 1 },
    { label: 'Проверка Директор', value: 2, id: 2 },
    { label: 'Отклонено Механик', value: 3, id: 3 },
    { label: 'Отклонено Директор', value: 4, id: 4 },
    { label: 'Подписано', value: 5, id: 5 },
    { label: 'Удалено', value: 6, id: 6 },
    { label: 'Проведено', value: 7, id: 7 }
  ];

  getStatusLabel(value: number): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }

  getStatusClass(value: number): string {
    switch (value) {
      case 0: return 'status-not-checked';
      case 1:
      case 2: return 'status-sent-for-check';
      case 3:
      case 4: return 'status-rejected';
      case 5: return 'status-approved';
      case 6: return 'status-deleted';
      case 7: return 'status-completed';
      default: return '';
    }
  }
}
