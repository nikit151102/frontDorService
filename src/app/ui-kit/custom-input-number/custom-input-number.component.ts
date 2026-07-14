import { Component, EventEmitter, Input, Output, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
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
export class CustomInputNumberComponent implements ControlValueAccessor, OnChanges {

  @Input() disabled: boolean = false;
  @Input() min: number = 0;
  @Input() max: number = Infinity;
  @Output() valueChange = new EventEmitter<number>();

  value: number = 0;
  onTouched: () => void = () => { };
  onChange: (value: number) => void = () => { };

  ngOnChanges(changes: SimpleChanges): void {
    // Если минимальное или максимальное значение изменилось динамически, 
    // сразу приводим текущее значение к допустимому диапазону
    if (changes['min'] || changes['max']) {
      this.clampValue();
    }
  }

  writeValue(value: number): void {
    this.value = value ?? 0;
    this.clampValue();
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

  private clampValue(): void {
    const clamped = Math.max(this.min, Math.min(this.max, this.value));
    if (clamped !== this.value) {
      this.value = clamped;
      this.onChange(this.value);
      this.valueChange.emit(this.value);
    }
  }

  handleInput(event: any) {
    let newValue = event.target.value;
    
    // Если поле очистили полностью
    if (!newValue) {
      this.value = 0;
      this.onChange(this.value);
      this.valueChange.emit(this.value);
      event.target.value = '0';
      return;
    }

    if (newValue === ',' || newValue === '.') {
      newValue = '0,';
    }
    
    // Унифицируем разделитель и удаляем все лишние символы
    newValue = newValue.replace('.', ',');
    newValue = newValue.replace(/[^0-9,]/g, '');
    
    // Оставляем только одну запятую
    const commaCount = newValue.split(',').length - 1;
    if (commaCount > 1) {
      newValue = newValue.substring(0, newValue.indexOf(',') + newValue.substring(newValue.indexOf(',')).replace(/,/g, '').length);
    }
    
    let numericValue = newValue ? parseFloat(newValue.replace(',', '.')) : 0;
    
    // Ограничиваем значение минимальным и максимальным порогом
    numericValue = Math.max(this.min, Math.min(this.max, numericValue));
    
    this.value = numericValue;
    this.onChange(this.value);
    this.valueChange.emit(this.value);

    event.target.value = this.getFormattedValue();
  }

  preventNonNumeric(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];

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