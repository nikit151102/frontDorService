import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PartnerMenuComponent } from '../../components/partner-menu/partner-menu.component';
import { InvoicesContentComponent } from './invoices-content/invoices-content.component';
import { BUTTON_SETS } from './button-config'
import { PartnersService } from './partners.service';
import { InvoicesService } from '../../components/invoices/invoices.service';
import { PartnerMenuService } from '../../components/partner-menu/partner-menu.service';
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
  contentWidth: any;
  constructor(private partnersService: PartnersService, private invoicesService: InvoicesService,
    private partnerMenuService: PartnerMenuService) { }

  ngOnInit(): void {
    this.partnerMenuService.setSomeVariable(true);
    this.partnerMenuService.someVariable$.subscribe((value: any) => {
      this.contentWidth = value
        ? 'calc(100% - 320px)'
        : 'calc(100% - 120px)';
    });

    this.partnersService.connectToWebSocket();
    this.partnersService.invoices$.subscribe((values: any) => {
      this.notificationsInvoices = values;
    })

    this.partnersService.partner$.subscribe((values: any) => {
      this.notificationsPartners = values;
    })
  }

  onSelectCounterparty(data: { id: number, data: string }) {
    console.log('selectedCounterparty', data)
    this.selectedCounterpartyId = data.id;
    this.selectedCounterparty = data.data;
    this.invoicesService.selectedCounterparty = data.data;

  }

  getBUTTON_SETS() {
    return BUTTON_SETS
  }
}
