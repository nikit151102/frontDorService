import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CounterpartiesService } from './counterparties-list.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupService } from '../../../../../../../components/confirm-popup/confirm-popup.service';

interface Counterparty {
  id: number;
  name: string;
}

interface TypeOption {
  label: string;
  value: number;
}

enum EditStatusEnum {
  Undefined = 0,
  New = 1,
  Updated = 2,
  Deleted = 3,
  NewRejected = 4,
  UpdateRejected = 5,
  DeleteRejected = 6,
  Approve = 7,
  NotActive = 8,
  Active = 9
}


@Component({
  selector: 'app-counterparties-list',
  imports: [CommonModule, DialogModule,
    FormsModule, ReactiveFormsModule, DropdownModule,
    InputTextModule, ButtonModule, ConfirmDialogModule],
  standalone: true,
  templateUrl: './counterparties-list.component.html',
  styleUrl: './counterparties-list.component.scss',
  providers: [MessageService]
})
export class CounterpartiesListComponent {
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
    private counterpartiesService: CounterpartiesService,
    private fb: FormBuilder,
    private confirmPopupService: ConfirmPopupService
  ) { }

  ngOnInit(): void {
    this.loadCounterparties();
    this.initializeForm();
  }

  loadCounterparties() {
    this.counterpartiesService.getCounterparties().subscribe(
      (data: any) => {
        this.counterparties = data.data;
        this.select('00000000-0000-0000-0000-000000000000');
      },
      (error: any) => {
        console.error('Ошибка загрузки контрагентов:', error);
      }
    );
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
        this.counterpartiesService.editCounterparty(this.selectedCounterparty.id, formDataWithValueType).subscribe(
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
        this.counterpartiesService.addCounterparty(formDataWithValueType).subscribe(
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
        this.counterpartiesService.deleteCounterparty(id).subscribe(
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

  isEditable(status: number): boolean {
    const editableStatuses = [
      EditStatusEnum.New,
      EditStatusEnum.NewRejected,
      EditStatusEnum.UpdateRejected,
      EditStatusEnum.DeleteRejected,
      EditStatusEnum.Active
    ];

    return editableStatuses.includes(status);
  }


  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Новый';
      case 2: return 'Измененный';
      case 3: return 'Удален';
      case 4: return 'Отклонено';
      case 5: return 'Подтвержден';
      case 6: return 'Неактивный';
      default: return 'Неизвестный статус';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'new';
      case 2: return 'updated';
      case 3: return 'deleted';
      case 4: return 'rejected';
      case 5: return 'approved';
      case 6: return 'not-active';
      default: return 'unknown';
    }
  }


  isForbiddenStatus(status: number): boolean {
    const forbiddenStatuses = [2, 3, 7, 8];
    return forbiddenStatuses.includes(status);
  }

  verification(id: string, item: any, status: number) {
    item.status = status;
    this.counterpartiesService.verification(id, item).subscribe((value: any) => {

    })
  }

}