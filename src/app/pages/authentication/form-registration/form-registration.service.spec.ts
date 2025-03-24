import { TestBed } from '@angular/core/testing';

import { FormRegistrationService } from './form-registration.service';

describe('FormRegistrationService', () => {
  let service: FormRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
