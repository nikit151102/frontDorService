import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSalaryFormComponent } from './driver-salary-form.component';

describe('DriverSalaryFormComponent', () => {
  let component: DriverSalaryFormComponent;
  let fixture: ComponentFixture<DriverSalaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverSalaryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverSalaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
