import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { statuses, taxes, types, adjustmentOptions, columns, productColumns } from '../../../../../services/data';
import { ConfirmPopupService } from '../../../../../components/confirm-popup/confirm-popup.service';
import { InvoicesService } from '../invoices.service';
import { InvoicesContentService } from '../../../tabs/partners/invoices-content/invoices-content.service';
import { CustomDropdownComponent } from '../../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomInputNumberComponent } from '../../../../../ui-kit/custom-input-number/custom-input-number.component';
import { CustomInputComponent } from '../../../../../ui-kit/custom-input/custom-input.component';
import { JwtService } from '../../../../../services/jwt.service';
import { ToastService } from '../../../../../services/toast.service';
import { InvoicesEditPartnerPopUpComponent } from './invoices-edit-partner-pop-up/invoices-edit-partner-pop-up.component';
import { InvoicesEditPartnerPopUpService } from './invoices-edit-partner-pop-up/invoices-edit-partner-pop-up.service';
import { ButtonConfig } from '../../partner-menu/button-config';
import { InfoScopeComponent } from './info-scope/info-scope.component';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';

@Component({
  selector: 'app-invoices-form',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDropdownComponent,
    CustomInputNumberComponent,
    CustomInputComponent,
    InvoicesEditPartnerPopUpComponent,
    InfoScopeComponent,
    ListInvoicesComponent
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class InvoicesFormComponent implements OnInit, OnChanges {
  @Input() invoiceId!: any;
  @Input() counterpartyName!: any;
  @Input() counterpartyId: any;
  @Input() isEditInvoice: any;
  visibleFieldsButton = ['Принять', 'Отклонить', 'Подписать', 'Удалить'];

  @Input() buttons: any[] = [];
  @Output() buttonClicked = new EventEmitter<{ button: ButtonConfig; product: any }>();
  
  visibleCheckPersonId: boolean = true;

  measurementUnits: any[] = [];
  productTargets: any[] = [];
  adjustmentOptions = adjustmentOptions;
  columns = columns;
  types = types;
  taxes = taxes;
  productColumns = productColumns;
  invoices: any[] = [];
  selectedInvoice: any;
  checkers: any;
  isEdit: any;
  constructor(
    private invoiceService: InvoicesContentService,
    private confirmPopupService: ConfirmPopupService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private productsService: InvoicesService,
    private jwtService: JwtService,
    private toastService: ToastService,
    private invoicesEditPartnerPopUpService: InvoicesEditPartnerPopUpService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['counterpartyData']) {
      const currentCounterpartyId = changes['counterpartyData'].currentValue;
      const previousCounterpartyId = changes['counterpartyData'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId && this.invoiceId != undefined) {
        this.loadInvoice();
      }
    }
    if (changes['invoiceId']) {
      const currentCounterpartyId = changes['invoiceId'].currentValue;
      const previousCounterpartyId = changes['invoiceId'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
        console.log('buttons',this.buttons)
        if (Array.isArray(this.invoiceId)) {
          this.invoiceId = this.invoiceId.join('');

          this.invoiceId = this.invoiceId.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');
        }
        console.log('this.invoiceId this.invoiceId ', this.invoiceId)
        if (this.invoiceId != null && this.invoiceId != undefined) {
          this.loadInvoice();
        }
      }
    }
    if (changes['isEditInvoice']) {
      const currentCounterpartyId = changes['isEditInvoice'].currentValue;
      const previousCounterpartyId = changes['isEditInvoice'].previousValue;
      if (currentCounterpartyId !== previousCounterpartyId) {
        this.isEdit = this.isEditInvoice;
        this.cdr.detectChanges();
      }
    }

  }

  onButtonClick(button: ButtonConfig) {
    this.buttonClicked.emit({ button, product: this.selectedInvoice });
    this.selectedInvoice = null;
    this.selectScope = null;
  }

  currentRole: any;

  ngOnInit() {
    this.drafts = []
    this.isScope = false;
    this.sumAmountDelta = null;
    
    this.currentRole = this.jwtService.getDecodedToken().email;
    if (this.currentRole == '3') {
      this.visibleCheckPersonId = false;
    }
    this.invoiceService.getCheckers().subscribe((values: any) => {
      this.checkers = values.data;

      this.checkers.forEach((checker: any) => {
        const initialFirstName = checker.firstName ? checker.firstName.charAt(0).toUpperCase() + '.' : '';
        const initialPatronymic = checker.patronymic ? checker.patronymic.charAt(0).toUpperCase() + '.' : '';
        checker.fullName = `${checker.lastName} ${initialFirstName} ${initialPatronymic}`.trim();
      });
    })

    this.invoiceService.getMeasurementUnits$().subscribe(units => {
      if (units.length === 0) {
        this.invoiceService.getMeasurementUnit().subscribe(values => {
          this.invoiceService.setMeasurementUnits(values);
        });
      }

    });
    this.invoiceService.getProductTargetsUnits$().subscribe(units => {
      if (units.length === 0) {
        this.invoiceService.getProductTarget().subscribe(values => {
          this.invoiceService.setProductTargetsUnits(values);
        });
      }
    });


    this.invoiceService.measurementUnits$.subscribe((data: any) => {
      this.measurementUnits = data.data;
      console.log('measurementUnits', this.measurementUnits)
    })

    this.invoiceService.productTargets$.subscribe((data: any) => {
      this.productTargets = data.data;
      console.log('productTargets', this.productTargets)
    })
  }

  onDateInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[,\.]/g, '-');
    let date = this.parseDate(value);
    if (date) {
      this.selectedInvoice.dateTime = date;
    }
  }
  parseDate(value: string): Date | null {
    const parts = value.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
    return null;
  }


  selectScope: any = {
    number: '',
    date: null,
    name: '',
    amount: 0
  };

  isScope: boolean = false;
  idScope:any;

  onInvoiceSelected(item: any) {
   this.invoiceId = item.id;
   this.loadInvoice();
  }
  
  
  drafts: any = [];
  sumAmountDelta: any;
