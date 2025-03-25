import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-personal-account',
  imports: [RouterOutlet,NavMenuComponent],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.scss'
})
export class PersonalAccountComponent {

}
