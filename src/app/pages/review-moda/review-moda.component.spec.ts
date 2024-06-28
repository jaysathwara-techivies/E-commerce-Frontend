import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewModaComponent } from './review-moda.component';

describe('ReviewModaComponent', () => {
  let component: ReviewModaComponent;
  let fixture: ComponentFixture<ReviewModaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewModaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewModaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
