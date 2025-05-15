import { TestBed } from '@angular/core/testing';

import { CashMenuService } from './cash-menu.service';

describe('CashMenuService', () => {
  let service: CashMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
