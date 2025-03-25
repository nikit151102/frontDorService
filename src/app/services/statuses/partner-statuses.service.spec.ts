import { TestBed } from '@angular/core/testing';

import { PartnerStatusesService } from './partner-statuses.service';

describe('PartnerStatusesService', () => {
  let service: PartnerStatusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
