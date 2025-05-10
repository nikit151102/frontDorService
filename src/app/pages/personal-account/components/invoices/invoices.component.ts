import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DateFilterSortComponent } from '../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { ProductsService } from '../products/products.service';
import { InvoicesFormComponent } from './invoices-form/invoices.component';
import { ConfirmPopupService } from '../../../../components/confirm-popup/confirm-popup.service';
import { InvoicesContentService } from '../../tabs/partners/invoices-content/invoices-content.service';
import { InvoicesService } from './invoices.service';
import { JwtService } from '../../../../services/jwt.service';
import { ToastService } from '../../../../services/toast.service';
import { InvoicePaymentComponent } from '../invoice-payment/invoice-payment.component';
import { InvoicePaymentService } from '../invoice-payment/invoice-payment.service';
import { GeneralFormComponent } from '../generalForm/general-form.component';
import { ScoreFormComponent } from '../score-form/score-form.component';
import { ScoreFormService } from '../score-form/score-form.service';
import { Router } from '@angular/router';
import { ButtonConfig } from '../../tabs/partners/invoices-content/button-config';
import { taxes } from '../../../../services/data';
import { PartnersService } from '../../tabs/partners/partners.service';

@Component({
  selector: 'app-invoices',
  providers: [ProductsService, MessageService],
  imports: [CommonModule,
    TableModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    MenuModule,
    InvoicesFormComponent,
    InvoicePaymentComponent,
    GeneralFormComponent,
    ScoreFormComponent
    // SettingsComponent
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnChanges, OnInit {
  @Input() tableWidth: string = 'calc(100vw - 336px)';
  @Input() counterpartyId!: any;
  @Input() counterpartyData: any = {};
  @Input() endpoint: any;
  @Input() endpointGetData: any;
  @Input() columns: any;
  @Input() paymentType: number = 1;
  @Input() totalInfoColumn: any;
  @Input() buttonConfigs!: Record<string, ButtonConfig[]>;
  @Input() generalForm: boolean = false;
  @Input() defaultFilter: any;
  selectInvoice: any;
  items: MenuItem[] | undefined;
  invoices: any;

  getTaxValue(tax: any) {
    const foundTax = taxes.find((item: any) => item.value === tax);
    return foundTax ? foundTax.label : '';
  }
  ngOnChanges(changes: SimpleChanges) {

    if (changes['defaultFilter']) {
      this.invoicesService.counterpartyId = this.counterpartyId;
      this.invoicesService.endpoint = this.endpoint;
      this.currentPage = 0;
      this.invoicesService?.totalInfo?.totalPagesCount;
      this.loadInvoices();
      console.log('loadInvoices defaultFilter')
      console.log('counterpartyData', this.counterpartyData)
    }
    if (changes['counterpartyId']) {
      this.invoicesService.counterpartyId = this.counterpartyId;
      this.invoicesService.endpoint = this.endpoint;
      this.currentPage = 0;
      this.loadInvoices();
      console.log('loadInvoices counterpartyId')
      console.log('counterpartyData', this.counterpartyData)
    }

    if (changes['buttonConfigs']) {
      this.buttonConfigs = this.buttonConfigs;
      this.loadInvoices();
      console.log('loadInvoices buttonConfigs')
    }
    this.partnersService.selectCounterpartyId = this.counterpartyId;
    console.log('this.partnersService.selectCounterpartyId', this.partnersService.selectCounterpartyId)
  }

  selectedProduct: any;
  idCurrentUser: any;
  currentRole: any;
  selectedColumns: string[] = [];
  typeValueRoute: boolean = true;

  constructor(private invoiceService: InvoicesContentService,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    // public productsService: ProductsService,
    private toastService: ToastService,
    public invoicesService: InvoicesService,
    private cdRef: ChangeDetectorRef,
    private jwtService: JwtService,
    public invoicePaymentService: InvoicePaymentService,
    private el: ElementRef, private renderer: Renderer2,
    private scoreFormService: ScoreFormService,
    private partnersService: PartnersService,
    private router: Router) { }

  ngOnInit() {

    const currentUrl = this.router.url;
    this.typeValueRoute = currentUrl.includes('/cash') ? false : true;
    console.log('this.invoicesService.counterpartyId', this.invoicesService.counterpartyId)

    this.idCurrentUser = localStorage.getItem('VXNlcklk')
    this.renderer.setStyle(this.el.nativeElement, '--table-width', this.tableWidth);

    this.currentRole = this.jwtService.getDecodedToken().email; // 1- "Снабженец" 2- "Механик"  3-"Директор"

    this.invoicesService.activData$.subscribe((data: any) => {
      console.log('invoices', data)
      this.invoices = data;
      this.cdRef.detectChanges();
    })
    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
    this.loadInvoices();
  }

  @HostBinding('style.--table-width') get cssVariable() {
    return this.tableWidth;
  }

  updateSelectedColumns(columns: string[]) {
    this.selectedColumns = columns;
    this.updateColumnVisibility();
  }

  getButtonSet(): ButtonConfig[] {
    switch (this.currentRole) {
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

  openPaymentModal() {
    this.invoicePaymentService.selectInvoiceId = this.selectInvoiceId;
    this.invoicePaymentService.selectInvoiceFullName = this.counterpartyData?.fullName;
    this.invoicePaymentService.selectInvoiceShortName = this.counterpartyData?.shortName;
    this.invoicePaymentService.visibleModal(true)
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

  editScopeData(selectData: any) {
    this.openScopeModal();
    this.dataSelectScope = selectData;
  }

  getTotalValue(columnIndex: number): any {
    if (!this.invoicesService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.invoicesService.totalInfo?.[column.value] ?? 0 : null;

    return typeof value === 'number' ? value.toString().replace('.', ',') : value;
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


  // onActionClick(actionName: string, product: any) {
  //   if (this.invoicesService && typeof this.productService[actionName] === 'function') {
  //     this.productService[actionName](product);
  //   } else {
  //     console.error(`Method ${actionName} does not exist on ProductsService`);
  //   }
  // }


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
  totalRecords = 0;
  totalPages = null;
  pageSize = 30;
  currentPage = 0;

  loadInvoices(reset = false) {
    if (reset) {
      this.currentPage = 0;
      this.invoices = [];
    }

    if (this.loading) return;

    this.loading = true;

    this.invoicesService.endpointGetData = this.endpointGetData;
    this.invoicesService.getProductsByCounterparty(
      this.counterpartyId,
      this.currentPage,
      this.pageSize
    ).subscribe(
      (response) => {
        const mapInvoice = (invoice: any) => {
          const transformed = {
            ...invoice,
            expenseSum: invoice.expenseSum?.toString().replace('.', ','),
            incomeSum: invoice.incomeSum?.toString().replace('.', ',')
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
          this.totalRecords = response.totalInfo?.totalPagesCount * this.pageSize;
        }

        if (reset || this.currentPage === 0) {
          this.invoices = newInvoices;
        } else {
          this.invoices = [...this.invoices, ...newInvoices];
        }

        this.invoicesService.setActiveData(this.invoices);
        this.invoicesService.totalInfo = response.totalInfo;
        this.totalPages = response.totalPages;
        this.currentPage++;
        this.loading = false;
      },
      (error) => {
        this.toastService.showError('Ошибка', 'Не удалось загрузить счета!');
        this.loading = false;
      }
    );
  }

  onScroll(event: any) {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom && this.totalPages && this.currentPage < this.totalPages) {
      this.loadInvoices();
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

        this.invoiceService.deleteInvoice(invoiceId, endpoint, this.invoicesService.defaultFilters).subscribe(
          (invoice: any) => {
            this.invoicesService.removeItemById(invoiceId.id);
            this.invoicesService.totalInfo = invoice.totalInfo;
            this.toastService.showSuccess('Удалено', invoice.message);

          },
          (error) => {
            this.toastService.showError('Ошибка', error.error.message);
          }
        );
      }
    });
  }

  verificationInvoice(invoice: any, status: any, titlePopUp: any, messagePopUp: any) {
    this.confirmPopupService.openConfirmDialog({
      title: titlePopUp,
      message: messagePopUp,
      acceptLabel: 'Отправить',
      rejectLabel: 'Отмена',
      onAccept: () => {



        this.invoiceService.sendingVerification(this.transformToSecondFormat(invoice), status, this.endpoint).subscribe(
          (response: any) => {
            this.invoicesService.updateActiveData(response.data);
          },
          (error) => {
            console.error('Error deleting invoice', error);
            this.toastService.showError('Ошибка', error.error.message);
          }
        );
      }
    });
  }

  private transformToSecondFormat(source: any): any {
    return {
      changeDateTime: source.changeDateTime,
      comment: source.comment,
      createDateTime: source.createDateTime,
      creatorId: source.creatorId,
      docAccountType: source.docAccountType,
      drafted: source.drafted,
      expenseSum: this.parseNumberWithComma(source.expenseSum),
      id: source.id,
      incomeSum: this.parseNumberWithComma(source.incomeSum),
      notifyStatus: source.notifyStatus,
      number: source.number,
      partnerId: source.partner?.id ?? source.partnerId ?? null,
      paymentDateTime: source.paymentDateTime,
      status: source.status,
      type: source.type
    };
  }


  private parseNumberWithComma(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'number') {
      return value;
    }
    const cleanedValue = value.replace(/\s/g, '').replace(/,/g, '.');
    const parsed = parseFloat(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  }


  selectInvoiceId: any;
  selectData: any;
  isEditInvoice: boolean = false;

  getInvoiceById(invoice: any) {
    console.log('invoice')
    this.invoiceService.getInvoiceById(invoice.id, this.endpoint).subscribe((data: any) => {
      if (data.data.docAccountType == 0) {
        if (this.generalForm) {
          this.selectData = { ...data.data };
          console.log('generalForm invoice', data.data)
        } else {
          this.selectInvoiceId = { ...data.data.id };
          this.isEditInvoice = true;
        }
      } else if (data.data.drafts != null) {
        this.isEditInvoice = true;
        this.selectInvoiceId = { ...data.data.id };
      } else {

        const currentUrl = this.router.url;
        let typeValueRoute = currentUrl.includes('/base') ? true : false;

        if (this.generalForm && typeValueRoute == true) {
          this.selectData = { ...data.data };
          console.log('generalForm invoice', data.data)
        } else {
          this.editScopeData(data.data);
        }
      }
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

}
