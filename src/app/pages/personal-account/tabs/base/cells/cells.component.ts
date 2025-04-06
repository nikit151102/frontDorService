import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { BUTTON_SETS } from '../bitumen/button-config';
import { CellsService } from './cells.service';
import { getFormArrivalSets, MODEL, getFormExpenseSets } from './form-config';

@Component({
  selector: 'app-cells',
  imports: [CommonModule, InvoicesComponent],
  templateUrl: './cells.component.html',
  styleUrl: './cells.component.scss'
})
export class CellsComponent implements OnInit {

  constructor(
    private generalFormService: GeneralFormService,
    private cellsService: CellsService,
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
    { field: 'placeTo', header: 'Организация', type: 'string', visible: true, width: '10%' },
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
    { field: 'ttn', header: 'ТТН', type: 'string', visible: true, width: '10%' },
    { field: 'weight', header: 'Тоннаж', type: 'string', visible: true, width: '8%' },
    { field: 'amount', header: 'Цена', type: 'string', visible: true, width: '8%' },
  ];


  columnsExpenseData = [
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeFrom', header: 'Откуда', type: 'string', visible: true, width: '10%' },
    { field: 'placeTo', header: 'Организация', type: 'string', visible: true, width: '10%' },
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
      type: '',
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

    this.generalFormService.setService(this.cellsService);

    this.loadData('/api/Entities/Cargo/Filter')
      .then((productTarget) => {
        const dataSources = {
          productTarget: productTarget.data
        };

        const formSet = getFormArrivalSets(dataSources);
        this.generalFormService.setConfig(formSet);
        MODEL.managerDocType = this.currentComponent === 'arrival' ? 0 : 1;
        this.generalFormService.setModel(MODEL);
        this.generalFormService.setService(this.cellsService);
        this.buttonConfigs = formSet.buttons;
      });


  }

  loadData(apiEndpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cellsService.getProductsByEndpoint(apiEndpoint).subscribe(
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

    const formSet = type === 'arrival'
      ? getFormArrivalSets({ productTarget: this.productTarget })
      : getFormExpenseSets({ productTarget: this.productTarget });

    MODEL.managerDocType = type === 'arrival' ? 0 : 1;
    this.generalFormService.setModel(MODEL);
    this.generalFormService.setConfig(formSet);
    this.buttonConfigs = formSet.buttons;
  }

  getButtonConfigs() {
    return BUTTON_SETS;
  }
}