oldInvoice: any;

  loadInvoice() {
    if (typeof this.invoiceId === 'object') {
      this.invoiceId = Object.values(this.invoiceId).join('');
      this.invoiceId = this.invoiceId.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');
    }
    console.log('this.invoiceId this.invoiceId ', this.invoiceId)
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe((value: any) => {
      this.idScope = value.data.id;
      if (value.data.drafts != null) {
        if(value.data.account == null){
          this.drafts = value.data.drafts;
          this.sumAmountDelta = value.data.sumAmountDelta;
          this.setDataScope(value.data);
          this.oldInvoice = value.data;
          this.selectedInvoice = value.data;
        } else{
          this.drafts = value.data.account.drafts;
          this.selectedInvoice = value.data;
          this.oldInvoice = value.data;
          this.sumAmountDelta = value.data.account.sumAmountDelta;
          this.setDataScope(value.data.account);
          
        }

        this.isScope = true;

        if (!this.selectScope) {
          this.selectScope = {};
        }
      } else {
        this.oldInvoice = null;
        this.selectedInvoice = value.data;
        this.isScope = false;
        this.drafts = [];
      }


      if (!this.selectedInvoice) {
        this.selectedInvoice = {};
      }
      
      this.selectedInvoice.dateTime = value?.data?.dateTime ? new Date(value.data.dateTime) : null;
      this.selectedInvoice.tax = taxes?.find(tx => tx.value === value?.data?.tax) || null;
      this.selectedInvoice.checkPersonId = value?.data?.checkPerson?.id || null;
      
      if (this.selectedInvoice.expenseSum == 0 && this.selectedInvoice.incomeSum < 0) {
        this.adjustmentType = 2; // -
        this.type = 0;
      } else if (this.selectedInvoice.incomeSum == 0 && this.selectedInvoice.expenseSum < 0) {
        this.adjustmentType = 1; // +
        this.type = 0;
      } else {
        this.type = 1;
      }
      if (value.data.productList) {
        this.selectedInvoice.productList = value.data.productList.map((product: any) => ({
          ...product,
          measurementUnitId: product.measurementUnit ? product.measurementUnit.id : null,
          productTargetId: product.productTarget ? product.productTarget.id : null,
        }));
      }
    })

  }


  setDataScope(value: any) {
    if (!this.selectScope) {
      this.selectScope = {};
    }
  
    this.selectScope.id = value.id;
    this.selectScope.number = value.number;
    this.selectScope.date = value.dateTime ? new Date(value.dateTime) : null;
    this.selectScope.name = value.productList?.[0]?.name || '';
    this.selectScope.amount = value.productList?.[0]?.amount || 0;
  }
  

  getStatusLabel(value: number): string {
    const status = statuses.find(status => status.value === value);
    return status ? status.label : 'Неизвестный статус';
  }

  getStatusClass(statusValue: number): string {
    switch (statusValue) {
      case 0: return 'status-not-checked';
      case 1: return 'status-sent-for-check';
      case 2: return 'status-sent-for-check';
      case 3: return 'status-rejected';
      case 4: return 'status-rejected';
      case 5: return 'status-approved';
      case 6: return 'status-deleted';
      default: return '';
    }
  }






  adjustmentType: number | null = null;
  type: number | null = null;

  onTypeChange() {
    if (this.type === 0) {
      this.adjustmentType = 1;
      this.onAdjustmentChange()
    } else {
      this.adjustmentType = null;
      this.selectedInvoice.productList.forEach((product: any) => {
        product.amount = Math.abs(product.amount);
        product.sumAmount = Math.abs(product.sumAmount);
      });
      this.selectedInvoice.type = 1;
    }
  }

  onAdjustmentChange() {
    if (this.selectedInvoice.productList) {
      this.selectedInvoice.productList.forEach((product: any) => {

        if (this.type === 0) {
          product.amount = Math.abs(product.amount) * (this.adjustmentType === 2 ? -1 : -1);
          product.sumAmount = -Math.abs(product.sumAmount);
        } else {
          product.amount = Math.abs(product.amount);
          product.sumAmount = Math.abs(product.sumAmount);
        }
      });

      // Если "+" то type = 1, если "-" то type = 0
      if (this.adjustmentType === 1) {
        this.selectedInvoice.type = 1; // Приход
      } else if (this.adjustmentType === 2) {
        this.selectedInvoice.type = 0; // Расход
      }
    }
  }





  editInvoice(id: string) {
    this.invoiceService.getInvoiceById(id).subscribe(
      (invoice) => {
        this.selectedInvoice = invoice.data;
        const typeObj = types.find(t => t.value === invoice.data.type);

        const taxObj = taxes.find(t => t.value === invoice.data.tax);
        const formattedDate = invoice.data.dateTime ? new Date(invoice.data.dateTime) : null;

        if (this.calculatingAmount() < 0 && (this.adjustmentType === 1 || this.adjustmentType === 2)) {
          this.selectedInvoice = {
            ...invoice.data,
            type: this.adjustmentType === 2 ? 0 : 1,
            tax: taxObj || null,
            dateTime: formattedDate || null
          };
        } else {
          this.selectedInvoice = {
            ...invoice.data,
            type: 1,
            tax: taxObj || null,
            dateTime: formattedDate || null
          };
        }

        this.type = invoice.data.type;
        delete this.selectedInvoice.expenseSum;
        delete this.selectedInvoice.incomeSum;
        if (this.selectedInvoice.productList.length === 0) {
          this.addProduct();
        }

        if (this.selectedInvoice.productList && this.selectedInvoice.productList.length > 0) {
          const hasNegative = this.selectedInvoice.productList.some((product: any) => product.amount < 0);


          if (this.type === 0) {
            this.adjustmentType = null; //  "Приход", 
            this.type = 0;
          } else if (this.type === 1) {
            this.adjustmentType = 1; // "Коррекция" и "+"
            this.type = 1;
          } else if (this.type === 2) {
            this.adjustmentType = 2; // "Коррекция" и "-"
            this.type = 1;
          }
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching invoice details', error);
        this.toastService.showError('Ошибка', 'Не удалось загрузить счет');
      }
    );
  }



  deleteInvoice(id: string) {

    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить счет-фактуру?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.invoiceService.deleteInvoice(id).subscribe(
          () => {
            let invoices = this.productsService.getActiveData()
            this.invoices = invoices.filter((inv: any) => inv.id !== id);

            this.toastService.showSuccess('Удаление', 'Счет-фактура удалена');
          },
          (error) => {
            console.error('Error deleting invoice', error);
            this.toastService.showError('Ошибка', 'Не удалось удалить счет-фактура');
          }
        );
      }
    });
  }

  addProduct() {
    if (!this.selectedInvoice) {
      this.createNewInvoice();
    }

    if (!this.selectedInvoice.productList) {
      this.selectedInvoice.productList = [];
    }

    const defaultUnit = this.measurementUnits.find(unit => unit.name === 'Штуки')?.id || '';


    this.selectedInvoice.productList.push({
      name: '',
      quantity: 0,
      amount: 0,
      sumAmount: 0,
      measurementUnitId: defaultUnit,
      productTargetId: '',
      date: new Date().toISOString()
    });

  }


  removeProduct(index: number) {
    if (this.selectedInvoice) {
      this.selectedInvoice.productList.splice(index, 1);
    }
  }

  onQuantityOrAmountChange(product: any) {
    if (product.quantity != null && product.amount != null) {
     
        product.sumAmount = product.quantity * product.amount;
  
        if ((product.quantity < 0 && product.amount > 0) || (product.quantity > 0 && product.amount < 0)) {
          product.sumAmount = -Math.abs(product.sumAmount);
        }
  
        if (this.type === 0) {
          product.sumAmount = -Math.abs(product.sumAmount);
          product.amount = -Math.abs(product.amount);
        }
    
    }
  }
  
  onAmountChange(value: any, index: number) {
    console.log('value', value)
    console.log('this.type', this.type)
    const updatedProducts = [...this.selectedInvoice.productList]; // Создаем новый массив
    if (this.type !== 1 || this.selectedInvoice.expenseSum < 0) {
      updatedProducts[index].amount = `-${value}`;
    } else {
      updatedProducts[index].amount = value;
    }

    this.selectedInvoice.productList = updatedProducts; // Обновляем массив, чтобы Angular заметил изменения
  }


  onQuantityOrSumAmountChange(product: any) {
    if (product.quantity != null && product.sumAmount != null) {

      if (product.quantity !== 0) {
        product.amount = product.sumAmount / product.quantity;
  
        if ((product.sumAmount < 0 && product.quantity > 0) || (product.sumAmount > 0 && product.quantity < 0)) {
          product.amount = -Math.abs(product.amount);
        }
  
        if (this.type === 0) {
          product.sumAmount = -Math.abs(product.sumAmount);
          product.amount = -Math.abs(product.amount);
        }
      } else {
        product.amount = 0;
      }
    }
  }
  



  onValueChange(changedField: 'quantity' | 'amount' | 'sumAmount', index: number) {
    const product = this.selectedInvoice.productList[index];

    if (!product) return;

    const { quantity, amount, sumAmount } = product;

    // Если введены quantity и amount, пересчитать sumAmount
    if (changedField !== 'sumAmount' && quantity && amount) {
      product.sumAmount = quantity * amount;
    }

    // Если введены quantity и sumAmount, пересчитать amount
    else if (changedField !== 'amount' && quantity && sumAmount) {
      product.amount = sumAmount / quantity;
    }

  }



  saveInvoice(callback?: (invoice: any) => void) {
    let titlePopUp = '';
    let acceptLabel = '';

    if (this.selectedInvoice && this.selectedInvoice.id) {
      titlePopUp = 'Вы действительно хотите обновить данные?';
      acceptLabel = 'Обновить';
    } else {
      titlePopUp = 'Вы действительно хотите создать счет-фактуру?';
      acceptLabel = 'Создать';
    }

    this.confirmPopupService.openConfirmDialog({
      title: '',
      message: titlePopUp,
      acceptLabel: acceptLabel,
      rejectLabel: 'Отмена',
      onAccept: () => {
        if (!this.visibleCheckPersonId) {
          this.selectedInvoice = {
            ...this.selectedInvoice,
            checkPersonId: '00000000-0000-0000-0000-000000000000',
          };
        }

        console.log('this.selectedInvoice', this.selectedInvoice);



        this.selectedInvoice = {
          ...this.selectedInvoice,
          tax: this.selectedInvoice.tax.value,
          type: typeof this.selectedInvoice.type === 'object' ? this.selectedInvoice.type.value : this.selectedInvoice.type,
          productList: this.selectedInvoice.productList.map((product: any) => {
            const updatedProduct: any = {
              ...product,
              amount: product.amount ? parseFloat(product.amount.toString().replace(',', '.')) : 0,
              sumAmount: product.sumAmount ? parseFloat(product.sumAmount.toString().replace(',', '.')) : 0
            };

            if (product.measurementUnitId === "") {
              delete updatedProduct.measurementUnitId;
            }

            if (product.productTargetId === "") {
              delete updatedProduct.productTargetId;
            }

            return updatedProduct;
          })
        };
        
        if (this.selectedInvoice.drafts) {
          delete this.selectedInvoice.drafts;
        }

        if (this.selectedInvoice.account) {
          delete this.selectedInvoice.account;
        }

        if (this.selectedInvoice.sumAmountDelta) {
          delete this.selectedInvoice.sumAmountDelta;
        }

        this.invoiceService.saveInvoice(this.selectedInvoice).subscribe(
          (invoice) => {
            console.log('invoice.documentMetadata.data', invoice.documentMetadata.data);

            if (this.selectedInvoice.id) {
              this.productsService.updateActiveData(invoice.documentMetadata.data);
            } else {
              this.productsService.addItemToStart(invoice.documentMetadata.data);
            }
            this.productsService.totalInfo = invoice.totalInfo;
            this.messageService.add({
              severity: 'success',
              summary: 'Успех',
              detail: 'Счет сохранен'
            });
            this.toastService.showSuccess('Сохранение', 'Счет-фактура сохранена');
            const invoiceId = invoice.documentMetadata.data.id;
            this.selectedInvoice = null;
            this.cdr.detectChanges();

            if (callback && invoice.documentMetadata.data) {
              callback(invoice.documentMetadata.data);
            }
          },
          (error) => {
            console.error('Ошибка при сохранении счета', error);
            this.toastService.showError('Ошибка', error.Message);
          }
        );
      }
    });
  }

  editPartner() {
    this.invoicesEditPartnerPopUpService.openConfirmDialog();
  }

  AcceptEditPartner(idPartner: string) {
    this.selectedInvoice.partnerId = idPartner;
    this.invoiceService.saveInvoice(this.selectedInvoice).subscribe(
      (invoice) => {
        console.log('invoice.documentMetadata.data', invoice.documentMetadata.data);

        this.productsService.removeItemById(invoice.documentMetadata.data.id);

        this.productsService.totalInfo = invoice.totalInfo;
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: 'Счет сохранен'
        });
        this.toastService.showSuccess('Сохранение', 'Счет-фактура сохранена');
        const invoiceId = invoice.documentMetadata.data.id;
        this.selectedInvoice = null;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Ошибка при сохранении счета', error);
        this.toastService.showError('Ошибка', error.Message);
      }
    );
  }

  sendingInvoice(invoice: string, status: number) {
    this.invoiceService.sendingVerification(invoice, status).subscribe(
      (updatedInvoice: any) => {
        const index = this.invoices.findIndex(invoice => invoice.id === invoice.id);
        if (index !== -1) {
          this.invoices[index] = { ...this.invoices[index], ...updatedInvoice.data };
          console.log('this.invoices[index]', this.invoices[index]);
          this.invoices = [...this.invoices];
          this.cdr.detectChanges();
          this.onDialogClose();
        }
      },
      error => {
        console.error('Ошибка при отправке на проверку:', error);
      }
    );
  }



  saveAndSendInvoice() {
    this.saveInvoice((invoice: any) => {
      let currentRole = this.jwtService.getDecodedToken().email;
      if (currentRole == '3') {
        this.sendingInvoice(invoice, 2);
      } else if (currentRole == '2') {
        this.sendingInvoice(invoice, 1);
      }
    });
  }


  newIncoice:boolean = false;
  createNewInvoice() {
    this.selectedInvoice = {
      dateTime: new Date().toISOString(),
      number: '',
      status: 0,
      tax: taxes?.length ? taxes[0] : 0,
      partnerId: this.counterpartyId,
      checkPersonId: this.checkers?.length ? this.checkers[0].id : '',
      comment: '',
      productList: []
    };

    this.type = types?.length ? types[0].value : 0;
    this.isEdit = true;
this.newIncoice = true;
    this.addProduct();
  }



  onDialogClose() {
    this.selectedInvoice = null;

    this.newIncoice = false
  }

  calculatingAmount(): number {
    if (this.selectedInvoice && this.selectedInvoice.productList.length > 0) {
      let totalAmount = this.selectedInvoice.productList.reduce((sum: number, product: any) => {
        return sum + (product.quantity * product.amount);
      }, 0);

      return totalAmount.toFixed(3).replace('.', ',');
    } else {

      return 0;
    }
  }

  acceptAccountDraft() {
    let data: any = null;
  
    if (this.selectScope && this.selectScope.amount > this.calculatingAmount()) {
      data = { expenseSum: this.calculatingAmount() };
    }
    
    if (
      this.oldInvoice &&
      JSON.stringify(this.oldInvoice) !== JSON.stringify(this.selectedInvoice)
    ) {
      data = this.selectedInvoice;
    }
    
    this.invoiceService.acceptAccountDraft(this.selectedInvoice.id, data).subscribe((response: any) => {
      if(data != null){
        this.productsService.updateFieldById(this.selectScope.id,'expenseSum', data.expenseSum)
      }
      if(this.selectScope && this.selectScope.id && data == null){
        this.productsService.removeItemById(this.selectScope.id);
      }
      this.productsService.addItemToStart(response.documentMetadata.data);
    });
  }
  


}


