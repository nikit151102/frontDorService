import { TestBed } from '@angular/core/testing';

import { ReferenceBookService } from './reference-book.service';

describe('ReferenceBookService', () => {
  let service: ReferenceBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
