import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtService } from '../../../../services/jwt.service';

interface CustomMenuItem {
  label: string;
  commandName?: string;
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
    { label: 'Профиль', commandName: 'profile' },
    { label: 'Контрагенты', commandName: 'clients' },
    { label: 'Сервисы', commandName: 'services' },
    // { label: 'Нал', commandName: '' },
    { label: 'Документы', commandName: 'documentsVerification' },
    { label: 'Справочники', commandName: 'reference' }
    
  ];

  decodedRole:any;

  constructor(private activatedRoute: ActivatedRoute, private jwtService:JwtService, private router: Router) {}
  ngOnInit(): void {
    this.decodedRole = this.jwtService.getDecodedToken();
    console.log('role',this.decodedRole)
  }

  execute(commandName: string) {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.router.navigate([`${id}/${commandName}`]);
      }
    });
  }
}
