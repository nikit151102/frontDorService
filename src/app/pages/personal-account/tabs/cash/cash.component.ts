import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MechanicComponent } from './mechanic/mechanic.component';
import { CashMenuComponent } from './cash-menu/cash-menu.component';
import { AntonComponent } from './anton/anton.component';
import { InvoicesService } from '../../components/invoices/invoices.service';
import { DimaComponent } from './dima/dima.component';
import { EgorComponent } from './egor/egor.component';
import { CashService } from './cash.service';

@Component({
  selector: 'app-cash',
  imports: [CommonModule, MechanicComponent, CashMenuComponent, AntonComponent, DimaComponent,EgorComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.scss'
})
export class CashComponent implements OnInit{


  selectedCashType: number | null = null;

  constructor(private invoicesService: InvoicesService, private cashService:CashService) { }
 
 
  ngOnInit(): void {
    this.cashService.connectToWebSocket();
  }

  onNameSelected(cashType: any) {
    this.selectedCashType = cashType;
    this.invoicesService.queryData.filters = [];
    this.invoicesService.defaultFilters = [];
    this.cashService.selectAntonCashType = cashType;
    const newFilters = [
      {
        field: 'DocPaymentType',
        values: [2, 3],
        type: 1
      },
      {
        field: 'antonCashType',
        values: [cashType],
        type: 1
      }
    ];

    newFilters.forEach(newFilter => {
      const existingFilterIndex = this.invoicesService.defaultFilters.findIndex(existingFilter =>
        existingFilter.field === newFilter.field
      );

      if (existingFilterIndex !== -1) {
        this.invoicesService.defaultFilters[existingFilterIndex].values = newFilter.values;
      } else {
        this.invoicesService.defaultFilters.push(newFilter);
      }
    });

    this.invoicesService.queryData.filters = [...this.invoicesService.defaultFilters];
  }



}
