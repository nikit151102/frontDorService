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
import { CacheReferenceService } from '../../../../../services/cache-reference.service';

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
    private invoicesService: InvoicesService,
    private cacheService: CacheReferenceService
  ) { }

  paymentType: number = 2;
  productTarget: any;
  buttonConfigs: any;

  totalInfoColumnArrival = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 5, value: 'totalSumTTN' },
    { columnNum: 6, value: 'totalSumWeight' },
    { columnNum: 8, value: 'totalAmountSum' },
  ];

  columnsArrivalData = [
    { field: 'date', header: 'Дата', type: 'date', visible: true, width: '12%' },
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
    { field: 'ttn', header: 'ТТН', type: 'number', visible: true, width: '10%' },
    { field: 'weight', header: 'Тоннаж', type: 'number', visible: true, width: '8%' },
    { field: 'amount', header: 'Цена', type: 'number', visible: true, width: '8%' },
    { field: 'sumAmount', header: 'Сумма', type: 'number', visible: true, width: '8%' },
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


  totalInfoColumnExpense = [
    { columnNum: 0, value: 'totalCount' },
    { columnNum: 5, value: 'totalSumWeight' },
    { columnNum: 6, value: 'totalSumWeight' },
    { columnNum: 7, value: 'totalAmountSum' },
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
    { field: 'weight', header: 'Тоннаж', type: 'number', visible: true, width: '8%' },
    { field: 'amount', header: 'Цена', type: 'number', visible: true, width: '8%' },
    { field: 'sumAmount', header: 'Сумма', type: 'number', visible: true, width: '8%' },
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

  formFieldArrival = ['amount', 'auto', 'cargoName', 'date', 'placeFromId', 'placeToId', 'sumAmount', 'ttn', 'weight', 'paymentType']
  formFieldExpense = ['amount', 'auto', 'cargoName', 'date', 'organizationId', 'placeToId', 'sumAmount', 'weight']

  currentComponent: 'arrival' | 'expense' = 'arrival';
  currentColumns: any = this.columnsArrivalData;
  currentTotalInfo: any = this.totalInfoColumnArrival;
  currentFormField: any = this.formFieldArrival;

  ngOnInit(): void {
    const cachedEndpoints = this.cacheService.getAllCachedEndpoints();
    console.log('Все закэшированные эндпоинты:', cachedEndpoints);
    this.switchComponent('arrival', 0, 'invoices', null, 'Приход');
    const currentRole = this.jwtService.getDecodedToken().email;
    this.paymentType = currentRole === '3' ? 2 : 3;

    this.generalFormService.setService(this.bitumenService);

  }

  loadData(apiEndpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bitumenService.getProductsByEndpoint(apiEndpoint).subscribe(
        (data: any) => resolve(data.data),
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
  titleTab: any;

  async switchComponent(type: 'arrival' | 'expense', typeDocs: number, typeComponent: string, code: any = null, title: any) {
    this.typeComponent = typeComponent;
    this.titleTab = title;

    if (typeComponent == 'invoices') {
      sessionStorage.setItem('managerDocType', String(typeDocs));
      this.invoicesService.queryData = { filters: [], sorts: [] };
      this.invoicesService.defaultFilters = [{
        field: 'ManagerDocType',
        values: [typeDocs],
        type: 1
      }];

      this.invoicesService.queryData.sorts = [{
        field: 'Date', sortType: 1
      }];


      this.invoicesService.filterStatic = [{
        field: 'ManagerDocType',
        values: [typeDocs],
        type: 1
      }];

      this.defaultFilters = { ...this.invoicesService.defaultFilters };
      this.currentComponent = type;
      this.currentColumns = type === 'arrival' ? this.columnsArrivalData : this.columnsExpenseData;
      this.currentTotalInfo = type === 'arrival' ? this.totalInfoColumnArrival : this.totalInfoColumnExpense;
      this.currentFormField = type === 'arrival' ? this.formFieldArrival : this.formFieldExpense;
      // Проверяем кэш для каждого эндпоинта
      const endpoints = [
        '/api/Entities/Cargo/Filter',
        '/api/Entities/MiningQuarry/Filter',
        '/api/Entities/Organization/Filter',
        '/api/Entities/StorageArea/Filter'
      ];

      try {
        // Проверяем кэш для всех эндпоинтов
        const cachedData = await this.checkCacheForEndpoints(endpoints);

        if (cachedData.allCached) {
          // Все данные есть в кэше
          console.log('Используем данные из кэша');
          this.processData(cachedData.results, type);
        } else {
          // Загружаем отсутствующие данные
          console.log('Загружаем отсутствующие данные с сервера');
          const freshData = await Promise.all(
            endpoints.map((endpoint, index) =>
              cachedData.results[index]
                ? Promise.resolve(cachedData.results[index])
                : this.loadData(endpoint)
            )
          );

          // Сохраняем новые данные в кэш
          freshData.forEach((data, index) => {
            if (!cachedData.results[index] && data) {
              this.cacheService.set(endpoints[index], data);
            }
          });

          this.processData(freshData, type);
        }
      } catch (error) {
        console.error('Error loading data:', error);
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

  // Проверяет кэш для всех эндпоинтов
  private async checkCacheForEndpoints(endpoints: string[]): Promise<{ allCached: boolean, results: any[] }> {
    const results = [];
    let allCached = true;

    for (const endpoint of endpoints) {
      const cached = this.cacheService.get(endpoint);
      if (cached) {
        results.push(cached);
      } else {
        results.push(null);
        allCached = false;
      }
    }

    return { allCached, results };
  }

  // Обрабатывает данные (из кэша или сервера)
  private processData(dataResults: any[], type: 'arrival' | 'expense') {
    const [productTarget, placeFroms, organization, storageArea] = dataResults.map(res => res?.data || res);

    const dataSources = {
      productTarget: productTarget,
      placeFroms: placeFroms,
      organizations: organization,
      storageArea: storageArea,
      filter: this.defaultFilters
    };

    const formSet = type === 'arrival'
      ? getFormArrivalSets(dataSources)
      : getFormExpenseSets(dataSources);

    this.generalFormService.setConfig(formSet);
    MODEL.managerDocType = this.currentComponent === 'arrival' ? 0 : 1;
    console.log('MODEL', MODEL);
    this.generalFormService.setModel(MODEL);
    this.generalFormService.setService(this.bitumenService);
    this.buttonConfigs = formSet.buttons;
  }

  getButtonConfigs() {
    return BUTTON_SETS;
  }
}
