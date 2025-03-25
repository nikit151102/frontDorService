import { TestBed } from '@angular/core/testing';

import { PartnerMenuService } from './partner-menu.service';

describe('PartnerMenuService', () => {
  let service: PartnerMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
