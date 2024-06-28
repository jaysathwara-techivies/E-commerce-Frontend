import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogpromptComponent } from './dialogprompt.component';

describe('DialogpromptComponent', () => {
  let component: DialogpromptComponent;
  let fixture: ComponentFixture<DialogpromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogpromptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogpromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
