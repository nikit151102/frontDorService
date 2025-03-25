import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMenuComponent } from './partner-menu.component';

describe('PartnerMenuComponent', () => {
  let component: PartnerMenuComponent;
  let fixture: ComponentFixture<PartnerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
