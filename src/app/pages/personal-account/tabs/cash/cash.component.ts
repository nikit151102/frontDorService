import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MechanicComponent } from './mechanic/mechanic.component';

@Component({
  selector: 'app-cash',
  imports: [CommonModule,MechanicComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.scss'
})
export class CashComponent {

}
