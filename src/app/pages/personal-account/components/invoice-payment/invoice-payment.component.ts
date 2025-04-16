import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicePaymentService } from './invoice-payment.service';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputNumberComponent } from '../../../../ui-kit/custom-input-number/custom-input-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoicesService } from '../invoices/invoices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-payment',
  standalone: true,
  imports: [CommonModule, CalendarModule, CustomInputNumberComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {
  @Input() counterpartyId: string = '';
  @Input() paymentType: number = 1;
  visible: boolean = false;
  title: string = 'Оплата';
  message: string = '';
  acceptLabel: string = 'Оплатить';
  rejectLabel: string = 'Отмена';
  measurementUnit: any = [];
  productTarget: any = [];
  dateTime: Date | undefined = new Date();
  amount: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    public invoicePaymentService: InvoicePaymentService,
    private invoicesService: InvoicesService,
    private router:Router
  ) { }

  ngOnInit() {
    this.invoicePaymentService.visible$.subscribe((value: boolean) => {
      this.visible = value;
      console.log('Popup visibility:', value);
      this.cdr.detectChanges();
    });

    this.loadData('/api/Entities/MeasurementUnit/Filter', 'measurementUnit');
    this.loadData('/api/Entities/ProductTarget/Filter', 'productTarget');

  }

  onAccept() {

    const currentUrl = this.router.url;
    const typeValue = currentUrl.includes('/cash') ? 0 : 1;
    const unitPieces = this.measurementUnit.find((unit: any) => unit.name === 'Штуки');
   

    let data: any = {
      dateTime: this.dateTime,
      type: typeValue,
      docPaymentType: this.paymentType,
      productList: [{
        // productTargetId: this.productTarget?.id || '',
        quantity: 1,
        // measurementUnit: tunitPieces || '',
        amount: this.amount,
        sumAmount: this.amount
      }]
    };


    if (typeValue === 0) {
      const antonCashFilter = this.invoicesService.defaultFilters.find(f => f.field === 'antonCashType');
      
      if (antonCashFilter && antonCashFilter.values && antonCashFilter.values.length > 0) {
        data.antonCashType = antonCashFilter.values[0];
      }
    }

    const isNullId = ['00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001'].includes(this.counterpartyId);
    if (!isNullId) {
      data.partnerId = this.counterpartyId;
    }

    this.invoicePaymentService.setPayment(data).subscribe(
      (data: any) => {
        this.invoicePaymentService.visibleModal(false)
        this.invoicesService.addItemToStart(data.documentMetadata.data);
        this.invoicesService.totalInfo = data.totalInfo;
        this.dateTime = new Date();
        this.amount = 0;
      },
      (error) => console.error('Ошибка при оплате:', error)
    );
  }

  closePopup() {
    this.invoicePaymentService.visibleModal(false);
  }

  loadData(apiEndpoint: string, targetProperty: 'measurementUnit' | 'productTarget') {
    this.invoicePaymentService.getProductsByEndpoint(apiEndpoint).subscribe(
      (response: any) => {
        if (targetProperty === 'measurementUnit') {
          this.measurementUnit = response.data;
        } else if (targetProperty === 'productTarget') {
          this.productTarget = response.data;
        }
        this.cdr.detectChanges();
      },
      (error) => console.error(`Ошибка загрузки ${targetProperty}:`, error)
    );
  }

  onDateInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[,\.]/g, '-');
    let date = this.parseDate(value);
    if (date) {
      this.dateTime = date;
    }
  }
  parseDate(value: string): Date | null {
    const parts = value.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
    return null; 
  }
  
}