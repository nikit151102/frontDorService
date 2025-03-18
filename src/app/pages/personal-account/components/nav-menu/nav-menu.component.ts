import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtService } from '../../../../services/jwt.service';

interface CustomMenuItem {
  label: string;
  commandName?: string;
   access: string
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent  implements OnInit{
  
  items: CustomMenuItem[] = [
    { label: 'Профиль', commandName: 'profile', access: '' },
    { label: 'Контрагенты', commandName: 'clients', access: 'PartnersAccess' },
    { label: 'Сервисы', commandName: 'services', access: 'ServicesAccess' },
    // { label: 'Нал', commandName: '', access: '', access: 'CashAccess },
    { label: 'Справочники', commandName: 'reference', access: 'EntitiesAccess' },
    { label: 'Выйти', commandName: 'exit', access: '/' }
    
  ];
  decodedRole: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private jwtService:JwtService, private router: Router) {}
  
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

    console.log('Decoded roles:', this.decodedRole);
  }

  hasAccess(access: string): boolean {
    return !access || this.decodedRole.includes(access);
  }

 execute(commandName: string) {
    if(commandName == 'exit'){
      this.router.navigate(['/']);
      this.tokenService.clearToken();
      window.history.pushState(null, '', '/');
    }else{
      this.activatedRoute.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.router.navigate([`${id}/${commandName}`]);
        }
      });
    }
  }
  
}
