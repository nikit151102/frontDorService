import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
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
import { FormatingDataService } from '../../../../services/formating-data.service';

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
  @Input() selectedComponent: string = '';
  @Input() modelForm: any;
  @Input() heightContainer: string = '280px'

  @Output() totalInfo = new EventEmitter<any>()
  selectInvoice: any;
  items: MenuItem[] | undefined;
  invoices: any;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLElement>;

  // Для массовых действий
  selectedProducts: Set<string> = new Set<string>();
  isProcessingBulkAction: boolean = false;
  currentSelectionStatus: number | null = null;

  // Для попапа переключения статуса
  showStatusSwitchPopup: boolean = false;
  pendingProduct: any = null;
  pendingStatusValue: number | null = null;
  popupPosition: { top: number; left: number } = { top: 0, left: 0 };

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
      this.invoicesService.counterpartyId = this.counterpartyId;
      this.invoicesService.endpoint = this.endpoint;
      this.invoicesService.currentPage = 0;
      this.invoicesService?.totalInfo?.totalPagesCount;
      this.loadInvoices(true);
    }
    if (changes['counterpartyId']) {
      this.invoicesService.counterpartyId = this.counterpartyId;
      this.invoicesService.endpoint = this.endpoint;
      this.invoicesService.currentPage = 0;
      this.loadInvoices(true);
      this.clearSelection();
    }
    if (changes['currentFormField']) {
      this.loadInvoices(true);
    }
    if (changes['buttonConfigs']) {
      this.buttonConfigs = this.buttonConfigs;
      this.invoicesService.currentPage = 0;
      this.loadInvoices(true);
    }
    if (changes['selectedComponent']) {
      this.invoicesService.currentPage = 0;
      this.loadInvoices(true);
    }
    this.partnersService.selectCounterpartyId = this.counterpartyId;
  }

  selectedProduct: any;
  idCurrentUser: any;
  currentRole: any;
  selectedColumns: string[] = [];
  typeValueRoute: boolean = true;

  constructor(private invoiceService: InvoicesContentService,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    private toastService: ToastService,
    public invoicesService: InvoicesService,
    private cdRef: ChangeDetectorRef,
    private jwtService: JwtService,
    public invoicePaymentService: InvoicePaymentService,
    private el: ElementRef, private renderer: Renderer2,
    private scoreFormService: ScoreFormService,
    private partnersService: PartnersService,
    private router: Router,
    public formatingDataService: FormatingDataService) { }

  ngOnInit() {
    const currentUrl = this.router.url;
    this.typeValueRoute = currentUrl.includes('/cash') ? false : true;

    this.idCurrentUser = localStorage.getItem('VXNlcklk')
    this.renderer.setStyle(this.el.nativeElement, '--table-width', this.tableWidth);

    this.currentRole = this.jwtService.getDecodedToken().email;

    this.invoicesService.activData$.subscribe((data: any) => {
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
        return this.buttonConfigs['director2'];
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

  // Получение статуса продукта
  getProductStatus(product: any): number {
    return product.status !== undefined ? product.status : product.invoiceStatus;
  }

  // Проверка, доступна ли кнопка для данного статуса
  isButtonAvailableForStatus(button: ButtonConfig, status: number | null): boolean {
    if (status === null) return true;

    // Проверяем по condition в кнопке
    if (button.condition) {
      // Создаем фиктивный продукт с нужным статусом для проверки
      const mockProduct = { status: status, invoiceStatus: status };
      return button.condition(mockProduct, this.idCurrentUser);
    }
    return true;
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

  // ==================== МАССОВЫЕ ДЕЙСТВИЯ ====================

  async executeBulkAction(button: ButtonConfig) {
    if (this.isProcessingBulkAction) {
      this.toastService.showError('Внимание', 'Дождитесь завершения предыдущей операции');
      return;
    }

    const selectedItems = this.invoices.filter((invoice: any) =>
      this.selectedProducts.has(invoice.id)
    );

    if (selectedItems.length === 0) return;

    // Подтверждение для массового действия
    this.confirmPopupService.openConfirmDialog({
      title: `Массовое действие: ${button.label}`,
      message: `Вы уверены, что хотите выполнить "${button.label}" для ${selectedItems.length} записей со статусом "${this.getStatusLabel(this.currentSelectionStatus)}"?`,
      acceptLabel: 'Выполнить',
      rejectLabel: 'Отмена',
      onAccept: async () => {
        await this.processBulkAction(button, selectedItems);
      }
    });
  }

  async processBulkAction(button: ButtonConfig, items: any[]) {
    this.isProcessingBulkAction = true;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    this.toastService.showInfo('Выполнение', `Начинаю обработку ${items.length} записей...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        await this.executeBulkSingleAction(button, item);
        successCount++;
        if ((i + 1) % 5 === 0 || i === items.length - 1) {
          this.toastService.showInfo('Прогресс', `Обработано ${i + 1} из ${items.length}`);
        }
      } catch (error: any) {
        errorCount++;
        errors.push(`${item.number || item.id}: ${error.message || 'Ошибка'}`);
        console.error(`Ошибка при обработке ${item.id}:`, error);
      }
    }

    this.isProcessingBulkAction = false;

    if (successCount > 0) {
      this.toastService.showSuccess('Завершено', `Успешно обработано: ${successCount} из ${items.length} записей`);
      this.clearSelection();
      this.loadInvoices(true);
    }
    if (errorCount > 0) {
      const errorMessage = errors.length > 3 ? `${errors.slice(0, 3).join(', ')} и ещё ${errors.length - 3} ошибок` : errors.join(', ');
      this.toastService.showError('Ошибки', `Не удалось обработать ${errorCount} записей: ${errorMessage}`);
    }
  }

  private async executeBulkSingleAction(button: ButtonConfig, product: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const actionName = button.action;

      switch (actionName) {
        case 'deleteInvoice':
          this.bulkDeleteInvoice(product).then(resolve).catch(reject);
          break;
        case 'verificationInvoice':
          if (button.status !== undefined) {
            this.bulkVerificationInvoice(product, button.status).then(resolve).catch(reject);
          } else {
            reject(new Error('Не указан статус для верификации'));
          }
          break;
        default:
          if (typeof this[actionName] === 'function') {
            try {
              const result = this[actionName](product);
              if (result instanceof Promise) {
                result.then(resolve).catch(reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`Метод '${actionName}' не найден`));
          }
      }
    });
  }

  private async bulkDeleteInvoice(invoice: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let endpoint = this.endpoint;
      if (endpoint === '/api/CommercialWork/DocInvoice') {
        endpoint = '/api/CommercialWork/DocInvoice';
      }

      this.invoiceService.deleteInvoice(invoice, endpoint, this.invoicesService.defaultFilters).subscribe(
        (response: any) => {
          this.invoicesService.removeItemById(invoice.id);
          resolve(response);
        },
        (error) => {
          reject(error.error || error);
        }
      );
    });
  }

  private async bulkVerificationInvoice(invoice: any, status: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.invoiceService.sendingVerification(
        this.transformToSecondFormat(invoice),
        status,
        this.endpoint
      ).subscribe(
        (response: any) => {
          this.invoicesService.updateActiveData(response.data);
          resolve(response);
        },
        (error) => {
          reject(error.error || error);
        }
      );
    });
  }

  // ==================== МЕТОДЫ ДЛЯ РАБОТЫ С ВЫДЕЛЕНИЕМ ====================

  toggleSelectionWithCheck(event: any, product: any) {
    const isChecked = event.target.checked;
    const productStatus = this.getProductStatus(product);

    // Если пытаемся выделить, но уже есть выделенные с другим статусом
    if (isChecked && this.selectedProducts.size > 0 && this.currentSelectionStatus !== null && productStatus !== this.currentSelectionStatus) {
      // Показываем попап
      this.pendingProduct = product;
      this.pendingStatusValue = productStatus;
      this.showStatusSwitchPopup = true;

      // Получаем позицию чекбокса для попапа
      const rect = event.target.getBoundingClientRect();
      this.popupPosition = {
        top: rect.top + window.scrollY - 10,
        left: rect.right + window.scrollX + 10
      };

      // Возвращаем чекбокс в исходное состояние
      event.target.checked = false;
      return;
    }

    // Обычное выделение/снятие
    if (isChecked) {
      this.selectedProducts.add(product.id);
      if (this.currentSelectionStatus === null) {
        this.currentSelectionStatus = productStatus;
      }
    } else {
      this.selectedProducts.delete(product.id);
      if (this.selectedProducts.size === 0) {
        this.currentSelectionStatus = null;
      }
    }
    this.cdRef.detectChanges();
  }

  // Переключиться на новый статус
  switchToNewStatus() {
    if (this.pendingStatusValue !== null) {
      // Очищаем текущее выделение
      this.selectedProducts.clear();
      // Устанавливаем новый статус
      this.currentSelectionStatus = this.pendingStatusValue;
      // Выделяем все записи с новым статусом
      this.invoices.forEach((product: any) => {
        if (this.getProductStatus(product) === this.pendingStatusValue) {
          this.selectedProducts.add(product.id);
        }
      });
    }
    this.showStatusSwitchPopup = false;
    this.pendingProduct = null;
    this.pendingStatusValue = null;
    this.cdRef.detectChanges();
  }

  // Отмена переключения
  cancelStatusSwitch() {
    this.showStatusSwitchPopup = false;
    this.pendingProduct = null;
    this.pendingStatusValue = null;
  }

  toggleSelectAll(event: any) {
    const isChecked = event.target.checked;

    if (isChecked) {
      // Если нет выделенных - выделяем всё
      if (this.selectedProducts.size === 0) {
        this.invoices.forEach((product: any) => {
          this.selectedProducts.add(product.id);
        });
        // Определяем статус для массового выделения (если все одного статуса)
        const firstStatus = this.invoices.length > 0 ? this.getProductStatus(this.invoices[0]) : null;
        const allSameStatus = this.invoices.every((p: any) => this.getProductStatus(p) === firstStatus);
        this.currentSelectionStatus = allSameStatus ? firstStatus : null;
      } else {
        // Если уже есть выделенные - выделяем только записи с таким же статусом
        this.invoices.forEach((product: any) => {
          if (this.getProductStatus(product) === this.currentSelectionStatus) {
            this.selectedProducts.add(product.id);
          }
        });
      }
    } else {
      this.selectedProducts.clear();
      this.currentSelectionStatus = null;
    }
    this.cdRef.detectChanges();
  }

  isAllSelected(): boolean {
    if (this.selectedProducts.size === 0) return false;
    if (this.currentSelectionStatus !== null) {
      const sameStatusItems = this.invoices.filter((p: any) => this.getProductStatus(p) === this.currentSelectionStatus);
      return sameStatusItems.length > 0 && sameStatusItems.every((p: any) => this.selectedProducts.has(p.id));
    }
    return this.invoices?.length > 0 && this.invoices.every((product: any) => this.selectedProducts.has(product.id));
  }

  isIndeterminate(): boolean {
    const selectedCount = this.selectedProducts.size;
    if (selectedCount === 0) return false;
    if (this.currentSelectionStatus !== null) {
      const sameStatusItems = this.invoices.filter((p: any) => this.getProductStatus(p) === this.currentSelectionStatus);
      return selectedCount > 0 && selectedCount < sameStatusItems.length;
    }
    return selectedCount > 0 && selectedCount < (this.invoices?.length || 0);
  }

  clearSelection() {
    this.selectedProducts.clear();
    this.currentSelectionStatus = null;
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

  getTotalValue(columnIndex: number): string | null {
    if (!this.invoicesService.totalInfo) return null;

    const column = this.totalInfoColumn.find((col: any) => col.columnNum === columnIndex);
    const value = column ? this.invoicesService.totalInfo?.[column.value] ?? 0 : null;

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

  getStatusLabel(value: any): string {
    return this.statuses.find(status => status.value === value)?.label || 'Неизвестный статус';
  }

  getStatusClass(value: any): string {
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
      this.invoicesService.currentPage = 0;
      this.invoices = [];
      this.clearSelection();
    }

    if (this.loading) return;

    this.loading = true;

    this.invoicesService.endpointGetData = this.endpointGetData;
    this.invoicesService.getProductsByCounterparty(
      this.counterpartyId,
      this.invoicesService.currentPage,
      this.invoicesService.pageSize
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

        this.totalInfo.emit(response.totalInfo);

        if (response.totalInfo && response.totalInfo?.totalPagesCount) {
          this.invoicesService.totalRecords = response.totalInfo?.totalPagesCount * this.invoicesService.pageSize;
        }

        if (reset || this.invoicesService.currentPage === 0) {
          this.invoices = newInvoices;
          this.clearSelection();
        } else {
          this.invoices = [...this.invoices, ...newInvoices];
        }

        this.invoicesService.setActiveData(this.invoices);
        this.invoicesService.totalInfo = response.totalInfo;
        this.invoicesService.totalPages = response.totalPages;
        this.invoicesService.currentPage++;
        this.loading = false;
        this.cdRef.detectChanges();
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

    if (atBottom && this.invoicesService.totalPages && this.invoicesService.currentPage < this.invoicesService.totalPages) {
      this.loadInvoices();
    }
  }

  deleteInvoice(invoice: any) {
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить счет-фактуру?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        let endpoint = this.endpoint;
        if (endpoint === '/api/CommercialWork/DocInvoice') {
          endpoint = '/api/CommercialWork/DocInvoice';
        }

        this.invoiceService.deleteInvoice(invoice, endpoint, this.invoicesService.defaultFilters).subscribe(
          (response: any) => {
            this.invoicesService.removeItemById(invoice.id);
            this.invoicesService.totalInfo = response.totalInfo;
            this.toastService.showSuccess('Удалено', response.message);
            if (this.selectedProducts.has(invoice.id)) {
              this.selectedProducts.delete(invoice.id);
            }
          },
          (error) => {
            this.toastService.showError('Ошибка', error.error?.message || 'Не удалось удалить');
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
        this.invoiceService.sendingVerification(
          this.transformToSecondFormat(invoice),
          status,
          this.endpoint
        ).subscribe(
          (verificationResponse: any) => {
            this.invoicesService.updateActiveData(verificationResponse.data);
            this.toastService.showSuccess('Успешно', 'Статус обновлен');
          },
          (error) => {
            console.error('Error verifying invoice', error);
            this.toastService.showError('Ошибка', error.error?.message || 'Не удалось обновить статус');
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
    this.invoiceService.getInvoiceById(invoice.id, this.endpoint).subscribe((data: any) => {
      if (data.data.docAccountType == 0) {
        if (this.generalForm) {
          this.selectData = { ...data.data };
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
        console.error('Error creating invoice', error);
        this.toastService.showError('Ошибка', error.error?.Message || 'Не удалось создать счет');
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
    if (!target.closest('.context-menu') && !target.closest('.dropdown') && !target.closest('.status-switch-popup')) {
      this.closeAllMenus();
      if (this.showStatusSwitchPopup) {
        this.showStatusSwitchPopup = false;
      }
    }
  }
}