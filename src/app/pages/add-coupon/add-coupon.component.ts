import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent {
  couponForm!:FormGroup
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilService:UtilService
  ) {
    this.createForm()
  }

  createForm() {
    this.couponForm = this.fb.group({
      code: [null, Validators.required],
      discount: [null, Validators.required],
      expiryDate: [null, Validators.required],
      usageLimit: [null, Validators.required]
    })
  }

  submiForm() {
    console.log(this.couponForm.value);
    console.log();
    return new Promise((resolve,reject)=>{
      let url = 'http://localhost:5000/coupons';
      let payload = {
        code: this.couponForm.value.code,
        discount: this.couponForm.value.discount,
        expiryDate: moment(this.couponForm.value.expiryDate).format('YYYY-MM-DDTHH:mm:ss'),
        usageLimit: this.couponForm.value.usageLimit,
      }
      this.authService.apiCall('POST',url,payload).subscribe(
        async (response:any) =>{
          this.couponForm.reset();
          this.utilService.openSnackBar({
            text: 'Coupon Has been Created'
          })
          resolve(response);
        }
      )
    }).catch(e=>e)
  }
}
