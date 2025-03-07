import { TestBed } from '@angular/core/testing';

import { InvoicesTableService } from './invoices-table.service';

describe('InvoicesTableService', () => {
  let service: InvoicesTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicesTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
