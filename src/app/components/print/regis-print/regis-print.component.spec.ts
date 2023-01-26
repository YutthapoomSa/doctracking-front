import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisPrintComponent } from './regis-print.component';

describe('RegisPrintComponent', () => {
  let component: RegisPrintComponent;
  let fixture: ComponentFixture<RegisPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
