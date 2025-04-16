import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../../../../../ui-kit/custom-input-auth/custom-input.component';
import { CustomInputNumberComponent } from '../../../../../../ui-kit/custom-input-number/custom-input-number.component';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-info-scope',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputNumberComponent,
    CustomInputComponent,
    CalendarModule
  ],
  templateUrl: './info-scope.component.html',
  styleUrl: './info-scope.component.scss'
})
export class InfoScopeComponent implements OnChanges {
  @Input() selectScope: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectScope'] && changes['selectScope'].currentValue == null) {
      this.selectScope = {
        id: '',
        number: '',
        date: null,
        name: '',
        amount: 0
      };
    }
  }
}
