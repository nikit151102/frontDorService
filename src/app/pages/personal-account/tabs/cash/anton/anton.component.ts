import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { GeneralFormService } from '../../../components/generalForm/general-form.service';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { AntonService } from './anton.service';
import { BUTTON_SETS } from './button-config';
import { MODEL, getFormSets } from './form-config';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from '../../../components/invoices/invoices.component';

@Component({
  selector: 'app-anton',
  imports: [CommonModule, InvoicesComponent],
  templateUrl: './anton.component.html',
  styleUrl: './anton.component.scss'
})
export class AntonComponent implements OnInit {

  constructor(private generalFormService: GeneralFormService,
    private antonService: AntonService,
    private jwtService: JwtService,
    private invoicesService: InvoicesService) { }
  paymentType: number = 2;
  columnsInvoices = [
    { field: 'dateTime', header: 'Дата', type: 'date', visible: true, width: '20%' },
    { field: 'productTarget', fieldView: 'productTarget', filterType: 10, searchField: 'productTarget.Name', header: 'Назначение', type: 'uuid', visible: true, width: '16%', endpoint: '/api/Entities/ProductTarget/Filter' },
    { field: 'name', header: 'Наименование', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'manufacturer', fieldView: 'manufacturer', header: 'Поставщик', type: 'string', visible: true, width: '15%', isFilter: false },
    { field: 'expenseSum', header: 'Расход', type: 'number', visible: true, width: '18%' },
    { field: 'incomeSum', header: 'Приход', type: 'number', visible: true, width: '18%' },
    { field: 'status', header: 'Статус', type: 'enam', visible: true, width: '20%' },
    { field: 'actions', header: 'Действия', type: 'actions', visible: false, width: '10%' },
  ];

  totalInfoColumnInvoices = [
    { columnNum: 4, value: 'totalExpenseSum' },
    { columnNum: 5, value: 'totalIncomeSum' },
    { columnNum: 6, value: 'totalSaldoInverse'}
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
    this.generalFormService.setService(this.antonService);
    this.paymentType = currentRole === '3' ? 2 : 3;
    Promise.all([
      this.loadData('/api/Entities/ProductTarget/Filter')
    ]).then(([productTarget]) => {
      const dataSources = {
        productTarget: productTarget.data
      };

      const formSet = getFormSets(dataSources);
      this.generalFormService.setConfig(formSet);
      this.generalFormService.setModel(MODEL);
      this.generalFormService.setService(this.antonService);
      this.buttonConfigs = formSet.buttons;
    });

  }

  loadData(apiEndpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.antonService.getProductsByEndpoint(apiEndpoint).subscribe(
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
