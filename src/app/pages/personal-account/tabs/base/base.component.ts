import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseMenuComponent } from './base-menu/base-menu.component';
import { BitumenComponent } from './bitumen/bitumen.component';
import { CellsComponent } from './cells/cells.component';

@Component({
  selector: 'app-base',
  imports: [CommonModule, BaseMenuComponent,BitumenComponent, CellsComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {

  selectedTab: any;
  selectedTabConfig: any;

  onSelectTab(selectTab: any){
    console.log('selectTab',selectTab)
    this.selectedTab = selectTab.code;
    sessionStorage.setItem('managerDocType', selectTab.managerDocType)
  }
}
