import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, take } from 'rxjs';
import { InvoicesEditPartnerPopUpService } from './invoices-edit-partner-pop-up.service';
import { PartnerMenuService } from '../../../partner-menu/partner-menu.service';

@Component({
  selector: 'app-invoices-edit-partner-pop-up',
  imports: [CommonModule],
  templateUrl: './invoices-edit-partner-pop-up.component.html',
  styleUrl: './invoices-edit-partner-pop-up.component.scss'
})
export class InvoicesEditPartnerPopUpComponent implements OnInit {
  visible$!: Observable<boolean>;
  title: string = 'Выберите контрагента';
  acceptLabel: string = 'Сохранить';
  rejectLabel: string = 'Отмена';
  partners: any[] = [];
  selectedPartner: any = null;
  @Output() partnerSelected = new EventEmitter<any>();
  
  constructor(
    private invoicesEditPartnerPopUpService: InvoicesEditPartnerPopUpService,
    private cdr: ChangeDetectorRef,
    private partnerMenuService: PartnerMenuService
  ) { }

  ngOnInit() {
    this.visible$ = this.invoicesEditPartnerPopUpService.visible$;

    if (this.partnerMenuService.partnersData?.length > 0) {
      this.partners = this.partnerMenuService.partnersData;
    } else {
      this.partnerMenuService.getCounterparties().subscribe(
        (data: any) => {
          this.partners = data.data;
        },
        (error: any) => {
          console.error('Ошибка загрузки контрагентов:', error);
        }
      );
    }
  }

  selectPartner(partner: any) {
    this.selectedPartner = partner;
  }

  onAccept() {
    if (this.selectedPartner) {
      console.log('Выбранный контрагент:', this.selectedPartner);
      this.partnerSelected.emit(this.selectedPartner.id);
      this.invoicesEditPartnerPopUpService.closeConfirmDialog();
    }
  }

  closePopup() {
    this.invoicesEditPartnerPopUpService.closeConfirmDialog();
  }
}
