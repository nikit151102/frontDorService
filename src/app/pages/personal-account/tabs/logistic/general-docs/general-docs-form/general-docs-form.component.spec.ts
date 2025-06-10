import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDocsFormComponent } from './general-docs-form.component';

describe('GeneralDocsFormComponent', () => {
  let component: GeneralDocsFormComponent;
  let fixture: ComponentFixture<GeneralDocsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralDocsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralDocsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
