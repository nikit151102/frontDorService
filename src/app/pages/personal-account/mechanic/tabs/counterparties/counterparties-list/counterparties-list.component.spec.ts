import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterpartiesListComponent } from './counterparties-list.component';

describe('CounterpartiesListComponent', () => {
  let component: CounterpartiesListComponent;
  let fixture: ComponentFixture<CounterpartiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterpartiesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounterpartiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
