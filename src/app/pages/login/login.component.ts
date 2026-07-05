import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

const REMEMBER_EMAIL_KEY = 'login_email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
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
    // localStorage.removeItem('credentials')
  }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.login();
  }

  login(): void {
    this.errorMessage = '';
    this.isLoading = true;

    const { email, password, rememberMe } = this.loginForm.value;
    const url = 'http://localhost:3000/api/user/login';
    const payload = { email, password };

    if (rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    this.authService
      .apiCall('POST', url, payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          if (!response) {
            return;
          }
          localStorage.setItem('credentials', JSON.stringify(response));
          const role = response.role;
          console.log(response);
          this.snackBar.open('Welcome back!', 'Close', { duration: 2500 });
          this.router.navigate(String(role) === 'admin' ? ['/admin-dashboard'] : ['/dashboard']);
        },
        error: (err: any) => {
          const message =
            err?.error?.message ||
            err?.error?.error ||
            'Invalid email or password. Please try again.';
          this.errorMessage = message;
          this.snackBar.open(message, 'Close', { duration: 4000 });
        },
      });
  }

  openNewPage(): void {
    this.router.navigate(['/resetpassword']);
  }

  signup(): void {
    this.router.navigate(['/register']);
  }
}
