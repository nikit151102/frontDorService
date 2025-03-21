import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

interface FullNotifyData {
  partnersNotifyData: NotifyData, // Данные уведомлений для Контрагентов
  servicesNotifyData: NotifyData // Данные уведомлений для Сервисов
}

interface NotifyData {
  notDeliveredCount: number, // Количество непрочитанных
  needActionCount: number // Количество Требуются действия
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
    { label: 'Контрагенты', commandName: 'clients', access: 'PartnersAccess', notifyKey: 'partnersNotifyData' },
    { label: 'Сервисы', commandName: 'services', access: 'ServicesAccess', notifyKey: 'servicesNotifyData' },
    // { label: 'Нал', commandName: '', access: '', access: 'CashAccess },
    { label: 'Справочники', commandName: 'reference', access: 'EntitiesAccess' }

  ];
  decodedRole: any[] = [];
  notifications: any;
  private notificationSubscription!: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private jwtService: JwtService, private router: Router,
    private cdr: ChangeDetectorRef,
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
      this.cdr.detectChanges();
    });
    this.notifications = this.navMenuService.getNotifications();
    console.log('notifications', this.notifications)
  }

  hasAccess(access: string): boolean {
    return !access || this.decodedRole.includes(access);
  }

  tooltipVisible = false;
  tooltipData: NotifyData | null = null;
  tooltipX = 0;
  tooltipY = 0;

  shouldShowNotification(notifyKey?: string): boolean {
    return notifyKey ? this.getNotificationCount(notifyKey) > 0 : false;
  }

  getNotificationCount(notifyKey: any): number {
    const data = this.navMenuService.getNotifications();
    return data && data[notifyKey]
      ? (data[notifyKey].notDeliveredCount || 0) + (data[notifyKey].needActionCount || 0)
      : 0;
  }


  getNotificationClass(notifyKey?: string): string {
    if (!this.notifications || !notifyKey || !(notifyKey in this.notifications)) {
      return '';
    }

    const data = this.notifications[notifyKey as keyof FullNotifyData] as NotifyData;
    if (data?.needActionCount > 0) {
      return 'notification-warning'; // Есть и непрочитанные, и требующие действий
    }
    return 'notification-info'; // Только непрочитанные
  }


  showTooltip(notifyKey: string | undefined, event: MouseEvent): void {
    if (!notifyKey || !this.notifications || !(notifyKey in this.notifications)) {
      return;
    }

    this.tooltipData = this.notifications[notifyKey as keyof FullNotifyData] as NotifyData;
    this.tooltipX = event.clientX + 10;
    this.tooltipY = event.clientY + 10;
    this.tooltipVisible = true;
  }


  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipData = null;
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
