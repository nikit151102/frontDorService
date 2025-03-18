import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtService } from '../../../../services/jwt.service';
import { TokenService } from '../../../../services/token.service';
import { NavMenuService } from './nav-menu.service';
import { Subscription } from 'rxjs';

interface CustomMenuItem {
  label: string;
  commandName?: string;
  access: string;
  notifyKey?: string;
}

interface FullNotifyData{
  PartnersNotifyData:NotifyData, // Данные уведомлений для Контрагентов
  ServicesNotifyData:NotifyData // Данные уведомлений для Сервисов
}

interface NotifyData {
  NotDeliveredCount: number, // Количество непрочитанных
  NeedActionCount: number // Количество Требуются действия
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent implements OnInit, OnDestroy {

  items: CustomMenuItem[] = [
    { label: 'Профиль', commandName: 'profile', access: '' },
    { label: 'Контрагенты', commandName: 'clients', access: 'PartnersAccess', notifyKey: 'PartnersNotifyData' },
    { label: 'Сервисы', commandName: 'services', access: 'ServicesAccess', notifyKey: 'ServicesNotifyData' },
    // { label: 'Нал', commandName: '', access: '', access: 'CashAccess },
    { label: 'Справочники', commandName: 'reference', access: 'EntitiesAccess' }

  ];
  decodedRole: any[] = [];
  notifications: any;
  private notificationSubscription!: Subscription;
  
  constructor(private activatedRoute: ActivatedRoute,
    private jwtService: JwtService, private router: Router,
    private tokenService: TokenService, private navMenuService: NavMenuService) { }

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

    this.navMenuService.connectToWebSocket();

    this.notificationSubscription = this.navMenuService.notifications$.subscribe((data: any) => {
      this.notifications = data;
    });

  }

  hasAccess(access: string): boolean {
    return !access || this.decodedRole.includes(access);
  }

  shouldShowNotification(notifyKey?: string): boolean {
    return notifyKey ? this.getNotificationCount(notifyKey) > 0 : false;
  }
  
  getNotificationCount(notifyKey?: string): number {
    if (!this.notifications || !notifyKey || !(notifyKey in this.notifications)) {
      return 0;
    }
  
    const data = this.notifications[notifyKey as keyof FullNotifyData] as NotifyData;
    return (data?.NotDeliveredCount || 0) + (data?.NeedActionCount || 0);
  }
  


  execute(commandName: string) {
    if (commandName == 'exit') {
      this.router.navigate(['/']);
      this.tokenService.clearToken();
      window.history.pushState(null, '', '/');
    } else {
      this.activatedRoute.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.router.navigate([`${id}/${commandName}`]);
        }
      });
    }
  }


  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }

    this.navMenuService.disconnectWebSocket();
  }


}
