import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSalaryComponent } from './driver-salary.component';

describe('DriverSalaryComponent', () => {
  let component: DriverSalaryComponent;
  let fixture: ComponentFixture<DriverSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
