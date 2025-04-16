import { TestBed } from '@angular/core/testing';

import { ScoreFormService } from './score-form.service';

describe('ScoreFormService', () => {
  let service: ScoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
