import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  template: `
  <button 
    [ngStyle]="{ 
      'background-color': backgroundColor, 
      'color': textColor 
    }" 
  (mouseenter)="onMouseEnter($event)" 
  (mouseleave)="onMouseLeave($event)" 
    (click)="handleClick()"
    [style.transition]="'background-color 0.3s ease'">
    <ng-content></ng-content> 
  </button>
`,
  styles: [`
  button {
    border: none;
    border-radius: 20px;
    padding: 12px 45px;
    cursor: pointer;
    width: 100%;
    height: 40px;
  }
`]
})
export class CustomButtonComponent {
  @Input() backgroundColor: string = '';
  @Input() hoverColor: string = '';
  @Input() textColor: string = '';
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  handleClick() {
    this.buttonClick.emit();
  }

  onMouseEnter(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = this.hoverColor;
  }

  onMouseLeave(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = this.backgroundColor;
  }
}