import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitumenComponent } from './bitumen.component';

describe('BitumenComponent', () => {
  let component: BitumenComponent;
  let fixture: ComponentFixture<BitumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
