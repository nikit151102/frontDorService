import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LogisticService } from './logistic.service';

@Component({
  selector: 'app-logistic',
  imports: [MenuComponent, RouterOutlet],
  templateUrl: './logistic.component.html',
  styleUrl: './logistic.component.scss'
})
export class LogisticComponent implements OnInit {

  selectedTab: any;
  selectedTabConfig: any;
  contentWidth: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private logisticService: LogisticService) { }

  ngOnInit(): void {
    this.logisticService.setSomeVariable(true);
    this.logisticService.someVariable$.subscribe((value: any) => {
      this.contentWidth = value
        ? 'calc(100% - 290px)'
        : 'calc(100% - 120px)';
    });

    this.logisticService.connectToWebSocket();
  }

  onSelectTab(selectTab: any) {
    console.log('selectTab', selectTab);

    this.selectedTab = selectTab.code;
    sessionStorage.setItem('managerDocType', selectTab.managerDocType);
    this.logisticService.selectManagerDocType = selectTab.managerDocType;
    let navigatePath;

    if (typeof selectTab.navigate === 'function') {
      navigatePath = selectTab.navigate(selectTab);  // Вызываем функцию
    } else {
      navigatePath = selectTab.navigate;             // Просто массив
    }

    this.router.navigate(navigatePath, { relativeTo: this.activatedRoute });
  }



}
