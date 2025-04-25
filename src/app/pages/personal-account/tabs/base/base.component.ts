import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseMenuComponent } from './base-menu/base-menu.component';

import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BaseService } from './base.service';

@Component({
  selector: 'app-base',
  imports: [CommonModule, BaseMenuComponent, RouterOutlet],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit{

  selectedTab: any;
  selectedTabConfig: any;

  constructor(private router: Router, private activatedRoute:ActivatedRoute, private baseService:BaseService) { }
  
  ngOnInit(): void {
    this.baseService.connectToWebSocket();
  }

  onSelectTab(selectTab: any) {
    console.log('selectTab', selectTab);
  
    this.selectedTab = selectTab.code;
    sessionStorage.setItem('managerDocType', selectTab.managerDocType);
    this.baseService.selectManagerDocType = selectTab.managerDocType;
    let navigatePath;
  
    if (typeof selectTab.navigate === 'function') {
      navigatePath = selectTab.navigate(selectTab);  // Вызываем функцию
    } else {
      navigatePath = selectTab.navigate;             // Просто массив
    }
  
    this.router.navigate(navigatePath, { relativeTo: this.activatedRoute });
  }
  


}
