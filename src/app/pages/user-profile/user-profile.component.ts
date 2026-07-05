import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  isAdmin: any;
  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    let profile:any = localStorage.getItem('credentials')
    this.isAdmin = JSON.parse(profile).role

  }

  goToPage(route:any) {
    this.router.navigate([`/${route}`])
  }

}
