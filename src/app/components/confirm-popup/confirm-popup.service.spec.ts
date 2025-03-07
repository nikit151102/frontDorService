import { TestBed } from '@angular/core/testing';

import { ConfirmPopupService } from './confirm-popup.service';

describe('ConfirmPopupService', () => {
  let service: ConfirmPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
