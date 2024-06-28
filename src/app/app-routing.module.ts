import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TableComponent } from './pages/table/table.component';
import { AuthenticationService } from './services/authentication.service';
import { ProductsComponent } from './pages/products/products.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin.guard';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ChangeProfileComponent } from './pages/change-profile/change-profile.component';
import { ChangeAddressComponent } from './pages/change-address/change-address.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderPlacedComponent } from './pages/order-placed/order-placed.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { AddCouponComponent } from './pages/add-coupon/add-coupon.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'employees',
    component: TableComponent,
    canActivate: [AuthenticationService]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthenticationService]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'orderhistory',
    component: OrderHistoryComponent
  },
  {
    path:'wishlist',
    component: WishlistComponent
  },
  {
    path:'men',
    component: ProductCategoryComponent
  },
  {
    path:'women',
    component: ProductCategoryComponent
  },
  {
    path:'kids',
    component: ProductCategoryComponent
  },
  {
    path:'beauty',
    component: ProductCategoryComponent
  },
  {
    path: 'userprofile',
    component: UserProfileComponent
  },
  {
    path: 'profile',
    component: ChangeProfileComponent
  },
  {
    path: 'address',
    component: ChangeAddressComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'order-placed',
    component: OrderPlacedComponent
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AdminGuard]

  },
  {
    path: 'category',
    component: AddCategoryComponent
  },
  {
    path: 'coupon',
    component: AddCouponComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
