import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveDocumentsComponent } from './receive-documents.component';

describe('ReceiveDocumentsComponent', () => {
  let component: ReceiveDocumentsComponent;
  let fixture: ComponentFixture<ReceiveDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
