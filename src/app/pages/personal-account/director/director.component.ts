import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';

interface CustomMenuItem {
  label: string;
  commandName?: string;
}

@Component({
  selector: 'app-director',
  imports: [CommonModule, RouterOutlet, NavMenuComponent],
  standalone: true,
  templateUrl: './director.component.html',
  styleUrl: './director.component.scss'
})
export class DirectorComponent {

  menuItems: CustomMenuItem[] = [
    { label: 'Документы', commandName: 'documents' },
    { label: 'Профиль', commandName: 'profile' },
    { label: 'Справочники', commandName: 'reference' }
  ];

}
