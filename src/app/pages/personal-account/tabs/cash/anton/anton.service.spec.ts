import { TestBed } from '@angular/core/testing';

import { AntonService } from './anton.service';

describe('AntonService', () => {
  let service: AntonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
