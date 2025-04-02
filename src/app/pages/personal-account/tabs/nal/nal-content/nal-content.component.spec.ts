import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NalContentComponent } from './nal-content.component';

describe('NalContentComponent', () => {
  let component: NalContentComponent;
  let fixture: ComponentFixture<NalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NalContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
