import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  productForm!:FormGroup
  categories: any[] = [];

  constructor(
    private fb:FormBuilder,
    private authService: AuthenticationService
  ){
    this.createForm()
  }

  async ngOnInit() {
    await this.getCategories();
  }

  createForm() {
    this.productForm = this.fb.group({
      name: [null,Validators.required],
      price: [null,Validators.required],
      description: [null,Validators.required],
      category: [null, Validators.required],
      stock: [null, Validators.required],
      img: [null],
      gender: [null]
    })
  }

  submitProduct() {
    return new Promise((resolve, reject) =>{
      let url = 'http://localhost:5000/api/products'
      let payload ={
        ...this.productForm.value
      }
      let token:any  = localStorage.getItem('credentials')
      const headers:any = new HttpHeaders({
        'Authorization': `Bearer ${JSON.parse(token).token}`,
        
      });
      this.authService.apiCall('POST', url, payload, headers).subscribe(
        async (response:any) =>{
          alert('products saved')
          this.productForm.reset()
          resolve(response)
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }

  getCategories() {
    return new Promise((resolve, reject) =>{
      let url = 'http://localhost:5000/categories'
      this.authService.apiCall('GET', url, null).subscribe(
        async (response:any) =>{
          this.categories = response
          resolve(response)
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }
}
