import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../../ui-kit/custom-button/custom-button.component';
import { CustomInputComponent } from '../../../ui-kit/custom-input-auth/custom-input.component';
import { Router } from '@angular/router';
import { ProgressSpinnerService } from '../../../components/progress-spinner/progress-spinner.service';
import { CurrentUserService } from '../../../services/current-user.service';
import { ToastService } from '../../../services/toast.service';
import { TokenService } from '../../../services/token.service';
import { NavMenuService } from '../../personal-account/components/nav-menu/nav-menu.service';
import { FormRegistrationService } from './form-registration.service';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-form-registration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomButtonComponent, CustomInputComponent, InputOtpModule],
  templateUrl: './form-registration.component.html',
  styleUrl: './form-registration.component.scss'
})
export class FormRegistrationComponent {
  signInForm: FormGroup;
  currentUser: boolean = false;
  dataCurrentUser: any;
  private localStorageKey: string = 'ZW5jcnlwdGVkRW1haWw=';
  public isMenuVisible: boolean = false;

  constructor(private fb: FormBuilder,
    private registrationService: FormRegistrationService,
    private router: Router,
    private tokenService: TokenService,
    private progressSpinnerService: ProgressSpinnerService,
    private toastService: ToastService,
    private currentUserService: CurrentUserService,
    private navMenuService: NavMenuService
  ) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      code: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Валидация для проверки совпадения паролей
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { 'passwordMismatch': true } : null;
  }

  private safeBtoa(input: string): string {
    return btoa(unescape(encodeURIComponent(input)));
  }

  private safeAtob(input: string): string {
    return decodeURIComponent(escape(atob(input)));
  }

  ngOnInit() {
    const encryptedEmail = localStorage.getItem(this.localStorageKey);
    if (encryptedEmail) {
      this.dataCurrentUser = JSON.parse(this.safeAtob(encryptedEmail));
      this.signInForm.patchValue({ username: this.dataCurrentUser.email });
      this.currentUser = true;
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

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  hideProfile() {
    this.signInForm.patchValue({ username: '' });
    localStorage.removeItem(this.localStorageKey);
    this.currentUser = false;
    this.isMenuVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const menuElement = document.querySelector('.dropdownMenu');
    if (menuElement && !menuElement.contains(event.target as Node)) {
      this.isMenuVisible = false;
    }
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
      if (this.signInForm.hasError('passwordMismatch')) {
        this.toastService.showWarn('Ошибка', 'Пароли не совпадают');
      }
      return;
    }
  
  
    this.progressSpinnerService.show();
    const formData = this.signInForm.value;
    const Data = {
      userName: formData.username,
      password: formData.password,
      initialPassCode: Number(formData.code)
    };
  
    this.registrationService.signIn(Data).subscribe(
      (response) => {
        if (response.data.data) {
          this.tokenService.setToken(response.data.token);
          this.progressSpinnerService.hide();
          localStorage.setItem('VXNlcklk', response.data.id);
          this.currentUserService.saveUser(response.data);
          this.router.navigate([`/${response.data.id}`]);
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

  handleOtp(otp: string) {
    console.log('Введенный код:', otp);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSignIn();
    }
  }

  @Output() switch = new EventEmitter<string>();

  goToLogin(){
    this.switch.emit('login');
  }
}
