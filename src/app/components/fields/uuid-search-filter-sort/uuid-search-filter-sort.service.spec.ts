import { TestBed } from '@angular/core/testing';

import { UuidSearchFilterSortService } from './uuid-search-filter-sort.service';

describe('UuidSearchFilterSortService', () => {
  let service: UuidSearchFilterSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UuidSearchFilterSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
