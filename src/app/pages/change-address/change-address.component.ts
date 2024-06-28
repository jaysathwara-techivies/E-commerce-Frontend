import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-change-address',
  templateUrl: './change-address.component.html',
  styleUrls: ['./change-address.component.scss']
})
export class ChangeAddressComponent implements OnInit{
  address = new FormControl(null,Validators.required)
  userId: any;
  id: any;
  isAddress: any[] = [];
  constructor(
    private authService: AuthenticationService,
    private utilService: UtilService
  ) {

  }
  async ngOnInit() {
    let profileData:any = localStorage.getItem('credentials')
    this.userId = JSON.parse(profileData)._id
    await this.getAddress(JSON.parse(profileData)._id)
  }

  updateName() {

  }

  getAddress(userId:any) {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/address/${userId}`
      this.authService.apiCall('GET', url, null).subscribe(
        async (response:any) =>{
          console.log(response);
          this.isAddress = response
          response.forEach((e:any) => {
            this.id = e._id

            this.address.patchValue(e.address)
          });
          resolve(response)
  
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }

  updateAddress() {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/address/${this.id}`
      let payload = {
        address: this.address.value
      }
      this.authService.apiCall('PUT', url, payload).subscribe(
        async (response:any) =>{

            this.address.patchValue(response.address)
            this.utilService.openSnackBar({
              text: 'Address Changed Successfully.',
              panelClass: 'success'
            })
          resolve(response)
  
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }

  addAddress() {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/address`
      let payload = {
        user: this.userId,
        address: this.address.value
      }
      this.authService.apiCall('POST', url, payload).subscribe(
        async (response:any) =>{

            this.address.patchValue(response.address)
            this.utilService.openSnackBar({
              text: 'Address Added Successfully.',
              panelClass: 'success'
            })
          resolve(response)
  
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }
}
