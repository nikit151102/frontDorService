import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { MenuItem } from 'primeng/api';

interface CustomMenuItem {
  label: string;
  commandName?: string;
}

@Component({
  selector: 'app-supplier',
  imports: [RouterOutlet,NavMenuComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent {

  menuItems: CustomMenuItem[] = [
    { label: 'Контрагенты', commandName: 'clients' },
    { label: 'Профиль', commandName: 'profile' },
    // { label: 'Нал', commandName: '' },
    // { label: 'Документы', commandName: '194253' }
  ];
  
}
