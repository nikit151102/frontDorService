import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { JwtService } from '../../services/jwt.service';
import { NavMenuService } from './components/nav-menu/nav-menu.service';

@Component({
  selector: 'app-personal-account',
  imports: [RouterOutlet,NavMenuComponent],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.scss'
})
export class PersonalAccountComponent  implements OnInit {
  showGreeting = false;  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private navMenuService: NavMenuService
  ) {}

  ngOnInit(): void {
    const currentPath = this.router.url; 

    if (!currentPath.includes('/clients') && 
        !currentPath.includes('/services') && 
        !currentPath.includes('/reference') && 
        !currentPath.includes('/accountant') && 
        !currentPath.includes('/cash') &&
        !currentPath.includes('/base') &&
        !currentPath.includes('/profile')) {
      this.showGreeting = true;  
      this.router.navigate(['loading'], { relativeTo: this.route });
      setTimeout(() => {
        this.redirectToFirstAvailableTab();
      }, 1500); 
    } else {
      this.redirectToFirstAvailableTab();
    }
  }

  private redirectToFirstAvailableTab() {
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
      { path: 'profile', access: '' }
    ];

    const firstAvailableTab = availableTabs.find(tab => !tab.access || userRoles.includes(tab.access));

    if (firstAvailableTab) {
      this.router.navigate([firstAvailableTab.path], { relativeTo: this.route, replaceUrl: true });
    } else {
      console.warn('Нет доступных вкладок!');
      this.router.navigate(['profile'], { relativeTo: this.route });
    }
  }
}