import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';
import { JwtService } from '../../../../../services/jwt.service';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { BUTTON_SETS } from './button-config';
import { DimaService } from './dima.service';
import { MODEL, getFormSets } from './form-config';
import { CacheReferenceService } from '../../../../../services/cache-reference.service';

@Component({
  selector: 'app-dima',
  imports: [CommonModule, InvoicesComponent],
  templateUrl: './dima.component.html',
  styleUrl: './dima.component.scss'
})
export class DimaComponent implements OnInit {

  constructor(private generalFormService: GeneralFormService,
    private dimaService: DimaService,
    private jwtService: JwtService,
    private invoicesService: InvoicesService,
    private cacheService: CacheReferenceService) { }
  paymentType: number = 2;
  columnsInvoices = [
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '20%' },
    { field: 'productTarget', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'name', header: 'Наименование', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'manufacturer', fieldView: 'manufacturer', header: 'Поставщик', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'expenseSum', header: 'Приход', type: 'number', visible: true, width: '18%' },
    { field: 'incomeSum', header: 'Расход', type: 'number', visible: true, width: '18%' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    { field: 'actions', header: 'Действия', type: 'actions', visible: false, width: '10%' },
  ];

  totalInfoColumnInvoices = [
    { columnNum: 4, value: 'totalExpenseSum' },
    { columnNum: 5, value: 'totalIncomeSum' },
    { columnNum: 6, value: 'totalSaldoInverse' }
  ]
  productTarget: any;
  buttonConfigs: any;

  ngOnInit(): void {

    // this.invoicesService.defaultFilters = [{
    //   field: 'DocPaymentType',
    //   values: [2, 3],
    //   type: 1
    // },
    // {
    //   field: 'antonCashType',
    //   values: [1],
    //   type: 1
    // }]

    const currentRole = this.jwtService.getDecodedToken().email;
    this.generalFormService.setModel(MODEL);
    this.generalFormService.setService(this.dimaService);
    this.paymentType = currentRole === '3' ? 2 : 3;

    // Используем версию с кэшированием
    this.loadDataWithCache('/api/Entities/ProductTarget/Filter')
      .then((productTarget) => {
        const dataSources = {
          productTarget: productTarget
        };

        const formSet = getFormSets(dataSources);
        this.generalFormService.setConfig(formSet);
        this.generalFormService.setModel(MODEL);
        this.generalFormService.setService(this.dimaService);
        this.buttonConfigs = formSet.buttons;
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }

  // Новый метод с кэшированием
  async loadDataWithCache(apiEndpoint: string): Promise<any> {
    // 1. Проверяем кэш
    const cachedData = this.cacheService.get(apiEndpoint);
    if (cachedData) {
      console.log('Используем кэшированные данные для', apiEndpoint);
      return cachedData;
    }

    // 2. Если нет в кэше, загружаем с сервера
    try {
      const data = await this.loadData(apiEndpoint);
      // 3. Сохраняем в кэш (TTL 1 час)
      this.cacheService.set(apiEndpoint, data.data, 60 * 60 * 1000);
      return data.data;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      throw error;
    }
  }


  loadData(apiEndpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dimaService.getProductsByEndpoint(apiEndpoint).subscribe(
        (data: any) => resolve(data),
        (error) => {
          console.error('Ошибка загрузки данных с эндпоинта:', error);
          reject(error);
        }
      );
    });
  }

  getButtonConfigs() {
    return BUTTON_SETS;
  }
}
