import { TestBed } from '@angular/core/testing';

import { InvoicesContentService } from './invoices-content.service';

describe('InvoicesContentService', () => {
  let service: InvoicesContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicesContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
