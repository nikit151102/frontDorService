import { TestBed } from '@angular/core/testing';

import { GeneralFormService } from './general-form.service';

describe('GeneralFormService', () => {
  let service: GeneralFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
