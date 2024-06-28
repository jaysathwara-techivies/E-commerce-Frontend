import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  constructor(
    private authService: AuthenticationService,
    private wishlistService: WishlistService
  ) { 

  }

 async ngOnInit() {
    await this.fetchWhishlist()
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
          this.wishlist = response.products;
          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e => e)
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
          // this.wishlist.delete(productId);
          this.fetchWhishlist()
          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e => e)
  }
}
