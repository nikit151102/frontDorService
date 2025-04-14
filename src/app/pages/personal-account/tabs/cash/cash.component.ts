import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MechanicComponent } from './mechanic/mechanic.component';
import { CashMenuComponent } from './cash-menu/cash-menu.component';
import { AntonComponent } from './anton/anton.component';
import { InvoicesService } from '../../components/invoices/invoices.service';

@Component({
  selector: 'app-cash',
  imports: [CommonModule,MechanicComponent, CashMenuComponent, AntonComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.scss'
})
export class CashComponent {


  selectedCashType: number | null = null;

  constructor(private invoicesService: InvoicesService){}

  onNameSelected(cashType: any) {
    this.selectedCashType = cashType;
  
    this.invoicesService.queryData.filters = [];
    this.invoicesService.defaultFilters = []; 
  
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
