import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormAuthorizationComponent } from './form-authorization/form-authorization.component';
import { FormRegistrationComponent } from './form-registration/form-registration.component';
import { FormRecoveryComponent } from './form-recovery/form-recovery.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormAuthorizationComponent, 
    FormRegistrationComponent,
    FormRecoveryComponent
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  currentView: 'login' | 'register' | 'forgot' = 'login';

  switchView(view: any) {
    this.currentView = view;
  }

}