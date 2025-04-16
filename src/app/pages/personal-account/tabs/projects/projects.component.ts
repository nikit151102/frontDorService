import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PartnerMenuComponent } from '../../components/partner-menu/partner-menu.component';
import { BUTTON_SETS } from './button-config'
import { ProjectsService } from './projects.service';
import { ProjectsContentComponent } from './projects-content/projects-content.component';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ProjectsContentComponent, PartnerMenuComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {


  selectedCounterpartyId: number | null = null;
  selectedCounterparty: any;
  notificationsInvoices: any;
  notificationsPartners: any;
  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.connectToWebSocket();
    this.projectsService.invoices$.subscribe((values: any) => {
      this.notificationsInvoices = values;
    })

    this.projectsService.partner$.subscribe((values: any) => {
      this.notificationsPartners = values;
    })
  }

  onSelectCounterparty(data:{id: number, data: string}) {
    console.log('data',data)
    this.selectedCounterpartyId = data.id;
    this.selectedCounterparty = data.data;
  }

  getBUTTON_SETS() {
    return BUTTON_SETS
  }
}
