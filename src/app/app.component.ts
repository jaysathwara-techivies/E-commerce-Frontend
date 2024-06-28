import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  // stripePromise = loadStripe('pk_test_51PTN7cRpwXDR9hXHTzJgSpNbywnFw74i7fHCjZPbVxBg9aYD20Kx0g0ZMafQaErSkOi3jR3R9Ouw8n7BAVIcU5gV00ujbuU73T');

  constructor(private router: Router){}

  showHeader(): boolean {
    const currentRoute = this.router.url;

    return !(currentRoute === '/login' || currentRoute === '/register' || currentRoute === '/');
  }
}
