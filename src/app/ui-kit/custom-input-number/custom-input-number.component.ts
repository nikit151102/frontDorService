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
  onTouched: () => void = () => {};
  onChange: (value: number) => void = () => {};

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
    let newValue = event.target.value.replace(/\D/g, ''); // Удаляет все нечисловые символы
    newValue = newValue ? parseInt(newValue, 10) : 0;

    if (newValue < this.min) newValue = this.min;
    if (newValue > this.max) newValue = this.max;

    this.value = newValue;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  preventNonNumeric(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
