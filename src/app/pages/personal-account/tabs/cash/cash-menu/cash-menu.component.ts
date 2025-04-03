import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';

@Component({
  selector: 'app-cash-menu',
  imports: [CommonModule],
  templateUrl: './cash-menu.component.html',
  styleUrl: './cash-menu.component.scss'
})
export class CashMenuComponent implements OnInit {

  selectedName: string = '';
  items: any[] = [
    { name: 'Снабженец', access: '' },
    { name: 'Механик', access: '' },
    { name: 'Директор', access: '' }
  ];

  constructor(private jwtService: JwtService) { }

  decodedRole: any[] = [];

  ngOnInit(): void {
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

  select(name: string): void {
    this.selectedName = name;
  }

}
