import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems:any = new BehaviorSubject([]);
  private checkOutproduct:any = new BehaviorSubject([]);
  cartItems$: any = this.cartItems.asObservable();
  checkOutproduct$: any = this.checkOutproduct.asObservable();
  constructor() { }

  addToCart(product: any): void {
    const currentItems = this.cartItems.value;
    this.cartItems.next([...currentItems, product]);
    console.log(this.cartItems.value);
  }

  getCartItems() {
    
    return this.cartItems$;
  }

  clearCart() {
    this.cartItems.next([]);
  }
  updateCartItems(items: any[]): void {
    this.cartItems.next(items);
  }

  isEmpty(): boolean {
    return this.cartItems.value.length === 0;
  }

  addToCheckout(product:any) {
    console.log('product: ', product);
    this.checkOutproduct.next([product])
  }

  getCheckOutProduct() {
    
    return this.checkOutproduct$;
  }
}
