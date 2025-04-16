import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountantComponent } from './accountant.component';

describe('AccountantComponent', () => {
  let component: AccountantComponent;
  let fixture: ComponentFixture<AccountantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
