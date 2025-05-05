import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { JwtService } from '../../../../../services/jwt.service';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { MODEL, getFormArrivalSets, getFormExpenseSets } from './form-config';
import { BUTTON_SETS } from './button-config';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { BitumenService } from './bitumen.service';
import { AdditionalDataComponent } from '../additional-data/additional-data.component';
import { CONFIGPRODUCTS } from './products-conf';

@Component({
  selector: 'app-bitumen',
  imports: [CommonModule, InvoicesComponent, AdditionalDataComponent],
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
    { field: 'date', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeFrom', header: 'Откуда', type: 'string', visible: true, width: '10%' },
    { field: 'placeTo', header: 'Куда слилb', type: 'string', visible: true, width: '10%' },
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
    { field: 'sumAmount', header: 'Сумма', type: 'string', visible: true, width: '8%' },
    {
      field: 'paymentType',
      header: 'Форма оплаты',
      type: 'enam',
      visible: true,
      width: '10%'
    },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    // { field: 'comment', header: 'Комментарий', type: 'string', visible: true, width: '15%' }
  ];


  columnsExpenseData = [
    { field: 'date', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeFrom', header: 'Откуда', type: 'string', visible: true, width: '10%' },
    { field: 'organization', header: 'Кому', type: 'string', visible: true, width: '10%' },
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
    { field: 'weight', header: 'Тоннаж', type: 'string', visible: true, width: '8%' },
    { field: 'amount', header: 'Цена', type: 'string', visible: true, width: '8%' },
    { field: 'sumAmount', header: 'Сумма', type: 'string', visible: true, width: '8%' },
    {
      field: 'paymentType',
      header: 'Форма оплаты',
      type: 'enam',
      visible: true,
      width: '10%'
    },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    // { field: 'comment', header: 'Комментарий', type: 'string', visible: true, width: '15%' }
  ];


  currentComponent: 'arrival' | 'expense' = 'arrival';
  currentColumns: any = this.columnsArrivalData;


  ngOnInit(): void {
    this.switchComponent('arrival', 0, 'invoices');
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

  defaultFilters: any
  typeComponent: string = 'invoices';
  productsConf: any;

  switchComponent(type: 'arrival' | 'expense', typeDocs: number, typeComponent: string, code: any = null) {
    this.typeComponent = typeComponent;
    if (typeComponent == 'invoices') {
      sessionStorage.setItem('managerDocType', String(typeDocs))
      this.invoicesService.queryData = { filters: [], sorts: [] };
      this.invoicesService.defaultFilters = [{
        field: 'ManagerDocType',
        values: [typeDocs],
        type: 1
      }];

      this.defaultFilters = { ...this.invoicesService.defaultFilters };
      this.currentComponent = type;
      this.currentColumns = type === 'arrival' ? this.columnsArrivalData : this.columnsExpenseData;

      Promise.all([
        this.loadData('/api/Entities/Cargo/Filter'),
        this.loadData('/api/Entities/MiningQuarry/Filter'),
        this.loadData('/api/Entities/Organization/Filter'),
        this.loadData('/api/Entities/StorageArea/Filter')
      ])
        .then(([productTarget, placeFroms, organization, storageArea]) => {
          const dataSources = {
            productTarget: productTarget.data,
            placeFroms: placeFroms.data,
            organizations: organization.data,
            storageArea: storageArea.data
          };

          const formSet = type === 'arrival'
            ? getFormArrivalSets(dataSources)
            : getFormExpenseSets(dataSources);
          this.generalFormService.setConfig(formSet);
          MODEL.managerDocType = this.currentComponent === 'arrival' ? 0 : 1;
          console.log('MODEL', MODEL)
          this.generalFormService.setModel(MODEL);
          this.generalFormService.setService(this.bitumenService);
          this.buttonConfigs = formSet.buttons;
        })
        .catch(error => {
          console.error('Error loading data:', error);
        });
    } else {
      if (code !== null) {
        const foundProduct = CONFIGPRODUCTS.find((product: any) => product.code === code);
        if (foundProduct) {
          this.productsConf = foundProduct;
        }
      }
    }
  }

  getButtonConfigs() {
    return BUTTON_SETS;
  }
}
