import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocumentsUnsuccessComponent } from './manage-documents-unsuccess.component';

describe('ManageDocumentsUnsuccessComponent', () => {
  let component: ManageDocumentsUnsuccessComponent;
  let fixture: ComponentFixture<ManageDocumentsUnsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDocumentsUnsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocumentsUnsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
