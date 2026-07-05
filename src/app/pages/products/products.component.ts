import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EditproductComponent } from '../editproduct/editproduct.component';
import { ReviewModaComponent } from '../review-moda/review-moda.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  searchQuery = '';
  isLoading = true;

  constructor(
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  get filteredProducts(): any[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.products;
    }
    return this.products.filter((product) => {
      const name = (product.name || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const gender = (product.gender || '').toLowerCase();
      return name.includes(query) || category.includes(query) || gender.includes(query);
    });
  }

  getProducts(): void {
    this.isLoading = true;
    const uri = 'http://localhost:3000/api/products';
    this.authService.apiCall('GET', uri).subscribe({
      next: (response: any) => {
        this.products = response || [];
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
      }
    });
  }

  viewReviews(product: any): void {
    this.dialog.open(ReviewModaComponent, {
      panelClass: 'review-modal',
      data: {
        productId: product._id,
        productName: product.name,
        adminView: true
      }
    });
  }

  editProduct(product: any): void {
    const dialogRef = this.dialog.open(EditproductComponent, {
      panelClass: 'edit-modal',
      data: { product }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProducts();
      }
    });
  }

}
