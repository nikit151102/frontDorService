import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input-number',
  templateUrl: './custom-input-number.component.html',
  styleUrl: './custom-input-number.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputNumberComponent),
      multi: true
    }
  ]
})
export class CustomInputNumberComponent implements ControlValueAccessor {

  @Input() disabled: boolean = false;
  @Input() min: number = 0;
  @Input() max: number = Infinity;
  @Output() valueChange = new EventEmitter<number>();

  value: number = 0;
  onTouched: () => void = () => { };
  onChange: (value: number) => void = () => { };

  writeValue(value: number): void {
    this.value = value || 0;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  handleInput(event: any) {
    let newValue = event.target.value;
    if (newValue === ',' || newValue === '.') {
      newValue = '0,';
    }
    newValue = newValue.replace('.', ',');
    newValue = newValue.replace(/[^0-9,]/g, '');
    const commaCount = newValue.split(',').length - 1;
    if (commaCount > 1) {
      newValue = newValue.substring(0, newValue.indexOf(',') + newValue.substring(newValue.indexOf(',')).replace(/,/g, '').length);
    }
    let numericValue = newValue ? parseFloat(newValue.replace(',', '.')) : 0;
    numericValue = Math.max(this.min, Math.min(this.max, numericValue));
    this.value = numericValue;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }


  preventNonNumeric(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    if (!/[0-9.,]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }

    const inputElement = event.target as HTMLInputElement;

    if ((event.key === ',' || event.key === '.') && inputElement) {
      if (inputElement.value.indexOf(',') !== -1) {
        event.preventDefault();
      }
    }
  }

  getFormattedValue(): string {
    return new Intl.NumberFormat('ru-RU').format(this.value);
  }
}