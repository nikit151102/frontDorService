import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormAuthorizationComponent } from './form-authorization/form-authorization.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormAuthorizationComponent],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  isRightPanelActive = false;
  visibleBtns: boolean = true;

  togglePanel(isSignUp: boolean) {
    this.isRightPanelActive = isSignUp;
  }

  onVisibleBtnsChange(value: boolean): void {
    this.visibleBtns = value;
  }

}