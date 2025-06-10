import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JwtService } from '../../../../../services/jwt.service';
import { BaseService } from '../../base/base.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  @Output() selectTab = new EventEmitter<any>();
  selectedName: string = '';
  items: any[] = [
    { code: '349143', name: 'Битум', access: '', managerDocType: 0, navigate: ['cars'] },
  ];

  constructor(private jwtService: JwtService, private baseService:BaseService) { }

  decodedRole: any[] = [];
  isVisible = true;

  toggleVisibility() {
    this.baseService.setSomeVariable(!this.isVisible);
  }


  ngOnInit(): void {
    this.baseService.someVariable$.subscribe((value: any) => {
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
    this.selectTab.emit(item);
  }

}
