import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DateFilterSortComponent } from '../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPopupService } from '../../../../../components/confirm-popup/confirm-popup.service';
import { taxes } from '../../../../../services/data';
import { FormatingDataService } from '../../../../../services/formating-data.service';
import { JwtService } from '../../../../../services/jwt.service';
import { ToastService } from '../../../../../services/toast.service';
import { ScoreFormService } from '../../../components/score-form/score-form.service';
import { BUTTON_SETS } from '../../partners/button-config';
import { ButtonConfig } from '../../partners/invoices-content/button-config';
import { InvoicesContentService } from '../../partners/invoices-content/invoices-content.service';
import { DriverSalaryService } from './driver-salary.service';
import { DriverSalaryFormService } from './driver-salary-form/driver-salary-form.service';
import { DriverSalaryFormComponent } from './driver-salary-form/driver-salary-form.component';
import { CONFIGS } from './config';
import { take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environment';

@Component({
  selector: 'app-driver-salary',
  providers: [MessageService],
  imports: [CommonModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    DriverSalaryFormComponent
  ],
  templateUrl: './driver-salary.component.html',
  styleUrl: './driver-salary.component.scss'
})
export class DriverSalaryComponent implements OnChanges, OnInit {
  @Input() tableWidth: string = 'calc(100vw - 336px)';
  @Input() counterpartyData: any = {};
  @Input() endpoint: any;
  @Input() endpointGetData: any;
  @Input() columns: any;
  @Input() paymentType: number = 1;
  @Input() totalInfoColumn: any;
  @Input() buttonConfigs: Record<string, ButtonConfig[]> = BUTTON_SETS;
  @Input() defaultFilter: any;
  @Input() selectedComponent: string = '';
  @Input() modelForm: any;
  @Input() heightContainer: string = '280px'
  currentConfig: any;

  employeeType: Number = 1;
  selectInvoice: any;
  items: MenuItem[] | undefined;
  invoices: any;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLElement>;

  scrollToTop() {
    if (this.tableContainer && this.tableContainer.nativeElement) {
      this.tableContainer.nativeElement.scrollTop = 0;
    }
  }


  getTaxValue(tax: any) {
    const foundTax = taxes.find((item: any) => item.value === tax);
    return foundTax ? foundTax.label : '';
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['defaultFilter']) {
      this.driverSalaryService.endpoint = this.endpoint;
      this.driverSalaryService.currentPage = 0;
      this.driverSalaryService?.totalInfo?.totalPagesCount;
      this.loadData(true);
      console.log('loadInvoices defaultFilter')
      console.log('counterpartyData', this.counterpartyData)
    }
    if (changes['currentFormField']) {
      this.loadData(true);
      console.log('loadInvoices buttonConfigs')
    }
    if (changes['buttonConfigs']) {
      this.buttonConfigs = this.buttonConfigs;
      this.driverSalaryService.currentPage = 0;
      this.loadData(true);
      console.log('loadInvoices buttonConfigs')
    }
    if (changes['selectedComponent']) {
      this.driverSalaryService.currentPage = 0;
      this.loadData(true);
    }
  }

  selectedProduct: any;
  idCurrentUser: any;
  currentRole: any;
  selectedColumns: string[] = [];

  constructor(private invoiceService: InvoicesContentService,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    // public productsService: ProductsService,
    private toastService: ToastService,
    public driverSalaryService: DriverSalaryService,
    private cdRef: ChangeDetectorRef,
    private jwtService: JwtService,
    private el: ElementRef, private renderer: Renderer2,
    private scoreFormService: ScoreFormService,
    private generalFormService: DriverSalaryFormService,
    private router: Router,
    private route: ActivatedRoute,
    public formatingDataService: FormatingDataService,
    private http: HttpClient) {
    this.driverSalaryService.defaultFilters = [];
  }

  ngOnInit() {
    // Очищаем фильтры перед подпиской
    this.driverSalaryService.defaultFilters = [];
    this.driverSalaryService.queryData.filters = [];
    // Используем take(1) чтобы выполнить только один раз
    this.route.url.pipe(take(1)).subscribe(segments => {
      console.log('URL segments:', segments);

      if (segments.length > 0) {
        const configCode = segments[0].path;
        console.log('configCode from segments:', configCode);

        this.currentConfig = CONFIGS.find(config => config.code === configCode);
        if (this.currentConfig) {
          this.endpoint = this.currentConfig.endpoint;
          this.driverSalaryService.endpoint = this.currentConfig.endpoint;
          this.columns = this.currentConfig.columnsDocs;
          this.totalInfoColumn = this.currentConfig.totalInfoColumn;

          console.log('this.currentConfig.employeeType', this.currentConfig.employeeType);

          this.driverSalaryService.defaultFilters = [];

          // Полностью заменяем фильтры (не добавляем, а заменяем)
          this.driverSalaryService.defaultFilters = [
            // { field: 'productTarget.Code', values: [12], type: 2 },
            {field:'DocInvoice.Partner.Type',values:[0,1,5],type:1},
            {field:'ManagerDocType',values:[0],type:1},
            {field:'DocInvoice.DocAccountType',values:[0],type:1},
            {field:'DocInvoice.DocPaymentType',values:[0],type:1}
          ];

          console.log('Filters after update:', this.driverSalaryService.defaultFilters);
        }
      }
    });

    this.idCurrentUser = localStorage.getItem('VXNlcklk')
    this.renderer.setStyle(this.el.nativeElement, '--table-width', this.tableWidth);
    this.currentRole = this.jwtService.getDecodedToken().email;
    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
    this.loadData(true);
  }

  selectItem(item: any) {
    this.selectData = item;
  }

  onCreate(eventData: any) {
    this.loadData(true);
  }

  @HostBinding('style.--table-width') get cssVariable() {
    return this.tableWidth;
  }

  updateSelectedColumns(columns: string[]) {
    this.selectedColumns = columns;
    this.updateColumnVisibility();
  }

  statuses = [
    { label: 'Черновик', value: 0, id: 0 },
    { label: 'Проверка Механик', value: 1, id: 1 },
    { label: 'Проверка Директор', value: 2, id: 2 },
    { label: 'Отклонено Механик', value: 3, id: 3 },
    { label: 'Отклонено Директор', value: 4, id: 4 },
    { label: 'Подписано', value: 5, id: 5 },
    { label: 'Удалено', value: 6, id: 6 },
    { label: 'Проведено', value: 7, id: 7 }
  ];


  getStatusLabel(value: number): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }

  getStatusClass(value: number): string {
    switch (value) {
      case 0: return 'status-not-checked';
      case 1:
      case 2: return 'status-sent-for-check';
      case 3:
      case 4: return 'status-rejected';
      case 5: return 'status-approved';
      case 6: return 'status-deleted';
      case 7: return 'status-completed';
      default: return '';
    }
  }


  getButtonSet(): ButtonConfig[] {
    switch (this.currentRole) {
      case '7':
        return this.buttonConfigs['logistic'];
      case '6':
        return this.buttonConfigs['householdManager'];
      case '5':
        return this.buttonConfigs['householdManager'];
      case '4':
        return this.buttonConfigs['accountant'];
      case '2':
        return this.buttonConfigs['supplier'];
      case '3':
        return this.buttonConfigs['mechanic'];
      case '1':
        return this.buttonConfigs['director'];
      default:
        return this.buttonConfigs['default'];
    }
  }

  [key: string]: any;
  handleButtonClick(button: ButtonConfig, product: any) {
    if (button.action && typeof this[button.action] === 'function') {
      if ((button.titlePopUp || button.messagePopUp || button.status !== undefined) && button.isEditData != false && button.isEditData != true) {
        this[button.action](product, button.status, button.titlePopUp, button.messagePopUp);
      } else if (button.isEditData == false || button.isEditData == true) {
        this.isEditInvoice = button.isEditData
        this[button.action](product);
      } else {
        this[button.action](product);
      }
    } else {
      console.error(`Action method '${button.action}' not found.`);
    }
    this.cdRef.detectChanges();
  }

  private paymentTypes = [
    { label: 'Нал', value: 0 },
    { label: 'Без нал', value: 1 },
    { label: 'Без нал без НДС', value: 2 }
  ];

  transform(value: number): string {
    const found = this.paymentTypes.find(pt => pt.value === value);
    return found ? found.label : '';
  }


  openScopeModal() {
    this.scoreFormService.selectInvoiceId = this.selectInvoiceId;
    this.scoreFormService.selectInvoiceFullName = this.counterpartyData?.fullName;
    this.scoreFormService.selectInvoiceShortName = this.counterpartyData?.shortName;
    this.dataSelectScope = null;
    this.scoreFormService.visibleModal(true);
  }


  updateColumnVisibility() {
    this.columns.forEach((col: any) => {
      col.visible = this.selectedColumns.includes(col.field);
    });
  }

  isColumnVisible(column: any): boolean {
    return column.visible;
  }


  dataSelectScope: any;


  getTotalValue(columnIndex: number): string | null {
    if (!this.driverSalaryService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.driverSalaryService.totalInfo?.[column.value] ?? 0 : null;

    if (value === null) return null;

    if (typeof value === 'number') {
      return value.toFixed(2).replace('.', ',');
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return numericValue.toFixed(2).replace('.', ',');
    }

    return value;
  }

  formatNumber(value: any): number {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error('Неверное значение. Не удалось преобразовать в число');
    }
    return Math.round(num * 100) / 100;
  }


  updateInvoice(invoice: any) {
    this.selectInvoice = invoice;
  }

  loading = false;

  loadData(reset = false) {
    if (reset) {
      this.driverSalaryService.currentPage = 0;
      this.invoices = [];
    }

    if (this.loading) return;

    this.loading = true;

    this.driverSalaryService.endpointGetData = this.endpointGetData;
    this.driverSalaryService.getData(
      this.driverSalaryService.currentPage,
      this.driverSalaryService.pageSize
    ).subscribe(
      (response) => {
        const monthNames = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        const mapInvoice = (invoice: any) => {
          const monthIndex = new Date(invoice.dateTime).getMonth();
          const transformed = {
            ...invoice,
            expenseSum: invoice.expenseSum?.toString().replace('.', ','),
            incomeSum: invoice.incomeSum?.toString().replace('.', ','),
            year: new Date(invoice.dateTime).getFullYear(),
            month: monthNames[monthIndex]
          };

          return transformed;
        };

        let newInvoices = [];
        if (response.documentMetadata && response.documentMetadata.data) {
          newInvoices = response.documentMetadata.data.map(mapInvoice);
        } else if (response.data) {
          newInvoices = response.data.map(mapInvoice);
        }

        if (response.totalInfo && response.totalInfo?.totalPagesCount) {
          this.driverSalaryService.totalRecords = response.totalInfo?.totalPagesCount * this.driverSalaryService.pageSize;
        }

        if (reset || this.driverSalaryService.currentPage === 0) {
          this.invoices = newInvoices;
        } else {
          this.invoices = [...this.invoices, ...newInvoices];
        }

        this.driverSalaryService.setActiveData(this.invoices);
        this.driverSalaryService.totalInfo = response.totalInfo;
        this.driverSalaryService.totalPages = response.totalPages;
        this.driverSalaryService.currentPage++;
        this.loading = false;
      },
      (error) => {
        this.toastService.showError('Ошибка', 'Не удалось загрузить счета!');
        this.loading = false;
      }
    );
  }

  deleteItem(id: string) {
    const token = localStorage.getItem('YXV0aFRva2Vu');

    this.http.delete(`${environment.apiUrl}/api/CommercialWork/DocInvoice/${id}`, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    }).subscribe(
      (response: any) => {
        const index = this.invoices.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          this.invoices.splice(index, 1);
        }
        this.invoices = [...this.invoices];
      },
      (error) => {
        console.error('Ошибка при удалении:', error);
      }
    );
  }


  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom && this.driverSalaryService.totalPages && this.driverSalaryService.currentPage < this.driverSalaryService.totalPages) {
      this.loadData();
    }
  }

  formatIsNumber(value: any): string {
    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(',', '.'))
      : Number(value);

    if (isNaN(numericValue)) return '0';

    if (Number.isInteger(numericValue)) {
      return numericValue.toLocaleString('ru-RU');
    } else {
      const formatted = numericValue.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formatted.endsWith(',00')
        ? formatted.replace(',00', '')
        : formatted;
    }
  }

  deleteInvoice(invoiceId: any) {
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить счет-фактуру?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        let endpoint;
        if (endpoint != '/api/CommercialWork/DocInvoice') {
          endpoint = this.endpoint;
        } else {
          endpoint = '/api/CommercialWork/DocInvoice';

        }

        this.invoiceService.deleteInvoice(invoiceId, endpoint, this.driverSalaryService.defaultFilters).subscribe(
          (invoice: any) => {
            this.driverSalaryService.removeItemById(invoiceId.id);
            this.driverSalaryService.totalInfo = invoice.totalInfo;
            this.toastService.showSuccess('Удалено', invoice.message);

          },
          (error) => {
            this.toastService.showError('Ошибка', error.error.message);
          }
        );
      }
    });
  }

  selectInvoiceId: any;
  selectData: any;
  isEditInvoice: boolean = false;

  getInvoiceById(invoice: any) {
    console.log('invoice')
    this.invoiceService.getInvoiceById(invoice.id, this.endpoint).subscribe((data: any) => {
      this.selectData = { ...data.data };
      console.log('generalForm invoice', data.data)
    })

  }


  dropdownVisible: { [key: string]: boolean } = {};

  toggleDropdown(productId: string) {
    Object.keys(this.dropdownVisible).forEach(id => {
      if (id !== productId) this.dropdownVisible[id] = false;
    });

    this.dropdownVisible[productId] = !this.dropdownVisible[productId];
    this.cdRef.detectChanges();
  }



  createInvoiceFromAccount(product: any) {
    this.invoiceService.docInvoiceFromAccount(product.id).subscribe((data: any) => {
      this.getInvoiceById(data.documentMetadata.data)
    },
      (error) => {
        console.error('Error deleting invoice', error);
        this.toastService.showError('Ошибка', error.error.Message);
      })
  }


  sendingInvoice(doc: any) {
    if (this.currentRole == 1) {
      doc.status = 5;
    } else {
      doc.status = 2;
    }
    this.generalFormService.sendingVerification(doc, status).subscribe(
      (updatedInvoice: any) => {
        this.driverSalaryService.addOrUpdateItem(updatedInvoice.data);
        this.contextMenuVisible = false;
      },
      error => {
        console.error('Ошибка при отправке на проверку:', error);
        this.toastService.showError('Ошибка', error.error.message);
      }
    );
  }


  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;

  onRightClick(event: MouseEvent, product: any) {
    event.preventDefault();

    this.selectedProduct = product;
    this.contextMenuVisible = true;

    let posX = event.pageX;
    let posY = event.pageY;

    const menuWidth = 200;
    const menuHeight = 150;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scrollY = window.scrollY;

    if (posX + menuWidth > screenWidth) {
      posX = screenWidth - menuWidth - 10;
    }

    if (posY + menuHeight > screenHeight + scrollY) {
      posY = event.pageY - menuHeight;
    }

    this.contextMenuX = posX;
    this.contextMenuY = posY;
  }


  closeAllMenus() {
    this.contextMenuVisible = false;
    this.dropdownVisible = {};
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.context-menu') && !target.closest('.dropdown')) {
      this.closeAllMenus();
    }
  }

  ngOnDestroy() {
    // Очищаем фильтры при уничтожении компонента
    this.driverSalaryService.defaultFilters = [];
  }

}
