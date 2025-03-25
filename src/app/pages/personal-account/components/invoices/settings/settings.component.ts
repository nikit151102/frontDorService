import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, MultiSelectModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    trigger('slideToggle', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class SettingsComponent {
  @Input() columns: any;
  @Input() selectedColumns: string[] = [];
  @Output() selectedColumnsChange = new EventEmitter<string[]>();

  showSettings = false;

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  onColumnsChange(event: any) {
    this.selectedColumnsChange.emit(this.selectedColumns);
  }
}


