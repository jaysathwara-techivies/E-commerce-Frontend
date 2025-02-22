import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';
import { DialogpromptComponent } from 'src/app/shared/dialogprompt/dialogprompt.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
orders: any[] = [];
currentPage = 1;
totalPages:any = [];
listLimit= [5,10,15,20];
limit = 5;
constructor(
  private authService: AuthenticationService,
  private dialog: MatDialog,
  private utilService: UtilService
) {

}

ngOnInit(): void {
  this.getOrderHistory()
}

getOrderHistory() {
  return new Promise((resolve, reject) =>{

    let url = `http://localhost:5000/api/orders/history?page=${this.currentPage}&limit=${this.limit}`
    let token:any  = localStorage.getItem('credentials')
    const headers:any = new HttpHeaders({
      'Authorization': `Bearer ${JSON.parse(token).token}`,
      
    });
    this.authService.apiCall('GET', url, null, headers).subscribe(
      async (response:any) =>{
        console.log(response);
        this.orders = response.orders
        this.currentPage = response.page;
        this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
        resolve(response)

      },
      (error)=>{
        reject(error)
      }
    )
  }).catch(e => e);
}

openDialog(order: any): void {
  if (order.status == 'shipped') {
    this.utilService.openSnackBar({
      text: 'The Order Has Been Shipped you can not Cancel this Order Now...'
    })
  } else {

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
          this.getOrderHistory()
          resolve(response)
        }

      },
      (error:any)=>{
        console.log('error: ', error);
        this.utilService.openSnackBar({
          text: 'Order cannot be canceled after 7 days'
        })
        reject(error)
      }
    )
  }).catch(e => e);
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.getOrderHistory();
}


onPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.getOrderHistory();
  }
}

onNextPage(): void {
  if (this.currentPage < this.totalPages.length) {
    this.currentPage++;
    this.getOrderHistory();
  }
}

onLimitChange() {
  this.currentPage = 1;
  this.getOrderHistory();
}

}
