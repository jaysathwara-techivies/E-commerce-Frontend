import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  // stripePromise = loadStripe('pk_test_51PTN7cRpwXDR9hXHTzJgSpNbywnFw74i7fHCjZPbVxBg9aYD20Kx0g0ZMafQaErSkOi3jR3R9Ouw8n7BAVIcU5gV00ujbuU73T');

  constructor(private router: Router, private authService: AuthenticationService){}

  isAuthRoute(): boolean {
    const route = this.router.url.split('?')[0];
    console.log(['/login', '/register', '/resetpassword', '/auth-otp', '/', '/**', ''].includes(route));
    
    return ['/login', '/register', '/resetpassword', '/auth-otp', '/', '/**', ''].includes(route);
  }

  showHeader(): boolean {
    console.log(this.authService.isLoggedIn());
    
    return this.authService.isLoggedIn()
  }
}
