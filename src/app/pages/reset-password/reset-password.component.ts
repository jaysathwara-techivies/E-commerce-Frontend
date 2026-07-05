import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  resetPassword!: FormGroup;
  isResetPassword = false;
  token: string | null = null;
  hidePassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || null;
    this.isResetPassword = !!this.token;
  }

  createForm(): void {
    this.resetForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
    this.resetPassword = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  sendMail(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    const url = 'http://localhost:3000/change-password';
    const payload = { email: this.resetForm.value.email };

    this.authService
      .apiCall('POST', url, payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          if (response?.data?.acknowledged) {
            this.isResetPassword = true;
          }
          this.successMessage = 'Check your email for reset instructions.';
          this.snackBar.open(this.successMessage, 'Close', { duration: 4000 });
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.message || 'Could not send reset email. Try again.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 4000 });
        },
      });
  }

  changePassword(): void {
    if (this.resetPassword.invalid) {
      this.resetPassword.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    const url = `http://localhost:3000/reset-password?token=${this.token}`;
    const payload = { password: this.resetPassword.value.password };

    this.authService
      .apiCall('POST', url, payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Password updated successfully.';
          this.snackBar.open('Password updated! You can sign in now.', 'Close', { duration: 3000 });
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.message || 'Could not reset password. Try again.';
          this.snackBar.open(this.errorMessage, 'Close', { duration: 4000 });
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
