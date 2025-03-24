import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  imports: [CommonModule],
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.scss'
})
export class CustomCheckboxComponent {
  @Input() options: any[] = [];
  @Input() selected: string[] = [];  
  @Input() disabled: boolean = false;
  @Output() selectedChange = new EventEmitter<string[]>(); 

  ngOnInit() {
    // Убедитесь, что selected всегда массив
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }
  }

  isSelected(id: string): boolean {
    return Array.isArray(this.selected) && this.selected.includes(id);
  }

  toggleSelection(id: string) {
    if (!Array.isArray(this.selected)) {
      this.selected = [];
    }

    const index = this.selected.indexOf(id);
    if (index === -1) {
      this.selected = [...this.selected, id]; 
    } else {
      this.selected = this.selected.filter(item => item !== id); 
    }
    this.selectedChange.emit(this.selected); 
  }
}
