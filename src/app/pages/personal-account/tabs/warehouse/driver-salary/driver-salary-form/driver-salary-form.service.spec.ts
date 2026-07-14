import { TestBed } from '@angular/core/testing';

import { DriverSalaryFormService } from './driver-salary-form.service';

describe('DriverSalaryFormService', () => {
  let service: DriverSalaryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverSalaryFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
