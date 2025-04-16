import { TestBed } from '@angular/core/testing';

import { EgorService } from './egor.service';

describe('EgorService', () => {
  let service: EgorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EgorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
