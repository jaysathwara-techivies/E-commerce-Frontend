import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
     private router: Router
    ){
      this.createForm()
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      
    })
  }


  register() {
    return new Promise((resolve, reject) => {
      let url = "http://localhost:5000/api/user/register";
      let payload = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      }

      this.authService.apiCall("POST", url, payload).subscribe(
        async (response: any) => {
          if (response) {
            this.router.navigate(['/login'])
          }
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      )
    }).catch(e => e)
  }
  goToLogin() {
    this.router.navigate(['/login'])
  }
}
