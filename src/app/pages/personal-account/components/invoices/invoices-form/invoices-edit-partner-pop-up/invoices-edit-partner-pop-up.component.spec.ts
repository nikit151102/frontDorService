import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesEditPartnerPopUpComponent } from './invoices-edit-partner-pop-up.component';

describe('InvoicesEditPartnerPopUpComponent', () => {
  let component: InvoicesEditPartnerPopUpComponent;
  let fixture: ComponentFixture<InvoicesEditPartnerPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesEditPartnerPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicesEditPartnerPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
