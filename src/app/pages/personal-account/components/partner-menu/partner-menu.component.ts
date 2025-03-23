import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupService } from '../../../../components/confirm-popup/confirm-popup.service';
import { PartnerStatusService } from '../../../../services/statuses/partner-statuses.service';
import { PartnerMenuService } from './partner-menu.service';
import { ButtonConfig } from './button-config';
import { JwtService } from '../../../../services/jwt.service';
import { CustomInputComponent } from '../../../../ui-kit/custom-input/custom-input.component';
import { ToastService } from '../../../../services/toast.service';

interface Counterparty {
  id: number;
  name: string;
}

interface TypeOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-partner-menu',
  imports: [CommonModule, DialogModule,
    FormsModule, ReactiveFormsModule, DropdownModule,
    InputTextModule, ButtonModule, ConfirmDialogModule, CustomInputComponent],
  standalone: true,
  templateUrl: './partner-menu.component.html',
  styleUrl: './partner-menu.component.scss'
})
export class PartnerMenuComponent {
  @Output() selectCounterparty = new EventEmitter<number>();
  @Input() typeCode: any;
  @Input() buttonConfigs!: Record<string, ButtonConfig[]>
  @Input() title: string = 'контрагента'

  counterparties: any = [];
  selectedId: any;
  menuOpenFor: number | null = null;
  display: boolean = false;
  counterpartyForm!: FormGroup;
  selectedCounterparty: any | null = null;
  currentRole: any;

  typeOptions: TypeOption[] = [
    { label: 'Контрагент', value: 0 },
    { label: 'Сервис', value: 1 },
    { label: 'Физическое лицо', value: 2 },
    { label: 'Юридическое лицо', value: 3 }
  ];

  constructor(
    private partnerMenuService: PartnerMenuService,
    private fb: FormBuilder,
    private confirmPopupService: ConfirmPopupService,
    private partnerStatusService: PartnerStatusService,
    private jwtService: JwtService,
    private toastService:ToastService
  ) { }

  ngOnInit(): void {
    this.currentRole = this.jwtService.getDecodedToken().email; // 1- "Снабженец" 2- "Механик"  3-"Директор"

    this.loadCounterparties();
    this.initializeForm();
  }

