import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CounterpartiesListComponent } from './counterparties-list/counterparties-list.component';
import { ProductsComponent } from '../../../../../components/products/products.component';

@Component({
  selector: 'app-counterparties',
  imports: [CommonModule, ProductsComponent, CounterpartiesListComponent],
  templateUrl: './counterparties.component.html',
  styleUrl: './counterparties.component.scss'
})
export class CounterpartiesComponent {
  selectedCounterpartyId: number | null = null;

  onSelectCounterparty(id: number) {
    this.selectedCounterpartyId = id;
  }

  
  columnsInvoices = [
     { field: 'number', header: 'Номер', type: 'string', visible: true, width: '300px' },
    { field: 'expenseSum', header: 'Расход', type: 'number', visible: true, width: '200px' },
    { field: 'incomeSum', header: 'Приход', type: 'number', visible: true, width: '200px' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '250px' },
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '300px' },
    { field: 'actions', header: 'Действия', type: 'actions', visible: true, width: '200px' }, // Ширина для кнопок
  ];
 
  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ]


}
