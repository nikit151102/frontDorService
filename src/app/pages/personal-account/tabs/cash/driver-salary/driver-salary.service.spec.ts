import { TestBed } from '@angular/core/testing';

import { DriverSalaryService } from './driver-salary.service';

describe('DriverSalaryService', () => {
  let service: DriverSalaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverSalaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
