import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PartnerMenuComponent } from '../../components/partner-menu/partner-menu.component';
import { InvoicesContentComponent } from './invoices-content/invoices-content.component';
import { BUTTON_SETS } from './button-config'
import { PartnersService } from './partners.service';
@Component({
  selector: 'app-partners',
  imports: [CommonModule, InvoicesContentComponent, PartnerMenuComponent],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit {


  selectedCounterpartyId: number | null = null;
  selectedCounterparty: any;
  notificationsInvoices: any;
  notificationsPartners: any;
  constructor(private partnersService: PartnersService) { }

  ngOnInit(): void {
    this.partnersService.connectToWebSocket();
    this.partnersService.invoices$.subscribe((values: any) => {
      this.notificationsInvoices = values;
    })

    this.partnersService.partner$.subscribe((values: any) => {
      this.notificationsPartners = values;
    })
  }

  onSelectCounterparty(data:{id: number, data: string}) {
    console.log('data',data)
    this.selectedCounterpartyId = data.id;
    this.selectedCounterparty = data.data;
  }

  getBUTTON_SETS() {
    return BUTTON_SETS
  }
}
