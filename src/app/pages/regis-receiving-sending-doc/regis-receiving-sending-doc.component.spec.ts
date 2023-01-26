import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisReceivingSendingDocComponent } from './regis-receiving-sending-doc.component';

describe('RegisReceivingSendingDocComponent', () => {
  let component: RegisReceivingSendingDocComponent;
  let fixture: ComponentFixture<RegisReceivingSendingDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisReceivingSendingDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisReceivingSendingDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
