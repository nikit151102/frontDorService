import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticComponent } from './logistic.component';

describe('LogisticComponent', () => {
  let component: LogisticComponent;
  let fixture: ComponentFixture<LogisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
