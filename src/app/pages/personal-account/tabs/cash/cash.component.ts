import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MechanicComponent } from './mechanic/mechanic.component';
import { CashMenuComponent } from './cash-menu/cash-menu.component';
import { AntonComponent } from './anton/anton.component';
import { InvoicesService } from '../../components/invoices/invoices.service';
import { DimaComponent } from './dima/dima.component';
import { EgorComponent } from './egor/egor.component';
import { CashService } from './cash.service';
import { SupplierComponent } from './supplier/supplier.component';
import { DimaBaseComponent } from './dimaBase/dima.component';

enum CashType {
  MECHANIC = 'Механик',
  ANTON = 'Антон',
  DIMA_BASE = 'Дима (база)',
  EGOR = 'Егор',
  SUPPLIER = 'Снабженец',
  DIMA = 'Дима'
}

@Component({
  selector: 'app-cash',
  imports: [CommonModule, MechanicComponent, CashMenuComponent, AntonComponent, DimaComponent, EgorComponent, SupplierComponent, DimaBaseComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.scss'
})
export class CashComponent implements OnInit {


  selectedCashType: number | null = null;
  titleTab: string = '';

  constructor(private invoicesService: InvoicesService, private cashService: CashService) { }

  getTitleTab(): string {
    switch (this.selectedCashType) {
      case 0: return CashType.MECHANIC;
      case 1: return CashType.ANTON;
      case 2: return CashType.DIMA_BASE;
      case 3: return CashType.EGOR;
      case 4: return CashType.SUPPLIER;
      case 5: return CashType.DIMA;
      default: return 'Неизвестная вкладка';
    }
  }

  ngOnInit(): void {
    this.cashService.connectToWebSocket();
  }

  onNameSelected(cashType: any) {
    this.selectedCashType = cashType;
    this.invoicesService.queryData.filters = [];
    this.invoicesService.defaultFilters = [];
    this.cashService.selectAntonCashType = cashType;
    const newFilters = cashType === 4
      ? [
        {
          field: 'antonCashType',
          values: [cashType],
          type: 1
        },
        {
          field: 'DocPaymentType',
          values: [0, 1],
          type: 1
        },
        { field: "DocAccountType", values: [0, 1], type: 1 },

        { field: "Partner.Type", values: [0, 1, 5], type: 1 }
      ]
      : [
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


    0


    this.invoicesService.filterStatic = newFilters;
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
