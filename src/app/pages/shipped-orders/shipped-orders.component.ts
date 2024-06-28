import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-shipped-orders',
  templateUrl: './shipped-orders.component.html',
  styleUrls: ['./shipped-orders.component.scss']
})
export class ShippedOrdersComponent implements OnInit, OnChanges {
  orders: any [] = [];
constructor(
  private authService: AuthenticationService,
  private utilService: UtilService
) {
  
}

  async ngOnInit() {
    await this.getOrders()
  }

async ngOnChanges(changes: SimpleChanges){
  console.log('changes: ', changes);
  console.log('dfdfdf');
  
}
  
  getOrders() {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/api/order?status=shipped`
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

  onClickDeliver(order:any) {
    return new Promise((resolve, reject) =>{
  
      let url = `http://localhost:5000/api/order/${order._id}/deliver`
  
      this.authService.apiCall('POST', url, null,).subscribe(
        async (response:any) =>{
          if (response) {
            this.utilService.openSnackBar({
              text: response.message
            })
            console.log(response);
            await this.getOrders()
            resolve(response)
          }
  
        },
        (error:any)=>{
          console.log('error: ', error);
          this.utilService.openSnackBar({
            text: error?.error?.error
          })
          reject(error)
        }
      )
    }).catch(e => e);
  }

}
