import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { CashMenuService } from './cash-menu.service';

@Component({
  selector: 'app-cash-menu',
  imports: [CommonModule],
  templateUrl: './cash-menu.component.html',
  styleUrl: './cash-menu.component.scss'
})
export class CashMenuComponent implements OnInit {

  @Output() selectedNameChange = new EventEmitter<string>();

  selectedName: string = '';
  items: any[] = [
    { name: 'Механик', access: 'MechanicAccess', antonCashType: 0 },
    { name: 'Антон', access: 'AntonAccess', antonCashType: 1 },
    { name: 'Дима', access: 'DimaAccess', antonCashType: 5 },
    { name: 'Дима база', access: 'DimaAccess', antonCashType: 2 },
    { name: 'Егор', access: 'EgorAccess', antonCashType: 3 },
    { name: 'Снабженец', access: '', antonCashType: 4 },
  ];
  // items: any[] = [
  //   { name: 'Механик', access: '', antonCashType: 0},
  //   { name: 'Антон', access: '', antonCashType: 1 },
  //   { name: 'Дима', access: '', antonCashType: 2 },
  //   { name: 'Егор', access: '', antonCashType: 3 },
  // ];

  constructor(private jwtService: JwtService, private cashMenuService: CashMenuService) { }

  decodedRole: any[] = [];
  isVisible = true;

  toggleVisibility() {
    this.cashMenuService.setSomeVariable(!this.isVisible);
  }

  ngOnInit(): void {
    this.cashMenuService.someVariable$.subscribe((value: any) => {
      this.isVisible = value
    })

    const decodedToken = this.jwtService.getDecodedToken();

    if (decodedToken && decodedToken.role) {
      if (Array.isArray(decodedToken.role)) {
        this.decodedRole = decodedToken.role;
      } else {
        console.error('Ошибка: role не массив!', decodedToken.role);
      }
    } else {
      console.error('Ошибка: Токен не содержит role!', decodedToken);
    }

  }

  hasAccess(access: string): boolean {
    return !access || this.decodedRole.includes(access);
  }

  select(item: any): void {
    this.selectedName = item.name;
    this.selectedNameChange.emit(item.antonCashType);
  }

}
