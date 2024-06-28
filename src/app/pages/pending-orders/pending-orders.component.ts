import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ViewOrderComponent } from '../view-order/view-order.component';
import { DialogpromptComponent } from 'src/app/shared/dialogprompt/dialogprompt.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.scss']
})
export class PendingOrdersComponent implements OnInit {
  orders: any[] = [];
  constructor(
    public authService: AuthenticationService,
    public dialog: MatDialog,
    private utilService: UtilService
  ) {

  }

  async ngOnInit() {
    await this.getOrders()
  }

  getOrders() {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/api/order?status=pending`
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

  onClickViewOrder(order:any) {
    this.dialog.open(ViewOrderComponent,{
      panelClass: 'order-modal',
      data: {
        order: order.productDetails
      }
      
    })
  }


  openDialog(order: any): void {
    const dialogRef = this.dialog.open(DialogpromptComponent, {
      width: '500px',
      data: {
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this order?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cancelOrder(order);
      }
    });
  }
  
  
  
  cancelOrder(order: any) {
    console.log(order._id);
    return new Promise((resolve, reject) =>{
  
      let url = `http://localhost:5000/api/order/${order._id}/cancel`
  
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

  shipOrder(order: any) {
    console.log(order._id);
    return new Promise((resolve, reject) =>{
  
      let url = `http://localhost:5000/api/order/${order._id}/ship`
  
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
