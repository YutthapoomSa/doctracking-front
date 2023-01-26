import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRoutingListComponent } from './document-routing-list.component';

describe('DocumentRoutingListComponent', () => {
  let component: DocumentRoutingListComponent;
  let fixture: ComponentFixture<DocumentRoutingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentRoutingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRoutingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
