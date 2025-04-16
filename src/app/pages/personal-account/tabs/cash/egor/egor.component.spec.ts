import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgorComponent } from './egor.component';

describe('EgorComponent', () => {
  let component: EgorComponent;
  let fixture: ComponentFixture<EgorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EgorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
