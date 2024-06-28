import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeService,  } from 'ngx-stripe';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('cardComponent') cardComponent: any
  checkOutItems: any[] = [];
  discount: any;
  code = new FormControl();
  defaultAddress = new FormControl()
  subtotal: any = '';
  discountedAmount: any;
  user: any;
  address: any;
paymentForm!: FormGroup;

elementsOptions: StripeElementsOptions = {
  locale: 'en'
};

cardOptions: StripeCardElementOptions = {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 'bold',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '18px',
      '::placeholder': {
        color: '#CFD7E0'
      }
    }
  }
};
  constructor(
    private cartService: CartService,
    private authService: AuthenticationService,
    private utilService: UtilService,
    private router: Router,
    private stripeService: StripeService
  ) {
    this.cartService.getCheckOutProduct().subscribe((cartItems: any[]) => {
      console.log('cartItems: ', cartItems);
      if (!cartItems.length) {
        this.router.navigate(['/dashboard'])
      }
      this.checkOutItems = cartItems
    });
    this.checkOutItems.forEach((item)=>{
      this.subtotal = item.total
    })
    this.user = this.authService.currentUserValue;

    }

    async ngOnInit()  {
      // let profileData:any = localStorage.getItem('credentials')
      // await this.getAddress(JSON.parse(profileData)._id)
    }


    applyCode() {
      return new Promise((resolve,reject) =>{
  
        let url = 'http://localhost:5000/apply-coupon'
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

    calculateTotal(): number {
      console.log('this.discount: ', this.discount);
      if (this.discount) {
        this.discountedAmount = (this.subtotal * this.discount / 100)
        return this.subtotal - (this.subtotal * this.discount / 100);
      }
      return this.subtotal;
    }


      submit() {
    return new Promise((resolve,reject) => {
      let url = 'http://localhost:5000/api/order';
      const total = this.calculateTotal();

      let payload = {
        user: this.user,
        items: this.checkOutItems.flatMap(item => 
          item.items.map((product: any) => {
            const { _id, quantity, price } = product;
            return { _id, quantity, price };
          })
        ),
        total: total,
        shippingAddress: this.address,
        createdAt: new Date()
        
      }
      console.log('payload: ', payload);
      
      this.authService.apiCall('POST', url, payload).subscribe(
        async (response: any) => {
          if (response) {
            this.utilService.openSnackBar({
              text: 'Your Order Is Placed.:)'
            })
            this.cartService.clearCart()
            this.router.navigate(['/order-placed'])
          }
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      )
      
    }).catch(e => e);
  }

  getAddress(userId:any) {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/address/${userId}`
      this.authService.apiCall('GET', url, null).subscribe(
        async (response:any) =>{
          console.log(response);
          response.forEach((e:any) => {
            this.address = e.address
          });
          resolve(response)
  
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }

  async onChecck(event:any) {
    console.log('event: ', event);
    if (event.checked) {
      let profileData:any = localStorage.getItem('credentials')
      await this.getAddress(JSON.parse(profileData)._id)
      this.defaultAddress.patchValue(this.address)
      console.log('this.address: ', this.address);
    } else{
      this.address = ''
      this.defaultAddress.patchValue(this.address)
    }
  }
  handlePayment() {
  this.stripeService.createToken(this.cardComponent.element, {})
      .subscribe((result) => {
        console.log('result: ', result);
        if (result.token) {
          const token = result.token.id;
          const amount = this.calculateTotal();
          
          const paymentPayload = {
            token: token,
            amount: amount,
            user: this.user
          };
          this.authService.apiCall('POST', 'http://localhost:5000/api/payment', paymentPayload).subscribe(
            (response: any) => {
              console.log('Payment successful', response);
              this.submit();
            },
            (error: any) => {
              console.log('Payment error', error);
            }
          );
        } else if (result.error) {
          console.log(result.error.message);
        }
      });
}
}