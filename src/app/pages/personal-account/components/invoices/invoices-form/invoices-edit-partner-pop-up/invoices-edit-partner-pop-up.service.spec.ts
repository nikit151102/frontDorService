import { TestBed } from '@angular/core/testing';

import { InvoicesEditPartnerPopUpService } from './invoices-edit-partner-pop-up.service';

describe('InvoicesEditPartnerPopUpService', () => {
  let service: InvoicesEditPartnerPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicesEditPartnerPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
