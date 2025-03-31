import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicePaymentService } from './invoice-payment.service';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputNumberComponent } from '../../../../ui-kit/custom-input-number/custom-input-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoicesService } from '../invoices/invoices.service';

@Component({
  selector: 'app-invoice-payment',
  standalone: true,
  imports: [CommonModule, CalendarModule, CustomInputNumberComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-payment.component.html',
  styleUrls: ['./invoice-payment.component.scss']
})
export class InvoicePaymentComponent implements OnInit {
  @Input() counterpartyId: string = '';
  visible: boolean = false;
  title: string = 'Оплата';
  message: string = '';
  acceptLabel: string = 'Оплатить';
  rejectLabel: string = 'Отмена';
  measurementUnit: any = [];
  productTarget: any = [];
  dateTime: Date = new Date();
  amount: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    public invoicePaymentService: InvoicePaymentService,
    private invoicesService: InvoicesService
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
    const unitPieces = this.measurementUnit.find((unit: any) => unit.name === 'Штуки');
    const data = {
      dateTime: this.dateTime,
      type: 1,
      partnerId: this.counterpartyId,
      productList: [{
        // productTargetId: this.productTarget?.id || '',
        quantity: 1,
        // measurementUnit: tunitPieces || '',
        amount: this.amount,
        sumAmount: this.amount
      }]
    };

    this.invoicePaymentService.setPayment(data).subscribe(
      (data:any) => {
        this.invoicePaymentService.visibleModal(false)
        this.invoicesService.addItemToStart(data.documentMetadata.data)
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
  
}