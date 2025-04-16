import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScopeComponent } from './info-scope.component';

describe('InfoScopeComponent', () => {
  let component: InfoScopeComponent;
  let fixture: ComponentFixture<InfoScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoScopeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
