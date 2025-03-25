import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: any;
  loading = true;
  errorMessage = '';

  constructor(private profileService: ProfileService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      patronymic: [''],
      email: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.profileForm.patchValue(this.profile); // Заполняем форму данными
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Ошибка загрузки профиля!';
        this.loading = false;
      }
    });
  }

  saveProfile() {
    const updatedProfile = this.profileForm.value;

    this.profileService.updateProfile(updatedProfile).subscribe({
      next: () => alert('Профиль успешно обновлен!'),
      error: () => alert('Ошибка обновления профиля!')
    });
  }
}
