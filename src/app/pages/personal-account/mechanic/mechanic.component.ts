import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';

interface CustomMenuItem {
  label: string;
  commandName?: string;
}

@Component({
  selector: 'app-mechanic',
  imports: [RouterOutlet,NavMenuComponent],
  templateUrl: './mechanic.component.html',
  styleUrl: './mechanic.component.scss'
})
export class MechanicComponent {

  menuItems: CustomMenuItem[] = [
    { label: 'Профиль', commandName: 'profile' },
    { label: 'Сервисы', commandName: 'services' },
    { label: 'Документы', commandName: 'documentsVerification' },
    // { label: 'Нал', commandName: '' },
  ];
  
}
