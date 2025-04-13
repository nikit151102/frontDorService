import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../../../../../ui-kit/custom-input-auth/custom-input.component';
import { CustomInputNumberComponent } from '../../../../../../ui-kit/custom-input-number/custom-input-number.component';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-info-scope',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputNumberComponent,
    CustomInputComponent,
    CalendarModule
  ],
  templateUrl: './info-scope.component.html',
  styleUrl: './info-scope.component.scss'
})
export class InfoScopeComponent {
  @Input() selectScope: any;
}