  getButtonSet(): ButtonConfig[] {
    switch (this.currentRole) {
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
  handleButtonClick(button: ButtonConfig, product: any, event?: Event) {
    console.log('productproduct', product)

    if (button.action && typeof this[button.action] === 'function') {
      if (button.titlePopUp || button.messagePopUp || button.status !== undefined) {
        this[button.action](event, product, button.status, button.titlePopUp, button.messagePopUp, event);
      } else if (button.isEditData == false || button.isEditData == true) {
        this.isEdit = true;
        console.log('button.isEditData', this.isEdit)
        this[button.action](event, product);

      } else {

        this[button.action](event, product);
      }
    } else {
      console.error(`Action method '${button.action}' not found.`);
    }
  }

  verificationPartner(invoice: any, status: any, titlePopUp: any, messagePopUp: any) {
   
    this.confirmPopupService.openConfirmDialog({
      title: titlePopUp,
      message: messagePopUp,
      acceptLabel: 'Отправить',
      rejectLabel: 'Отмена',
      onAccept: () => {

        this.partnerMenuService.sendingVerification(titlePopUp, status).subscribe(
          () => {
      
          },
          (error) => {
            console.error('Error deleting invoice', error);
          
          }
        );
      }
    });
  }


  loadCounterparties() {
    this.partnerMenuService.getCounterparties().subscribe(
      (data: any) => {
        this.counterparties = data.data;
        this.sortCounterpartiesByStatus();
        this.select('00000000-0000-0000-0000-000000000000');
      },
      (error: any) => {
        console.error('Ошибка загрузки контрагентов:', error);
        this.toastService.showError('Ошибка', 'Ошибка загрузки контрагентов');
      }
    );
  }

  sortCounterpartiesByStatus() {
    this.counterparties = this.partnerStatusService.sortByStatus(this.counterparties)
  }


  initializeForm() {
    this.counterpartyForm = this.fb.group({
      id: [''],
      shortName: ['', Validators.required],
      fullName: ['', Validators.required],
      inn: ['', Validators.required],
      ogrn: [''],
      kpp: [''],
      address: [''],
      type: [0]
    });
  }

  select(id: any) {
    this.selectedId = id;
    this.selectCounterparty.emit(id);
  }

  isEdit: boolean = false;

  openDialog(event: MouseEvent, counterparty?: any) {
    event.stopPropagation();
    if (counterparty) {
      this.selectedCounterparty = counterparty;

      this.counterpartyForm.patchValue({
        shortName: counterparty.shortName,
        fullName: counterparty.fullName,
        inn: counterparty.inn,
        ogrn: counterparty.ogrn,
        kpp: counterparty.kpp,
        address: counterparty.address,
        id: counterparty.id,
        type: this.typeOptions.find(option => option.value === counterparty.type)
      });
    } else {
      this.selectedCounterparty = null;
      this.counterpartyForm.reset();
    }
    this.display = true;
    if (this.isEdit == false) {
      this.counterpartyForm.controls['shortName'].disable();
      this.counterpartyForm.controls['fullName'].disable();
      this.counterpartyForm.controls['inn'].disable();
      this.counterpartyForm.controls['ogrn'].disable();
      this.counterpartyForm.controls['kpp'].disable();
      this.counterpartyForm.controls['address'].disable();
    } else {
      this.counterpartyForm.controls['shortName'].enable();
      this.counterpartyForm.controls['fullName'].enable();
      this.counterpartyForm.controls['inn'].enable();
      this.counterpartyForm.controls['ogrn'].enable();
      this.counterpartyForm.controls['kpp'].enable();
      this.counterpartyForm.controls['address'].enable();
    }
  }

  onSubmit() {

    if (this.counterpartyForm.invalid) {
      if (this.counterpartyForm.controls['shortName'].hasError('required')) {
        this.toastService.showWarn('Ошибка', 'Поле "Краткое наименование" обязательно для заполнения');
      }
      if (this.counterpartyForm.controls['fullName'].hasError('required')) {
        this.toastService.showWarn('Ошибка', 'Поле "Полное наименование" обязательно для заполнения');
      }
      if (this.counterpartyForm.controls['inn'].hasError('required')) {
        this.toastService.showWarn('Ошибка', 'Поле "ИНН" обязательно для заполнения');
      }
      return;
    }


      const formData = this.counterpartyForm.value;

      const { type, ...rest } = formData;

      const formDataWithValueType = {
        ...rest,
        type: type ? type.value : null
      };

      if (this.selectedCounterparty) {
        this.partnerMenuService.editCounterparty(this.selectedCounterparty.id, formDataWithValueType).subscribe(
          (updatedCounterparty) => {
            const index = this.counterparties.findIndex((c: Counterparty) => c.id === this.selectedCounterparty?.id);
            if (index !== -1) {
              this.counterparties[index] = updatedCounterparty;
              this.display = false;
            }
            this.toastService.showSuccess('Успех', 'Контрагент успешно отредактирован');
            this.loadCounterparties();
          },
          (error) => {
            console.error('Ошибка редактирования контрагента:', error)
            this.toastService.showError('Ошибка', 'Ошибка редактирования контрагента');
          } 
        );
      } else {
        this.partnerMenuService.addCounterparty(formDataWithValueType).subscribe(
          (newCounterparty) => {
            this.counterparties.push(newCounterparty);
            this.display = false;
            this.loadCounterparties();
            this.toastService.showSuccess('Успех', 'Контрагент успешно добавлен');
          },
          (error) => {
            console.error('Ошибка добавления контрагента:', error);
            this.toastService.showError('Ошибка', 'Ошибка добавления контрагента'); 
          }

        );
      }
  }


  deleteCounterparty(event: any, partner: any) {
    console.log('partnerpartnerpartner', partner)
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить контрагента?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.partnerMenuService.deleteCounterparty(partner.id).subscribe(
          () => {
            this.counterparties = this.counterparties.filter((c: any) => c.id !== partner.id);
            this.toastService.showSuccess('Успех', 'Контрагент удален');
            this.loadCounterparties();
          },
          (error) =>{
            console.error('Ошибка удаления контрагента:', error)
            this.toastService.showError('Ошибка', 'Не удалось удалить контрагента'); 
          } 
        );
      }
    });
  }

  openMenu(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.menuOpenFor = this.menuOpenFor === id ? null : id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest('.counterparty-item') && this.menuOpenFor !== null) {
      this.menuOpenFor = null;
    }
  }


  // Работа со статусами
  isEditable(status: number): boolean {
    return this.partnerStatusService.isEditable(status);
  }

  getStatusLabel(status: number): string {
    return this.partnerStatusService.getStatusLabel(status);
  }

  getStatusClass(status: number): string {
    return this.partnerStatusService.getStatusClass(status);
  }

  isForbiddenStatus(status: number): boolean {
    return this.partnerStatusService.isForbiddenStatus(status);
  }



  searchTerm: string = '';
  filterField: string = 'fullName';
  onSearchChange(value: string): void {
    this.searchTerm = value;

    const existingFilterIndex = this.partnerMenuService.queryData.filters.findIndex(
      (f: any) => f.field === this.filterField
    );

    if (this.searchTerm) {
      const filterDto = {
        field: this.filterField,
        values: [this.searchTerm],
        type: 0
      };

      if (existingFilterIndex !== -1) {
        this.partnerMenuService.queryData.filters[existingFilterIndex] = filterDto;
      } else {
        this.partnerMenuService.queryData.filters.push(filterDto);
      }
    } else {
      if (existingFilterIndex !== -1) {
        this.partnerMenuService.queryData.filters.splice(existingFilterIndex, 1);
      }
    }

    this.loadCounterparties();
  }

}

