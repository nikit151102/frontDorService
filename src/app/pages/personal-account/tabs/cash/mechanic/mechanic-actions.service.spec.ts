import { TestBed } from '@angular/core/testing';

import { MechanicActionsService } from './mechanic-actions.service';

describe('MechanicActionsService', () => {
  let service: MechanicActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
