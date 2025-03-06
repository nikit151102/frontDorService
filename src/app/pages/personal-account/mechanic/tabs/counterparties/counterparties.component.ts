import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MechanicInvoicesTableComponent } from './invoices-table/invoices-table.component';
import { MechanicCounterpartiesListComponent } from './counterparties-list/counterparties-list.component';

@Component({
  selector: 'app-counterparties',
  imports: [CommonModule, MechanicInvoicesTableComponent, MechanicCounterpartiesListComponent],
  templateUrl: './counterparties.component.html',
  styleUrl: './counterparties.component.scss'
})
export class MechanicCounterpartiesComponent {
  selectedCounterpartyId: number | null = null;

  onSelectCounterparty(id: number) {
    this.selectedCounterpartyId = id;
  }
}
