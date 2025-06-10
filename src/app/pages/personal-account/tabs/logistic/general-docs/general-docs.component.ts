import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { ConfirmPopupService } from '../../../../../components/confirm-popup/confirm-popup.service';
import { DateFilterSortComponent } from '../../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { taxes } from '../../../../../services/data';
import { JwtService } from '../../../../../services/jwt.service';
import { ToastService } from '../../../../../services/toast.service';
import { GeneralFormComponent } from '../../../components/generalForm/general-form.component';
import { InvoicePaymentService } from '../../../components/invoice-payment/invoice-payment.service';
import { InvoicesService } from '../../../components/invoices/invoices.service';
import { ScoreFormService } from '../../../components/score-form/score-form.service';
import { ButtonConfig } from '../../partners/invoices-content/button-config';
import { InvoicesContentService } from '../../partners/invoices-content/invoices-content.service';
import { PartnersService } from '../../partners/partners.service';
import { BUTTON_SETS, columnsDocs, endpoint, totalInfoColumn } from './config';
import { GeneralDocsService } from './general-docs.service';
import { GeneralDocsFormComponent } from './general-docs-form/general-docs-form.component';

@Component({
  selector: 'app-general-docs',
  providers: [MessageService],
  imports: [CommonModule,
    SearchFilterSortComponent,
    DateFilterSortComponent,
    NumberFilterComponent,
    UuidSearchFilterSortComponent,
    GeneralDocsFormComponent
    // SettingsComponent
  ],
  templateUrl: './general-docs.component.html',
  styleUrl: './general-docs.component.scss'
})
export class GeneralDocsComponent implements OnChanges, OnInit {
  @Input() tableWidth: string = 'calc(100vw - 336px)';
  @Input() counterpartyData: any = {};
  @Input() endpoint: any;
  @Input() endpointGetData: any;
  @Input() columns: any = columnsDocs;
  @Input() paymentType: number = 1;
  @Input() totalInfoColumn: any = totalInfoColumn;
  @Input() buttonConfigs: Record<string, ButtonConfig[]> = BUTTON_SETS;
  @Input() defaultFilter: any;
  @Input() selectedComponent: string = '';
  @Input() modelForm: any;
  @Input() heightContainer: string = '280px'

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
      this.generalDocsService.endpoint = this.endpoint;
      this.generalDocsService.currentPage = 0;
      this.generalDocsService?.totalInfo?.totalPagesCount;
      this.loadInvoices(true);
      console.log('loadInvoices defaultFilter')
      console.log('counterpartyData', this.counterpartyData)
    }
    if (changes['currentFormField']) {
      this.loadInvoices(true);
      console.log('loadInvoices buttonConfigs')
    }
    if (changes['buttonConfigs']) {
      this.buttonConfigs = this.buttonConfigs;
      this.generalDocsService.currentPage = 0;
      this.loadInvoices(true);
      console.log('loadInvoices buttonConfigs')
    }
    if (changes['selectedComponent']) {
      this.generalDocsService.currentPage = 0;
      this.loadInvoices(true);
    }
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
    public generalDocsService: GeneralDocsService,
    private cdRef: ChangeDetectorRef,
    private jwtService: JwtService,
    public invoicePaymentService: InvoicePaymentService,
    private el: ElementRef, private renderer: Renderer2,
    private scoreFormService: ScoreFormService,
    private partnersService: PartnersService,
    private router: Router) { }

  ngOnInit() {
    this.endpoint = endpoint;
    this.generalDocsService.endpoint = endpoint;
    const currentUrl = this.router.url;
    this.typeValueRoute = currentUrl.includes('/cash') ? false : true;

    this.idCurrentUser = localStorage.getItem('VXNlcklk')
    this.renderer.setStyle(this.el.nativeElement, '--table-width', this.tableWidth);

    this.currentRole = this.jwtService.getDecodedToken().email; // 1- "Снабженец" 2- "Механик"  3-"Директор"

    this.generalDocsService.activData$.subscribe((data: any) => {
      console.log('invoices', data)
      this.invoices = data;
      this.cdRef.detectChanges();
    })
    this.selectedColumns = this.columns.map((col: any) => col.field);
    this.updateColumnVisibility();
    this.loadInvoices(true);
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


  getTotalValue(columnIndex: number): string | null {
    if (!this.generalDocsService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.generalDocsService.totalInfo?.[column.value] ?? 0 : null;

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

  loadInvoices(reset = false) {
    if (reset) {
      this.generalDocsService.currentPage = 0;
      this.invoices = [];
    }

    if (this.loading) return;

    this.loading = true;

    this.generalDocsService.endpointGetData = this.endpointGetData;
    this.generalDocsService.getProductsByCounterparty(
      this.generalDocsService.currentPage,
      this.generalDocsService.pageSize
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
          this.generalDocsService.totalRecords = response.totalInfo?.totalPagesCount * this.generalDocsService.pageSize;
        }

        if (reset || this.generalDocsService.currentPage === 0) {
          this.invoices = newInvoices;
        } else {
          this.invoices = [...this.invoices, ...newInvoices];
        }

        this.generalDocsService.setActiveData(this.invoices);
        this.generalDocsService.totalInfo = response.totalInfo;
        this.generalDocsService.totalPages = response.totalPages;
        this.generalDocsService.currentPage++;
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

    if (atBottom && this.generalDocsService.totalPages && this.generalDocsService.currentPage < this.generalDocsService.totalPages) {
      this.loadInvoices();
    }
  }

  formatisNumber(value: any): string {
    const numericValue = typeof value === 'string'
      ? parseFloat(value.replace(',', '.'))
      : Number(value);

    if (isNaN(numericValue)) return '0';

    if (Number.isInteger(numericValue)) {
      return numericValue.toString();
    } else {
      const formatted = numericValue.toFixed(2);
      return formatted.endsWith('.00')
        ? formatted.replace('.00', '')
        : formatted.replace('.', ',');
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

        this.invoiceService.deleteInvoice(invoiceId, endpoint, this.generalDocsService.defaultFilters).subscribe(
          (invoice: any) => {
            this.generalDocsService.removeItemById(invoiceId.id);
            this.generalDocsService.totalInfo = invoice.totalInfo;
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
