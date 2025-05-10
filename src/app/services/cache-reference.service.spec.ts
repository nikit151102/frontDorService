import { TestBed } from '@angular/core/testing';

import { CacheReferenceService } from './cache-reference.service';

describe('CacheReferenceService', () => {
  let service: CacheReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
