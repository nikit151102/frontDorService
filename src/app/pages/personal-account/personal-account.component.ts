import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { JwtService } from '../../services/jwt.service';
import { NavMenuService } from './components/nav-menu/nav-menu.service';

@Component({
  selector: 'app-personal-account',
  imports: [RouterOutlet, NavMenuComponent],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.scss'
})
export class PersonalAccountComponent implements OnInit {
  showGreeting = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private navMenuService: NavMenuService
  ) {}

  ngOnInit(): void {
    const fullPath = this.router.url;
    const segments = fullPath.split('/');

    const rootTab = segments.find(segment =>
      ['clients', 'services', 'reference', 'accountant', 'cash', 'base', 'profile'].includes(segment)
    );

    if (!rootTab) {
      this.showGreeting = true;
      this.router.navigate(['loading'], { relativeTo: this.route });
      setTimeout(() => {
        this.checkAndRedirect();
      }, 1500);
    } else {
      this.checkAndRedirect(rootTab);
    }
  }

  private checkAndRedirect(rootTab?: string) {
    const decodedToken = this.jwtService.getDecodedToken();
    if (!decodedToken || !decodedToken.role) {
      console.error('Ошибка: нет роли в токене!');
      this.router.navigate(['profile'], { relativeTo: this.route });
      return;
    }

    const userRoles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];

    const availableTabs = [
      { path: 'clients', access: 'PartnersAccess' },
      { path: 'services', access: 'ServicesAccess' },
      { path: 'reference', access: 'EntitiesAccess' },
      { path: 'accountant', access: 'AccountantAccess' },
      { path: 'cash', access: 'CashAccess' },
      { path: 'base', access: 'BaseAccess' },
      { path: 'profile', access: '' }
    ];

    if (rootTab) {
      const rootTabConfig = availableTabs.find(tab => tab.path === rootTab);
      if (rootTabConfig && (!rootTabConfig.access || userRoles.includes(rootTabConfig.access))) {
        return;
      }
    }

    const firstAvailableTab = availableTabs.find(tab => !tab.access || userRoles.includes(tab.access));
    if (firstAvailableTab) {
      this.router.navigate([firstAvailableTab.path], { relativeTo: this.route, replaceUrl: true });
    } else {
      this.router.navigate(['profile'], { relativeTo: this.route });
    }
  }
}