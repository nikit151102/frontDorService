import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputNumberComponent } from '../../../../ui-kit/custom-input-number/custom-input-number.component';
import { InvoicesService } from '../invoices/invoices.service';
import { ScoreFormService } from './score-form.service';
import { CustomInputComponent } from '../../../../ui-kit/custom-input/custom-input.component';
import { JwtService } from '../../../../services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-form',
  imports: [CommonModule, CalendarModule, CustomInputNumberComponent, FormsModule, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './score-form.component.html',
  styleUrl: './score-form.component.scss'
})
export class ScoreFormComponent implements OnInit, OnChanges  {
  @Input() data: any;
  @Input() counterpartyId: string = '';
  visible: boolean = false;
  message: string = '';
  acceptLabel: string = 'Черновик';
  rejectLabel: string = 'Отмена';
  measurementUnit: any = [];
  productTarget: any = [];
  dateTime: Date | undefined = new Date();
  amount: number = 0;
  numberScope: string = '';
  name: string = '';
  currentRole:any;

  constructor(
    private cdr: ChangeDetectorRef,
    public scoreFormService: ScoreFormService,
    private invoicesService: InvoicesService,
    private jwtService: JwtService,
    private router:Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.fillFormWithData(this.data);
      console.log('this.data',this.data)
    }
  }
  
  ngOnInit() {
    this.currentRole = this.jwtService.getDecodedToken().email
    this.scoreFormService.visible$.subscribe((value: boolean) => {
      this.visible = value;
      console.log('Popup visibility:', value);
      this.cdr.detectChanges();
    });

    // this.loadData('/api/Entities/MeasurementUnit/Filter', 'measurementUnit');
    // this.loadData('/api/Entities/ProductTarget/Filter', 'productTarget');

  }

  fillFormWithData(data: any) {
    this.numberScope = data.number || '';
    this.dateTime = data.dateTime ? new Date(data.dateTime) : new Date();
    this.name = data.productList?.[0]?.name || '';
    this.amount = data.productList?.[0]?.amount || 0;
  }

  onAccept(callback?: (invoice: any) => void) {
    
    let data: any = {
      number: this.numberScope,
      dateTime: this.dateTime,
      type: 1,
      partnerId: (this.counterpartyId === '00000000-0000-0000-0000-000000000001')
        ? '00000000-0000-0000-0000-000000000000'
        : this.counterpartyId,
      productList: [{
        name: this.name,
        quantity: 1,
        amount: this.amount,
        sumAmount: this.amount
      }]
    };

    
    const currentUrl = this.router.url;
    const typeValue = currentUrl.includes('/cash') ? 1 : 0;
    if(typeValue == 1){
      data.docPaymentType = 3;
    }

    this.scoreFormService.setCreate(data).subscribe(
      (data: any) => {
        this.scoreFormService.visibleModal(false)
        this.invoicesService.addItemToStart(data.documentMetadata.data);
        this.invoicesService.totalInfo = data.totalInfo;
        this.dateTime = new Date();
        this.amount = 0;
        this.numberScope = '';
        this.name = '';
        return data.documentMetadata.data;
      },
      (error) => console.error('Ошибка при оплате:', error)
    );
  }

  onAcceptEdit() {
    const data = {
      id: this.data.id,
      number: this.numberScope,
      dateTime: this.dateTime,
      type: 1,
      partnerId: (this.counterpartyId === '00000000-0000-0000-0000-000000000001')
        ? '00000000-0000-0000-0000-000000000000'
        : this.counterpartyId,
      productList: [{
        name: this.name,
        quantity: 1,
        amount: this.amount,
        sumAmount: this.amount
      }]
    };

    this.scoreFormService.setEdit(data).subscribe(
      (data: any) => {
        this.scoreFormService.visibleModal(false)
        this.invoicesService.updateActiveData(data.documentMetadata.data);
        this.invoicesService.totalInfo = data.totalInfo;
        this.dateTime = new Date();
        this.amount = 0;
        this.numberScope = '';
        this.name = '';
      },
      (error) => console.error('Ошибка при оплате:', error)
    );
  }


  closePopup() {
    this.scoreFormService.visibleModal(false);
  }

  loadData(apiEndpoint: string, targetProperty: 'measurementUnit' | 'productTarget') {
    this.scoreFormService.getProductsByEndpoint(apiEndpoint).subscribe(
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

  sendingVerification() {

  }



  saveAndSendInvoice() {
    this.onAccept((invoice: any) => {
      this.sendingInvoice(invoice, 2);
    });
  }

  sendingInvoice(invoice: string, status: number) {
    this.scoreFormService.sendingVerification(invoice, status).subscribe(
      (updatedInvoice: any) => {
        this.invoicesService.updateActiveData(updatedInvoice.data)
        this.closePopup();
      },
      error => {
        console.error('Ошибка при отправке на проверку:', error);
      }
    );
  }

}