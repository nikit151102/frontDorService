import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { BUTTON_SETS } from './button-config';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { FORM_SETS, MODEL } from './form-config';
import { MechanicActionsService } from './mechanic-actions.service';

@Component({
  selector: 'app-mechanic',
  imports: [CommonModule, InvoicesComponent],
  templateUrl: './mechanic.component.html',
  styleUrl: './mechanic.component.scss'
})
export class MechanicComponent implements OnInit {

  constructor(private generalFormService: GeneralFormService, private mechanicActionsService:MechanicActionsService) { }

  columnsInvoices = [
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '20%' },
    { field: 'productTarget.Id', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'number', header: 'Номер', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'number', header: 'Номер', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'expenseSum', header: 'Расход', type: 'number', visible: true, width: '18%' },
    { field: 'incomeSum', header: 'Приход', type: 'number', visible: true, width: '18%' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    { field: 'actions', header: 'Действия', type: 'actions', visible: true, width: '10%' },
  ];

  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ]

  ngOnInit(): void {
    this.generalFormService.setConfig(FORM_SETS);
    this.generalFormService.setModel(MODEL);
    this.generalFormService.setService(this.mechanicActionsService);
  }

  getButtonConfigs() {
    return BUTTON_SETS
  }
}
