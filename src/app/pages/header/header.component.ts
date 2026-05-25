import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // userName:any;
  // cartItemCount: number = 0;
  @Input() userName: string = 'Jay Sathwara';
  @Input() cartItemCount: number = 0;
  @Input() pendingOrdersCount: number = 12;
  @Input() pendingReturnsCount: number = 3;
  @Input() pageTitle: string = 'Dashboard';
 
  isCollapsed: boolean = false;
  mobileOpen: boolean = false;
  productsMenuOpen = false;
  isProductsSectionActive = false;
  categoriesMenuOpen = false;
  isCategoriesSectionActive = false;
  isAdmin = false;
  userRole = 'Customer';
  brandName = 'Shop';

  private routerSub?: Subscription;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private cartService: CartService,
    private dialog: MatDialog
  ) {
    this.cartService.cartItems$.subscribe((items: string | any[]) => {
      this.cartItemCount = items.length;
    });
    this.loadUserFromSession();
  }

  private loadUserFromSession(): void {
    const data = sessionStorage.getItem('credentials');
    if (!data) {
      return;
    }
    try {
      const credentials = JSON.parse(data);
      this.userName = credentials.name || 'User';
      this.isAdmin = credentials.role === 'admin';
      this.userRole = this.isAdmin ? 'Administrator' : 'Customer';
      this.brandName = this.isAdmin ? 'ShopAdmin' : 'Shop';
    } catch {
      this.isAdmin = false;
    }
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      this.isCollapsed = saved === 'true';
    }
    // Apply on load
    setTimeout(() => {
      const content = document.querySelector('.page-content') as HTMLElement;
      if (content) {
        content.style.marginLeft = this.isCollapsed ? '64px' : '220px';
      }
    }, 0);

    this.updateSidebarMenuState();
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateSidebarMenuState());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleProductsMenu(): void {
    this.expandSidebarIfCollapsed();
    this.productsMenuOpen = !this.productsMenuOpen;
  }

  toggleCategoriesMenu(): void {
    this.expandSidebarIfCollapsed();
    this.categoriesMenuOpen = !this.categoriesMenuOpen;
  }

  private expandSidebarIfCollapsed(): void {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      localStorage.setItem('sidebarCollapsed', 'false');
      this.applySidebarLayout();
    }
  }

  private updateSidebarMenuState(): void {
    const url = this.router.url.split('?')[0];
    this.isProductsSectionActive =
      url === '/products' || url.startsWith('/products/') || url === '/add-product';
    if (this.isProductsSectionActive) {
      this.productsMenuOpen = true;
    }

    this.isCategoriesSectionActive =
      url === '/category' || url.startsWith('/category/') || url === '/add-category';
    if (this.isCategoriesSectionActive) {
      this.categoriesMenuOpen = true;
    }
  }

  private applySidebarLayout(): void {
    const content = document.querySelector('.page-content') as HTMLElement;
    if (content) {
      content.style.marginLeft = this.isCollapsed ? '64px' : '220px';
    }
  }
  // logout() {
  //   this.authService.logOut()
  //   this.router.navigate(['/login'])
  // }
  cart(){
    const dialogRef = this.dialog.open(CartComponent,{
      panelClass: "cart-modal",
    })
  }

  // goToProfile() {
  //   this.router.navigate(['/userprofile'])
  // }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.isCollapsed));
    this.applySidebarLayout();
  }
 
  toggleMobileSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
    // Add/remove class on sidebar-wrapper for mobile
    const sidebar = document.querySelector('.sidebar-wrapper');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open', this.mobileOpen);
    }
  }
 
  logout(): void {
    this.authService.logOut();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate([this.isAdmin ? '/profile' : '/userprofile']);
  }
 
  // cart(): void {
  //   this.router.navigate(['/cart']);
  // }
}

