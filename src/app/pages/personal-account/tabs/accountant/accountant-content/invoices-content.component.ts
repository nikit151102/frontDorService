import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { JwtService } from '../../../../../services/jwt.service';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { BUTTON_SETS } from './button-config';

@Component({
  selector: 'app-invoices-content',
  imports: [CommonModule, InvoicesComponent],
  templateUrl: './invoices-content.component.html',
  styleUrl: './invoices-content.component.scss'
})
export class InvoicesContentComponent implements OnInit, OnChanges {
  @Input() counterpartyId!: any;
  @Input() counterpartyData!: any;
  @Input() notificationItem: any;
  selectedComponent: string = 'invoices';

  constructor(private jwtService: JwtService,
    private invoicesService: InvoicesService
  ) { }

  ngOnInit(): void {
    this.invoicesService.defaultFilters = [{
      field: 'Partner.Type',
      values: [0,1],
      type: 1
    },
    {
      field: 'Status',
      values: [5],
      type: 1
    }]

    this.jwtService.getDecodedToken()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notificationItem']) {
      this.invoicesService.updateOrAddItem(this.notificationItem);
    }
  }

  getButtonConfigs() {
    return BUTTON_SETS
  }

  showComponent(component: string) {
    this.selectedComponent = component;
  }

  columnsInvoices = [
    { field: 'number', header: 'Номер', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'expenseSum', header: 'Расход', type: 'number', visible: true, width: '18%' },
    { field: 'incomeSum', header: 'Приход', type: 'number', visible: true, width: '18%' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '20%' },
    { field: 'partnerName', header: 'Контрагент', type: 'date', visible: true, width: '20%' },
    { field: 'creatorName', header: 'Создатель', type: 'date', visible: true, width: '20%' },
    { field: 'actions', header: 'Действия', type: 'actions', visible: true, width: '10%' },
  ];

  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ]


}
