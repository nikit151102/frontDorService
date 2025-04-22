import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseMenuComponent } from './base-menu/base-menu.component';

import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  imports: [CommonModule, BaseMenuComponent, RouterOutlet],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {

  selectedTab: any;
  selectedTabConfig: any;

  constructor(private router: Router, private activatedRoute:ActivatedRoute) { }

  onSelectTab(selectTab: any) {
    console.log('selectTab', selectTab);
  
    this.selectedTab = selectTab.code;
    sessionStorage.setItem('managerDocType', selectTab.managerDocType);
  
    let navigatePath;
  
    if (typeof selectTab.navigate === 'function') {
      navigatePath = selectTab.navigate(selectTab);  // Вызываем функцию
    } else {
      navigatePath = selectTab.navigate;             // Просто массив
    }
  
    this.router.navigate(navigatePath, { relativeTo: this.activatedRoute });
  }
  


}
