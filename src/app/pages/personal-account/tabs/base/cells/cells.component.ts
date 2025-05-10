import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { BUTTON_SETS } from '../bitumen/button-config';
import { CellsService } from './cells.service';
import { getFormArrivalSets, MODEL, getFormExpenseSets } from './form-config';
import { CONFIGPRODUCTS } from './products-conf';
import { AdditionalDataComponent } from '../additional-data/additional-data.component';
import { CacheReferenceService } from '../../../../../services/cache-reference.service';

@Component({
  selector: 'app-cells',
  imports: [CommonModule, InvoicesComponent, AdditionalDataComponent],
  templateUrl: './cells.component.html',
  styleUrl: './cells.component.scss'
})
export class CellsComponent implements OnInit {

  constructor(
    private generalFormService: GeneralFormService,
    private cellsService: CellsService,
    private jwtService: JwtService,
    private invoicesService: InvoicesService,
    private cacheService: CacheReferenceService
  ) { }

  paymentType: number = 2;
  productTarget: any;
  placeFroms: any;
  buttonConfigs: any;

  totalInfoColumnInvoices = [
    { columnNum: 1, value: 'totalExpenseSum' },
    { columnNum: 2, value: 'totalIncomeSum' },
  ];

  columnsArrivalData = [
    { field: 'date', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeFrom', header: 'Откуда', type: 'string', visible: true, width: '10%' },
    { field: 'placeTo', header: 'Куда слили', type: 'string', visible: true, width: '10%' },
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
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
  ];


  columnsExpenseData = [
    { field: 'date', header: 'Дата', type: 'date', visible: true, width: '12%' },
    { field: 'auto', header: 'Авто', type: 'string', visible: true, width: '10%' },
    { field: 'placeTo', header: 'Откуда', type: 'string', visible: true, width: '10%' },
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
      type: '',
      visible: true,
      width: '10%'
    },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    // { field: 'comment', header: 'Комментарий', type: 'string', visible: true, width: '15%' }
  ];


  currentComponent: 'arrival' | 'expense' = 'arrival';
  currentColumns: any = this.columnsArrivalData;

  ngOnInit(): void {
    this.switchComponent('arrival', 2, 'invoices');
    const currentRole = this.jwtService.getDecodedToken().email;
    this.paymentType = currentRole === '3' ? 2 : 3;

    this.generalFormService.setService(this.cellsService);

    Promise.all([
      this.loadDataWithCache('/api/Entities/Cargo/Filter'),
      this.loadDataWithCache('/api/Entities/MiningQuarry/Filter'),
      this.loadDataWithCache('/api/Entities/Organization/Filter'),
      this.loadDataWithCache('/api/Entities/StorageArea/Filter')
    ])
      .then(([productTarget, placeFroms, organization, storageArea]) => {
        const dataSources = {
          productTarget: productTarget.data,
          placeFroms: placeFroms.data,
          organizations: organization.data,
          storageArea: storageArea.data,
          filter: this.defaultFilters
        };

        const formSet = this.currentComponent === 'arrival'
          ? getFormArrivalSets(dataSources)
          : getFormExpenseSets(dataSources);

        this.generalFormService.setConfig(formSet);
        MODEL.managerDocType = this.currentComponent === 'arrival' ? 0 : 1;
        this.generalFormService.setModel(MODEL);
        this.generalFormService.setService(this.cellsService);
        this.buttonConfigs = formSet.buttons;
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }

  // Новый метод с кэшированием
  async loadDataWithCache(apiEndpoint: string): Promise<any> {
    // 1. Проверяем кэш
    const cachedData = this.cacheService.get(apiEndpoint);
    if (cachedData) {
      console.log('Используем кэш для', apiEndpoint);
      return cachedData;
    }

    // 2. Если нет в кэше, загружаем с сервера
    try {
      const data = await this.loadData(apiEndpoint);
      // 3. Сохраняем в кэш (TTL 1 час)
      this.cacheService.set(apiEndpoint, data, 60 * 60 * 1000);
      return data;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      throw error;
    }
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
  typeComponent: string = 'invoices';
  productsConf: any;

 async switchComponent(type: 'arrival' | 'expense', typeDocs: number, typeComponent: string, code: any = null) {
    this.typeComponent = typeComponent;
    if (typeComponent == 'invoices') {
        sessionStorage.setItem('managerDocType', String(typeDocs));
        this.invoicesService.queryData = { filters: [], sorts: [] };
        this.invoicesService.defaultFilters = [{
            field: 'ManagerDocType',
            values: [typeDocs],
            type: 1
        }];

        this.defaultFilters = { ...this.invoicesService.defaultFilters };
        this.currentComponent = type;
        this.currentColumns = type === 'arrival' ? this.columnsArrivalData : this.columnsExpenseData;

        try {
            // Массив эндпоинтов для загрузки
            const endpoints = [
                '/api/Entities/Cargo/Filter',
                '/api/Entities/MiningQuarry/Filter',
                '/api/Entities/Organization/Filter',
                '/api/Entities/StorageArea/Filter'
            ];

            // Загружаем данные с кэшированием
            const [productTarget, placeFroms, organization, storageArea] = await Promise.all(
                endpoints.map(endpoint => this.loadDataWithCache(endpoint))
            );

            const dataSources = {
                productTarget: productTarget.data,
                placeFroms: placeFroms.data,
                organizations: organization.data,
                storageArea: storageArea.data,
                filter: this.defaultFilters
            };

            const formSet = type === 'arrival'
                ? getFormArrivalSets(dataSources)
                : getFormExpenseSets(dataSources);

            MODEL.managerDocType = type === 'arrival' ? 2 : 3;

            this.generalFormService.setService(this.cellsService);
            this.generalFormService.setConfig(formSet);
            this.generalFormService.setModel(MODEL);

            this.buttonConfigs = formSet.buttons;
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
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
