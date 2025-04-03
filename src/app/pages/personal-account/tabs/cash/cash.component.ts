import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MechanicComponent } from './mechanic/mechanic.component';
import { CashMenuComponent } from './cash-menu/cash-menu.component';

@Component({
  selector: 'app-cash',
  imports: [CommonModule,MechanicComponent, CashMenuComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.scss'
})
export class CashComponent {

}
