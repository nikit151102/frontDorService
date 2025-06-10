import { TestBed } from '@angular/core/testing';

import { GeneralDocsService } from './general-docs.service';

describe('GeneralDocsService', () => {
  let service: GeneralDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
