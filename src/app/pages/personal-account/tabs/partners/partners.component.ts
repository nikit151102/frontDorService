import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PartnerMenuComponent } from '../../components/partner-menu/partner-menu.component';
import { InvoicesContentComponent } from './invoices-content/invoices-content.component';

@Component({
  selector: 'app-partners',
  imports: [CommonModule, InvoicesContentComponent, PartnerMenuComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent {
  selectedCounterpartyId: number | null = null;

  onSelectCounterparty(id: number) {
    this.selectedCounterpartyId = id;
  }
}
