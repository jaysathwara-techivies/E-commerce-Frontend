import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

export interface GenderOption {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  categories: any[] = [];
  imagePreview: string | null = null;
  isSubmitting = false;
  private imgSub?: Subscription;

  genderOptions: GenderOption[] = [
    { value: 'Men', label: 'Men', icon: 'man' },
    { value: 'Women', label: 'Women', icon: 'woman' },
    { value: 'Kids', label: 'Kids', icon: 'child_care' },
    { value: 'Beauty', label: 'Beauty', icon: 'spa' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  async ngOnInit(): Promise<void> {
    await this.getCategories();
    this.imgSub = this.productForm.get('img')?.valueChanges.subscribe((url) => {
      this.imagePreview = url?.trim() ? url.trim() : null;
    });
  }

  ngOnDestroy(): void {
    this.imgSub?.unsubscribe();
  }

  createForm(): void {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: [null, Validators.required],
      category: [null, Validators.required],
      stock: [null, [Validators.required, Validators.min(0)]],
      img: [null],
      gender: [null, Validators.required]
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onImageError(): void {
    this.imagePreview = null;
  }

  submitProduct(): void {
    if (this.productForm.invalid || this.isSubmitting) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const url = 'http://localhost:3000/api/products';
    const payload = { ...this.productForm.value };

    this.authService.apiCall('POST', url, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Product published successfully', 'View products', { duration: 4000 })
          .onAction()
          .subscribe(() => this.router.navigate(['/products']));
        this.productForm.reset();
        this.imagePreview = null;
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open('Failed to save product. Please try again.', 'Close', { duration: 4000 });
      }
    });
  }

  getCategories(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const url = 'http://localhost:3000/get-categories';
      
      this.authService.apiCall('GET', url, null).subscribe({
        next: (response: any) => {
          this.categories = response;
          resolve(response);
        },
        error: (error) => reject(error)
      });
    }).catch((e) => e);
  }
}
