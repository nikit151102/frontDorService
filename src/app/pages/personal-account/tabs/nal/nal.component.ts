import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NalContentComponent } from './nal-content/nal-content.component';
import { AccountantService } from '../accountant/accountant.service';

@Component({
  selector: 'app-nal',
  imports: [CommonModule, NalContentComponent],
  templateUrl: './nal.component.html',
  styleUrl: './nal.component.scss'
})
export class NalComponent implements OnInit {

  selectedCounterpartyId: any = '00000000-0000-0000-0000-000000000000';
  selectedCounterparty: any;
  notificationsInvoices: any;
  notificationsPartners: any;
  constructor(private accountantService: AccountantService) { }

  ngOnInit(): void {
    this.accountantService.connectToWebSocket();
    this.accountantService.invoices$.subscribe((values: any) => {
      this.notificationsInvoices = values;
    })

    this.accountantService.partner$.subscribe((values: any) => {
      this.notificationsPartners = values;
    })
  }

  onSelectCounterparty(data:{id: number, data: string}) {
    console.log('data',data)
    this.selectedCounterpartyId = data.id;
    this.selectedCounterparty = data.data;
  }

}
