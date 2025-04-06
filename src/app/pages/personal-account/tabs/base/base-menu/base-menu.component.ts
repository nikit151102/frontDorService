import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-menu',
  imports: [CommonModule],
  templateUrl: './base-menu.component.html',
  styleUrl: './base-menu.component.scss'
})
export class BaseMenuComponent implements OnInit {

  @Output() selectTab = new EventEmitter<any>();
  selectedName: string = '';
  items: any[] = [
    { code: '349143', name: 'Битум', access: '' },
    { code: '810632', name: 'Ячейки', access: '' }
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

  select(item: any): void {
    this.selectedName = item.name;
    this.selectTab.emit(item);
  }

}
