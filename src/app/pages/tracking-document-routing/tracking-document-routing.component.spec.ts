import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingDocumentRoutingComponent } from './tracking-document-routing.component';

describe('TrackingDocumentRoutingComponent', () => {
  let component: TrackingDocumentRoutingComponent;
  let fixture: ComponentFixture<TrackingDocumentRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingDocumentRoutingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingDocumentRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
