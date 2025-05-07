import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../../ui-kit/custom-button/custom-button.component';
import { FormAuthorizationService } from './form-authorization.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../services/toast.service';
import { CookieConsentService } from '../../../services/cookie-consent.service';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { CustomInputComponent } from '../../../ui-kit/custom-input-auth/custom-input.component';
import { NavMenuService } from '../../personal-account/components/nav-menu/nav-menu.service';
import { environment } from '../../../../environment';

@Component({
  selector: 'app-form-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomButtonComponent, CustomInputComponent],
  templateUrl: './form-authorization.component.html',
  styleUrls: ['./form-authorization.component.scss']
})
export class FormAuthorizationComponent implements OnInit {
  @Output() visibleBtns: EventEmitter<boolean> = new EventEmitter<boolean>();

  signInForm: FormGroup;
  currentUser: boolean = false;
  dataCurrentUser: any;
  private localStorageKey: string = 'YXV0aFRva2Vu';
  public isMenuVisible: boolean = false;

  constructor(private fb: FormBuilder,
    private AuthorizationService: FormAuthorizationService,
    private router: Router,
    private tokenService: TokenService,
    private progressSpinnerService: ProgressSpinnerService,
    private toastService: ToastService,
    private cookieConsentService: CookieConsentService,
    private currentUserService: CurrentUserService,
    private navMenuService: NavMenuService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  ngOnInit() {

    const dataUser = localStorage.getItem(environment.userAuthData);
    if (dataUser) {
      this.dataCurrentUser = JSON.parse(dataUser);
      if (this.dataCurrentUser && this.dataCurrentUser.token && this.dataCurrentUser.userName) {
        this.currentUser = true;
        this.visibleBtns.emit(false);
        this.signInForm.patchValue({ username: this.dataCurrentUser.userName });
      }
    }

    setTimeout(() => {
      const usernameInput = document.getElementById('username') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;

      if (usernameInput) {
        usernameInput.type = 'text';
        setTimeout(() => usernameInput.type = 'text', 100);
      }

      if (passwordInput) {
        passwordInput.type = 'text';
        setTimeout(() => passwordInput.type = 'password', 100);
      }
    });
  }

  hideProfile() {
    this.signInForm.patchValue({ username: '' });
    localStorage.removeItem(this.localStorageKey);
    this.currentUser = false;
    this.visibleBtns.emit(true);
    this.isMenuVisible = false;
  }

  onSignIn() {
    this.signInForm.markAllAsTouched();

    if (this.signInForm.invalid) {
      if (this.signInForm.controls['username'].hasError('required')) {
        this.toastService.showWarn('Ошибка', 'Поле "Электронная почта" обязательно для заполнения');
      }
      if (this.signInForm.controls['password'].hasError('required')) {
        this.toastService.showWarn('Ошибка', 'Поле "Пароль" обязательно для заполнения');
      }
      if (this.signInForm.controls['password'].hasError('minlength')) {
        this.toastService.showWarn('Ошибка', 'Пароль должен содержать не менее 6 символов');
      }
      return;
    }

    this.progressSpinnerService.show();
    const formData = this.signInForm.value;
    const Data = {
      userName: formData.username,
      password: formData.password,
      email: ""
    };

    this.AuthorizationService.signIn(Data).subscribe(
      (response) => {
        if (response.data.data) {
          this.tokenService.setToken(response.data.data.token);
          this.progressSpinnerService.hide();
          localStorage.setItem('VXNlcklk', response.data.data.id);
          localStorage.setItem(environment.userAuthData, JSON.stringify(response.data.data));
          this.currentUserService.saveUser(response.data.data);
          this.router.navigate([`/${response.data.data.id}`]);
          this.navMenuService.setNotifications(response.notifyData);
          this.toastService.showSuccess('Успешно', 'Вы вошли в систему');
        }
      },
      (error) => {
        this.progressSpinnerService.hide();
        const errorMessage = error?.error?.Message || 'Произошла неизвестная ошибка';
        this.toastService.showError('Ошибка входа', errorMessage);
      }
    );
  }



  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSignIn();
    }
  }
  
}
