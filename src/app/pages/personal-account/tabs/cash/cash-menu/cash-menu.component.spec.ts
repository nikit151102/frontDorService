import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashMenuComponent } from './cash-menu.component';

describe('CashMenuComponent', () => {
  let component: CashMenuComponent;
  let fixture: ComponentFixture<CashMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
