import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NalComponent } from './nal.component';

describe('NalComponent', () => {
  let component: NalComponent;
  let fixture: ComponentFixture<NalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
