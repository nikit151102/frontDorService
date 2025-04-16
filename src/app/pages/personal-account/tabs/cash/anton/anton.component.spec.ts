import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntonComponent } from './anton.component';

describe('AntonComponent', () => {
  let component: AntonComponent;
  let fixture: ComponentFixture<AntonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
