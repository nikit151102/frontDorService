import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  @Input() text: string = '';

  isTooltipVisible: boolean = false;
  isClicked: boolean = false; // Флаг фиксации открытого состояния

  constructor(private eRef: ElementRef) {}

  // Показываем тултип при наведении
  showTooltip() {
    if (!this.isClicked) {
      this.isTooltipVisible = true;
    }
  }

  // Скрываем тултип, если не было клика
  hideTooltip() {
    if (!this.isClicked) {
      this.isTooltipVisible = false;
    }
  }

  // Фиксируем тултип открытым при клике
  toggleTooltip() {
    this.isClicked = !this.isClicked;
    this.isTooltipVisible = this.isClicked;
  }

  // Закрываем тултип при клике вне
  @HostListener('document:click', ['$event'])
  closeTooltip(event: Event) {
    if (this.isClicked && !this.eRef.nativeElement.contains(event.target)) {
      this.isClicked = false;
      this.isTooltipVisible = false;
    }
  }
}
