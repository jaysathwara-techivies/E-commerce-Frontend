import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';
import { DialogpromptComponent } from 'src/app/shared/dialogprompt/dialogprompt.component';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm!:FormGroup
  categories:any[] = []
  constructor(
    private fb:FormBuilder,
    private authService: AuthenticationService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {
    this.createForm()
  }
  async ngOnInit() {
    await this.getCategories()
  }
  createForm() {
    this.categoryForm = this.fb.group({
      name: [null,Validators.required],
      description: [null,Validators.required],
    })
  }

  submiForm() {
    console.log(this.categoryForm.value);
    return new Promise ((resolve,reject)=>{
      let url = 'http://localhost:5000/categories';
      let payload = {
        ...this.categoryForm.value
      }
      this.authService.apiCall('POST',url,payload).subscribe(
        async (response:any) =>{
          this.categories.push(response);
          await this.getCategories()
          this.utilService.openSnackBar({
            text: 'Category has been created...'
          })
          resolve(response)
        },
        (error) => {
          reject(error)
        }
      )
    }).catch(e=>e)
  }

  getCategories() {
    return new Promise ((resolve,reject)=>{
      let url = 'http://localhost:5000/categories';
      this.authService.apiCall('GET',url,null).subscribe(
        async (response:any) =>{
          this.categories = response;
          resolve(response)
        },
        (error) => {
          reject(error)
        }
      )
    }).catch(e=>e)
  }

  openDialog(id: any): void {
    const dialogRef = this.dialog.open(DialogpromptComponent, {
      width: '500px',
      data: {
        title: 'Cancel Order',
        message: 'Are you sure you want to Delete this Category?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCategory(id);
      }
    });
  }

  deleteCategory(id:any) {
    return new Promise ((resolve,reject)=>{
      let url = `http://localhost:5000/categories/${id}`;

      this.authService.apiCall('DELETE',url,null).subscribe(
        async (response:any) =>{
          await this.getCategories()
          this.utilService.openSnackBar({
            text: response.message
          })
          resolve(response)
        },
        (error) => {
          reject(error)
        }
      )
    }).catch(e=>e)
  }
}
