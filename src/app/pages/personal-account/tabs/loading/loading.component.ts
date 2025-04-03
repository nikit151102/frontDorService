import { Component } from '@angular/core';
import { CurrentUserService } from '../../../../services/current-user.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  greeting: string = '';
  userFullName: string = ''; 

  constructor(private currentUserService: CurrentUserService) {
    this.setGreeting();
    this.setUserFullName();
  }

  private setGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Доброе утро,';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Добрый день,';
    } else if (hour >= 18 && hour < 23) {
      this.greeting = 'Добрый вечер,';
    } else {
      this.greeting = 'Доброй ночи,';
    }
  }

  private setUserFullName() {
    const user = this.currentUserService.getUser();
    if (user && user.firstName && user.lastName) {
      this.userFullName = `${user.firstName} ${user.lastName}`;
    } else {
      this.userFullName = 'Гость'; 
    }
  }
}