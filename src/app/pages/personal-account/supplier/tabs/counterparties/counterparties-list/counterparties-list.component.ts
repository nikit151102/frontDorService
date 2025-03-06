import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CounterpartiesService } from './counterparties-list.service';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

interface Counterparty {
  id: number;
  name: string;
}

interface TypeOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-counterparties-list',
  imports: [CommonModule, DialogModule,
    FormsModule, ReactiveFormsModule, DropdownModule,
    InputTextModule, ButtonModule],
  standalone: true,
  templateUrl: './counterparties-list.component.html',
  styleUrl: './counterparties-list.component.scss'
})
export class CounterpartiesListComponent {
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
    private counterpartiesService: CounterpartiesService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadCounterparties();
    this.initializeForm();
  }

  loadCounterparties() {
    this.counterpartiesService.getCounterparties().subscribe(
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
      id:[''],
      shortName: ['', Validators.required],
      fullName: ['', Validators.required],
      inn: ['', Validators.required],
      ogrn: ['', Validators.required],
      kpp: ['', Validators.required],
      address: ['', Validators.required],
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
    this.counterpartiesService.deleteCounterparty(id).subscribe(
      () => {
        this.counterparties = this.counterparties.filter((c: any) => c.id !== id);
        this.loadCounterparties();
      },
      (error) => console.error('Ошибка удаления контрагента:', error)
    );
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