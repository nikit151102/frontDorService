import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dorService';
}
