import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MechanicInvoicesTableComponent } from './invoices-table/invoices-table.component';
import { MechanicCounterpartiesListComponent } from './counterparties-list/counterparties-list.component';
import { ProductsComponent } from '../../../../../components/products/products.component';

@Component({
  selector: 'app-counterparties',
  imports: [CommonModule, MechanicInvoicesTableComponent, MechanicCounterpartiesListComponent, ProductsComponent],
  templateUrl: './counterparties.component.html',
  styleUrl: './counterparties.component.scss'
})
export class MechanicCounterpartiesComponent {
  selectedCounterpartyId: number | null = null;

  onSelectCounterparty(id: number) {
    this.selectedCounterpartyId = id;
  }

  
  columnsInvoices = [
    { field: 'number', header: 'Номер',type: 'string', visible: true, width: '300px' },
    { field: 'expenseSum', header: 'Расход',type: 'number', visible: true, width: '300px' },
    { field: 'incomeSum', header: 'Приход',type: 'number', visible: true, width: '300px' },
    { field: 'dateTime', header: 'Дата',type: 'date', visible: true, width: '300px' }
  ];
 
  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ]
}

