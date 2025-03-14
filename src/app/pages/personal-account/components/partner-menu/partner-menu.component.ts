import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupService } from '../../../../components/confirm-popup/confirm-popup.service';
import { PartnerStatusService } from '../../../../services/statuses/partner-statuses.service';
import { PartnerMenuService } from './partner-menu.service';

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
    InputTextModule, ButtonModule, ConfirmDialogModule],
  standalone: true,
  templateUrl: './partner-menu.component.html',
  styleUrl: './partner-menu.component.scss'
})
export class PartnerMenuComponent {
  @Output() selectCounterparty = new EventEmitter<number>();

  counterparties: any = [];
  selectedId: any;
  menuOpenFor: number | null = null;
  display: boolean = false;
  counterpartyForm!: FormGroup;
  selectedCounterparty: any | null = null;

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
    private partnerStatusService: PartnerStatusService
  ) { }

  ngOnInit(): void {
    this.loadCounterparties();
    this.initializeForm();
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

  }

  onSubmit() {
    if (this.counterpartyForm.valid) {

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
            this.loadCounterparties();
          },
          (error) => console.error('Ошибка редактирования контрагента:', error)
        );
      } else {
        this.partnerMenuService.addCounterparty(formDataWithValueType).subscribe(
          (newCounterparty) => {
            this.counterparties.push(newCounterparty);
            this.display = false;
            this.loadCounterparties();
          },
          (error) => console.error('Ошибка добавления контрагента:', error)
        );
      }
    }
  }


  deleteCounterparty(id: string) {
    this.confirmPopupService.openConfirmDialog({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить контрагента?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.partnerMenuService.deleteCounterparty(id).subscribe(
          () => {
            this.counterparties = this.counterparties.filter((c: any) => c.id !== id);
            this.loadCounterparties();
          },
          (error) => console.error('Ошибка удаления контрагента:', error)
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
}