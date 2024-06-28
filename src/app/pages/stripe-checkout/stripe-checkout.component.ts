import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
@Component({
  selector: 'app-stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.scss']
})
export class StripeCheckoutComponent {
  constructor(private http: HttpClient, private stripeService: StripeService) {}


  checkout() {
    this.http.post('/create-checkout-session', {})
      .pipe(
        switchMap((session:any) => {
          return this.stripeService.redirectToCheckout({ sessionId: session.id });
        })
      )
      .subscribe(result => {
        if (result.error) {
          alert(result.error.message);
        }
      });
  }
}
