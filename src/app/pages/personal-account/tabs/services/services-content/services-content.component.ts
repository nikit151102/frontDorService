import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { ProductsComponent } from '../../../components/products/products.component';
import { BUTTON_SERVICES_SETS } from './button-services-config';
import { InvoicesService } from '../../../components/invoices/invoices.service';

@Component({
  selector: 'app-services-content',
  imports: [CommonModule, InvoicesComponent, ProductsComponent],
  templateUrl: './services-content.component.html',
  styleUrl: './services-content.component.scss'
})
export class ServicesContentComponent implements OnInit, OnChanges {
  @Input() counterpartyId!: any;
  selectedComponent: string = 'invoices';

  constructor(private invoicesService:InvoicesService) { }

  ngOnInit(): void { 
    this.invoicesService.defaultFilters = [{
      field: 'Partner.Type',
      values: [1],
      type: 1
    }]

  }

  ngOnChanges(changes: SimpleChanges): void { }

  getButtonConfigs() {
    return BUTTON_SERVICES_SETS
  }

  showComponent(component: string) {
    this.selectedComponent = component;
  }

  columns = [
    { field: 'productTarget.name', header: 'Назначение', type: 'uuid', visible: true, width: '200px' },
    { field: 'name', header: 'Товар', type: 'string', visible: true, width: '300px' },
    { field: 'quantity', header: 'Количество', type: 'number', visible: true, width: '300px' },
    { field: 'measurementUnit.shortName', header: 'Ед.изм', type: 'number', visible: true, width: '300px' },
    { field: 'amount', header: 'Сумма', type: 'number', visible: true, width: '300px' },
    { field: 'docInvoice', header: 'Номер фактуры', type: 'string', visible: true, width: '200px' },
    { field: 'dateTime', header: 'Дата фактуры', type: 'date', visible: true, width: '200px' },
    { field: 'docInvoiceStatus', header: 'Статус фактуры', type: 'enam', visible: true, width: '300px' }
  ];

  totalInfoColumn = [
    { columnNum: 2, value: 'totalExpenseSum' },
    { columnNum: 4, value: 'totalIncomeSum' }
  ];



  columnsInvoices = [
    { field: 'number', header: 'Номер', type: 'string', visible: true, width: '15%' },
    { field: 'expenseSum', header: 'Расход', type: 'number', visible: true, width: '18%' },
    { field: 'incomeSum', header: 'Приход', type: 'number', visible: true, width: '18%' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '20%' },
    { field: 'actions', header: 'Действия', type: 'actions', visible: true, width: '10%' }, // Ширина для кнопок
  ];



  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ]



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
