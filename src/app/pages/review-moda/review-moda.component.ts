import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-review-moda',
  templateUrl: './review-moda.component.html',
  styleUrls: ['./review-moda.component.scss']
})
export class ReviewModaComponent implements OnInit {
ratingOptions: any;
  reviews: any;
  reviewForm!:FormGroup
  userId: any;
  reviewFormMode: any = 'add';
  reviewFormData: any = {};
  constructor(
    public dialogRef: MatDialogRef<ReviewModaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthenticationService,
    private fb:FormBuilder

  ) {
    this.createForm()
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('credentials')
    this.userId = JSON.parse(this.userId)._id
    console.log('this.userId: ', this.userId);
    console.log(this.data);
    this.getReview(this.data.productId)
  }

  createForm() {
    this.reviewForm = this.fb.group({
      reviewText: [null, Validators.required],
      rating: [null]
    })
  }

  getReview(productId:any) {
    return new Promise((resolve,reject) => {

      let uri = `http://localhost:5000/review?productId=${productId}`
      this.authService.apiCall('GET', uri ).subscribe(
      async (response: any) =>{
        if (response) {
          this.reviews = response
        }
        resolve(response)
      },
      (
        (error:any) => {
          reject(error)
        })
      )
    }).catch(e => e);
  }

  submit() {
    console.log(this.reviewFormMode);
    
    return new Promise((resolve, reject) => {
      let user: any = localStorage.getItem('credentials');
      let url = '';
      let payload = {
        ...this.reviewForm.value,
        userId: JSON.parse(user)._id,
        productId: this.data.productId
      };
  
      if (this.reviewFormMode.includes('edit')) {
        // If editing an existing review, make a PATCH request
        url = `http://localhost:5000/review/${this.reviewFormData._id}`;
        this.authService.apiCall('PUT', url, payload).subscribe(
          async (response: any) => {
            alert('Review updated successfully');
            this.getReview(this.data.productId);
            this.reviewForm.reset();
            this.reviewFormMode = ''
            this.reviewFormData = {}
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        // If adding a new review, make a POST request
        url = 'http://localhost:5000/review';
        this.authService.apiCall('POST', url, payload).subscribe(
          async (response: any) => {
            alert('Review added successfully');
            this.getReview(this.data.productId);
            this.reviewForm.reset();
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      }
    }).catch(e => e);
  }
  
  deleteReview(review:any) {
    return new Promise((resolve, reject) =>{
      let url = `http://localhost:5000/review/${review._id}`
      this.authService.apiCall('DELETE',url, null).subscribe(
        async (response:any) =>{
          this.reviews = response
          this.getReview(this.data.productId)

          resolve(response)
        },
        (error) =>{
          reject(error)
        }
      )
    }).catch(e => e)    
  }

  editReview(review:any) {
    console.log('review: ', review);
    console.log(this.reviewForm);
    
    this.reviewForm.patchValue(review)
    this.reviewFormMode = 'edit';
    this.reviewFormData = {...review}
  }

}
