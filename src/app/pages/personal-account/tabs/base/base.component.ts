import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseMenuComponent } from './base-menu/base-menu.component';
import { BitumenComponent } from './bitumen/bitumen.component';

@Component({
  selector: 'app-base',
  imports: [CommonModule, BaseMenuComponent,BitumenComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {

  selectedTab: any;
  selectedTabConfig: any;

  onSelectTab(selectTab: any){
    console.log('selectTab',selectTab)
    this.selectedTab = selectTab.code;
  }
}
