import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAccountComponent } from './payment-account.component';

describe('PaymentAccountComponent', () => {
  let component: PaymentAccountComponent;
  let fixture: ComponentFixture<PaymentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
