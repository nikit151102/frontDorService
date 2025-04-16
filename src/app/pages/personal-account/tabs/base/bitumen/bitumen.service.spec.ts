import { TestBed } from '@angular/core/testing';

import { BitumenService } from './bitumen.service';

describe('BitumenService', () => {
  let service: BitumenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitumenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
