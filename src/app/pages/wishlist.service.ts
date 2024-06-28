import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<string[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();
  constructor() { }

  addToWishlist(productId: string) {
    const currentValue = this.wishlistSubject.value;
    const updatedValue = [...currentValue, productId];
    this.wishlistSubject.next(updatedValue);
    console.log(this.wishlist$);
    
  }

  removeFromWishlist(productId: string) {
    const currentValue = this.wishlistSubject.value;
    const updatedValue = currentValue.filter(id => id !== productId);
    this.wishlistSubject.next(updatedValue);
  }
}
