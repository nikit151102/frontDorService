import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProductsComponent } from './products/products.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices-table',
  standalone: true,
  imports: [CommonModule, InvoicesComponent, ProductsComponent],
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss']
})
export class InvoicesTableComponent implements OnInit, OnChanges {
  @Input() counterpartyId!: any;
  selectedComponent: string = 'invoices';

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void { }

  showComponent(component: string) {
    this.selectedComponent = component;
  }

  columns = [
    { field: 'productTarget.name', header: 'Назначение', type: 'uuid', visible: true, width: '200px' },
    { field: 'name', header: 'Товар', type: 'string', visible: true, width: '300px' },
    { field: 'quantity', header: 'Количество', type: 'number', visible: true, width: '300px' },
    { field: 'measurementUnit.shortName', header: 'Ед.изм', type: 'number', visible: true, width: '300px' },
    { field: 'amount', header: 'Сумма', type: 'number', visible: true, width: '300px' },
    { field: 'docInvoice', header: 'Номер фактуры', type: 'string', visible: true, width: '300px' },
    { field: 'dateTime', header: 'Дата фактуры', type: 'date', visible: true, width: '300px' },
    { field: 'docInvoiceStatus', header: 'Статус фактуры', type: 'enam', visible: true, width: '300px' }
  ];
 
  totalInfoColumn = [
    { columnNum: 2, value: 'totalExpenseSum' },
    { columnNum: 4, value: 'totalIncomeSum' }
  ];

  productActions = [
    {
      label: 'Редактировать',
      action: (product: any) => this.editProduct(product)
    },
    {
      label: 'Удалить',
      action: (product: any) => this.deleteProduct(product)
    }
  ];
  
  editProduct(product: any) {
    console.log('Редактируем:', product);
    // Здесь можно добавить логику редактирования, например, открытие модального окна
  }
  
  deleteProduct(product: any) {
    console.log('Удаляем:', product);
    // Здесь можно добавить логику удаления, например, вызов API
  }
  

}
