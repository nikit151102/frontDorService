import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  imports: [CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss'
})
export class CustomDropdownComponent {

  @Input() options: any[] = [];  // Передаем список значений
  @Input() optionLabel: string = 'name'; // Какое поле показывать
  @Input() optionValue: string = 'value'; // Какое поле использовать как value
  @Input() disabled: boolean = false; // Можно ли редактировать
  @Input() selected: any; // Текущее выбранное значение
  @Output() selectedChange = new EventEmitter<any>(); // Для передачи нового значения

  isOpen = false; 

  constructor(private elementRef: ElementRef) {}
  
  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: any) {
    this.selected = option[this.optionValue];
    this.selectedChange.emit(this.selected);
    this.isOpen = false;
  }

  get selectedLabel(): string {
    const selectedOption = this.options.find(opt => opt[this.optionValue] === this.selected);
    return selectedOption ? selectedOption[this.optionLabel] : 'Выберите';
  }
  
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  
}
