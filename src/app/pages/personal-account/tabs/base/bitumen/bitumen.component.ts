import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { JwtService } from '../../../../../services/jwt.service';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { MechanicActionsService } from '../../cash/mechanic/mechanic-actions.service';

import { MODEL, getFormArrivalSets, getFormExpenseSets } from './form-config';
import { BUTTON_SETS } from './button-config';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { BitumenService } from './bitumen.service';

@Component({
  selector: 'app-bitumen',
  imports: [CommonModule, InvoicesComponent],
  templateUrl: './bitumen.component.html',
  styleUrl: './bitumen.component.scss'
})
export class BitumenComponent implements OnInit {

  constructor(
    private generalFormService: GeneralFormService,
    private bitumenService: BitumenService,
    private jwtService: JwtService,
    private invoicesService: InvoicesService
  ) { }

  paymentType: number = 2;
  productTarget: any;
  buttonConfigs: any;

  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ];

  columnsArrivalData = [
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeFrom', header: 'Откуда', type: 'string', visible: true, width: '10%' },
    { field: 'placeTo', header: 'Куда слил', type: 'string', visible: true, width: '10%' },
    {
      field: 'cargoName',
      fieldView: 'cargoName',
      filterType: 10,
      searchField: 'cargo.Name',
      header: 'Груз',
      type: 'uuid',
      visible: true,
      width: '12%',
      endpoint: '/api/Entities/Cargo/Filter'
    },
    { field: 'ttn', header: 'ТТН', type: 'string', visible: true, width: '10%' },
    { field: 'weight', header: 'Тоннаж', type: 'string', visible: true, width: '8%' },
    { field: 'amount', header: 'Цена', type: 'string', visible: true, width: '8%' },
    {
      field: 'paymentType',
      header: 'Форма оплаты',
      type: 'enam',
      visible: true,
      width: '10%'
    },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    { field: 'comment', header: 'Комментарий', type: 'string', visible: true, width: '15%' }
  ];


  columnsExpenseData = [
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeFrom', header: 'Откуда', type: 'string', visible: true, width: '10%' },
    { field: 'placeTo', header: 'Кому', type: 'string', visible: true, width: '10%' },
    {
      field: 'cargoId',
      fieldView: 'cargoName',
      filterType: 10,
      searchField: 'cargo.Name',
      header: 'Груз',
      type: 'uuid',
      visible: true,
      width: '12%',
      endpoint: '/api/Entities/Cargo/Filter'
    },
    { field: 'weight', header: 'Тоннаж', type: 'string', visible: true, width: '8%' },
    { field: 'amount', header: 'Цена', type: 'string', visible: true, width: '8%' },
    {
      field: 'paymentType',
      header: 'Форма оплаты',
      type: 'enam',
      visible: true,
      width: '10%'
    },
    { field: 'comment', header: 'Комментарий', type: 'string', visible: true, width: '15%' }
  ];


  currentComponent: 'arrival' | 'expense' = 'arrival';
  currentColumns: any = this.columnsArrivalData;


  ngOnInit(): void {
    this.switchComponent('arrival', 0);
    const currentRole = this.jwtService.getDecodedToken().email;
    this.paymentType = currentRole === '3' ? 2 : 3;

    this.generalFormService.setService(this.bitumenService);

  }

  loadData(apiEndpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bitumenService.getProductsByEndpoint(apiEndpoint).subscribe(
        (data: any) => resolve(data),
        (error) => {
          console.error('Ошибка загрузки данных с эндпоинта:', error);
          reject(error);
        }
      );
    });
  }

  defaultFilters: any;
  switchComponent(type: 'arrival' | 'expense', typeDocs: number) {
    this.invoicesService.queryData = { filters: [], sorts: [] };
    this.invoicesService.defaultFilters = [{
      field: 'ManagerDocType',
      values: [typeDocs],
      type: 1
    }];

    this.defaultFilters = { ...this.invoicesService.defaultFilters };
    this.currentComponent = type;
    this.currentColumns = type === 'arrival' ? this.columnsArrivalData : this.columnsExpenseData;

    this.loadData('/api/Entities/Cargo/Filter')
      .then((productTarget) => {
        this.productTarget = productTarget.data;
        const dataSources = { productTarget: this.productTarget };

        const formSet = type === 'arrival'
          ? getFormArrivalSets(dataSources)
          : getFormExpenseSets(dataSources);

        MODEL.managerDocType = type === 'arrival' ? 0 : 1;

        this.generalFormService.setService(this.bitumenService);
        this.generalFormService.setConfig(formSet);
        this.generalFormService.setModel(MODEL);

        this.buttonConfigs = formSet.buttons;
      });
  }


  getButtonConfigs() {
    return BUTTON_SETS;
  }
}
