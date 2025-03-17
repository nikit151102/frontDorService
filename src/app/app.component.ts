import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmPopupComponent } from './components/confirm-popup/confirm-popup.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmPopupComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  title = 'dorService';

  
}
