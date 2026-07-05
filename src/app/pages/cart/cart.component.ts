import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  cartItems: any[] = [];
  user: any;
  address: any;
  code = new FormControl()
  discount: any;
  discountedAmount: any;
  total: any;
  constructor(
    public dialogRef: MatDialogRef<CartComponent>,
    private cartService: CartService,
    private authService: AuthenticationService,
    private router: Router,
    private utilService: UtilService
  ) { 
    this.cartService.cartItems$.subscribe((items: any[]) => {
      this.cartItems = items.map(item => ({ ...item}));
    });
    console.log(this.cartItems);
    
    this.cartItems.forEach((item:any) =>{
      console.log(item);
      
      return item?.productDetails
      ? (item.productDetails.total =
          item.totalQuantity * (item.productDetails.price ?? item.price))
      : (item.total = item.totalQuantity * item.price);    
    })
    this.user = this.authService.currentUserValue;
  }
  async ngOnInit() {
    let profileData:any = localStorage.getItem('credentials')
    await this.getAddress(JSON.parse(profileData)._id)

    this.code.valueChanges.subscribe((value)=>{
      console.log(value);
      if (!value) {
        this.discount = 0
        this.calculateTotal()
        console.log(false);
        
      }
    })
  }

  closeModal(): void {
    this.dialogRef.close()
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  }

  trackByItemId(_index: number, item: any): string {
    return item._id;
  }

  getUnitPrice(item: any): number {
    return item?.productDetails ? item.productDetails?.price ?? 0 : item?.price ?? 0;
  }

  getLineTotal(item: any): number {
    return item.totalQuantity * this.getUnitPrice(item);
  }

  getMaxStock(item: any): number {
    return item.stock ?? item.productDetails?.stock ?? 99;
  }

  decrementQuantity(item: any): void {
    if (item.totalQuantity > 1) {
      item.totalQuantity--;
      this.persistCart();
    }
  }

  incrementQuantity(item: any): void {
    if (item.totalQuantity < this.getMaxStock(item)) {
      item.totalQuantity++;
      this.persistCart();
    }
  }

  private persistCart(): void {
    this.cartService.updateCartItems([...this.cartItems]);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + this.getLineTotal(item), 0);
  }

  // submit() {
  //   console.log(this.cartItems);
  //   return new Promise((resolve,reject) => {
  //     let url = 'http://localhost:3000/api/order';
  //     const total = this.calculateTotal();

  //     let payload = {
  //       user: this.user,
  //       items: this.cartItems.map(item => {
  //         const { _id, quantity, price } = item;
  //         return { _id, quantity, price };
  //       }),
  //       total: total,
  //       shippingAddress: this.address,
  //       createdAt: new Date()

  //     }
      
  //     this.authService.apiCall('POST', url, payload).subscribe(
  //       async (response: any) => {
  //         if (response) {
  //           this.closeModal()
  //           this.utilService.openSnackBar({
  //             text: 'Your Order Is Placed.:)'
  //           })
  //           this.cartService.clearCart()
  //         }
  //         resolve(response);
  //       },
  //       (error: any) => {
  //         reject(error);
  //       }
  //     )
      
  //   }).catch(e => e);
  // }
  submit() {
    const total = this.calculateTotal();

    let payload = {
      user: this.user,
      items: this.cartItems.map(item => ({
        _id: item._id,
        quantity: item.totalQuantity,
        price: this.getUnitPrice(item),
        img: item.img ? item.img : item.productDetails?.img,
        name: item.name ? item.name : item.productDetails?.name,
        category: item.category ? item.category : item.productDetails?.category
      })),
      total: total,
      shippingAddress: this.address,
      createdAt: new Date()
    }
    this.cartService.addToCheckout(payload)
    this.closeModal()
    this.router.navigate(['/checkout'])
  }

  deleteItem(item:any){
    this.cartItems = this.cartItems.filter(cartItem => cartItem._id !== item._id);
    this.cartService.updateCartItems(this.cartItems);
  }

  getAddress(userId:any) {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:3000/address/${userId}`
      this.authService.apiCall('GET', url, null).subscribe(
        async (response:any) =>{
          console.log(response);
          response.forEach((e:any) => {
            // this.address = e.address
            resolve(e.address)
          });
  
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }

  async onChecck(event:any) {
    if (event.srcElement.checked) {
      console.log(this.address);
      let profileData:any = localStorage.getItem('credentials')
      this.address =   await this.getAddress(JSON.parse(profileData)._id)
    } else{
      this.address = ''
    }
  }

  applyCode() {
    return new Promise((resolve,reject) =>{

      let url = 'http://localhost:3000/apply-coupon'
      let payload = {
        code : this.code.value
      }
      this.authService.apiCall('POST',url, payload).subscribe(
        async(response:any) =>{
          console.log('response: ', response);
          if (response) {
            this.discount = response.discount
          }
          resolve(response)
        },
        (error) =>{
          reject(
            error
          )
          this.utilService.openSnackBar({
            text: 'Invalid Coupon Code!'
          })
        }
      )
    }).catch(e=>e)
  }
    
  }
