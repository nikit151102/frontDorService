import { TestBed } from '@angular/core/testing';

import { AdditionalDataService } from './additional-data.service';

describe('AdditionalDataService', () => {
  let service: AdditionalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
