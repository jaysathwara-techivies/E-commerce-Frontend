import { Component, OnChanges, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-canceled-orders',
  templateUrl: './canceled-orders.component.html',
  styleUrls: ['./canceled-orders.component.scss']
})
export class CanceledOrdersComponent implements OnChanges, OnInit {
  orders: any[] = [];
  constructor(
    public authService: AuthenticationService
  ) {

  }

  async ngOnInit() {
    
    await this.getOrders()
  }
  
  async ngOnChanges() {
  }

  getOrders() {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/api/order?status=canceled`
      this.authService.apiCall('GET', url, null).subscribe(
        async(response: any) =>{
          this.orders = response
          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e=>e)
  }
}
