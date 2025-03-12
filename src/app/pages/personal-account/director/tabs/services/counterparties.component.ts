import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvoicesTableComponent } from './invoices-table/invoices-table.component';
import { CounterpartiesListComponent } from './invoices-table/counterparties-list/counterparties-list.component';

@Component({
  selector: 'app-counterparties',
  imports: [CommonModule, InvoicesTableComponent, CounterpartiesListComponent],
  templateUrl: './counterparties.component.html',
  styleUrl: './counterparties.component.scss'
})
export class CounterpartiesComponent {
  selectedCounterpartyId: number | null = null;

  onSelectCounterparty(id: number) {
    this.selectedCounterpartyId = id;
  }
}
