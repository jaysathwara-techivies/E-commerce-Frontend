import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {
      this.createForm()
    }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  login() {
    return new Promise((resolve,reject) => {
      let url = 'http://localhost:3000/login'
      let payload = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.authService.apiCall('POST', url, payload).subscribe(
        async (response: any) => {
          if (response) {
            const { token } = response;
            localStorage.setItem('token', token);
          }
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      )
      
    }).catch(e => e);
  }

  openNewPage() {
    this.router.navigate(['/resetpassword'])
  }
}
