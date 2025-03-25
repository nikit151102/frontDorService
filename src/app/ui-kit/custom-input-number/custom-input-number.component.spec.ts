import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputNumberComponent } from './custom-input-number.component';

describe('CustomInputNumberComponent', () => {
  let component: CustomInputNumberComponent;
  let fixture: ComponentFixture<CustomInputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputNumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
