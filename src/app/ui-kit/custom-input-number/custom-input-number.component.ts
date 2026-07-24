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
  displayValue: string = '0'; // Свойство для привязки к шаблону

  onTouched: () => void = () => { };
  onChange: (value: number) => void = () => { };

  ngOnChanges(changes: SimpleChanges): void {
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
    this.displayValue = this.getFormattedValue();
  }

  handleInput(event: any) {
    let newValue = event.target.value;
    
    // Если поле очистили полностью
    if (!newValue) {
      this.value = 0;
      this.displayValue = '0';
      this.onChange(this.value);
      this.valueChange.emit(this.value);
      event.target.value = '0';
      return;
    }

    // Унифицируем разделитель и удаляем все лишние символы
    newValue = newValue.replace('.', ',');
    newValue = newValue.replace(/[^0-9,]/g, '');
    
    // Оставляем только одну запятую (простая и надежная замена сложному substring)
    const parts = newValue.split(',');
    if (parts.length > 2) {
      newValue = parts[0] + ',' + parts.slice(1).join('');
    }

    // Если введена только запятая, добавляем ноль в начале
    if (newValue === ',') {
      newValue = '0,';
    }
    
    // Проверяем, заканчивается ли строка на запятую (пользователь в процессе ввода дробной части)
    const endsWithComma = newValue.endsWith(',');
    
    // Преобразуем в число
    let numericValue = newValue ? parseFloat(newValue.replace(',', '.')) : 0;
    
    // Ограничиваем значение минимальным и максимальным порогом
    numericValue = Math.max(this.min, Math.min(this.max, numericValue));
    
    this.value = numericValue;
    this.onChange(this.value);
    this.valueChange.emit(this.value);

    // Форматируем для отображения
    this.displayValue = this.getFormattedValue();
    
    // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: если пользователь ввел запятую в конце, 
    // а форматирование её убрало (например, "1," превратилось в "1"),
    // возвращаем запятую, чтобы позволить продолжить ввод дробной части
    if (endsWithComma && !this.displayValue.includes(',')) {
      this.displayValue += ',';
    }

    event.target.value = this.displayValue;
  }

  preventNonNumeric(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];

    if (!/[0-9.,]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }

    const inputElement = event.target as HTMLInputElement;

    // Запрещаем ввод второй запятой/точки
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