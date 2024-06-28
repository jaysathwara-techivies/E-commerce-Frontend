import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss']
})
export class EditproductComponent implements OnInit {
  productForm!:FormGroup
  constructor(
    public dialogRef: MatDialogRef<EditproductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ){
    this.createForm()
  }

  ngOnInit(): void {
    console.log(this.data);
    this.productForm.patchValue(this.data.product)
  }

  
  createForm() {
    this.productForm = this.fb.group({
      name: [null,Validators.required],
      price: [null,Validators.required],
      description: [null,Validators.required],
      category: [null, Validators.required],
      stock: [null, Validators.required],
      img: [null]
    })
  }

  submitProduct() {
    return new Promise((resolve, reject) =>{
      let id = this.data.product._id
      let url = `http://localhost:5000/api/products/${id}`
      let payload ={
        ...this.productForm.value
      }
      let token:any  = localStorage.getItem('credentials')
      const headers:any = new HttpHeaders({
        'Authorization': `Bearer ${JSON.parse(token).token}`,
        
      });
      this.authService.apiCall('PUT', url, payload, headers).subscribe(
        async (response:any) =>{
          alert('products saved')
          this.dialogRef.close({response: response})
          resolve(response)
        },
        (error)=>{
          reject(error)
        }
      )
    }).catch(e => e);
  }
  }


