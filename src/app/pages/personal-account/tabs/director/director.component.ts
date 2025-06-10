import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DirectorService } from './director.service';

@Component({
  selector: 'app-director',
  imports: [MenuComponent, RouterOutlet],
  templateUrl: './director.component.html',
  styleUrl: './director.component.scss'
})
export class DirectorComponent implements OnInit {

  selectedTab: any;
  selectedTabConfig: any;
  contentWidth: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private directorService: DirectorService) { }

  ngOnInit(): void {
    this.directorService.setSomeVariable(true);
    this.directorService.someVariable$.subscribe((value: any) => {
      this.contentWidth = value
        ? 'calc(100% - 290px)'
        : 'calc(100% - 120px)';
    });

    // this.directorService.connectToWebSocket();
  }

  onSelectTab(selectTab: any) {
    console.log('selectTab', selectTab);

    this.selectedTab = selectTab.code;
    sessionStorage.setItem('managerDocType', selectTab.managerDocType);
    this.directorService.selectManagerDocType = selectTab.managerDocType;
    let navigatePath;

    if (typeof selectTab.navigate === 'function') {
      navigatePath = selectTab.navigate(selectTab);  // Вызываем функцию
    } else {
      navigatePath = selectTab.navigate;             // Просто массив
    }

    this.router.navigate(navigatePath, { relativeTo: this.activatedRoute });
  }



}
