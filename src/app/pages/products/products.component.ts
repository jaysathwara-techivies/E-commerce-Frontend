import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { EditproductComponent } from '../editproduct/editproduct.component';
import { HttpHeaders } from '@angular/common/http';
import { WishlistService } from '../wishlist.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  addedToCart = new Set<number>();
  isAdmin: any;
  wishlist: Set<string> = new Set();
  constructor(
    private authService:AuthenticationService,
    public cartService: CartService,
    private dialog: MatDialog,
    private utilService: UtilService
  ) {
    this.cartService.getCartItems().subscribe((cartItems: any[]) => {
      console.log('cartItems: ', cartItems);
      // this.updateButtonState(cartItems);
      if (!cartItems.length) {
        this.addedToCart.clear()
      }
    });
  }

  async ngOnInit() {
    this.getProducts()
    let profileData:any = localStorage.getItem('credentials')
    this.isAdmin = JSON.parse(profileData).role 
    await this.fetchWhishlist()
  }

  getProducts() {
    return new Promise((resolve,reject) => {

      let uri = 'http://localhost:5000/api/products'
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

  // updateButtonState(cartItems: any[]): void {
  //   cartItems.forEach(item => this.addedToCart.add(item._id));
  // }

  isButtonDisabled(productId: any): boolean {
    return this.addedToCart.has(productId);
  }
  editProduct(product:any) {
    console.log('product: ', product);
    console.log(true);
    const dialogRef = this.dialog.open(EditproductComponent,{
      panelClass: "edit-modal",
      data:{
        product: product
      }
    })
    dialogRef.afterClosed().subscribe(async result =>{
      if (result) {
        console.log(result);
        this.getProducts()
      }
    }

    )
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

  isProductInWishlist(productId: string): boolean {
    return this.wishlist.has(productId);
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


}
