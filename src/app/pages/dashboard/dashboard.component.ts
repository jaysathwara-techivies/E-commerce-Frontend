import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReviewModaComponent } from '../review-moda/review-moda.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';
import { HttpHeaders } from '@angular/common/http';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  products: any[] = [];
  addedToCart = new Set<number>();
  wishlist: Set<string> = new Set();
  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private cartService: CartService,
    private utilService:UtilService
  ) {

  }
  async ngOnInit() {
    await this.getProducts()
  }

  getProducts() {
    return new Promise((resolve,reject) => {

      let uri = 'http://localhost:5000/api/most-selling-product'
      this.authService.apiCall('GET', uri ).subscribe(
      async (response: any) =>{
        if (response) {
          this.products = response
        }
        resolve(response)
      },
      (
        (error:any) => {
          reject(error)
        })
      )
    }).catch(e => e);
  }

  addToCart(product: any, i:any): void {
    this.cartService.addToCart(product);
    this.addedToCart.add(product._id);
    
  }

  isButtonDisabled(productId: any): boolean {
    return this.addedToCart.has(productId);
  }

  addToWishlist(id:any){
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/wishlist`
      let token:any  = localStorage.getItem('credentials')
      const headers:any = new HttpHeaders({
        'Authorization': `Bearer ${JSON.parse(token).token}`,
        
      });
      let payload ={
        user: JSON.parse(localStorage.getItem('credentials') || '{}')._id,
        productId : id
      }
      this.authService.apiCall('POST', url, payload, headers).subscribe(
        async (response:any) =>{
          this.wishlist = new Set(response.products.map((product: any) => product._id));
          this.utilService.openSnackBar({
            text: 'Product Added to Wishlist',
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

  toggleWishlist(productId: string) {
    if (this.wishlist.has(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  removeFromWishlist(productId:any) {
    return new Promise((resolve,reject) =>{
      const user = JSON.parse(localStorage.getItem('credentials') || '{}')._id;
      if (!user) {
          reject('User ID not found in local storage');
          return;
      }
      const url = `http://localhost:5000/wishlist/${productId}?user=${user}`;    
        this.authService.apiCall('DELETE', url, null).subscribe(
        async (response:any) =>{
          this.wishlist.delete(productId);
          this.utilService.openSnackBar({
            text: 'Product Removed from Wishlist',
            panelClass: 'danger'
          })
          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e => e)
  }

  isProductInWishlist(productId: string): boolean {
    return this.wishlist.has(productId);
  }
  fetchWhishlist() {
    return new Promise((resolve,reject) =>{
      const user = JSON.parse(localStorage.getItem('credentials') || '{}')._id;
      if (!user) {
          reject('User ID not found in local storage');
          return;
      }

      const url = `http://localhost:5000/wishlist?user=${user}`;    
        this.authService.apiCall('GET', url, null).subscribe(
        async (response:any) =>{
          this.wishlist = new Set(response.products.map((product: any) => product._id));
          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e => e)
  }
  openReviewModal(product:any) {
    const modalRef = this.dialog.open(ReviewModaComponent,
      {
        panelClass: "review-modal",
        data: {
          productId: product._id
        }
      }
    )
  }

}
