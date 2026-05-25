import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductsComponent } from './products.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsComponent ],
      imports: [ FormsModule, MatIconModule, RouterTestingModule ],
      providers: [
        {
          provide: AuthenticationService,
          useValue: { apiCall: () => of([]) }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
