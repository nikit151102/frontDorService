import { TestBed } from '@angular/core/testing';

import { LogisticService } from './logistic.service';

describe('LogisticService', () => {
  let service: LogisticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogisticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
