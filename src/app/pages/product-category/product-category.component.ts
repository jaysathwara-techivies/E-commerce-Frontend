import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { ReviewModaComponent } from '../review-moda/review-moda.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  products: any[] = [];
  addedToCart = new Set<number>();
  wishlist: Set<string> = new Set();
  categories:any[] = []; 
  searchQuery = '';
  selectedCategory = '';
  sortOption = 'name';
  itemsPerPage = 5; // Number of items per page
  currentPage = 1;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public cartService: CartService,
    private dialog: MatDialog,
    private utilService: UtilService
  ) {

  }

  async ngOnInit() {
    let gender = this.route.snapshot.routeConfig?.path;
    if (gender) {
      gender = gender.charAt(0).toUpperCase() + gender.slice(1);
  }
    this.getProducts(gender)
    await this.fetchWhishlist()
    await this.getCategories()
  }

  getProducts(gender:any) {
    return new Promise((resolve,reject) => {

      let uri = `http://localhost:5000/api/getproducts?gender=${gender}`
      this.authService.apiCall('GET', uri ).subscribe(
      async (response: any) =>{
        if (response) {
          console.log('response: ', response);
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

  addToCart(product: any): void {
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

  filteredProducts() {
    let filtered = this.products;

    if (this.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    console.log('this.selectedCategory: ', this.selectedCategory);
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    
    filtered = filtered.sort((a, b) => {
      if (this.sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (this.sortOption === 'price') {
        return a.price - b.price;
      }
    });

    return filtered;
  }


  paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts().slice(startIndex, endIndex);
  }

  totalPages() {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  getCategories() {
    return new Promise((resolve, reject) =>{
      let url = 'http://localhost:5000/categories'
      this.authService.apiCall('GET', url, null).subscribe(
        async (response:any) =>{
          this.categories = response
          resolve(response)
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }

}
