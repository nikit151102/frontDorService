import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountantService } from './accountant.service';
import { InvoicesContentComponent } from './accountant-content/invoices-content.component';
import { PartnerMenuComponent } from '../../components/partner-menu/partner-menu.component';
import { BUTTON_SETS } from './button-config';
import { PartnerMenuService } from '../../components/partner-menu/partner-menu.service';

@Component({
  selector: 'app-accountant',
  imports: [CommonModule, InvoicesContentComponent, PartnerMenuComponent],
  templateUrl: './accountant.component.html',
  styleUrl: './accountant.component.scss'
})
export class AccountantComponent implements OnInit {


  selectedCounterpartyId: any = '00000000-0000-0000-0000-000000000000';
  selectedCounterparty: any;
  notificationsInvoices: any;
  notificationsPartners: any;
  contentWidth: any;
  constructor(private accountantService: AccountantService,
    private partnerMenuService: PartnerMenuService
  ) { }

  ngOnInit(): void {
    this.partnerMenuService.setSomeVariable(true);
    this.partnerMenuService.someVariable$.subscribe((value: any) => {
      this.contentWidth = value
        ? 'calc(100% - 320px)'
        : 'calc(100% - 120px)';
    });


    this.accountantService.connectToWebSocket();
    this.accountantService.invoices$.subscribe((values: any) => {
      this.notificationsInvoices = values;
    })

    this.accountantService.partner$.subscribe((values: any) => {
      this.notificationsPartners = values;
    })
  }

  onSelectCounterparty(data: { id: number, data: string }) {
    console.log('data', data)
    this.selectedCounterpartyId = data.id;
    this.selectedCounterparty = data.data;
    this.accountantService.selectCounterpartyId = data.id;
  }

  getBUTTON_SETS() {
    return BUTTON_SETS
  }

}
