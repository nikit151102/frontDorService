import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
import { JwtService } from '../../../../services/jwt.service';
import { CustomDropdownComponent } from '../../../../ui-kit/custom-dropdown/custom-dropdown.component';
import { CustomInputComponent } from '../../../../ui-kit/custom-input-auth/custom-input.component';
import { CustomInputNumberComponent } from '../../../../ui-kit/custom-input-number/custom-input-number.component';
import { InvoiceConfig } from '../../../../interfaces/common.interface';
import { GeneralFormService } from './general-form.service';

@Component({
  selector: 'general-form',
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
  ],
  templateUrl: './general-form.component.html',
  styleUrl: './general-form.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class GeneralFormComponent implements OnInit, OnChanges {
  config!: InvoiceConfig;
  service: any;
  model: Record<string, any> = {};
  selectedInvoice: any;
  isEdit: boolean = true;

  constructor(
    private generalFormService: GeneralFormService,
    private cdr: ChangeDetectorRef,
    private jwtService: JwtService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['model']) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.generalFormService.getConfig().subscribe(config => {
      this.config = config;
      this.initializeModel(config);
    });

    this.service = this.generalFormService.getService();
    const currentRole = this.jwtService.getDecodedToken().email;
    this.isEdit = currentRole !== '3';
  }

  private initializeModel(config: InvoiceConfig): void {
    this.model = {};
    if (config?.fields) {
      config.fields.forEach(field => {
        this.model[field.name] = field.type === 'dropdown' ? field.options?.[0]?.value : '';
      });
    }
  }

  executeAction(action: (model: any, service: any) => void): void {
    if (typeof action === 'function') {
      action(this.model, this.service);
    }
  }

  onDialogClose(): void {
    this.selectedInvoice = null;
  }

  createNewInvoice(): void {
    this.selectedInvoice = {};
    this.model = {};
    if (this.config?.fields) {
      this.config.fields.forEach(field => {
        this.model[field.name] = field.type === 'dropdown' ? field.options?.[0]?.value : '';
      });
    }

    this.generalFormService.setSelectedInvoice(this.model);
    this.generalFormService.setModel(this.model);
  }
}
