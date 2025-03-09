import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MechanicCounterpartiesService } from './counterparties-list.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupService } from '../../../../../../components/confirm-popup/confirm-popup.service';

interface Counterparty {
  id: number;
  name: string;
}

interface TypeOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-mechanic-counterparties-list',
  imports: [CommonModule, DialogModule,
    FormsModule, ReactiveFormsModule, DropdownModule,
    InputTextModule, ButtonModule, ConfirmDialogModule],
  standalone: true,
  templateUrl: './counterparties-list.component.html',
  styleUrl: './counterparties-list.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class MechanicCounterpartiesListComponent {
  @Output() selectCounterparty = new EventEmitter<number>();

  counterparties: any = [];
  selectedId: number | null = null;
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
    private mechaniccounterpartiesService: MechanicCounterpartiesService,
    private fb: FormBuilder,
    private confirmPopupService: ConfirmPopupService
  ) { }

  ngOnInit(): void {
    this.loadCounterparties();
    this.initializeForm();
  }

  loadCounterparties() {
    this.mechaniccounterpartiesService.getCounterparties().subscribe(
      (data: any) => {
        this.counterparties = data.data;
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

  select(id: number) {
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
        type: type ? type.value : 1
      };

      if (this.selectedCounterparty) {
        this.mechaniccounterpartiesService.editCounterparty(this.selectedCounterparty.id, formDataWithValueType).subscribe(
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
        this.mechaniccounterpartiesService.addCounterparty(formDataWithValueType).subscribe(
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
      message: 'Вы уверены, что хотите удалить сервис?',
      acceptLabel: 'Удалить',
      rejectLabel: 'Отмена',
      onAccept: () => {
        this.mechaniccounterpartiesService.deleteCounterparty(id).subscribe(
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

}