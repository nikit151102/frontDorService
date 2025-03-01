import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAuthorizationComponent } from './form-authorization.component';

describe('FormAuthorizationComponent', () => {
  let component: FormAuthorizationComponent;
  let fixture: ComponentFixture<FormAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAuthorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
