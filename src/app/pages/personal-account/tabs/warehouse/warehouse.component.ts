import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { InvoicesService } from '../base/invoices/invoices.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DateFilterSortComponent } from '../../../../components/fields/date-filter/date-filter.component';
import { NumberFilterComponent } from '../../../../components/fields/number-filter/number-filter.component';
import { SearchFilterSortComponent } from '../../../../components/fields/search-filter-sort/search-filter-sort.component';
import { UuidSearchFilterSortComponent } from '../../../../components/fields/uuid-search-filter-sort/uuid-search-filter-sort.component';
import { WarehouseService } from './warehouse.service';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { DirectorService } from '../stats/director.service';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-warehouse',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent implements OnInit {

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
    sessionStorage.setItem('warehouseType', selectTab.managerDocType);
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
