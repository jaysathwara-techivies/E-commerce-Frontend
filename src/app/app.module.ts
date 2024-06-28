import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TableComponent } from './pages/table/table.component';
import { HeaderComponent } from './pages/header/header.component';
import { ProductsComponent } from './pages/products/products.component';
import {MatIconModule} from '@angular/material/icon';
import { CartComponent } from './pages/cart/cart.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CartService } from './services/cart.service';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { EditproductComponent } from './pages/editproduct/editproduct.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ProductCategoryComponent } from './pages/product-category/product-category.component';
import { ReviewModaComponent } from './pages/review-moda/review-moda.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ChangeProfileComponent } from './pages/change-profile/change-profile.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ChangeAddressComponent } from './pages/change-address/change-address.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthOtpComponent } from './pages/auth-otp/auth-otp.component';
import { OrderPlacedComponent } from './pages/order-placed/order-placed.component';
import { NgxStripeModule } from 'ngx-stripe';
import { StripeCheckoutComponent } from './pages/stripe-checkout/stripe-checkout.component';
import { DialogpromptComponent } from './shared/dialogprompt/dialogprompt.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { PendingOrdersComponent } from './pages/pending-orders/pending-orders.component';
import { ShippedOrdersComponent } from './pages/shipped-orders/shipped-orders.component';
import { CanceledOrdersComponent } from './pages/canceled-orders/canceled-orders.component';
import { ViewOrderComponent } from './pages/view-order/view-order.component';
import { AddCategoryComponent } from './pages/add-category/add-category.component';
import { AddCouponComponent } from './pages/add-coupon/add-coupon.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    TableComponent,
    HeaderComponent,
    ProductsComponent,
    CartComponent,
    AdminDashboardComponent,
    EditproductComponent,
    OrderHistoryComponent,
    WishlistComponent,
    SidebarComponent,
    ProductCategoryComponent,
    ReviewModaComponent,
    UserProfileComponent,
    ChangeProfileComponent,
    ChangeAddressComponent,
    DashboardComponent,
    CheckoutComponent,
    AuthOtpComponent,
    OrderPlacedComponent,
    StripeCheckoutComponent,
    DialogpromptComponent,
    AdminPanelComponent,
    PendingOrdersComponent,
    ShippedOrdersComponent,
    CanceledOrdersComponent,
    ViewOrderComponent,
    AddCategoryComponent,
    AddCouponComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxStripeModule.forRoot('pk_test_51PTN7cRpwXDR9hXHTzJgSpNbywnFw74i7fHCjZPbVxBg9aYD20Kx0g0ZMafQaErSkOi3jR3R9Ouw8n7BAVIcU5gV00ujbuU73T'),
    MatNativeDateModule
  ],
  exports :[
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule
  ],
  providers: [CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
