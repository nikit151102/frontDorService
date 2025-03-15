import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceBookComponent } from './reference-book.component';

describe('ReferenceBookComponent', () => {
  let component: ReferenceBookComponent;
  let fixture: ComponentFixture<ReferenceBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
