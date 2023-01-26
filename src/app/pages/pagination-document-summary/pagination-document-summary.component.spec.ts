import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationDocumentSummaryComponent } from './pagination-document-summary.component';

describe('PaginationDocumentSummaryComponent', () => {
  let component: PaginationDocumentSummaryComponent;
  let fixture: ComponentFixture<PaginationDocumentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationDocumentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationDocumentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
