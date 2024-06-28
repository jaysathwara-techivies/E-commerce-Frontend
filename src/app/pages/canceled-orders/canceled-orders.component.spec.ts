import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanceledOrdersComponent } from './canceled-orders.component';

describe('CanceledOrdersComponent', () => {
  let component: CanceledOrdersComponent;
  let fixture: ComponentFixture<CanceledOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanceledOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanceledOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
