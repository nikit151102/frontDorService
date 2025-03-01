import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressSpinnerService } from './progress-spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.scss'
})
export class ProgressSpinnerComponent {

  constructor(public spinnerService: ProgressSpinnerService) {}

}
