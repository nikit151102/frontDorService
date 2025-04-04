import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomInputComponent,
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() formControl: AbstractControl | null = null; 

  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  touched: boolean = false;
  disabled: boolean = false;

  errorMessage: string = '';

  onChange: any = () => { };
  onTouched: any = () => { };

  ngOnInit() { }

  ngAfterViewInit() {
    if (this.formControl) {
      this.formControl.statusChanges.subscribe(() => {
        this.setErrorMessages();
      });
    }
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
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

  handleInputChange(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    if (this.formControl) {
      this.setErrorMessages();
    }
  }

  handleBlur(): void {
    if ((this.value || '').trim() !== '') {
      this.touched = true;
    } else {
      this.touched = false;
    }
    this.onTouched();
  }
  
  
  handleFocus(): void {
    this.touched = true;
  }

  setErrorMessages() {
    if (this.formControl) {
      if (this.formControl.errors) {
        if (this.formControl.errors['required']) {
          this.errorMessage = 'Это поле обязательно для заполнения';
        } else if (this.formControl.errors['minlength']) {
          this.errorMessage = `Минимальная длина — ${this.formControl.errors['minlength'].requiredLength} символов`;
        } else if (this.formControl.errors['maxlength']) {
          this.errorMessage = `Максимальная длина — ${this.formControl.errors['maxlength'].requiredLength} символов`;
        } else if (this.formControl.errors['email']) {
          this.errorMessage = 'Неверный формат электронной почты';
        } else {
          this.errorMessage = '';
        }
      }
    }
  }

}