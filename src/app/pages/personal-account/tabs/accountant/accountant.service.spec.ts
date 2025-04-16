import { TestBed } from '@angular/core/testing';
import { AccountantService } from './accountant.service';

describe('PartnersService', () => {
  let service: AccountantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
