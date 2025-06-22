import { TestBed } from '@angular/core/testing';

import { FormatingDataService } from './formating-data.service';

describe('FormatingDataService', () => {
  let service: FormatingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
