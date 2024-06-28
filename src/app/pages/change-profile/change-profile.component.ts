import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss']
})
export class ChangeProfileComponent implements OnInit{
  name = new FormControl(null)
  userId: any;
  constructor(
    private authService: AuthenticationService,
    private utilService: UtilService
  ) {
    
  }

  ngOnInit(): void {
    let profile:any = localStorage.getItem('credentials')
    this.userId = JSON.parse(profile)._id
    this.name.patchValue(JSON.parse(profile).name)
  }

  updateName() {
    console.log(this.name.value);
    return new Promise((resolve, reject)=>{
      let url =  `http://localhost:5000/profile/${this.userId}`
      let payload = {
        name: this.name.value
      }

      this.authService.apiCall('POST', url, payload).subscribe(
        async (response: any) =>{
          let profile:any = localStorage.getItem('credentials')
          if (profile) {
            profile = JSON.parse(profile)
            console.log('profile: ', profile);
            profile.name = response.name
            localStorage.setItem('credentials', JSON.stringify(profile));
          }
          this.utilService.openSnackBar({
            text: 'Profile Name Changed',
            panelClass: 'success'
          })
          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e=>e)
  }
}
