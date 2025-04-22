import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDataComponent } from './additional-data.component';

describe('AdditionalDataComponent', () => {
  let component: AdditionalDataComponent;
  let fixture: ComponentFixture<AdditionalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
