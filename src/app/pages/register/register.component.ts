import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  hidePassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  createForm(): void {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.register();
  }

  register(): void {
    this.errorMessage = '';
    this.isLoading = true;
    const url = 'http://localhost:3000/api/user/register';
    const payload = this.registerForm.value;

    this.authService
      .apiCall('POST', url, payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.snackBar.open('Account created! Please sign in.', 'Close', { duration: 3000 });
            this.router.navigate(['/login']);
          }
        },
        error: (err: any) => {
          const message =
            err?.error?.message || err?.error?.error || 'Registration failed. Please try again.';
          this.errorMessage = message;
          this.snackBar.open(message, 'Close', { duration: 4000 });
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
