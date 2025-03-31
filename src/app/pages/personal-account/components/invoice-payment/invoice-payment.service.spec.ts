import { TestBed } from '@angular/core/testing';

import { InvoicePaymentService } from './invoice-payment.service';

describe('InvoicePaymentService', () => {
  let service: InvoicePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
