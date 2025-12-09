import { TestBed } from '@angular/core/testing';

import { GeneralDocsFormService } from './general-docs-form.service';

describe('GeneralDocsFormService', () => {
  let service: GeneralDocsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralDocsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
