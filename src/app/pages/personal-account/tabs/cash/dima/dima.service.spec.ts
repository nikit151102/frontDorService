import { TestBed } from '@angular/core/testing';

import { DimaService } from './dima.service';

describe('DimaService', () => {
  let service: DimaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DimaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
