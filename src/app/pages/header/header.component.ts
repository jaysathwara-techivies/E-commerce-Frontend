import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  userName:any;
  cartItemCount: number = 0;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private cartService: CartService,
    private dialog: MatDialog
  ) {
    this.cartService.cartItems$.subscribe((items: string | any[]) => {
      this.cartItemCount = items.length;
      });
      const data:any = localStorage.getItem('credentials')
      this.userName = JSON.parse(data).name
  }

  ngOnInit(): void {
  }
  logout() {
    this.authService.logOut()
    this.router.navigate(['/login'])
  }
  cart(){
    const dialogRef = this.dialog.open(CartComponent,{
      panelClass: "cart-modal",
    })
  }

  goToProfile() {
    this.router.navigate(['/userprofile'])
  }
}

