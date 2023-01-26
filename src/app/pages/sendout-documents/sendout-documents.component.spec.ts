import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendoutDocumentsComponent } from './sendout-documents.component';

describe('SendoutDocumentsComponent', () => {
  let component: SendoutDocumentsComponent;
  let fixture: ComponentFixture<SendoutDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendoutDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendoutDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
