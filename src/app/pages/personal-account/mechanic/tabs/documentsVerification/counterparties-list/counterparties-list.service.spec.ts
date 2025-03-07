import { TestBed } from '@angular/core/testing';

import { CounterpartiesListService } from './counterparties-list.service';

describe('CounterpartiesListService', () => {
  let service: CounterpartiesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterpartiesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
