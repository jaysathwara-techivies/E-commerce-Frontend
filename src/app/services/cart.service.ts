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
    const items:any[]  = this.getCartItems();
    const existingItem = items.find((item:any) => {      
     return item._id === product._id})

     if (existingItem) {
      existingItem.totalQuantity += 1
     } else {
      items.push({
        ...product,
        totalQuantity: 1
      });
     }
    this.cartItems.next([...items]);
  }

  getCartItems() {
    
    return this.cartItems.value;
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
