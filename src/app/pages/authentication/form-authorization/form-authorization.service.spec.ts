import { TestBed } from '@angular/core/testing';

import { FormAuthorizationService } from './form-authorization.service';

describe('FormAuthorizationService', () => {
  let service: FormAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
