import { TestBed } from '@angular/core/testing';

import { ServicesContentService } from './services-content.service';

describe('ServicesContentService', () => {
  let service: ServicesContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
