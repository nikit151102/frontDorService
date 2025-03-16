import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PartnerMenuComponent } from '../../components/partner-menu/partner-menu.component';
import { InvoicesContentComponent } from '../partners/invoices-content/invoices-content.component';
import { BUTTON_SETS } from './button-config';

@Component({
  selector: 'app-services',
  imports: [CommonModule, InvoicesContentComponent, PartnerMenuComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  selectedCounterpartyId: number | null = null;

  onSelectCounterparty(id: number) {
    this.selectedCounterpartyId = id;
  }

  getBUTTON_SETS() {
    return BUTTON_SETS
  }

}
