import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  resetForm!:FormGroup;
  resetPassword !: FormGroup
  isResetPassword: any = false;
  private subscriptions: Subscription[] = [];
  token: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ){
    this.createForm()
  }

  ngOnInit(): void {
    this.token =   this.route.snapshot.queryParams['token']
    if (this.token) {
      this.isResetPassword = true
    } else{
      this.isResetPassword = false
    }
  }


  createForm() {
    this.resetForm = this.formBuilder.group({
      email: [null, Validators.required]
    })

    this.resetPassword = this.formBuilder.group({
      password: [null, Validators.required]
    })
  }

  sendMail() {
    return new Promise((resolve, reject) => {
      let url = 'http://localhost:3000/change-password'
      let payload = { 
        email: this.resetForm.value.email
      }
      this.authService.apiCall("POST", url, payload).subscribe(
        async (response: any) => {
          if (response) {
            console.log('response: ', response);
            this.isResetPassword = response.data.acknowledged
          }
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      )
      
    })
  }

  changePassword() {
    console.log('pw: ', this.resetPassword.value);
    return new Promise((resolve, reject) => {
      let url = `http://localhost:3000/reset-password?token=${this.token}`;
      let payload = {
        password: this.resetPassword.value.password
      }

      this.authService.apiCall("POST", url, payload).subscribe(
        async (response) => {
          if (response) {
            console.log('response: ', response);
            
          }
        },(error) =>{
          reject(error)
        }
      )
    })
  }
}
