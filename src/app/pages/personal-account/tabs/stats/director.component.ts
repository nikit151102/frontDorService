import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DirectorService } from './director.service';
import {CarsComponent} from './tabs/cars/cars.component'
import { CarsService } from './tabs/cars/cars.service';

@Component({
  selector: 'app-director',
  imports: [MenuComponent, CarsComponent],
  templateUrl: './director.component.html',
  styleUrl: './director.component.scss'
})
export class DirectorComponent implements OnInit {

  selectedTab: any;
  selectedTabConfig: any;
  contentWidth: any;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private directorService: DirectorService,
    public productsServ: CarsService,
  ) { }

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
    this.selectedTab = selectTab.code;
    sessionStorage.setItem('managerDocType', selectTab.managerDocType);
    this.directorService.selectManagerDocType = selectTab.managerDocType;
    let navigatePath;

    if (typeof selectTab.navigate === 'function') {
      navigatePath = selectTab.navigate(selectTab);
    } else {
      navigatePath = selectTab.navigate;         
    }

    this.router.navigate(navigatePath, { relativeTo: this.activatedRoute });
  }

  onPeriodChanged(data: any) {
    const startDatePlusOne = new Date(data.startDate);
    startDatePlusOne.setDate(startDatePlusOne.getDate() + 1);
    const startDateStr = startDatePlusOne.toISOString().split('T')[0];
    const endDateStr = data.endDate.toISOString().split('T')[0];
    
    this.productsServ.setPeriod(startDateStr, endDateStr);
  }

}
